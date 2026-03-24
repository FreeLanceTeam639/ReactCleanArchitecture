import { LoaderCircle, ShieldCheck, Sparkles, WandSparkles } from 'lucide-react';
import { AUTHENTICATED_NAVIGATION_LINKS } from '../../shared/constants/navigationLinks.js';
import { ROUTES } from '../../shared/constants/routes.js';
import MarketplaceHeader from '../../shared/ui/MarketplaceHeader.jsx';
import { usePostTaskPage } from '../../features/workspace/hooks/usePostTaskPage.js';

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

export default function PostTaskPage({ navigate }) {
  const {
    meta,
    verificationOverview,
    form,
    feedback,
    busyKey,
    isLoading,
    error,
    setFieldValue,
    submit
  } = usePostTaskPage(navigate);

  const canPostJobs = Boolean(verificationOverview?.isVerified);

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
            <p>Every member can post jobs after verification. Once approved, this form publishes directly to the backend.</p>
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
              <form className="workspaceForm" onSubmit={(event) => submit(event, 'publish')}>
                <label className="profileField fullWidth">
                  <span>Task title</span>
                  <input value={form.title} onChange={(event) => setFieldValue('title', event.target.value)} placeholder="Need a polished marketplace dashboard UI" />
                </label>

                <label className="profileField">
                  <span>Category</span>
                  <select className="talentSelect" value={form.category} onChange={(event) => setFieldValue('category', event.target.value)}>
                    {meta.categories.map((item) => <option key={item}>{item}</option>)}
                  </select>
                </label>

                <label className="profileField">
                  <span>Budget type</span>
                  <select className="talentSelect" value={form.budgetType} onChange={(event) => setFieldValue('budgetType', event.target.value)}>
                    {meta.budgetTypes.map((item) => <option key={item}>{item}</option>)}
                  </select>
                </label>

                <label className="profileField">
                  <span>Budget</span>
                  <input value={form.budget} onChange={(event) => setFieldValue('budget', event.target.value)} placeholder="1200" />
                </label>

                <label className="profileField">
                  <span>Timeline</span>
                  <select className="talentSelect" value={form.duration} onChange={(event) => setFieldValue('duration', event.target.value)}>
                    {meta.durations.map((item) => <option key={item}>{item}</option>)}
                  </select>
                </label>

                <label className="profileField fullWidth">
                  <span>Required skills</span>
                  <input value={form.skills} onChange={(event) => setFieldValue('skills', event.target.value)} placeholder="React, Tailwind, REST API" />
                </label>

                <label className="profileField fullWidth">
                  <span>Description</span>
                  <textarea rows="7" value={form.description} onChange={(event) => setFieldValue('description', event.target.value)} placeholder="Describe deliverables, deadlines and communication expectations." />
                </label>

                <div className="workspaceFormActions fullWidth">
                  <button type="button" className="btn ghost interactive" onClick={(event) => submit(event, 'draft')} disabled={busyKey === 'draft'}>
                    {busyKey === 'draft' ? 'Saving...' : 'Save draft'}
                  </button>
                  <button type="submit" className="btn primary interactive" disabled={busyKey === 'publish'}>
                    {busyKey === 'publish' ? 'Publishing...' : 'Publish task'}
                  </button>
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
                <strong>{form.title || 'Task title preview'}</strong>
                <p>{form.description || 'Your task description will appear here. Clear structure increases conversion.'}</p>
                <div className="workspacePreviewGrid">
                  <div><span>Category</span><strong>{form.category}</strong></div>
                  <div><span>Budget</span><strong>{form.budgetType} • ${form.budget || 0}</strong></div>
                  <div><span>Timeline</span><strong>{form.duration}</strong></div>
                  <div><span>Skills</span><strong>{form.skills || '-'}</strong></div>
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
