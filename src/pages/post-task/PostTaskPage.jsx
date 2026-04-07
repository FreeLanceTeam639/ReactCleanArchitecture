import { ArrowUpRight, LoaderCircle, ShieldCheck, Sparkles, WandSparkles } from 'lucide-react';
import { resolveApiAssetUrl } from '../../shared/api/mediaAssets.js';
import { AUTHENTICATED_NAVIGATION_LINKS } from '../../shared/constants/navigationLinks.js';
import { ROUTES } from '../../shared/constants/routes.js';
import MarketplaceHeader from '../../shared/ui/MarketplaceHeader.jsx';
import WorkspaceTaskMediaField from '../../features/workspace/components/WorkspaceTaskMediaField.jsx';
import { usePostTaskPage } from '../../features/workspace/hooks/usePostTaskPage.js';
import SelectOne from '../../components/ui/select-1.jsx';

function VerificationStatusBadge({ status = 'Unverified' }) {
  const normalizedStatus = String(status).toLowerCase();
  const className = normalizedStatus === 'verified'
    ? 'workspaceBadge active'
    : normalizedStatus === 'pending'
      ? 'workspaceBadge review'
      : normalizedStatus === 'rejected'
        ? 'workspaceBadge blocked'
        : 'workspaceBadge';

  return <span className={className}>{status}</span>;
}

function getPlanDurationLabel(planKey) {
  const normalizedPlanKey = String(planKey || 'free').toLowerCase();

  if (normalizedPlanKey === 'starter') {
    return 'Starter paketinde eyni vaxtda 5 aktiv is elani saxlanilir ve 30 gunden bir yenilenir.';
  }

  if (normalizedPlanKey === 'growth') {
    return 'Boyume paketinde limitsiz aktiv is elani var ve vaxt mehdudiyyeti yoxdur.';
  }

  return 'Pulsuz paketde yalniz 1 aktiv is elani paylasmaq olur ve her elan 15 gun aktiv qalir.';
}

function getUpgradeLabel(planKey) {
  return String(planKey || 'free').toLowerCase() === 'starter'
    ? 'Upgrade to Growth'
    : 'Upgrade to Starter';
}

function getUsageLabel(subscriptionOverview) {
  if (!subscriptionOverview) {
    return '';
  }

  const activeJobs = Number(subscriptionOverview.activePublishedJobs || 0);

  if (subscriptionOverview.isUnlimited) {
    return `${activeJobs} aktiv elan / limitsiz`;
  }

  return `${activeJobs}/${subscriptionOverview.maxActivePublishedJobs || 0} aktiv elan`;
}

