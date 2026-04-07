import { MoreHorizontal, Users } from 'lucide-react';

function getInitials(name) {
  return String(name || 'U')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}

function joinClassNames(...values) {
  return values.filter(Boolean).join(' ');
}

export default function RuixenMonoChat({
  chatName = 'Team Flow',
  description = 'Collaborate clearly and keep every reply in one focused stream.',
  participants = [],
  selectedParticipantId = '',
  onParticipantSelect,
  toolbar = null,
  children,
  stats = [],
  clearLabel = 'Show all',
  onClearSelection,
  participantsLabel = 'Participants',
  moreLabel = 'More options'
}) {
  return (
    <section className="workspaceMonoShell">
      <header className="workspaceMonoHeader">
        <div className="workspaceMonoHeaderMain">
          <div className="workspaceMonoIconWrap">
            <Users size={24} />
          </div>

          <div>
            <h2>{chatName}</h2>
            <p>{description}</p>
          </div>
        </div>

        <div className="workspaceMonoHeaderSide">
          {stats.length ? (
            <div className="workspaceMonoStats">
              {stats.map((stat) => (
                <article key={stat.label} className="workspaceMonoStatCard">
                  <span>{stat.label}</span>
                  <strong>{stat.value}</strong>
                </article>
              ))}
            </div>
          ) : null}

          <button type="button" className="workspaceMonoHeaderAction" aria-label={moreLabel}>
            <MoreHorizontal size={18} />
          </button>
        </div>
      </header>

      {toolbar ? <div className="workspaceMonoToolbar">{toolbar}</div> : null}

      <div className="workspaceMonoBody">
        <aside className="workspaceMonoAside">
          <div className="workspaceMonoAsideTop">
            <strong>{participantsLabel}</strong>
            {onClearSelection ? (
              <button type="button" className="workspaceMonoClearButton" onClick={onClearSelection}>
                {clearLabel}
              </button>
            ) : null}
          </div>

          <div className="workspaceMonoParticipantList">
            {participants.map((participant) => {
              const isSelected = selectedParticipantId === participant.id;

              return (
                <button
                  key={participant.id}
                  type="button"
                  onClick={() => onParticipantSelect?.(participant.id)}
                  className={joinClassNames(
                    'workspaceMonoParticipant',
                    isSelected && 'active',
                    participant.unreadCount ? 'unread' : ''
                  )}
                >
                  <div className="workspaceMonoAvatarWrap">
                    {participant.avatar ? (
                      <img src={participant.avatar} alt={participant.name} className="workspaceMonoAvatarImage" />
                    ) : (
                      <span className="workspaceMonoAvatarFallback">{getInitials(participant.name)}</span>
                    )}
                    <span className={participant.isOnline ? 'workspaceMonoOnlineDot online' : 'workspaceMonoOnlineDot'} />
                  </div>

                  <div className="workspaceMonoParticipantCopy">
                    <div className="workspaceMonoParticipantTop">
                      <strong>{participant.name}</strong>
                      <small>{participant.updatedAt}</small>
                    </div>
                    <p>{participant.preview}</p>
                    <div className="workspaceMonoParticipantMeta">
                      <span>{participant.title}</span>
                      {participant.unreadCount ? (
                        <span className="workspaceMonoUnreadBadge">{participant.unreadCount}</span>
                      ) : null}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        <div className="workspaceMonoMain">{children}</div>
      </div>
    </section>
  );
}
