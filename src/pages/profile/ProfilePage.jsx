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
import MarketplaceHeader from '../../shared/ui/MarketplaceHeader.jsx';
import { ROUTES } from '../../shared/constants/routes.js';
import { PROFILE_NAVIGATION_LINKS } from '../../shared/constants/navigationLinks.js';
import { clearAuthenticatedUser } from '../../shared/lib/storage/authStorage.js';

function StatCard({ label, value }) {
  return (
    <article className="profileStatCard cardLift">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function EmptyState({ title, copy }) {
  return (
    <div className="profileEmptyState">
      <strong>{title}</strong>
      <p>{copy}</p>
    </div>
  );
}

export default function ProfilePage({ navigate }) {
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
    markNotificationReadById
  } = useProfilePage(navigate);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {
      // backend logout failsa bele local session temizlenir
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
            <p>Profile endpoint-ləri yüklənir...</p>
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
            <strong>Profile məlumatları açıla bilmədi.</strong>
            <p>{pageError}</p>
            <button type="button" className="btn primary interactive" onClick={() => navigate(ROUTES.login)}>
              Go to Login
            </button>
          </section>
        </main>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  const renderDashboard = () => (
    <>
      <section className="profileDashboardGrid">
        <article className="profilePanel cardLift" id="profileTasks">
          <div className="profilePanelHeader">
            <div>
              <span className="profileEyebrow">Overview</span>
              <h2>Ongoing Tasks</h2>
            </div>
            <BriefcaseBusiness size={20} />
          </div>

          <div className="profileTaskList">
            {tasks.length ? (
              tasks.map((task) => (
                <div key={task.id} className="profileTaskRow">
                  <div>
                    <strong>{task.title}</strong>
                    <p>{task.status}</p>
                  </div>
                  <span>{task.budget}</span>
                </div>
              ))
            ) : (
              <EmptyState title="No active tasks" copy="Task list backend-dən boş gəldi." />
            )}
          </div>
        </article>

        <article className="profilePanel cardLift" id="profileMessages">
          <div className="profilePanelHeader">
            <div>
              <span className="profileEyebrow">Inbox</span>
              <h2>Messages</h2>
            </div>
            <MessageSquare size={20} />
          </div>

          <div className="profileCounterBadge">{summary?.unreadMessages || 0} unread messages</div>

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
                    {message.isRead ? 'Seen' : busyKey === `message:${message.id}` ? 'Saving...' : 'Mark read'}
                  </button>
                </div>
              ))
            ) : (
              <EmptyState title="No messages" copy="Messages endpoint-i hazır olanda siyahı burada görünəcək." />
            )}
          </div>
        </article>

        <article className="profilePanel profileFinancePanel cardLift">
          <div className="profilePanelHeader">
            <div>
              <span className="profileEyebrow">Balance</span>
              <h2>{summary?.availableBalance || '$0'}</h2>
            </div>
            <Wallet size={20} />
          </div>

          <div className="profileFinanceGrid">
            <div className="profileMiniCard">
              <Star size={18} />
              <div>
                <strong>{summary?.rating || '0.0'} rating</strong>
                <p>{summary?.reviewsCount || 0} review</p>
              </div>
            </div>
            <div className="profileMiniCard">
              <CreditCard size={18} />
              <div>
                <strong>{summary?.earnings || '$0'}</strong>
                <p>Total earnings</p>
              </div>
            </div>
          </div>
        </article>

        <article className="profilePanel cardLift">
          <div className="profilePanelHeader">
            <div>
              <span className="profileEyebrow">Alerts</span>
              <h2>Notifications</h2>
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
                      ? 'Seen'
                      : busyKey === `notification:${notification.id}`
                        ? 'Saving...'
                        : 'Mark read'}
                  </button>
                </div>
              ))
            ) : (
              <EmptyState title="No notifications" copy="Notifications endpoint-i boş gəlib." />
            )}
          </div>
        </article>
      </section>

      <section className="profileBottomGrid" id="profileSettings">
        <article className="profilePanel cardLift">
          <div className="profilePanelHeader">
            <div>
              <span className="profileEyebrow">Quick Stats</span>
              <h2>Account Summary</h2>
            </div>
            <ShieldCheck size={20} />
          </div>

          <div className="profileSummaryGrid">
            <div className="profileSummaryItem">
              <span>Active Tasks</span>
              <strong>{summary?.activeTasks || 0}</strong>
            </div>
            <div className="profileSummaryItem">
              <span>Pending Requests</span>
              <strong>{summary?.pendingRequests || 0}</strong>
            </div>
            <div className="profileSummaryItem">
              <span>Saved Items</span>
              <strong>{summary?.savedItems || 0}</strong>
            </div>
            <div className="profileSummaryItem">
              <span>Avg. Response</span>
              <strong>{summary?.responseTime || '—'}</strong>
            </div>
          </div>
        </article>

        <article className="profilePanel cardLift">
          <div className="profilePanelHeader">
            <div>
              <span className="profileEyebrow">Preferences</span>
              <h2>Profile Controls</h2>
            </div>
            <Settings size={20} />
          </div>

          <div className="profileControlsList">
            <button type="button" className="profileControlButton" onClick={() => setActiveTab('Settings')}>
              Change profile details
            </button>
            <button type="button" className="profileControlButton" onClick={() => navigate(ROUTES.messages)}>
              Open messages workspace
            </button>
            <button type="button" className="profileControlButton" onClick={() => navigate(ROUTES.wallet)}>
              Check wallet and payouts
            </button>
            <button type="button" className="profileControlButton" onClick={() => navigate(ROUTES.security)}>
              Open security settings
            </button>
            <button type="button" className="profileControlButton" onClick={handleLogout}>
              Sign out from current session
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
          <span className="profileEyebrow">Inventory</span>
          <h2>My Listings</h2>
        </div>
        <BriefcaseBusiness size={20} />
      </div>

      <div className="profileSimpleList">
        {listings.length ? (
          listings.map((listing) => (
            <div key={listing.id} className="profileSimpleRow profileInteractiveRow">
              <div>
                <strong>{listing.title}</strong>
                <p>
                  {listing.category} • {listing.budget}
                </p>
              </div>
              <div className="profileInlineActions">
                <span className={`profileStatusBadge ${listing.status}`}>{listing.status}</span>
                <button
                  type="button"
                  className="profileActionButton interactive"
                  disabled={busyKey === `listing:${listing.id}`}
                  onClick={() => toggleListingStatus(listing.id)}
                >
                  {busyKey === `listing:${listing.id}`
                    ? 'Saving...'
                    : listing.status === 'active'
                      ? 'Pause'
                      : 'Activate'}
                </button>
              </div>
            </div>
          ))
        ) : (
          <EmptyState title="No listings found" copy="Listings endpoint-dən aktiv data gəlməyib." />
        )}
      </div>
    </section>
  );

  const renderProposals = () => (
    <section className="profilePanel cardLift">
      <div className="profilePanelHeader">
        <div>
          <span className="profileEyebrow">Pipeline</span>
          <h2>Proposals</h2>
        </div>
        <ShieldCheck size={20} />
      </div>

      <div className="profileSimpleList">
        {proposals.length ? (
          proposals.map((proposal) => (
            <div key={proposal.id} className="profileSimpleRow profileInteractiveRow">
              <div>
                <strong>{proposal.jobTitle}</strong>
                <p>
                  {proposal.clientName} • {proposal.amount}
                </p>
              </div>
              <div className="profileInlineActions">
                <span className={`profileStatusBadge ${proposal.status}`}>{proposal.status}</span>
                <button
                  type="button"
                  className="profileActionButton interactive"
                  disabled={busyKey === `proposal:${proposal.id}`}
                  onClick={() => cycleProposalStatus(proposal.id)}
                >
                  {busyKey === `proposal:${proposal.id}` ? 'Saving...' : 'Next status'}
                </button>
              </div>
            </div>
          ))
        ) : (
          <EmptyState title="No proposals yet" copy="Proposal endpoint-i boş cavab verib." />
        )}
      </div>
    </section>
  );

  const renderReviews = () => (
    <section className="profilePanel cardLift">
      <div className="profilePanelHeader">
        <div>
          <span className="profileEyebrow">Social Proof</span>
          <h2>Reviews</h2>
        </div>
        <Star size={20} />
      </div>

      <div className="profileSimpleList">
        {reviews.length ? (
          reviews.map((review) => (
            <div key={review.id} className="profileSimpleRow">
              <strong>
                {review.author} • {review.rating.toFixed(1)} / 5
              </strong>
              <p>{review.comment}</p>
            </div>
          ))
        ) : (
          <EmptyState title="No reviews yet" copy="Reviews endpoint-i geri dönüş etməyib." />
        )}
      </div>
    </section>
  );

  const renderSaved = () => (
    <section className="profilePanel cardLift">
      <div className="profilePanelHeader">
        <div>
          <span className="profileEyebrow">Bookmarks</span>
          <h2>Saved Items</h2>
        </div>
        <Bell size={20} />
      </div>

      <div className="profileSimpleList">
        {savedItems.length ? (
          savedItems.map((item) => (
            <div key={item.id} className="profileSimpleRow profileInteractiveRow">
              <div>
                <strong>{item.title}</strong>
                <p>
                  {item.type}
                  {item.meta ? ` • ${item.meta}` : ''}
                </p>
              </div>
              <button
                type="button"
                className="profileActionButton interactive"
                disabled={busyKey === `saved:${item.id}`}
                onClick={() => removeSaved(item.id)}
              >
                {busyKey === `saved:${item.id}` ? 'Removing...' : 'Remove'}
              </button>
            </div>
          ))
        ) : (
          <EmptyState title="No saved items" copy="Saved endpoint-i boş qayıdıb." />
        )}
      </div>
    </section>
  );

  const renderSettings = () => (
    <section className="profilePanel cardLift">
      <div className="profilePanelHeader">
        <div>
          <span className="profileEyebrow">Account</span>
          <h2>Settings</h2>
        </div>
        <Settings size={20} />
      </div>

      <form className="profileSettingsForm" onSubmit={submitSettings}>
        <label className="profileField">
          <span>Full name</span>
          <input
            type="text"
            value={settingsForm.fullName}
            onChange={(event) => setSettingsFieldValue('fullName', event.target.value)}
            required
          />
        </label>
        <label className="profileField">
          <span>Profession</span>
          <input
            type="text"
            value={settingsForm.profession}
            onChange={(event) => setSettingsFieldValue('profession', event.target.value)}
          />
        </label>
        <label className="profileField">
          <span>Headline</span>
          <input
            type="text"
            value={settingsForm.headline}
            onChange={(event) => setSettingsFieldValue('headline', event.target.value)}
          />
        </label>
        <label className="profileField">
          <span>Location</span>
          <input
            type="text"
            value={settingsForm.location}
            onChange={(event) => setSettingsFieldValue('location', event.target.value)}
          />
        </label>
        <label className="profileField">
          <span>Hourly rate</span>
          <input
            type="text"
            value={settingsForm.hourlyRate}
            onChange={(event) => setSettingsFieldValue('hourlyRate', event.target.value)}
          />
        </label>
        <label className="profileField">
          <span>Availability</span>
          <input
            type="text"
            value={settingsForm.availability}
            onChange={(event) => setSettingsFieldValue('availability', event.target.value)}
          />
        </label>
        <label className="profileField fullWidth">
          <span>Skills</span>
          <input
            type="text"
            value={settingsForm.skills}
            onChange={(event) => setSettingsFieldValue('skills', event.target.value)}
            placeholder="React, UI Design, API Integration"
          />
        </label>
        <label className="profileField fullWidth">
          <span>Bio</span>
          <textarea
            rows="5"
            value={settingsForm.bio}
            onChange={(event) => setSettingsFieldValue('bio', event.target.value)}
          />
        </label>
        <div className="profileSettingsActions fullWidth">
          <button type="submit" className="btn primary interactive" disabled={busyKey === 'settings'}>
            {busyKey === 'settings' ? 'Saving...' : 'Save Changes'}
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
        actionButton={{ label: 'Post Job', route: ROUTES.postTask }}
      />

      <main className="wrap profilePage fadeUp">
        <section className="profileHero cardLift">
          <div className="profileHeroGrid">
            <div className="profileIdentityBlock">
              <div className="profileAvatar">{profile.avatarInitials || profile.fullName?.slice(0, 2)?.toUpperCase()}</div>

              <div className="profileIdentityCopy">
                <div className="profileBadgeRow">
                  <span className="profileBadge">
                    <ShieldCheck size={16} /> {profile.badge}
                  </span>
                  {profile.availability ? <span className="profileBadge mutedBadge">{profile.availability}</span> : null}
                </div>
                <h1>{profile.fullName}</h1>
                <p>{profile.headline || profile.profession}</p>
                <div className="profileMetaLine">
                  <span>
                    <MapPin size={16} /> {profile.location}
                  </span>
                  <span>Member since {profile.memberSince}</span>
                  {profile.hourlyRate ? <span>{profile.hourlyRate}/hr</span> : null}
                </div>
              </div>
            </div>

            <div className="profileStatsGrid">
              {stats.map((item) => (
                <StatCard key={item.label} label={item.label} value={item.value} />
              ))}
            </div>
          </div>

          {profile.bio ? <p className="profileBioText">{profile.bio}</p> : null}

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
            <button type="button" className="btn primary interactive" onClick={() => setActiveTab('Settings')}>
              Edit Profile
            </button>
            <button type="button" className="btn ghost interactive" onClick={() => navigate(ROUTES.orders)}>
              My Orders
            </button>
            <button type="button" className="btn ghost interactive" onClick={() => navigate(ROUTES.postTask)}>
              Post Job
            </button>
            <button type="button" className="btn ghost interactive" onClick={handleLogout}>
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </section>

        {feedback ? <div className="profileFeedbackBanner">{feedback}</div> : null}

        <section className="profileTabs cardLift">
          {PROFILE_TABS.map((item) => (
            <button
              key={item}
              type="button"
              className={item === activeTab ? 'profileTab active' : 'profileTab'}
              onClick={() => setActiveTab(item)}
            >
              {item}
            </button>
          ))}
        </section>

        {activeTab === 'Dashboard' ? renderDashboard() : null}
        {activeTab === 'My Listings' ? renderListings() : null}
        {activeTab === 'Proposals' ? renderProposals() : null}
        {activeTab === 'Reviews' ? renderReviews() : null}
        {activeTab === 'Saved' ? renderSaved() : null}
        {activeTab === 'Settings' ? renderSettings() : null}
      </main>
    </div>
  );
}
