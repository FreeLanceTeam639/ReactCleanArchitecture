import { KeyRound, LoaderCircle, ShieldCheck, Smartphone, ToggleLeft, ToggleRight } from 'lucide-react';
import { PROFILE_NAVIGATION_LINKS } from '../../shared/constants/navigationLinks.js';
import { ROUTES } from '../../shared/constants/routes.js';
import MarketplaceHeader from '../../shared/ui/MarketplaceHeader.jsx';
import { useSecurityPage } from '../../features/workspace/hooks/useSecurityPage.js';

function SecurityToggle({ label, description, checked, busy, onClick }) {
  return (
    <button type="button" className="workspaceToggleCard interactive" onClick={onClick} disabled={busy}>
      <div>
        <strong>{label}</strong>
        <p>{description}</p>
      </div>
      {checked ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
    </button>
  );
}

export default function SecurityPage({ navigate }) {
  const {
    settings,
    sessions,
    passwordForm,
    feedback,
    isLoading,
    busyKey,
    error,
    toggleSetting,
    setPasswordFieldValue,
    submitPassword,
    revokeOneSession
  } = useSecurityPage(navigate);

  return (
    <div className="profileShell">
      <MarketplaceHeader
        navigate={navigate}
        links={PROFILE_NAVIGATION_LINKS}
        actionButton={{ label: 'Post a Job', route: ROUTES.postTask }}
      />

      <main className="wrap workspacePage fadeUp">
        <section className="workspaceHero cardLift">
          <div>
            <span className="profileEyebrow">Security Center</span>
            <h1>Security Settings</h1>
            <p>2FA, login alert və active session idarəsi ayrıca security endpoint qatına bağlanıb.</p>
          </div>
          <div className="workspaceHighlightCard cardLift">
            <ShieldCheck size={18} />
            <div>
              <strong>Protected account flow</strong>
              <p>Frontend yalnız state göstərir, dəyişiklik request-ləri service layer üzərindən gedir.</p>
            </div>
          </div>
        </section>

        {isLoading ? (
          <section className="workspacePanel cardLift"><div className="workspaceEmptyState"><LoaderCircle className="spinLoader" size={24} /> Loading security settings...</div></section>
        ) : error ? (
          <section className="workspacePanel cardLift"><div className="workspaceEmptyState">{error}</div></section>
        ) : (
          <section className="workspaceSplitLayout singleTop">
            <article className="workspacePanel cardLift">
              <div className="workspacePanelHeader">
                <div>
                  <span className="profileEyebrow">Preferences</span>
                  <h2>Account protections</h2>
                </div>
                <ShieldCheck size={18} />
              </div>
              <div className="workspaceToggleList">
                <SecurityToggle label="Two-factor authentication" description="Extra verification during sign-in." checked={settings.twoFactorEnabled} busy={busyKey === 'toggle:twoFactorEnabled'} onClick={() => toggleSetting('twoFactorEnabled')} />
                <SecurityToggle label="Login alerts" description="Email and in-app alerts for new sign-ins." checked={settings.loginAlerts} busy={busyKey === 'toggle:loginAlerts'} onClick={() => toggleSetting('loginAlerts')} />
                <SecurityToggle label="Session lock" description="Require device approval before new session starts." checked={settings.sessionLock} busy={busyKey === 'toggle:sessionLock'} onClick={() => toggleSetting('sessionLock')} />
              </div>

              <form className="workspaceForm security" onSubmit={submitPassword}>
                <div className="workspacePanelHeader smallGap">
                  <div>
                    <span className="profileEyebrow">Credentials</span>
                    <h2>Update password</h2>
                  </div>
                  <KeyRound size={18} />
                </div>
                <label className="profileField">
                  <span>Current password</span>
                  <input type="password" value={passwordForm.currentPassword} onChange={(event) => setPasswordFieldValue('currentPassword', event.target.value)} />
                </label>
                <label className="profileField">
                  <span>New password</span>
                  <input type="password" value={passwordForm.newPassword} onChange={(event) => setPasswordFieldValue('newPassword', event.target.value)} />
                </label>
                <label className="profileField fullWidth">
                  <span>Confirm new password</span>
                  <input type="password" value={passwordForm.confirmPassword} onChange={(event) => setPasswordFieldValue('confirmPassword', event.target.value)} />
                </label>
                <button type="submit" className="btn primary interactive" disabled={busyKey === 'password'}>
                  {busyKey === 'password' ? 'Saving...' : 'Update password'}
                </button>
              </form>
              {feedback ? <div className="profileFeedbackBanner">{feedback}</div> : null}
            </article>

            <aside className="workspacePanel cardLift">
              <div className="workspacePanelHeader">
                <div>
                  <span className="profileEyebrow">Sessions</span>
                  <h2>Active devices</h2>
                </div>
                <Smartphone size={18} />
              </div>
              <div className="workspaceListStack">
                {sessions.map((item) => (
                  <article key={item.id} className="workspaceListCard">
                    <div className="workspaceListCardMain">
                      <div className="workspaceListCardIcon"><Smartphone size={16} /></div>
                      <div>
                        <strong>{item.device}</strong>
                        <p>{item.location}</p>
                      </div>
                    </div>
                    <div className="workspaceListCardSide">
                      <small>{item.lastActive}</small>
                      {item.isCurrent ? (
                        <span className="workspaceBadge active">Current</span>
                      ) : (
                        <button type="button" className="profileActionButton interactive" disabled={busyKey === `session:${item.id}`} onClick={() => revokeOneSession(item.id)}>
                          {busyKey === `session:${item.id}` ? 'Revoking...' : 'Revoke'}
                        </button>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </aside>
          </section>
        )}
      </main>
    </div>
  );
}
