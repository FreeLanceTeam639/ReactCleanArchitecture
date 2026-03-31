import { useCallback, useEffect, useMemo, useState } from 'react';
import { ROUTES } from '../../../shared/constants/routes.js';
import { useCountryDirectory } from '../../../shared/hooks/useCountryDirectory.js';
import {
  detectCountryByPhoneValue,
  findCountryByName,
  syncPhoneNumberToCountry
} from '../../../shared/lib/forms/countryPhone.js';
import { useToast } from '../../../shared/hooks/useToast.js';
import {
  clearAuthenticatedUser,
  hasAuthenticatedSession,
  updateAuthenticatedSessionUser
} from '../../../shared/lib/storage/authStorage.js';
import {
  fetchCurrentUserProfile,
  fetchMessages,
  fetchNotifications,
  fetchProfileListings,
  fetchProfileProposals,
  fetchProfileReviews,
  fetchProfileSummary,
  fetchProfileTasks,
  fetchSavedItems,
  markMessageAsRead,
  markNotificationAsRead,
  removeSavedItem,
  updateCurrentUserProfile,
  updateProfileListingStatus,
  updateProfileProposalStatus
} from '../services/profileService.js';

export const PROFILE_TABS = ['Dashboard', 'My Listings', 'Proposals', 'Reviews', 'Saved', 'Settings'];

const PROPOSAL_STATUS_FLOW = ['pending', 'shortlisted', 'accepted'];

function getNextProposalStatus(currentStatus = 'pending') {
  const normalized = currentStatus.toLowerCase();
  const currentIndex = PROPOSAL_STATUS_FLOW.indexOf(normalized);

  if (currentIndex === -1) {
    return PROPOSAL_STATUS_FLOW[0];
  }

  return PROPOSAL_STATUS_FLOW[(currentIndex + 1) % PROPOSAL_STATUS_FLOW.length];
}

function buildInitialState() {
  return {
    profile: null,
    summary: null,
    tasks: [],
    listings: [],
    proposals: [],
    reviews: [],
    savedItems: [],
    notifications: [],
    messages: []
  };
}

