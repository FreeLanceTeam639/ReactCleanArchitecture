import { FileText, LoaderCircle, Send, ShieldCheck } from 'lucide-react';
import { useVerificationPage } from '../../features/verification/hooks/useVerificationPage.js';
import { PROFILE_NAVIGATION_LINKS } from '../../shared/constants/navigationLinks.js';
import { ROUTES } from '../../shared/constants/routes.js';
import { useI18n } from '../../shared/i18n/I18nProvider.jsx';
import MarketplaceHeader from '../../shared/ui/MarketplaceHeader.jsx';

function VerificationStatusBadge({ status = 'Unverified', t }) {
  const normalizedStatus = String(status).toLowerCase();
  const className =
    normalizedStatus === 'verified'
      ? 'workspaceBadge active'
      : normalizedStatus === 'pending'
        ? 'workspaceBadge review'
        : normalizedStatus === 'rejected'
          ? 'workspaceBadge blocked'
          : 'workspaceBadge';

  return <span className={className}>{t(status)}</span>;
}

export default function VerificationPage({ navigate }) {
  const { t } = useI18n();
  const {
    overview,
    form,
    isLoading,
    error,
    feedback,
    busyKey,
    setFieldValue,
    submit
  } = useVerificationPage(navigate);

  const isVerified = overview?.isVerified;
  const canSubmitTicket = overview?.canSubmitTicket;

  return (
    <div className="profileShell">
      <MarketplaceHeader
        navigate={navigate}
        links={PROFILE_NAVIGATION_LINKS}
        actionButton={{
          label: isVerified ? t('Post Job') : t('Verification'),
          route: isVerified ? ROUTES.postTask : ROUTES.verification
        }}
      />

      <main className="wrap workspacePage fadeUp">
        <section className="workspaceHero cardLift">
          <div>
            <span className="profileEyebrow">{t('Verification Center')}</span>
            <h1>{t('Get Verified To Post Jobs')}</h1>
            <p>{t('Every member can use the platform, but job posting opens only after a verification request is approved.')}</p>
          </div>
          <div className="workspaceHighlightCard cardLift">
            <ShieldCheck size={18} />
            <div>
              <strong>{t('Status')}</strong>
              <p>{t(overview?.verificationNote || 'Submit a short review ticket and wait for admin approval.')}</p>
            </div>
          </div>
        </section>

        {isLoading ? (
          <section className="workspacePanel cardLift">
            <div className="workspaceEmptyState">
              <LoaderCircle className="spinLoader" size={24} /> {t('Loading verification status...')}
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
                  <span className="profileEyebrow">{t('Membership')}</span>
                  <h2>{t('Verification status')}</h2>
                </div>
                <ShieldCheck size={18} />
              </div>

              <div className="workspacePreviewCard">
                <div className="workspacePreviewGrid">
                  <div>
                    <span>{t('Current status')}</span>
                    <strong><VerificationStatusBadge status={overview?.verificationStatus} t={t} /></strong>
                  </div>
                  <div>
                    <span>{t('Posting access')}</span>
                    <strong>{isVerified ? t('Enabled') : t('Locked')}</strong>
                  </div>
                </div>
                {overview?.verificationNote ? <p>{t(overview.verificationNote)}</p> : null}
                {isVerified ? (
                  <button type="button" className="btn primary interactive" onClick={() => navigate(ROUTES.postTask)}>
                    {t('Go to Post Job')}
                  </button>
                ) : null}
              </div>

              {overview?.latestTicket ? (
                <div className="workspaceListCard" style={{ marginTop: '1rem' }}>
                  <div className="workspaceListCardMain">
                    <div className="workspaceListCardIcon"><FileText size={16} /></div>
                    <div>
                      <strong>{overview.latestTicket.subject}</strong>
                      <p>{overview.latestTicket.message}</p>
                    </div>
                  </div>
                  <div className="workspaceListCardSide">
                    <VerificationStatusBadge status={overview.latestTicket.status} t={t} />
                    <small>{overview.latestTicket.createdAt}</small>
                  </div>
                </div>
              ) : null}
            </article>

            <aside className="workspacePanel cardLift">
              <div className="workspacePanelHeader">
                <div>
                  <span className="profileEyebrow">{t('Ticket')}</span>
                  <h2>{t('Submit verification request')}</h2>
                </div>
                <Send size={18} />
              </div>

              {canSubmitTicket ? (
                <form className="workspaceForm" onSubmit={submit}>
                  <label className="profileField fullWidth">
                    <span>{t('Subject')}</span>
                    <input
                      value={form.subject}
                      onChange={(event) => setFieldValue('subject', event.target.value)}
                      placeholder={t('Request account verification for posting jobs')}
                      required
                    />
                  </label>

                  <label className="profileField fullWidth">
                    <span>{t('Portfolio URL')}</span>
                    <input
                      value={form.portfolioUrl}
                      onChange={(event) => setFieldValue('portfolioUrl', event.target.value)}
                      placeholder="https://your-portfolio.example"
                    />
                  </label>

                  <label className="profileField fullWidth">
                    <span>{t('Message')}</span>
                    <textarea
                      rows="7"
                      value={form.message}
                      onChange={(event) => setFieldValue('message', event.target.value)}
                      placeholder={t('Briefly explain what you want to post, who you are, and any proof the admin should review.')}
                      required
                    />
                  </label>

                  <button type="submit" className="btn primary interactive" disabled={busyKey === 'submit'}>
                    {busyKey === 'submit' ? t('Submitting...') : t('Send verification ticket')}
                  </button>
                </form>
              ) : (
                <div className="workspaceEmptyState">
                  {isVerified
                    ? t('Your account is already verified.')
                    : t('A verification request is already pending. You can submit another one after review.')}
                </div>
              )}

              {feedback ? <div className="profileFeedbackBanner">{t(feedback)}</div> : null}
            </aside>
          </section>
        )}
      </main>
    </div>
  );
}
