import { useMemo } from 'react';
import { LoaderCircle, MessagesSquare, Search } from 'lucide-react';
import { useMessagesPage } from '../../features/workspace/hooks/useMessagesPage.js';
import { AUTHENTICATED_NAVIGATION_LINKS } from '../../shared/constants/navigationLinks.js';
import { ROUTES } from '../../shared/constants/routes.js';
import { useI18n } from '../../shared/i18n/I18nProvider.jsx';
import MarketplaceHeader from '../../shared/ui/MarketplaceHeader.jsx';
import ChatInterface from '../../components/ui/chat-interface.jsx';
import RuixenMonoChat from '../../components/ui/ruixen-mono-chat.jsx';
import SelectOne from '../../components/ui/select-1.jsx';

export default function MessagesPage({ navigate }) {
  const { t } = useI18n();
  const {
    filters,
    conversations,
    thread,
    activeConversation,
    draftMessage,
    isParticipantTyping,
    isLoading,
    error,
    busyKey,
    setDraftMessage,
    setFilterValue,
    openConversation,
    submitReply
  } = useMessagesPage(navigate);

  const participantItems = useMemo(
    () =>
      conversations.map((item) => ({
        id: item.id,
        name: item.participant,
        title: item.title,
        preview: item.lastMessage || t('No messages yet'),
        updatedAt: item.updatedAt,
        unreadCount: item.unreadCount || 0,
        isOnline: item.status !== 'archived',
        avatar: item.avatarUrl || ''
      })),
    [conversations, t]
  );

  const toolbar = (
    <>
      <label className="talentSearchInput">
        <Search size={16} />
        <input
          value={filters.search}
          onChange={(event) => setFilterValue('search', event.target.value)}
          placeholder={t('Search conversations')}
        />
      </label>
      <SelectOne
        className="workspaceToolbarSelect"
        triggerClassName="interactive"
        value={filters.status}
        onChange={(nextValue) => setFilterValue('status', nextValue)}
        options={[
          { value: 'all', label: t('All conversations') },
          { value: 'unread', label: t('Unread') },
          { value: 'active', label: t('Active') },
          { value: 'archived', label: t('Archived') }
        ]}
      />
    </>
  );

  return (
    <div className="profileShell">
      <MarketplaceHeader
        navigate={navigate}
        links={AUTHENTICATED_NAVIGATION_LINKS}
        actionButton={{ label: t('Post Job'), route: ROUTES.postTask }}
      />

      <main className="wrap workspacePage fadeUp">
        {isLoading ? (
          <section className="workspacePanel cardLift">
            <div className="workspaceEmptyState">
              <LoaderCircle className="spinLoader" size={24} /> {t('Loading messages...')}
            </div>
          </section>
        ) : error ? (
          <section className="workspacePanel cardLift">
            <div className="workspaceEmptyState">{t(error)}</div>
          </section>
        ) : (
          <RuixenMonoChat
            chatName={t('Messages & Chat')}
            description={t('Conversation indexing, unread state and reply flow run through the endpoint-first service layer.')}
            participants={participantItems}
            selectedParticipantId={activeConversation?.id || ''}
            onParticipantSelect={openConversation}
            toolbar={toolbar}
            stats={[
              { label: t('Conversations'), value: conversations.length },
              { label: t('Unread'), value: conversations.reduce((sum, item) => sum + (item.unreadCount || 0), 0) }
            ]}
            clearLabel={t('All conversations')}
            participantsLabel={t('Participants')}
            moreLabel={t('More options')}
            onClearSelection={() => setFilterValue('status', 'all')}
          >
            <section className="workspaceThreadPanel">
              {activeConversation ? (
                <ChatInterface
                  conversation={activeConversation}
                  messages={thread}
                  draftMessage={draftMessage}
                  onDraftChange={setDraftMessage}
                  onSubmit={submitReply}
                  isSending={busyKey === 'reply'}
                  currentUserLabel={t('You')}
                  sendLabel={t('Send')}
                  sendingLabel={t('Sending...')}
                  placeholder={t('Write a reply...')}
                  isParticipantTyping={isParticipantTyping}
                  typingLabel={`${activeConversation.participant} ${t('is typing...')}`}
                  statusLabel={t(activeConversation.status)}
                  statusTextMap={{
                    active: t('active'),
                    unread: t('unread'),
                    archived: t('archived')
                  }}
                  headerDescription={activeConversation.title}
                  emptyStateTitle={t('No messages yet')}
                  emptyStateDescription={t('Reply here to keep the project moving.')}
                />
              ) : (
                <div className="workspaceEmptyState">
                  <MessagesSquare size={18} /> {t('Select a conversation to start replying.')}
                </div>
              )}
            </section>
          </RuixenMonoChat>
        )}
      </main>
    </div>
  );
}
