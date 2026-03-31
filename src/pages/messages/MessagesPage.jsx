import { LoaderCircle, MessagesSquare, Search, Send } from 'lucide-react';
import { useMessagesPage } from '../../features/workspace/hooks/useMessagesPage.js';
import { AUTHENTICATED_NAVIGATION_LINKS } from '../../shared/constants/navigationLinks.js';
import { ROUTES } from '../../shared/constants/routes.js';
import { useI18n } from '../../shared/i18n/I18nProvider.jsx';
import MarketplaceHeader from '../../shared/ui/MarketplaceHeader.jsx';

export default function MessagesPage({ navigate }) {
  const { t } = useI18n();
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
        actionButton={{ label: t('Post Job'), route: ROUTES.postTask }}
      />

      <main className="wrap workspacePage fadeUp">
        <section className="workspaceHero cardLift">
          <div>
            <span className="profileEyebrow">{t('Inbox Flow')}</span>
            <h1>{t('Messages & Chat')}</h1>
            <p>{t('Conversation indexing, unread state and reply flow run through the endpoint-first service layer.')}</p>
          </div>
          <div className="workspaceMetricsGrid workspaceMiniMetrics">
            <article className="workspaceMetricCard cardLift">
              <span>{t('Conversations')}</span>
              <strong>{conversations.length}</strong>
            </article>
            <article className="workspaceMetricCard cardLift">
              <span>{t('Unread')}</span>
              <strong>{conversations.reduce((sum, item) => sum + (item.unreadCount || 0), 0)}</strong>
            </article>
          </div>
        </section>

        <section className="workspacePanel cardLift">
          <div className="workspaceToolbar compact">
            <label className="talentSearchInput">
              <Search size={16} />
              <input
                value={filters.search}
                onChange={(event) => setFilterValue('search', event.target.value)}
                placeholder={t('Search conversations')}
              />
            </label>
            <select
              className="talentSelect"
              value={filters.status}
              onChange={(event) => setFilterValue('status', event.target.value)}
            >
              <option value="all">{t('All conversations')}</option>
              <option value="unread">{t('Unread')}</option>
              <option value="active">{t('Active')}</option>
              <option value="archived">{t('Archived')}</option>
            </select>
          </div>

          {isLoading ? (
            <div className="workspaceEmptyState">
              <LoaderCircle className="spinLoader" size={24} /> {t('Loading messages...')}
            </div>
          ) : error ? (
            <div className="workspaceEmptyState">{t(error)}</div>
          ) : (
            <div className="workspaceSplitLayout">
              <aside className="workspaceConversationList">
                {conversations.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={
                      item.id === activeConversation?.id
                        ? 'workspaceConversationCard active interactive'
                        : 'workspaceConversationCard interactive'
                    }
                    onClick={() => openConversation(item.id)}
                  >
                    <div className="workspaceConversationTop">
                      <strong>{item.participant}</strong>
                      <span>{item.updatedAt}</span>
                    </div>
                    <p>{item.lastMessage}</p>
                    <div className="workspaceConversationMeta">
                      <span>{item.title}</span>
                      {item.unreadCount ? (
                        <span className="workspaceBadge unread">
                          {busyKey === `read:${item.id}` ? '...' : item.unreadCount}
                        </span>
                      ) : null}
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
                      <span className={`workspaceBadge ${activeConversation.status}`}>
                        {t(activeConversation.status)}
                      </span>
                    </div>

                    <div className="workspaceThreadBody">
                      {thread.map((item) => (
                        <div
                          key={item.id}
                          className={
                            item.direction === 'outbound'
                              ? 'workspaceBubble outbound'
                              : 'workspaceBubble inbound'
                          }
                        >
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
                        placeholder={t('Write a reply...')}
                      />
                      <button type="submit" className="btn primary interactive" disabled={busyKey === 'reply'}>
                        <Send size={16} /> {busyKey === 'reply' ? t('Sending...') : t('Send')}
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="workspaceEmptyState">
                    <MessagesSquare size={18} /> {t('Select a conversation to start replying.')}
                  </div>
                )}
              </section>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