export function useProfilePage(navigate) {
  const toast = useToast();
  const { countries, isLoading: isCountriesLoading, defaultCountry } = useCountryDirectory();
  const [activeTab, setActiveTab] = useState(PROFILE_TABS[0]);
  const [pageState, setPageState] = useState(buildInitialState);
  const [settingsForm, setSettingsForm] = useState({
      fullName: '',
      profession: '',
      headline: '',
      country: '',
      phoneNumber: '',
    hourlyRate: '',
    availability: '',
    bio: '',
    skills: '',
    avatarUrl: '',
    bannerUrl: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState('');
  const [feedback, setFeedback] = useState('');
  const [busyKey, setBusyKey] = useState('');

  const applyProfileToForm = useCallback((profile) => {
    setSettingsForm({
      fullName: profile.fullName || '',
      profession: profile.profession || '',
      headline: profile.headline || '',
      country: profile.country || profile.location || '',
      phoneNumber: profile.phoneNumber || '',
      hourlyRate: profile.hourlyRate || '',
      availability: profile.availability || '',
      bio: profile.bio || '',
      skills: Array.isArray(profile.skills) ? profile.skills.join(', ') : '',
      avatarUrl: profile.avatarUrl || '',
      bannerUrl: profile.bannerUrl || ''
    });
  }, []);

  const loadProfilePage = useCallback(async () => {
    setIsLoading(true);
    setPageError('');

    const results = await Promise.allSettled([
      fetchCurrentUserProfile(),
      fetchProfileSummary(),
      fetchProfileTasks(),
      fetchProfileListings(),
      fetchProfileProposals(),
      fetchProfileReviews(),
      fetchSavedItems(),
      fetchNotifications(),
      fetchMessages()
    ]);

    const [profile, summary, tasks, listings, proposals, reviews, savedItems, notifications, messages] = results;

    if (profile.status === 'rejected') {
      clearAuthenticatedUser();
      navigate(ROUTES.login);
      return;
    }

    const nextState = {
      profile: profile.value,
      summary: summary.status === 'fulfilled' ? summary.value : null,
      tasks: tasks.status === 'fulfilled' ? tasks.value : [],
      listings: listings.status === 'fulfilled' ? listings.value : [],
      proposals: proposals.status === 'fulfilled' ? proposals.value : [],
      reviews: reviews.status === 'fulfilled' ? reviews.value : [],
      savedItems: savedItems.status === 'fulfilled' ? savedItems.value : [],
      notifications: notifications.status === 'fulfilled' ? notifications.value : [],
      messages: messages.status === 'fulfilled' ? messages.value : []
    };

    setPageState(nextState);
    applyProfileToForm(nextState.profile);

    const rejectedCount = results.filter((result) => result.status === 'rejected').length;

    if (rejectedCount > 1) {
      setFeedback('Some account panels are still syncing. Available information is shown below.');
    }

    setIsLoading(false);
  }, [applyProfileToForm, navigate]);

  useEffect(() => {
    if (!settingsForm.country && defaultCountry?.name) {
      setSettingsForm((currentState) => ({
        ...currentState,
        country: defaultCountry.name
      }));
    }
  }, [defaultCountry, settingsForm.country]);

  useEffect(() => {
    loadProfilePage().catch((error) => {
      if (!hasAuthenticatedSession()) {
        navigate(ROUTES.login);
        return;
      }

      setPageError(error?.message || 'Profile details could not be loaded.');
      setIsLoading(false);
    });
  }, [loadProfilePage, navigate]);

  const stats = useMemo(() => {
    if (!pageState.summary) {
      return [];
    }

    return [
      { label: 'This Month Earnings', value: pageState.summary.monthlyEarnings },
      { label: 'Tasks Completed', value: pageState.summary.tasksCompleted },
      { label: 'Response Rate', value: pageState.summary.responseRate }
    ];
  }, [pageState.summary]);

  const setSettingsFieldValue = (fieldName, value) => {
    setSettingsForm((currentState) => ({
      ...currentState,
      [fieldName]: value
    }));
  };

  const setSettingsCountryValue = (country) => {
    setSettingsForm((currentState) => ({
      ...currentState,
      country,
      phoneNumber: syncPhoneNumberToCountry(
        currentState.phoneNumber,
        currentState.country,
        country,
        countries
      )
    }));
  };

  const submitSettings = async (event) => {
    event.preventDefault();
    setBusyKey('settings');
    setFeedback('');

    const resolvedCountry =
      findCountryByName(countries, settingsForm.country) ||
      detectCountryByPhoneValue(countries, settingsForm.phoneNumber) ||
      defaultCountry ||
      null;

    const normalizedCountry = resolvedCountry?.name || '';
    const normalizedPhoneNumber = settingsForm.phoneNumber
      ? syncPhoneNumberToCountry(
          settingsForm.phoneNumber,
          settingsForm.country,
          normalizedCountry,
          countries
        )
      : '';

    if (settingsForm.phoneNumber && !normalizedCountry) {
      const nextMessage = 'Telefon nomresi ucun duzgun olke secilmeyib.';
      setFeedback(nextMessage);
      setBusyKey('');
      toast.error({
        title: 'Profil yenilenmedi',
        message: nextMessage
      });
      return;
    }

    try {
      const normalizedSkills = settingsForm.skills
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
        .slice(0, 20)
        .map((item) => item.slice(0, 50));

      const updatedProfile = await updateCurrentUserProfile({
        fullName: settingsForm.fullName.trim(),
        profession: settingsForm.profession.trim(),
        headline: settingsForm.headline.trim(),
        country: normalizedCountry,
        location: normalizedCountry,
        phoneNumber: normalizedPhoneNumber,
        hourlyRate: settingsForm.hourlyRate.trim(),
        availability: settingsForm.availability.trim(),
        bio: settingsForm.bio.trim(),
        skills: normalizedSkills,
        avatarUrl: settingsForm.avatarUrl,
        bannerUrl: settingsForm.bannerUrl
      });

      setPageState((currentState) => ({
        ...currentState,
        profile: {
          ...currentState.profile,
          ...updatedProfile,
          fullName: updatedProfile.fullName || currentState.profile?.fullName || settingsForm.fullName,
          profession: updatedProfile.profession || currentState.profile?.profession || settingsForm.profession,
          headline: updatedProfile.headline || currentState.profile?.headline || settingsForm.headline,
          country: updatedProfile.country || currentState.profile?.country || settingsForm.country,
          location: updatedProfile.location || updatedProfile.country || currentState.profile?.location || settingsForm.country,
          phoneNumber: updatedProfile.phoneNumber || currentState.profile?.phoneNumber || settingsForm.phoneNumber,
          hourlyRate: updatedProfile.hourlyRate || currentState.profile?.hourlyRate || settingsForm.hourlyRate,
          availability: updatedProfile.availability || currentState.profile?.availability || settingsForm.availability,
          bio: updatedProfile.bio || currentState.profile?.bio || settingsForm.bio,
          skills: updatedProfile.skills?.length ? updatedProfile.skills : settingsForm.skills
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean),
          avatarUrl: updatedProfile.avatarUrl || currentState.profile?.avatarUrl || settingsForm.avatarUrl,
          bannerUrl: updatedProfile.bannerUrl || currentState.profile?.bannerUrl || settingsForm.bannerUrl
        }
      }));
      applyProfileToForm({
        ...pageState.profile,
        ...updatedProfile,
        fullName: updatedProfile.fullName || pageState.profile?.fullName || settingsForm.fullName,
        profession: updatedProfile.profession || pageState.profile?.profession || settingsForm.profession,
        headline: updatedProfile.headline || pageState.profile?.headline || settingsForm.headline,
        country: updatedProfile.country || pageState.profile?.country || settingsForm.country,
        location: updatedProfile.location || updatedProfile.country || pageState.profile?.location || settingsForm.country,
        phoneNumber: updatedProfile.phoneNumber || pageState.profile?.phoneNumber || settingsForm.phoneNumber,
        hourlyRate: updatedProfile.hourlyRate || pageState.profile?.hourlyRate || settingsForm.hourlyRate,
        availability: updatedProfile.availability || pageState.profile?.availability || settingsForm.availability,
        bio: updatedProfile.bio || pageState.profile?.bio || settingsForm.bio,
        skills: updatedProfile.skills?.length ? updatedProfile.skills : settingsForm.skills
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
        avatarUrl: updatedProfile.avatarUrl || pageState.profile?.avatarUrl || settingsForm.avatarUrl,
        bannerUrl: updatedProfile.bannerUrl || pageState.profile?.bannerUrl || settingsForm.bannerUrl
      });
      updateAuthenticatedSessionUser({
        firstName: updatedProfile.firstName || settingsForm.fullName?.split(' ')[0] || '',
        fullName: updatedProfile.fullName || settingsForm.fullName,
        avatarUrl: updatedProfile.avatarUrl || settingsForm.avatarUrl,
        country: updatedProfile.country || settingsForm.country
      });
      setFeedback('Profil melumatlari yadda saxlanildi.');
      toast.success({
        title: 'Profil yenilendi',
        message: 'Deyisiklikleriniz ugurla yadda saxlandi.'
      });
    } catch (error) {
      const nextMessage = error?.message || 'Profil yenilenmedi.';
      setFeedback(nextMessage);
      toast.error({
        title: 'Profil yenilenmedi',
        message: nextMessage
      });
    } finally {
      setBusyKey('');
    }
  };

  const toggleListingStatus = async (listingId) => {
    const listing = pageState.listings.find((item) => item.id === listingId);

    if (!listing) {
      return;
    }

    const nextStatus = listing.status === 'active' ? 'paused' : 'active';
    setBusyKey(`listing:${listingId}`);
    setFeedback('');

    try {
      const updatedListing = await updateProfileListingStatus(listingId, nextStatus);
      setPageState((currentState) => ({
        ...currentState,
        listings: currentState.listings.map((item) => (
          item.id === listingId
            ? {
                ...item,
                ...updatedListing,
                id: item.id,
                title: updatedListing.title || item.title,
                category: updatedListing.category || item.category,
                budget: updatedListing.budget || item.budget,
                status: updatedListing.status || nextStatus
              }
            : item
        ))
      }));
      toast.success({
        title: 'Elan statusu yenilendi',
        message: `Elaniniz ${nextStatus === 'active' ? 'aktiv' : 'dayandirildi'} veziyyete kecdi.`
      });
    } catch (error) {
      const nextMessage = error?.message || 'Elan statusunu yenilemek mumkun olmadi.';
      setFeedback(nextMessage);
      toast.error({
        title: 'Elan statusu yenilenmedi',
        message: nextMessage
      });
    } finally {
      setBusyKey('');
    }
  };

  const cycleProposalStatus = async (proposalId) => {
    const proposal = pageState.proposals.find((item) => item.id === proposalId);

    if (!proposal) {
      return;
    }

    setBusyKey(`proposal:${proposalId}`);
    setFeedback('');

    try {
      const nextStatus = getNextProposalStatus(proposal.status);
      const updatedProposal = await updateProfileProposalStatus(proposalId, nextStatus);
      setPageState((currentState) => ({
        ...currentState,
        proposals: currentState.proposals.map((item) => (
          item.id === proposalId
            ? {
                ...item,
                ...updatedProposal,
                id: item.id,
                jobTitle: updatedProposal.jobTitle || item.jobTitle,
                clientName: updatedProposal.clientName || item.clientName,
                amount: updatedProposal.amount || item.amount,
                status: updatedProposal.status || nextStatus
              }
            : item
        ))
      }));
      toast.success({
        title: 'Proposal yenilendi',
        message: `Proposal statusu ${nextStatus} olaraq yenilendi.`
      });
    } catch (error) {
      const nextMessage = error?.message || 'Proposal statusunu yenilemek mumkun olmadi.';
      setFeedback(nextMessage);
      toast.error({
        title: 'Proposal yenilenmedi',
        message: nextMessage
      });
    } finally {
      setBusyKey('');
    }
  };

  const removeSaved = async (savedItemId) => {
    setBusyKey(`saved:${savedItemId}`);
    setFeedback('');

    try {
      await removeSavedItem(savedItemId);
      setPageState((currentState) => ({
        ...currentState,
        savedItems: currentState.savedItems.filter((item) => item.id !== savedItemId),
        summary: currentState.summary
          ? {
              ...currentState.summary,
              savedItems: Math.max(0, Number(currentState.summary.savedItems || 0) - 1)
            }
          : currentState.summary
      }));
      toast.info({
        title: 'Yadda saxlanan elan silindi',
        message: 'Secdiyiniz qeyd yadda saxlananlar bolmesinden cixarildi.'
      });
    } catch (error) {
      const nextMessage = error?.message || 'Yadda saxlanan qeydi silmek mumkun olmadi.';
      setFeedback(nextMessage);
      toast.error({
        title: 'Qeyd silinmedi',
        message: nextMessage
      });
    } finally {
      setBusyKey('');
    }
  };

  const markMessageReadById = async (messageId) => {
    setBusyKey(`message:${messageId}`);
    setFeedback('');

    try {
      const updatedMessage = await markMessageAsRead(messageId);
      setPageState((currentState) => ({
        ...currentState,
        messages: currentState.messages.map((item) => (
          item.id === messageId
            ? {
                ...item,
                ...updatedMessage,
                id: item.id,
                sender: updatedMessage.sender || item.sender,
                text: updatedMessage.text || item.text,
                isRead: true
              }
            : item
        )),
        summary: currentState.summary
          ? {
              ...currentState.summary,
              unreadMessages: Math.max(
                0,
                Number(currentState.summary.unreadMessages || 0) - (currentState.messages.find((item) => item.id === messageId)?.isRead ? 0 : 1)
              )
            }
          : currentState.summary
      }));
    } catch (error) {
      const nextMessage = error?.message || 'Mesaj statusunu yenilemek mumkun olmadi.';
      setFeedback(nextMessage);
      toast.error({
        title: 'Mesaj yenilenmedi',
        message: nextMessage
      });
    } finally {
      setBusyKey('');
    }
  };

  const markNotificationReadById = async (notificationId) => {
    setBusyKey(`notification:${notificationId}`);
    setFeedback('');

    try {
      const updatedNotification = await markNotificationAsRead(notificationId);
      setPageState((currentState) => ({
        ...currentState,
        notifications: currentState.notifications.map((item) => (
          item.id === notificationId
            ? {
                ...item,
                ...updatedNotification,
                id: item.id,
                title: updatedNotification.title || item.title,
                message: updatedNotification.message || item.message,
                isRead: true
              }
            : item
        ))
      }));
    } catch (error) {
      const nextMessage = error?.message || 'Bildiris statusunu yenilemek mumkun olmadi.';
      setFeedback(nextMessage);
      toast.error({
        title: 'Bildiris yenilenmedi',
        message: nextMessage
      });
    } finally {
      setBusyKey('');
    }
  };

  return {
    activeTab,
    setActiveTab,
    profile: pageState.profile,
    summary: pageState.summary,
    tasks: pageState.tasks,
    listings: pageState.listings,
    proposals: pageState.proposals,
    reviews: pageState.reviews,
    savedItems: pageState.savedItems,
    notifications: pageState.notifications,
    messages: pageState.messages,
    stats,
    settingsForm,
    countries,
    isCountriesLoading,
    isLoading,
    pageError,
    feedback,
    busyKey,
    setSettingsFieldValue,
    setSettingsCountryValue,
    submitSettings,
    toggleListingStatus,
    cycleProposalStatus,
    removeSaved,
    markMessageReadById,
    markNotificationReadById,
    refreshProfilePage: loadProfilePage
  };
}
