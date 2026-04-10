import {
  Bell,
  BriefcaseBusiness,
  CreditCard,
  LoaderCircle,
  LogOut,
  MapPin,
  MessageSquare,
  Settings,
  ShieldCheck,
  Star,
  Wallet
} from 'lucide-react';
import { logoutUser } from '../../features/auth/services/authService.js';
import { PROFILE_TABS, useProfilePage } from '../../features/profile/hooks/useProfilePage.js';
import { CommentThread } from '../../components/ui/reddit-nested-thread-reply.jsx';
import MarketplaceHeader from '../../shared/ui/MarketplaceHeader.jsx';
import AdminImageField from '../../shared/ui/admin/AdminImageField.jsx';
import CountrySelect from '../../shared/ui/CountrySelect.jsx';
import PhoneNumberField from '../../shared/ui/PhoneNumberField.jsx';
import { ROUTES } from '../../shared/constants/routes.js';
import { PROFILE_NAVIGATION_LINKS } from '../../shared/constants/navigationLinks.js';
import { useI18n } from '../../shared/i18n/I18nProvider.jsx';
import { clearAuthenticatedUser } from '../../shared/lib/storage/authStorage.js';

function StatCard({ label, value }) {
  return (
    <article className="profileStatCard cardLift">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function EmptyState({ title, copy, actionLabel, onAction }) {
  return (
    <div className="profileEmptyState">
      <strong>{title}</strong>
      <p>{copy}</p>
      {actionLabel && onAction ? (
        <button type="button" className="profileActionButton interactive" onClick={onAction}>
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}

export default function ProfilePage({ navigate }) {
  const { t } = useI18n();
  const {
    activeTab,
    setActiveTab,
    profile,
    summary,
    tasks,
    listings,
    proposals,
    reviews,
    savedItems,
    notifications,
    messages,
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
    markNotificationReadById
  } = useProfilePage(navigate);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {
      // local session still clears even if backend logout fails
    }

    clearAuthenticatedUser();
    navigate(ROUTES.home);
  };

  if (isLoading) {
    return (
      <div className="profileShell">
        <MarketplaceHeader navigate={navigate} links={[{ label: 'Home', route: ROUTES.home }]} />
        <main className="wrap profilePage fadeUp">
          <section className="profileHero cardLift profileLoadingState">
            <LoaderCircle className="spinLoader" size={28} />
            <p>{t('Your account hub is loading...')}</p>
          </section>
        </main>
      </div>
    );
  }

  if (pageError) {
    return (
      <div className="profileShell">
        <MarketplaceHeader navigate={navigate} links={[{ label: 'Home', route: ROUTES.home }]} />
        <main className="wrap profilePage fadeUp">
          <section className="profileHero cardLift profileErrorState">
            <strong>{t('We could not open your account right now.')}</strong>
            <p>{pageError}</p>
            <button type="button" className="btn primary interactive" onClick={() => navigate(ROUTES.home)}>
              {t('Return home')}
            </button>
          </section>
        </main>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  const normalizedFeedback = /backend/i.test(feedback || '')
    ? t('Profile details updated successfully.')
    : feedback;

  const renderDashboard = () => (
    <>
      <section className="profileDashboardGrid">
        <article className="profilePanel cardLift" id="profileTasks">
          <div className="profilePanelHeader">
            <div>
              <span className="profileEyebrow">{t('Overview')}</span>
              <h2>{t('Ongoing Tasks')}</h2>
            </div>
            <BriefcaseBusiness size={20} />
          </div>

          <div className="profileTaskList">
            {tasks.length ? (
              tasks.map((task) => (
                <div key={task.id} className="profileTaskRow">
                  <div>
                    <strong>{task.title}</strong>
                    <p>{t(task.status)}</p>
                  </div>
                  <span>{task.budget}</span>
                </div>
              ))
            ) : (
              <EmptyState
                title={t('No active tasks yet')}
                copy={t('Your current jobs and active deliveries will appear here as soon as work starts.')}
                actionLabel={profile.canPostJobs ? t('Post Job') : t('Get verified')}
                onAction={() => navigate(profile.canPostJobs ? ROUTES.postTask : ROUTES.verification)}
              />
            )}
          </div>
        </article>

        <article className="profilePanel cardLift" id="profileMessages">
          <div className="profilePanelHeader">
            <div>
              <span className="profileEyebrow">{t('Inbox')}</span>
              <h2>{t('Messages')}</h2>
            </div>
            <MessageSquare size={20} />
          </div>

          <div className="profileCounterBadge">{t(`${summary?.unreadMessages || 0} unread messages`)}</div>

          <div className="profileSimpleList">
            {messages.length ? (
              messages.map((message) => (
                <div key={message.id} className={message.isRead ? 'profileSimpleRow' : 'profileSimpleRow unread'}>
                  <div>
                    <strong>{message.sender}</strong>
                    <p>{message.text}</p>
                  </div>
                  <button
                    type="button"
                    className="profileActionButton interactive"
                    disabled={busyKey === `message:${message.id}` || message.isRead}
                    onClick={() => markMessageReadById(message.id)}
                  >
                    {message.isRead ? t('Seen') : busyKey === `message:${message.id}` ? t('Saving...') : t('Mark read')}
                  </button>
                </div>
              ))
            ) : (
              <EmptyState
                title={t('No conversations yet')}
                copy={t('New conversations will appear here as soon as you connect with another member.')}
                actionLabel={t('Browse members')}
                onAction={() => navigate(ROUTES.home)}
              />
            )}
          </div>
        </article>

        <article className="profilePanel profileFinancePanel cardLift">
          <div className="profilePanelHeader">
            <div>
              <span className="profileEyebrow">{t('Balance')}</span>
              <h2>{summary?.availableBalance || '$0'}</h2>
            </div>
            <Wallet size={20} />
          </div>

          <div className="profileFinanceGrid">
            <div className="profileMiniCard">
              <Star size={18} />
              <div>
                <strong>{t(`${summary?.rating || '0.0'} rating`)}</strong>
                <p>{t(`${summary?.reviewsCount || 0} review`)}</p>
              </div>
            </div>
            <div className="profileMiniCard">
              <CreditCard size={18} />
              <div>
                <strong>{summary?.earnings || '$0'}</strong>
                <p>{t('Total earnings')}</p>
              </div>
            </div>
          </div>
        </article>

        <article className="profilePanel cardLift">
          <div className="profilePanelHeader">
            <div>
              <span className="profileEyebrow">{t('Alerts')}</span>
              <h2>{t('Notifications')}</h2>
            </div>
            <Bell size={20} />
          </div>

          <div className="profileSimpleList">
            {notifications.length ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={notification.isRead ? 'profileSimpleRow' : 'profileSimpleRow unread'}
                >
                  <div>
                    <strong>{notification.title}</strong>
                    <p>{notification.message}</p>
                  </div>
                  <button
                    type="button"
                    className="profileActionButton interactive"
                    disabled={busyKey === `notification:${notification.id}` || notification.isRead}
                    onClick={() => markNotificationReadById(notification.id)}
                  >
                    {notification.isRead
                      ? t('Seen')
                      : busyKey === `notification:${notification.id}`
                        ? t('Saving...')
                        : t('Mark read')}
                  </button>
                </div>
              ))
            ) : (
              <EmptyState
                title={t('No notifications right now')}
                copy={t('Verification updates, security alerts and collaboration activity will appear here.')}
                actionLabel={t('Open orders')}
                onAction={() => navigate(ROUTES.orders)}
              />
            )}
          </div>
        </article>
      </section>

      <section className="profileBottomGrid" id="profileSettings">
        <article className="profilePanel cardLift">
          <div className="profilePanelHeader">
            <div>
              <span className="profileEyebrow">{t('Quick Stats')}</span>
              <h2>{t('Account Summary')}</h2>
            </div>
            <ShieldCheck size={20} />
          </div>

          <div className="profileSummaryGrid">
            <div className="profileSummaryItem">
              <span>{t('Active Tasks')}</span>
              <strong>{summary?.activeTasks || 0}</strong>
            </div>
            <div className="profileSummaryItem">
              <span>{t('Pending Requests')}</span>
              <strong>{summary?.pendingRequests || 0}</strong>
            </div>
            <div className="profileSummaryItem">
              <span>{t('Saved Items')}</span>
              <strong>{summary?.savedItems || 0}</strong>
            </div>
            <div className="profileSummaryItem">
              <span>{t('Avg. Response')}</span>
              <strong>{summary?.responseTime || '-'}</strong>
            </div>
          </div>
        </article>

        <article className="profilePanel cardLift">
          <div className="profilePanelHeader">
            <div>
              <span className="profileEyebrow">{t('Preferences')}</span>
              <h2>{t('Profile Controls')}</h2>
            </div>
            <Settings size={20} />
          </div>

          <div className="profileControlsList">
            <button type="button" className="profileControlButton" onClick={() => setActiveTab('settings')}>
              {t('Change profile details')}
            </button>
            <button type="button" className="profileControlButton" onClick={() => navigate(ROUTES.messages)}>
              {t('Open messages workspace')}
            </button>
            <button type="button" className="profileControlButton" onClick={() => navigate(ROUTES.wallet)}>
              {t('Check wallet and payouts')}
            </button>
            <button type="button" className="profileControlButton" onClick={() => navigate(ROUTES.security)}>
              {t('Open security settings')}
            </button>
            <button type="button" className="profileControlButton" onClick={handleLogout}>
              {t('Sign out from current session')}
            </button>
          </div>
        </article>
      </section>
    </>
  );

  const renderListings = () => (
    <section className="profilePanel cardLift">
      <div className="profilePanelHeader">
        <div>
          <span className="profileEyebrow">{t('Inventory')}</span>
          <h2>{t('My Listings')}</h2>
        </div>
        <BriefcaseBusiness size={20} />
      </div>

      <div className="profileSimpleList">
        {listings.length ? (
          listings.map((listing) => (
            <div key={listing.id} className="profileSimpleRow profileInteractiveRow">
              <div>
                <strong>{listing.title}</strong>
                <p>{listing.category} • {listing.budget}</p>
              </div>
              <div className="profileInlineActions">
                <span className={`profileStatusBadge ${listing.status}`}>{t(listing.status)}</span>
                <button
                  type="button"
                  className="profileActionButton interactive"
                  disabled={busyKey === `listing:${listing.id}`}
                  onClick={() => toggleListingStatus(listing.id)}
                >
                  {busyKey === `listing:${listing.id}`
                    ? t('Saving...')
                    : listing.status === 'active'
                      ? t('Pause')
                      : t('Activate')}
                </button>
              </div>
            </div>
          ))
        ) : (
          <EmptyState
            title={t('No listings published yet')}
            copy={t('Create your first job post to start receiving interest and managing it from this panel.')}
            actionLabel={profile.canPostJobs ? t('Post Job') : t('Get verified')}
            onAction={() => navigate(profile.canPostJobs ? ROUTES.postTask : ROUTES.verification)}
          />
        )}
      </div>
    </section>
  );

  const renderProposals = () => (
    <section className="profilePanel cardLift">
      <div className="profilePanelHeader">
        <div>
          <span className="profileEyebrow">{t('Pipeline')}</span>
          <h2>{t('Proposals')}</h2>
        </div>
        <ShieldCheck size={20} />
      </div>

      <div className="profileSimpleList">
        {proposals.length ? (
          proposals.map((proposal) => (
            <div key={proposal.id} className="profileSimpleRow profileInteractiveRow">
              <div>
                <strong>{proposal.jobTitle}</strong>
                <p>{proposal.clientName} • {proposal.amount}</p>
              </div>
              <div className="profileInlineActions">
                <span className={`profileStatusBadge ${proposal.status}`}>{t(proposal.status)}</span>
                <button
                  type="button"
                  className="profileActionButton interactive"
                  disabled={busyKey === `proposal:${proposal.id}`}
                  onClick={() => cycleProposalStatus(proposal.id)}
                >
                  {busyKey === `proposal:${proposal.id}` ? t('Saving...') : t('Next status')}
                </button>
              </div>
            </div>
          ))
        ) : (
          <EmptyState
            title={t('No proposals yet')}
            copy={t('Once you start conversations from public profiles, your proposal activity will appear here.')}
            actionLabel={t('Browse members')}
            onAction={() => navigate(ROUTES.home)}
          />
        )}
      </div>
    </section>
  );

  const renderReviews = () => (
    <section className="profilePanel cardLift">
      <div className="profilePanelHeader">
        <div>
          <span className="profileEyebrow">{t('Social Proof')}</span>
          <h2>{t('Reviews')}</h2>
        </div>
        <Star size={20} />
      </div>

      <CommentThread
        items={reviews}
        groupByProject
        emptyTitle={t('No reviews yet')}
        emptyDescription={t('Reviews from completed tasks and client collaborations will appear here.')}
      />
    </section>
  );

  const renderSaved = () => (
    <section className="profilePanel cardLift">
      <div className="profilePanelHeader">
        <div>
          <span className="profileEyebrow">{t('Bookmarks')}</span>
          <h2>{t('Saved Items')}</h2>
        </div>
        <Bell size={20} />
      </div>

      <div className="profileSimpleList">
        {savedItems.length ? (
          savedItems.map((item) => (
            <div key={item.id} className="profileSimpleRow profileInteractiveRow">
              <div>
                <strong>{item.title}</strong>
                <p>{item.type}{item.meta ? ` • ${item.meta}` : ''}</p>
              </div>
              <button
                type="button"
                className="profileActionButton interactive"
                disabled={busyKey === `saved:${item.id}`}
                onClick={() => removeSaved(item.id)}
              >
                {busyKey === `saved:${item.id}` ? t('Removing...') : t('Remove')}
              </button>
            </div>
          ))
        ) : (
          <EmptyState
            title={t('No saved items yet')}
            copy={t('Save strong member profiles to compare them later from one clean place.')}
            actionLabel={t('Browse members')}
            onAction={() => navigate(ROUTES.home)}
          />
        )}
      </div>
    </section>
  );

  const renderSettings = () => (
    <section className="profilePanel cardLift">
      <div className="profilePanelHeader">
        <div>
          <span className="profileEyebrow">{t('Account')}</span>
          <h2>{t('Settings')}</h2>
        </div>
        <Settings size={20} />
      </div>

      <form className="profileSettingsForm" onSubmit={submitSettings}>
        <label className="profileField">
          <span>{t('Full name')}</span>
          <input
            type="text"
            value={settingsForm.fullName}
            onChange={(event) => setSettingsFieldValue('fullName', event.target.value)}
            required
          />
        </label>
        <label className="profileField">
          <span>{t('Profession')}</span>
          <input
            type="text"
            value={settingsForm.profession}
            onChange={(event) => setSettingsFieldValue('profession', event.target.value)}
          />
        </label>
        <label className="profileField">
          <span>{t('Headline')}</span>
          <input
            type="text"
            value={settingsForm.headline}
            onChange={(event) => setSettingsFieldValue('headline', event.target.value)}
          />
        </label>
        <label className="profileField">
          <span>{t('Country')}</span>
          <CountrySelect
            value={settingsForm.country}
            countries={countries}
            onChange={setSettingsCountryValue}
            disabled={isCountriesLoading}
            placeholder={t('Select country')}
          />
        </label>
        <label className="profileField">
          <span>{t('Phone number')}</span>
          <PhoneNumberField
            countryValue={settingsForm.country}
            countries={countries}
            value={settingsForm.phoneNumber}
            onChange={(value) => setSettingsFieldValue('phoneNumber', value)}
            disabled={isCountriesLoading}
            placeholder="501234567"
          />
        </label>
        <label className="profileField">
          <span>{t('Hourly rate')}</span>
          <input
            type="text"
            value={settingsForm.hourlyRate}
            onChange={(event) => setSettingsFieldValue('hourlyRate', event.target.value)}
          />
        </label>
        <label className="profileField">
          <span>{t('Availability')}</span>
          <input
            type="text"
            value={settingsForm.availability}
            onChange={(event) => setSettingsFieldValue('availability', event.target.value)}
          />
        </label>
        <div className="profileField fullWidth">
          <AdminImageField
            label={t('Profile image')}
            value={settingsForm.avatarUrl}
            onChange={(value) => setSettingsFieldValue('avatarUrl', value)}
            shape="circle"
            hint={t('Paste an image URL or upload a JPG, PNG or WEBP file to save it on your profile.')}
          />
        </div>
        <div className="profileField fullWidth">
          <AdminImageField
            label={t('Profile banner')}
            value={settingsForm.bannerUrl}
            onChange={(value) => setSettingsFieldValue('bannerUrl', value)}
            shape="landscape"
            layout="stacked"
            showUrlInput={false}
            hint={t('Upload a wide banner image for your public profile cards.')}
          />
        </div>
        <label className="profileField fullWidth">
          <span>{t('Skills')}</span>
          <input
            type="text"
            value={settingsForm.skills}
            onChange={(event) => setSettingsFieldValue('skills', event.target.value)}
            placeholder="React, UI Design, API Integration"
          />
        </label>
        <label className="profileField fullWidth">
          <span>{t('Bio')}</span>
          <textarea
            rows="5"
            value={settingsForm.bio}
            onChange={(event) => setSettingsFieldValue('bio', event.target.value)}
          />
        </label>
        <div className="profileSettingsActions fullWidth">
          <button type="submit" className="btn primary interactive" disabled={busyKey === 'settings'}>
            {busyKey === 'settings' ? t('Saving...') : t('Save Changes')}
          </button>
        </div>
      </form>
    </section>
  );

  return (
    <div className="profileShell">
      <MarketplaceHeader
        navigate={navigate}
        links={PROFILE_NAVIGATION_LINKS}
        actionButton={{
          label: profile.canPostJobs ? t('Post Job') : t('Get Verified'),
          route: profile.canPostJobs ? ROUTES.postTask : ROUTES.verification
        }}
      />

      <main className="wrap profilePage fadeUp">
        <section className="profileHero cardLift">
          {profile.bannerUrl ? (
            <div className="profileHeroBannerWrap">
              <img src={profile.bannerUrl} alt={`${profile.fullName} banner`} className="profileHeroBanner" />
            </div>
          ) : null}

          <div className="profileHeroGrid">
            <div className="profileIdentityBlock">
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt={profile.fullName} className="profileAvatar profileAvatarImage" />
              ) : (
                <div className="profileAvatar">{profile.avatarInitials || profile.fullName?.slice(0, 2)?.toUpperCase()}</div>
              )}

              <div className="profileIdentityCopy">
                <div className="profileBadgeRow">
                  <span className="profileBadge">
                    <ShieldCheck size={16} /> {profile.badge}
                  </span>
                  {profile.availability ? <span className="profileBadge mutedBadge">{profile.availability}</span> : null}
                  {profile.verificationStatus ? <span className="profileBadge mutedBadge">{profile.verificationStatus}</span> : null}
                </div>
                <h1>{profile.fullName}</h1>
                <p>{profile.headline || profile.profession}</p>
                <div className="profileMetaLine">
                  <span>
                    <MapPin size={16} /> {profile.location}
                  </span>
                  <span>{t(`Member since ${profile.memberSince}`)}</span>
                  {profile.hourlyRate ? <span>{profile.hourlyRate}/hr</span> : null}
                </div>
              </div>
            </div>

            <div className="profileStatsGrid">
              {stats.map((item) => (
                <StatCard key={item.label} label={t(item.label)} value={item.value} />
              ))}
            </div>
          </div>

          {profile.bio ? <p className="profileBioText">{profile.bio}</p> : null}

          {!profile.canPostJobs ? (
            <div className="profileFeedbackBanner">
              {t('Job posting is locked until your verification request is approved.')} {' '}
              <button type="button" className="inlineLink interactive" onClick={() => navigate(ROUTES.verification)}>
                {t('Open verification center')}
              </button>
              {profile.verificationNote ? ` • ${profile.verificationNote}` : ''}
            </div>
          ) : null}

          {profile.skills?.length ? (
            <div className="profileSkillRow">
              {profile.skills.map((skill) => (
                <span key={skill} className="profileSkillChip">
                  {skill}
                </span>
              ))}
            </div>
          ) : null}

          <div className="profileHeroActions">
            <button type="button" className="btn primary interactive" onClick={() => setActiveTab('settings')}>
              {t('Edit Profile')}
            </button>
            <button type="button" className="btn ghost interactive" onClick={() => navigate(ROUTES.orders)}>
              {t('My Orders')}
            </button>
            <button
              type="button"
              className="btn ghost interactive"
              onClick={() => navigate(profile.canPostJobs ? ROUTES.postTask : ROUTES.verification)}
            >
              {profile.canPostJobs ? t('Post Job') : t('Get Verified')}
            </button>
            <button type="button" className="btn ghost interactive" onClick={handleLogout}>
              <LogOut size={16} /> {t('Sign Out')}
            </button>
          </div>
        </section>

        {normalizedFeedback ? <div className="profileFeedbackBanner">{t(normalizedFeedback)}</div> : null}

        <section className="profileTabs cardLift">
          {PROFILE_TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={item.id === activeTab ? 'profileTab active' : 'profileTab'}
              onClick={() => setActiveTab(item.id)}
            >
              {t(item.label)}
            </button>
          ))}
        </section>

        {activeTab === 'dashboard' ? renderDashboard() : null}
        {activeTab === 'listings' ? renderListings() : null}
        {activeTab === 'proposals' ? renderProposals() : null}
        {activeTab === 'reviews' ? renderReviews() : null}
        {activeTab === 'saved' ? renderSaved() : null}
        {activeTab === 'settings' ? renderSettings() : null}
      </main>
    </div>
  );
}
