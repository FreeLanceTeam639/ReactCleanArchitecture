import { useCallback, useEffect, useMemo, useState } from 'react';
import { ROUTES } from '../../../shared/constants/routes.js';
import { clearAuthenticatedUser, hasAuthenticatedSession } from '../../../shared/lib/storage/authStorage.js';
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
  const [activeTab, setActiveTab] = useState(PROFILE_TABS[0]);
  const [pageState, setPageState] = useState(buildInitialState);
  const [settingsForm, setSettingsForm] = useState({
    fullName: '',
    profession: '',
    headline: '',
    location: '',
    hourlyRate: '',
    availability: '',
    bio: '',
    skills: ''
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
      location: profile.location || '',
      hourlyRate: profile.hourlyRate || '',
      availability: profile.availability || '',
      bio: profile.bio || '',
      skills: Array.isArray(profile.skills) ? profile.skills.join(', ') : ''
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
      setFeedback('Bəzi profile endpoint-ləri cavab vermədi. Yüklənən məlumatlar göstərilir.');
    }

    setIsLoading(false);
  }, [applyProfileToForm, navigate]);

  useEffect(() => {
    loadProfilePage().catch((error) => {
      if (!hasAuthenticatedSession()) {
        navigate(ROUTES.login);
        return;
      }

      setPageError(error?.message || 'Profile məlumatları yüklənə bilmədi.');
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

  const submitSettings = async (event) => {
    event.preventDefault();
    setBusyKey('settings');
    setFeedback('');

    try {
      const updatedProfile = await updateCurrentUserProfile({
        fullName: settingsForm.fullName,
        profession: settingsForm.profession,
        headline: settingsForm.headline,
        location: settingsForm.location,
        hourlyRate: settingsForm.hourlyRate,
        availability: settingsForm.availability,
        bio: settingsForm.bio,
        skills: settingsForm.skills
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean)
      });

      setPageState((currentState) => ({
        ...currentState,
        profile: {
          ...currentState.profile,
          ...updatedProfile,
          fullName: updatedProfile.fullName || currentState.profile?.fullName || settingsForm.fullName,
          profession: updatedProfile.profession || currentState.profile?.profession || settingsForm.profession,
          headline: updatedProfile.headline || currentState.profile?.headline || settingsForm.headline,
          location: updatedProfile.location || currentState.profile?.location || settingsForm.location,
          hourlyRate: updatedProfile.hourlyRate || currentState.profile?.hourlyRate || settingsForm.hourlyRate,
          availability: updatedProfile.availability || currentState.profile?.availability || settingsForm.availability,
          bio: updatedProfile.bio || currentState.profile?.bio || settingsForm.bio,
          skills: updatedProfile.skills?.length ? updatedProfile.skills : settingsForm.skills
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean)
        }
      }));
      applyProfileToForm({
        ...pageState.profile,
        ...updatedProfile,
        fullName: updatedProfile.fullName || pageState.profile?.fullName || settingsForm.fullName,
        profession: updatedProfile.profession || pageState.profile?.profession || settingsForm.profession,
        headline: updatedProfile.headline || pageState.profile?.headline || settingsForm.headline,
        location: updatedProfile.location || pageState.profile?.location || settingsForm.location,
        hourlyRate: updatedProfile.hourlyRate || pageState.profile?.hourlyRate || settingsForm.hourlyRate,
        availability: updatedProfile.availability || pageState.profile?.availability || settingsForm.availability,
        bio: updatedProfile.bio || pageState.profile?.bio || settingsForm.bio,
        skills: updatedProfile.skills?.length ? updatedProfile.skills : settingsForm.skills
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean)
      });
      setFeedback('Profile məlumatları backend üzərindən yeniləndi.');
    } catch (error) {
      setFeedback(error?.message || 'Profile yenilənmədi.');
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
    } catch (error) {
      setFeedback(error?.message || 'Listing status yenilənmədi.');
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
    } catch (error) {
      setFeedback(error?.message || 'Proposal status yenilənmədi.');
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
    } catch (error) {
      setFeedback(error?.message || 'Saved item silinmədi.');
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
      setFeedback(error?.message || 'Message status yenilənmədi.');
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
      setFeedback(error?.message || 'Notification status yenilənmədi.');
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
    isLoading,
    pageError,
    feedback,
    busyKey,
    setSettingsFieldValue,
    submitSettings,
    toggleListingStatus,
    cycleProposalStatus,
    removeSaved,
    markMessageReadById,
    markNotificationReadById,
    refreshProfilePage: loadProfilePage
  };
}
