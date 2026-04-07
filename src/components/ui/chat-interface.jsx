import { AnimatePresence, motion } from 'framer-motion';
import { ImageIcon, Link2, Send } from 'lucide-react';
import { useEffect, useMemo, useRef } from 'react';

function getInitials(name) {
  return String(name || 'U')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}

function resolveMessageType(message) {
  if (message.imageUrl) {
    return 'image';
  }

  if (Array.isArray(message.links) && message.links.length > 0) {
    return 'text-with-links';
  }

  return 'text';
}

function LinkBadge({ link }) {
  return (
    <span className="workspaceChatLinkBadge">
      <Link2 size={12} />
      {link.text}
    </span>
  );
}

function MessageLoader() {
  return (
    <div className="workspaceChatLoader" aria-hidden="true">
      <span />
      <span />
      <span />
    </div>
  );
}

function MessageBubble({ item, participantName, currentUserLabel, isPending }) {
  const isOutbound = item.direction === 'outbound';
  const authorName = isOutbound ? currentUserLabel : participantName;
  const messageType = resolveMessageType(item);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className={isOutbound ? 'workspaceChatRow outbound' : 'workspaceChatRow inbound'}
    >
      <div className={isOutbound ? 'workspaceChatAvatar outbound' : 'workspaceChatAvatar inbound'}>
        {getInitials(authorName)}
      </div>

      <div className="workspaceChatEntry">
        <span className="workspaceChatSender">{authorName}</span>

        <div className={isOutbound ? 'workspaceChatBubble outbound' : 'workspaceChatBubble inbound'}>
          {messageType === 'text' ? <p>{item.text}</p> : null}

          {messageType === 'image' ? (
            <div className="workspaceChatImageWrap">
              <img src={item.imageUrl} alt={item.text || 'Chat attachment'} className="workspaceChatImage" />
              {item.text ? <p>{item.text}</p> : null}
            </div>
          ) : null}

          {messageType === 'text-with-links' ? (
            <div className="workspaceChatRichText">
              <p>{item.text}</p>
              <div className="workspaceChatLinks">
                {item.links.map((link, index) => (
                  <LinkBadge key={`${item.id}-${index}`} link={link} />
                ))}
              </div>
            </div>
          ) : null}

          <div className="workspaceChatMeta">
            {isPending ? (
              <span className="workspaceChatPending">
                <MessageLoader /> Sending
              </span>
            ) : (
              <span>{item.sentAt}</span>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default function ChatInterface({
  conversation,
  messages,
  draftMessage,
  onDraftChange,
  onSubmit,
  isSending = false,
  isParticipantTyping = false,
  emptyStateTitle = 'Select a conversation',
  emptyStateDescription = 'Choose a conversation to start replying.',
  currentUserLabel = 'You',
  sendLabel = 'Send',
  sendingLabel = 'Sending...',
  placeholder = 'Write a reply...',
  typingLabel = 'Typing...',
  statusLabel = '',
  headerDescription = '',
  statusTextMap = {}
}) {
  const bodyRef = useRef(null);

  useEffect(() => {
    if (!bodyRef.current) {
      return;
    }

    bodyRef.current.scrollTo({
      top: bodyRef.current.scrollHeight,
      behavior: 'smooth'
    });
  }, [messages, conversation?.id]);

  const visibleMessages = useMemo(() => {
    if (!Array.isArray(messages) || messages.length === 0) {
      return [];
    }

    return messages;
  }, [messages]);

  if (!conversation) {
    return (
      <section className="workspaceChatShell empty">
        <div className="workspaceChatEmpty">
          <div className="workspaceChatEmptyIcon">
            <ImageIcon size={20} />
          </div>
          <strong>{emptyStateTitle}</strong>
          <p>{emptyStateDescription}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="workspaceChatShell">
      <div className="workspaceChatBackdrop" />

      <header className="workspaceChatHeader">
        <div className="workspaceChatIdentity">
          {conversation.avatarUrl ? (
            <img src={conversation.avatarUrl} alt={conversation.participant} className="workspaceChatHeroAvatarImage" />
          ) : (
            <div className="workspaceChatHeroAvatar">{getInitials(conversation.participant)}</div>
          )}
          <div>
            <strong>{conversation.participant}</strong>
            <p>{headerDescription || conversation.title}</p>
          </div>
        </div>

        <div className="workspaceChatHeaderMeta">
          <span className={`workspaceBadge ${conversation.status}`}>{statusTextMap[conversation.status] || statusLabel}</span>
          <small>{conversation.updatedAt}</small>
        </div>
      </header>

      <AnimatePresence initial={false}>
        {isParticipantTyping ? (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="workspaceChatTypingBar"
          >
            <MessageLoader />
            <span>{typingLabel}</span>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div ref={bodyRef} className="workspaceChatBody">
        <div className="workspaceChatTopFade" />

        <AnimatePresence initial={false}>
          {visibleMessages.length ? (
            <div className="workspaceChatMessages">
              {visibleMessages.map((item) => (
                <MessageBubble
                  key={item.id}
                  item={item}
                  participantName={conversation.participant}
                  currentUserLabel={currentUserLabel}
                />
              ))}
            </div>
          ) : (
            <div className="workspaceChatBodyEmpty">
              <strong>{emptyStateTitle}</strong>
              <p>{emptyStateDescription}</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      <form className="workspaceChatComposer" onSubmit={onSubmit}>
        <label className="workspaceChatComposerField">
          <textarea
            value={draftMessage}
            onChange={(event) => onDraftChange(event.target.value)}
            placeholder={placeholder}
          />
        </label>

        <button type="submit" className="btn primary interactive workspaceChatSendButton" disabled={isSending}>
          <Send size={16} />
          {isSending ? sendingLabel : sendLabel}
        </button>
      </form>
    </section>
  );
}
