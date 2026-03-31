import {
  KeyRound,
  LoaderCircle,
  ShieldCheck,
  Smartphone,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { useSecurityPage } from '../../features/workspace/hooks/useSecurityPage.js';
import { PROFILE_NAVIGATION_LINKS } from '../../shared/constants/navigationLinks.js';
import { ROUTES } from '../../shared/constants/routes.js';
import { useI18n } from '../../shared/i18n/I18nProvider.jsx';
import MarketplaceHeader from '../../shared/ui/MarketplaceHeader.jsx';

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
  const { t } = useI18n();
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
        actionButton={{ label: t('Post Job'), route: ROUTES.postTask }}
      />

      <main className="wrap workspacePage fadeUp">
        <section className="workspaceHero cardLift">
          <div>
            <span className="profileEyebrow">{t('Security Center')}</span>
            <h1>{t('Security Settings')}</h1>
            <p>{t('2FA, login alerts and active session controls are connected to the dedicated security endpoint layer.')}</p>
          </div>
          <div className="workspaceHighlightCard cardLift">
            <ShieldCheck size={18} />
            <div>
              <strong>{t('Protected account flow')}</strong>
              <p>{t('The frontend shows the current state while change requests go through the service layer.')}</p>
            </div>
          </div>
        </section>

        {isLoading ? (
          <section className="workspacePanel cardLift">
            <div className="workspaceEmptyState">
              <LoaderCircle className="spinLoader" size={24} /> {t('Loading security settings...')}
            </div>
          </section>
        ) : error ? (
          <section className="workspacePanel cardLift">
            <div className="workspaceEmptyState">{t(error)}</div>
          </section>
        ) : (
          <section className="workspaceSplitLayout singleTop">
            <article className="workspacePanel cardLift">
              <div className="workspacePanelHeader">
                <div>
                  <span className="profileEyebrow">{t('Preferences')}</span>
                  <h2>{t('Account protections')}</h2>
                </div>
                <ShieldCheck size={18} />
              </div>
              <div className="workspaceToggleList">
                <SecurityToggle
                  label={t('Two-factor authentication')}
                  description={t('Extra verification during sign-in.')}
                  checked={settings.twoFactorEnabled}
                  busy={busyKey === 'toggle:twoFactorEnabled'}
                  onClick={() => toggleSetting('twoFactorEnabled')}
                />
                <SecurityToggle
                  label={t('Login alerts')}
                  description={t('Email and in-app alerts for new sign-ins.')}
                  checked={settings.loginAlerts}
                  busy={busyKey === 'toggle:loginAlerts'}
                  onClick={() => toggleSetting('loginAlerts')}
                />
                <SecurityToggle
                  label={t('Session lock')}
                  description={t('Require device approval before a new session starts.')}
                  checked={settings.sessionLock}
                  busy={busyKey === 'toggle:sessionLock'}
                  onClick={() => toggleSetting('sessionLock')}
                />
              </div>

              <form className="workspaceForm security" onSubmit={submitPassword}>
                <div className="workspacePanelHeader smallGap">
                  <div>
                    <span className="profileEyebrow">{t('Credentials')}</span>
                    <h2>{t('Update password')}</h2>
                  </div>
                  <KeyRound size={18} />
                </div>
                <label className="profileField">
                  <span>{t('Current password')}</span>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(event) => setPasswordFieldValue('currentPassword', event.target.value)}
                  />
                </label>
                <label className="profileField">
                  <span>{t('New password')}</span>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(event) => setPasswordFieldValue('newPassword', event.target.value)}
                  />
                </label>
                <label className="profileField fullWidth">
                  <span>{t('Confirm new password')}</span>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(event) => setPasswordFieldValue('confirmPassword', event.target.value)}
                  />
                </label>
                <button type="submit" className="btn primary interactive" disabled={busyKey === 'password'}>
                  {busyKey === 'password' ? t('Saving...') : t('Update password')}
                </button>
              </form>
              {feedback ? <div className="profileFeedbackBanner">{t(feedback)}</div> : null}
            </article>

            <aside className="workspacePanel cardLift">
              <div className="workspacePanelHeader">
                <div>
                  <span className="profileEyebrow">{t('Sessions')}</span>
                  <h2>{t('Active devices')}</h2>
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
                        <span className="workspaceBadge active">{t('Current')}</span>
                      ) : (
                        <button
                          type="button"
                          className="profileActionButton interactive"
                          disabled={busyKey === `session:${item.id}`}
                          onClick={() => revokeOneSession(item.id)}
                        >
                          {busyKey === `session:${item.id}` ? t('Revoking...') : t('Revoke')}
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
