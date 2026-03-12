import {
  Bell,
  BriefcaseBusiness,
  CreditCard,
  LogOut,
  MapPin,
  MessageSquare,
  Settings,
  ShieldCheck,
  Star,
  Wallet
} from 'lucide-react';
import MarketplaceHeader from '../../shared/ui/MarketplaceHeader.jsx';
import { ROUTES } from '../../shared/constants/routes.js';
import {
  clearAuthenticatedUser,
  getAuthenticatedUser
} from '../../shared/lib/storage/authStorage.js';

function StatCard({ label, value }) {
  return (
    <article className="profileStatCard cardLift">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

export default function ProfilePage({ navigate }) {
  const user = getAuthenticatedUser();

  if (!user) {
    navigate(ROUTES.login);
    return null;
  }

  const handleLogout = () => {
    clearAuthenticatedUser();
    navigate(ROUTES.home);
  };

  return (
    <div className="profileShell">
      <MarketplaceHeader
        navigate={navigate}
        links={[
          { label: 'Home', route: ROUTES.home },
          { label: 'My Tasks', href: '#profileTasks' },
          { label: 'Messages', href: '#profileMessages' },
          { label: 'Settings', href: '#profileSettings' }
        ]}
      />

      <main className="wrap profilePage fadeUp">
        <section className="profileHero cardLift">
          <div className="profileHeroGrid">
            <div className="profileIdentityBlock">
              <div className="profileAvatar">{user.avatarInitials || user.fullName?.slice(0, 2)?.toUpperCase()}</div>

              <div className="profileIdentityCopy">
                <div className="profileBadgeRow">
                  <span className="profileBadge"><ShieldCheck size={16} /> {user.badge}</span>
                </div>
                <h1>{user.fullName}</h1>
                <p>{user.profession}</p>
                <div className="profileMetaLine">
                  <span><MapPin size={16} /> {user.location}</span>
                  <span>Member since {user.memberSince}</span>
                </div>
              </div>
            </div>

            <div className="profileStatsGrid">
              {user.stats?.map((item) => (
                <StatCard key={item.label} label={item.label} value={item.value} />
              ))}
            </div>
          </div>

          <div className="profileHeroActions">
            <button type="button" className="btn primary interactive">Edit Profile</button>
            <button type="button" className="btn ghost interactive">View My Listings</button>
            <button type="button" className="btn ghost interactive" onClick={handleLogout}>
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </section>

        <section className="profileTabs cardLift">
          {user.navItems?.map((item, index) => (
            <button key={item} type="button" className={index === 0 ? 'profileTab active' : 'profileTab'}>
              {item}
            </button>
          ))}
        </section>

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
              {user.ongoingTasks?.map((task) => (
                <div key={task.title} className="profileTaskRow">
                  <div>
                    <strong>{task.title}</strong>
                    <p>{task.status}</p>
                  </div>
                  <span>{task.budget}</span>
                </div>
              ))}
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

            <div className="profileCounterBadge">{user.unreadMessages} new messages</div>

            <div className="profileSimpleList">
              {user.messages?.map((message) => (
                <div key={`${message.sender}-${message.text}`} className="profileSimpleRow">
                  <strong>{message.sender}</strong>
                  <p>{message.text}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="profilePanel profileFinancePanel cardLift">
            <div className="profilePanelHeader">
              <div>
                <span className="profileEyebrow">Balance</span>
                <h2>{user.availableBalance}</h2>
              </div>
              <Wallet size={20} />
            </div>

            <div className="profileFinanceGrid">
              <div className="profileMiniCard">
                <Star size={18} />
                <div>
                  <strong>{user.rating} rating</strong>
                  <p>{user.reviewsCount} review</p>
                </div>
              </div>
              <div className="profileMiniCard">
                <CreditCard size={18} />
                <div>
                  <strong>{user.earnings}</strong>
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
              {user.notifications?.map((notification) => (
                <div key={notification} className="profileSimpleRow">
                  <strong>Update</strong>
                  <p>{notification}</p>
                </div>
              ))}
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
                <strong>{user.activeTasks}</strong>
              </div>
              <div className="profileSummaryItem">
                <span>Pending Requests</span>
                <strong>{user.pendingRequests}</strong>
              </div>
              <div className="profileSummaryItem">
                <span>Saved Items</span>
                <strong>{user.savedItems}</strong>
              </div>
              <div className="profileSummaryItem">
                <span>Avg. Response</span>
                <strong>{user.responseTime}</strong>
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
              <button type="button" className="profileControlButton">Change profile details</button>
              <button type="button" className="profileControlButton">Manage portfolio & gallery</button>
              <button type="button" className="profileControlButton">Update billing information</button>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}
