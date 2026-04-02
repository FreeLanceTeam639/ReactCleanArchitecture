import { useMemo, useState } from 'react';
import { ChevronDown, MessageSquare, Pin, Star } from 'lucide-react';

function getInitials(value = '') {
  return String(value || '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((item) => item[0])
    .join('')
    .toUpperCase() || 'RV';
}

function normalizeStatus(value = '') {
  const normalizedValue = String(value || '').trim().toLowerCase();

  if (normalizedValue === 'featured') {
    return 'Featured';
  }

  if (normalizedValue === 'received') {
    return 'Received';
  }

  if (normalizedValue === 'given') {
    return 'Given';
  }

  if (normalizedValue === 'visible') {
    return 'Visible';
  }

  return normalizedValue
    ? normalizedValue.charAt(0).toUpperCase() + normalizedValue.slice(1)
    : '';
}

function normalizeReviewItem(item = {}) {
  return {
    id:
      item.id ||
      item._id ||
      `${item.author || 'review'}-${item.project || item.createdAt || item.comment || item.text || 'entry'}`,
    author: item.author || 'Anonymous reviewer',
    content: item.content || item.comment || item.text || '',
    timestamp: item.timestamp || item.createdAt || item.timeAgo || 'recently',
    rating: Number(item.rating || item.score || 0) || 0,
    project: item.project || item.title || '',
    role: item.role || '',
    status: item.status || '',
    replies: Array.isArray(item.replies) ? item.replies.map(normalizeReviewItem) : []
  };
}

function buildThreadItems(items = [], groupByProject = true) {
  const normalizedItems = Array.isArray(items)
    ? items.map(normalizeReviewItem).filter((item) => item.content || item.project || item.author)
    : [];

  if (!groupByProject || normalizedItems.some((item) => item.replies.length > 0)) {
    return normalizedItems;
  }

  const groups = new Map();

  normalizedItems.forEach((item) => {
    const projectKey = String(item.project || '').trim().toLowerCase();
    const groupKey = projectKey || String(item.id);

    if (!groups.has(groupKey)) {
      groups.set(groupKey, []);
    }

    groups.get(groupKey).push(item);
  });

  return Array.from(groups.values()).map((group) => {
    const [head, ...rest] = group;

    if (!rest.length) {
      return head;
    }

    return {
      ...head,
      replies: [...head.replies, ...rest.map((item) => ({ ...item, replies: [...item.replies] }))]
    };
  });
}

function renderStars(rating) {
  const roundedRating = Math.max(0, Math.min(5, Math.round(Number(rating || 0))));

  return Array.from({ length: 5 }, (_, index) => (
    <Star
      key={`${rating}-${index}`}
      size={14}
      className={index < roundedRating ? 'reviewThreadStar is-active' : 'reviewThreadStar'}
      fill={index < roundedRating ? 'currentColor' : 'none'}
    />
  ));
}

function ReviewThreadItem({
  item,
  depth = 0,
  labels,
  renderItemActions,
  formatStatus
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasReplies = item.replies.length > 0;
  const statusLabel = formatStatus
    ? formatStatus(item.status, normalizeStatus(item.status))
    : normalizeStatus(item.status);
  const roleLabel = normalizeStatus(item.role);

  return (
    <div className={depth > 0 ? 'reviewThreadNode nested' : 'reviewThreadNode'}>
      <article className="reviewThreadCard">
        <header className="reviewThreadCardHeader">
          <div className="reviewThreadAvatar">
            <span>{getInitials(item.author)}</span>
          </div>

          <div className="reviewThreadHeaderContent">
            <div className="reviewThreadIdentityRow">
              <strong>{item.author}</strong>
              {statusLabel ? (
                <span className={item.status === 'featured' ? 'reviewThreadBadge is-featured' : 'reviewThreadBadge'}>
                  {item.status === 'featured' ? <Pin size={12} /> : null}
                  {statusLabel}
                </span>
              ) : null}
              {item.project ? <span className="reviewThreadBadge subtle">{item.project}</span> : null}
            </div>

            <div className="reviewThreadMetaRow">
              {item.rating > 0 ? (
                <span className="reviewThreadRatingPill">
                  <span className="reviewThreadStars">{renderStars(item.rating)}</span>
                  <strong>{item.rating.toFixed(1)}</strong>
                </span>
              ) : null}
              {roleLabel ? <span className="reviewThreadMetaPill">{roleLabel}</span> : null}
              {item.timestamp ? <span className="reviewThreadMetaText">{item.timestamp}</span> : null}
            </div>
          </div>
        </header>

        <div className="reviewThreadBody">
          <p>{item.content}</p>
        </div>

        <footer className="reviewThreadFooter">
          <div className="reviewThreadFooterInfo">
            <span className="reviewThreadFooterPill">
              <MessageSquare size={14} />
              {hasReplies ? labels.replyCount(item.replies.length) : labels.singleItem}
            </span>
          </div>

          <div className="reviewThreadFooterActions">
            {renderItemActions ? renderItemActions(item) : null}

            {hasReplies ? (
              <button
                type="button"
                className={isExpanded ? 'reviewThreadToggle open' : 'reviewThreadToggle'}
                onClick={() => setIsExpanded((currentState) => !currentState)}
              >
                <span>{isExpanded ? labels.collapse : labels.expand}</span>
                <ChevronDown size={15} />
              </button>
            ) : null}
          </div>
        </footer>
      </article>

      {hasReplies && isExpanded ? (
        <div className="reviewThreadReplies">
          {item.replies.map((reply) => (
            <ReviewThreadItem
              key={reply.id}
              item={reply}
              depth={depth + 1}
              labels={labels}
              renderItemActions={renderItemActions}
              formatStatus={formatStatus}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function CommentThread({
  initialComments = [],
  items,
  groupByProject = true,
  emptyTitle = 'No reviews yet',
  emptyDescription = 'Reviews from completed work will appear here.',
  className = '',
  renderItemActions,
  labels: labelOverrides = {},
  formatStatus
}) {
  const comments = useMemo(
    () => buildThreadItems(Array.isArray(items) ? items : initialComments, groupByProject),
    [groupByProject, initialComments, items]
  );

  const labels = {
    collapse: 'Hide thread',
    expand: 'Show thread',
    singleItem: 'Single review',
    replyCount: (count) => `${count} related review${count === 1 ? '' : 's'}`,
    ...labelOverrides
  };

  if (!comments.length) {
    return (
      <div className={`reviewThread reviewThreadEmpty ${className}`.trim()}>
        <div className="reviewThreadEmptyIcon">
          <MessageSquare size={22} />
        </div>
        <strong>{emptyTitle}</strong>
        <p>{emptyDescription}</p>
      </div>
    );
  }

  return (
    <div className={`reviewThread ${className}`.trim()}>
      {comments.map((comment) => (
        <ReviewThreadItem
          key={comment.id}
          item={comment}
          labels={labels}
          renderItemActions={renderItemActions}
          formatStatus={formatStatus}
        />
      ))}
    </div>
  );
}