export default function PostTaskPage({ navigate }) {
  const {
    meta,
    verificationOverview,
    subscriptionOverview,
    form,
    feedback,
    busyKey,
    isLoading,
    error,
    canPublishNow,
    setFieldValue,
    openUpgradeFlow,
    submit
  } = usePostTaskPage(navigate);

  const canPostJobs = Boolean(verificationOverview?.isVerified);
  const usageLabel = getUsageLabel(subscriptionOverview);
  const currentPlanName = subscriptionOverview?.currentPlanName || 'Pulsuz';
  const remainingPostsLabel = subscriptionOverview?.isUnlimited
    ? 'Limitsiz qalir'
    : `${Number(subscriptionOverview?.remainingPublishedJobs || 0)} elan yeri qalib`;
  const upgradeLabel = getUpgradeLabel(subscriptionOverview?.currentPlanKey);
  const previewCoverImage = resolveApiAssetUrl(form.imageUrls?.[0] || '');
  const galleryCount = Array.isArray(form.imageUrls) ? form.imageUrls.length : 0;

  return (
    <div className="profileShell">
      <MarketplaceHeader
        navigate={navigate}
        links={AUTHENTICATED_NAVIGATION_LINKS}
        actionButton={{
          label: canPostJobs ? 'Post Job' : 'Get Verified',
          route: canPostJobs ? ROUTES.postTask : ROUTES.verification
        }}
      />

      <main className="wrap workspacePage fadeUp">
        <section className="workspaceHero cardLift">
          <div>
            <span className="profileEyebrow">Member Workflow</span>
            <h1>Create Task / Post Job</h1>
            <p>Every member can post jobs after verification. Once approved, this form publishes directly to the backend and the result appears in My Orders & Jobs.</p>
          </div>
          <div className="workspaceHighlightCard cardLift">
            <WandSparkles size={18} />
            <div>
              <strong>Structured brief</strong>
              <p>Category, budget, timeline and skills go straight into the create-task flow.</p>
            </div>
          </div>
        </section>

        {isLoading ? (
          <section className="workspacePanel cardLift">
            <div className="workspaceEmptyState"><LoaderCircle className="spinLoader" size={24} /> Loading task page...</div>
          </section>
        ) : error ? (
          <section className="workspacePanel cardLift">
            <div className="workspaceEmptyState">{error}</div>
          </section>
        ) : !canPostJobs ? (
          <section className="workspaceSplitLayout singleTop">
            <article className="workspacePanel cardLift">
              <div className="workspacePanelHeader">
                <div>
                  <span className="profileEyebrow">Posting Access</span>
                  <h2>Verification required</h2>
                </div>
                <ShieldCheck size={18} />
              </div>

              <div className="workspacePreviewCard">
                <div className="workspacePreviewGrid">
                  <div>
                    <span>Status</span>
                    <strong><VerificationStatusBadge status={verificationOverview?.verificationStatus} /></strong>
                  </div>
                  <div>
                    <span>Access</span>
                    <strong>Locked</strong>
                  </div>
                </div>
                <p>
                  {verificationOverview?.verificationNote || 'Submit a verification ticket so the admin team can approve your account for job posting.'}
                </p>
                <button type="button" className="btn primary interactive" onClick={() => navigate(ROUTES.verification)}>
                  Open Verification Center
                </button>
              </div>
            </article>

            <aside className="workspacePanel cardLift">
              <div className="workspacePanelHeader">
                <div>
                  <span className="profileEyebrow">What unlocks</span>
                  <h2>After approval</h2>
                </div>
                <Sparkles size={18} />
              </div>

              <div className="workspacePreviewCard">
                <strong>Job posting access</strong>
                <p>You will be able to create drafts, publish tasks, and manage your listings from the same member account.</p>
                <div className="workspacePreviewGrid">
                  <div><span>Drafts</span><strong>Enabled</strong></div>
                  <div><span>Publishing</span><strong>Enabled</strong></div>
                  <div><span>Listings</span><strong>Visible in profile</strong></div>
                  <div><span>Review flow</span><strong>Admin approved</strong></div>
                </div>
              </div>
            </aside>
          </section>
        ) : (
          <section className="workspaceSplitLayout singleTop">
            <article className="workspacePanel cardLift">
              {subscriptionOverview ? (
                <div className="workspacePreviewCard workspaceSubscriptionCard">
                  <div className="workspacePanelHeader smallGap">
                    <div>
                      <span className="profileEyebrow">Subscription access</span>
                      <h2>Posting limitiniz</h2>
                    </div>
                    <Sparkles size={18} />
                  </div>

                  <div className="workspacePreviewGrid workspaceMiniMetrics">
                    <div>
                      <span>Cari paket</span>
                      <strong>{currentPlanName}</strong>
                    </div>
                    <div>
                      <span>Istifade</span>
                      <strong>{usageLabel}</strong>
                    </div>
                    <div>
                      <span>Qaliq limit</span>
                      <strong>{remainingPostsLabel}</strong>
                    </div>
                    <div>
                      <span>Status</span>
                      <strong>
                        <span className={canPublishNow ? 'workspaceBadge active' : 'workspaceBadge blocked'}>
                          {canPublishNow ? 'Publishing open' : 'Limit reached'}
                        </span>
                      </strong>
                    </div>
                  </div>

                  <p className="workspaceSubscriptionHint">{getPlanDurationLabel(subscriptionOverview.currentPlanKey)}</p>

                  {!canPublishNow ? (
                    <div className="workspaceSubscriptionActions">
                      <span className="workspaceBadge blocked">Yeni elan ucun upgrade lazimdir</span>
                      <button type="button" className="btn primary interactive workspaceButtonStretch" onClick={openUpgradeFlow}>
                        {upgradeLabel}
                        <ArrowUpRight size={16} />
                      </button>
                    </div>
                  ) : null}
                </div>
              ) : null}

              <form className="workspaceForm" onSubmit={(event) => submit(event, 'publish')}>
                <label className="profileField fullWidth">
                  <span>Task title</span>
                  <input value={form.title} onChange={(event) => setFieldValue('title', event.target.value)} placeholder="Enter task title" />
                </label>

                <label className="profileField">
                  <span>Category</span>
                  <SelectOne value={form.category} onChange={(nextValue) => setFieldValue('category', nextValue)} options={meta.categories} />
                </label>

                <label className="profileField">
                  <span>Budget type</span>
                  <SelectOne value={form.budgetType} onChange={(nextValue) => setFieldValue('budgetType', nextValue)} options={meta.budgetTypes} />
                </label>

                <label className="profileField">
                  <span>Budget</span>
                  <input value={form.budget} onChange={(event) => setFieldValue('budget', event.target.value)} placeholder="Enter budget" />
                </label>

                <label className="profileField">
                  <span>Timeline</span>
                  <SelectOne value={form.duration} onChange={(nextValue) => setFieldValue('duration', nextValue)} options={meta.durations} />
                </label>

                <label className="profileField fullWidth">
                  <span>Required skills</span>
                  <input value={form.skills} onChange={(event) => setFieldValue('skills', event.target.value)} placeholder="Enter required skills" />
                </label>

                <label className="profileField fullWidth">
                  <span>Description</span>
                  <textarea rows="7" value={form.description} onChange={(event) => setFieldValue('description', event.target.value)} placeholder="Describe deliverables, deadlines and communication expectations." />
                </label>

                <WorkspaceTaskMediaField
                  label="Task visuals"
                  value={form.imageUrls}
                  onChange={(nextImages) => setFieldValue('imageUrls', nextImages)}
                />

                <div className="workspaceFormActions fullWidth">
                  <button type="button" className="btn ghost interactive" onClick={(event) => submit(event, 'draft')} disabled={busyKey === 'draft'}>
                    {busyKey === 'draft' ? 'Saving...' : 'Save draft'}
                  </button>
                  {canPublishNow ? (
                    <button type="submit" className="btn primary interactive" disabled={busyKey === 'publish'}>
                      {busyKey === 'publish' ? 'Publishing...' : 'Publish task'}
                    </button>
                  ) : (
                    <button type="button" className="btn primary interactive" onClick={openUpgradeFlow}>
                      {upgradeLabel}
                    </button>
                  )}
                </div>
              </form>
              {feedback ? <div className="profileFeedbackBanner">{feedback}</div> : null}
            </article>

            <aside className="workspacePanel cardLift">
              <div className="workspacePanelHeader">
                <div>
                  <span className="profileEyebrow">Preview</span>
                  <h2>Task snapshot</h2>
                </div>
                <Sparkles size={18} />
              </div>
              <div className="workspacePreviewCard">
                {previewCoverImage ? (
                  <div className="workspaceTaskSnapshotMedia">
                    <img src={previewCoverImage} alt="Task cover preview" className="workspaceTaskSnapshotImage" />
                    <span className="workspaceTaskSnapshotBadge">Cover image</span>
                  </div>
                ) : (
                  <div className="workspaceTaskSnapshotPlaceholder">
                    <strong>Image gallery not added yet</strong>
                    <p>Upload visuals and the first image will become the public cover on task cards and the detail page.</p>
                  </div>
                )}
                <strong>{form.title || 'Task title preview'}</strong>
                <p>{form.description || 'Your task description will appear here. Clear structure increases conversion.'}</p>
                <div className="workspacePreviewGrid">
                  <div><span>Category</span><strong>{form.category}</strong></div>
                  <div><span>Budget</span><strong>{form.budgetType} • ${form.budget || 0}</strong></div>
                  <div><span>Timeline</span><strong>{form.duration}</strong></div>
                  <div><span>Skills</span><strong>{form.skills || '-'}</strong></div>
                  <div><span>Gallery</span><strong>{galleryCount ? `${galleryCount} sekil` : 'Sekil yoxdur'}</strong></div>
                </div>
                <div className="profileSkillRow">
                  {meta.suggestedSkills.map((item) => (
                    <button key={item} type="button" className="profileSkillChip interactive" onClick={() => setFieldValue('skills', form.skills ? `${form.skills}, ${item}` : item)}>
                      + {item}
                    </button>
                  ))}
                </div>
              </div>
            </aside>
          </section>
        )}
      </main>
    </div>
  );
}
