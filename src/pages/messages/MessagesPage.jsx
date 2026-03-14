import { LoaderCircle, Search, Send, MessagesSquare } from 'lucide-react';
import { AUTHENTICATED_NAVIGATION_LINKS } from '../../shared/constants/navigationLinks.js';
import { ROUTES } from '../../shared/constants/routes.js';
import MarketplaceHeader from '../../shared/ui/MarketplaceHeader.jsx';
import { useMessagesPage } from '../../features/workspace/hooks/useMessagesPage.js';

export default function MessagesPage({ navigate }) {
  const {
    filters,
    conversations,
    thread,
    activeConversation,
    draftMessage,
    isLoading,
    error,
    busyKey,
    setDraftMessage,
    setFilterValue,
    openConversation,
    submitReply
  } = useMessagesPage(navigate);

  return (
    <div className="profileShell">
      <MarketplaceHeader
        navigate={navigate}
        links={AUTHENTICATED_NAVIGATION_LINKS}
        actionButton={{ label: 'Post a Job', route: ROUTES.postTask }}
      />

      <main className="wrap workspacePage fadeUp">
        <section className="workspaceHero cardLift">
          <div>
            <span className="profileEyebrow">Inbox Flow</span>
            <h1>Messages & Chat</h1>
            <p>Conversation indexing, unread state və reply axını endpoint-first service layer ilə işləyir.</p>
          </div>
          <div className="workspaceMetricsGrid workspaceMiniMetrics">
            <article className="workspaceMetricCard cardLift"><span>Conversations</span><strong>{conversations.length}</strong></article>
            <article className="workspaceMetricCard cardLift"><span>Unread</span><strong>{conversations.reduce((sum, item) => sum + (item.unreadCount || 0), 0)}</strong></article>
          </div>
        </section>

        <section className="workspacePanel cardLift">
          <div className="workspaceToolbar compact">
            <label className="talentSearchInput">
              <Search size={16} />
              <input value={filters.search} onChange={(event) => setFilterValue('search', event.target.value)} placeholder="Search conversations" />
            </label>
            <select className="talentSelect" value={filters.status} onChange={(event) => setFilterValue('status', event.target.value)}>
              <option value="all">All conversations</option>
              <option value="unread">Unread</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {isLoading ? (
            <div className="workspaceEmptyState"><LoaderCircle className="spinLoader" size={24} /> Loading messages...</div>
          ) : error ? (
            <div className="workspaceEmptyState">{error}</div>
          ) : (
            <div className="workspaceSplitLayout">
              <aside className="workspaceConversationList">
                {conversations.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={item.id === activeConversation?.id ? 'workspaceConversationCard active interactive' : 'workspaceConversationCard interactive'}
                    onClick={() => openConversation(item.id)}
                  >
                    <div className="workspaceConversationTop">
                      <strong>{item.participant}</strong>
                      <span>{item.updatedAt}</span>
                    </div>
                    <p>{item.lastMessage}</p>
                    <div className="workspaceConversationMeta">
                      <span>{item.title}</span>
                      {item.unreadCount ? <span className="workspaceBadge unread">{busyKey === `read:${item.id}` ? '...' : item.unreadCount}</span> : null}
                    </div>
                  </button>
                ))}
              </aside>

              <section className="workspaceThreadPanel">
                {activeConversation ? (
                  <>
                    <div className="workspaceThreadHeader">
                      <div>
                        <strong>{activeConversation.participant}</strong>
                        <p>{activeConversation.title}</p>
                      </div>
                      <span className={`workspaceBadge ${activeConversation.status}`}>{activeConversation.status}</span>
                    </div>

                    <div className="workspaceThreadBody">
                      {thread.map((item) => (
                        <div key={item.id} className={item.direction === 'outbound' ? 'workspaceBubble outbound' : 'workspaceBubble inbound'}>
                          <strong>{item.sender}</strong>
                          <p>{item.text}</p>
                          <span>{item.sentAt}</span>
                        </div>
                      ))}
                    </div>

                    <form className="workspaceComposer" onSubmit={submitReply}>
                      <textarea
                        value={draftMessage}
                        onChange={(event) => setDraftMessage(event.target.value)}
                        placeholder="Write a reply..."
                      />
                      <button type="submit" className="btn primary interactive" disabled={busyKey === 'reply'}>
                        <Send size={16} /> {busyKey === 'reply' ? 'Sending...' : 'Send'}
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="workspaceEmptyState"><MessagesSquare size={18} /> Select a conversation to start replying.</div>
                )}
              </section>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
