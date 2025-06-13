import React, { useState, useRef, useEffect } from 'react';
import { Bet, User } from '../types';
import { formatDateToDDMMYYYY } from '../utils/dateUtils';

interface BetCardProps {
  bet: Bet;
  users: User[];
  onEdit: () => void;
  onDelete: () => void;
  onAddComment: (comment: { author: string; text: string }) => void;
}

const BetCard: React.FC<BetCardProps> = ({ bet, users, onEdit, onDelete, onAddComment }) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState({ author: '', text: '' });
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Minimum distance to trigger swipe
  const minSwipeDistance = 50;

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Open': return 'status-open';
      case 'In Progress': return 'status-in-progress';
      case 'Blocked': return 'status-blocked';
      case 'Done': return 'status-done';
      default: return '';
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.author && newComment.text) {
      onAddComment(newComment);
      setNewComment({ author: '', text: '' });
      setShowCommentForm(false);
    }
  };

  const handleArchive = () => {
    if (window.confirm('Are you sure you want to archive this bet? You can restore it later from Settings.')) {
      onDelete();
    }
  };

  // Handle touch events for swipe gestures on mobile
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    // Left swipe to show actions, right swipe to expand
    if (isLeftSwipe) {
      // Show quick action (could be edit or archive)
      if (window.innerWidth <= 480) {
        setIsExpanded(!isExpanded);
      }
    }
    if (isRightSwipe) {
      // Quick expand/collapse comments
      if (window.innerWidth <= 480) {
        setShowComments(!showComments);
      }
    }
  };

  // Auto-select first user for mobile convenience
  useEffect(() => {
    if (showCommentForm && users.length > 0 && !newComment.author) {
      setNewComment(prev => ({ ...prev, author: users[0].name }));
    }
  }, [showCommentForm, users, newComment.author]);

  // Check if text content is long and should be truncated on mobile
  const shouldTruncateText = (text: string) => {
    return window.innerWidth <= 480 && text.length > 100;
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div 
      ref={cardRef}
      className={`bet-card ${isExpanded ? 'bet-card-expanded' : ''}`}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="bet-header">
        <div className="bet-owner">
          {shouldTruncateText(bet.what) && !isExpanded 
            ? truncateText(bet.what) 
            : bet.what
          }
          {shouldTruncateText(bet.what) && (
            <button 
              className="expand-toggle"
              onClick={() => setIsExpanded(!isExpanded)}
              aria-label={isExpanded ? "Collapse" : "Expand"}
            >
              {isExpanded ? '▼' : '▶'}
            </button>
          )}
        </div>
        <div className={`bet-status ${getStatusClass(bet.status)}`}>
          {bet.status}
        </div>
      </div>

      <div className="bet-content">
        <div className="bet-field">
          <strong>Owner:</strong>
          <p>{bet.owner}</p>
        </div>

        <div className="bet-field">
          <strong>Problem Statement:</strong>
          <p>
            {shouldTruncateText(bet.why) && !isExpanded 
              ? truncateText(bet.why) 
              : bet.why
            }
          </p>
        </div>

        <div className="bet-field">
          <strong>Solution:</strong>
          <p>
            {shouldTruncateText(bet.how) && !isExpanded 
              ? truncateText(bet.how) 
              : bet.how
            }
          </p>
        </div>

        <div className="bet-field">
          <strong>Due Date:</strong>
          <p>{formatDateToDDMMYYYY(bet.when)}</p>
        </div>
      </div>

      <div className="bet-footer">
        <div className="bet-meta">
          <span>Updated: {formatDateToDDMMYYYY(bet.lastUpdated)}</span>
          <span>{bet.comments.length} comment{bet.comments.length !== 1 ? 's' : ''}</span>
        </div>

        <div className="bet-actions">
          <button 
            className="btn btn-small btn-secondary"
            onClick={() => setShowComments(!showComments)}
            aria-label={`${showComments ? 'Hide' : 'Show'} comments`}
          >
            <span className="button-icon">💬</span>
            <span className="button-text">Comments</span>
          </button>
          <button 
            className="btn btn-small btn-primary"
            onClick={onEdit}
            aria-label="Edit bet"
          >
            <span className="button-icon">✏️</span>
            <span className="button-text">Edit</span>
          </button>
          <button 
            className="btn btn-small btn-warning"
            onClick={handleArchive}
            aria-label="Archive bet"
          >
            <span className="button-icon">📦</span>
            <span className="button-text">Archive</span>
          </button>
        </div>
      </div>

      {/* Mobile swipe hint */}
      {window.innerWidth <= 480 && (
        <div className="mobile-hint">
          <small>💡 Swipe left to expand, right for comments</small>
        </div>
      )}

      {showComments && (
        <div className="comments-section">
          <div className="comments-header">
            <h4>Comments ({bet.comments.length})</h4>
            <button 
              className="btn btn-small btn-primary"
              onClick={() => setShowCommentForm(!showCommentForm)}
              aria-label={showCommentForm ? "Cancel comment" : "Add comment"}
            >
              <span className="button-icon">{showCommentForm ? '✕' : '+'}</span>
              <span className="button-text">{showCommentForm ? 'Cancel' : 'Add Comment'}</span>
            </button>
          </div>

          {showCommentForm && (
            <form className="comment-form" onSubmit={handleAddComment}>
              <div className="comment-form-row">
                <select
                  value={newComment.author}
                  onChange={(e) => setNewComment({ ...newComment, author: e.target.value })}
                  required
                  aria-label="Select comment author"
                >
                  <option value="">Select author...</option>
                  {users.map(user => (
                    <option key={user.name} value={user.name}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="comment-form-row">
                <textarea
                  value={newComment.text}
                  onChange={(e) => setNewComment({ ...newComment, text: e.target.value })}
                  placeholder="Enter your comment..."
                  required
                  rows={3}
                  aria-label="Comment text"
                />
              </div>
              <div className="comment-form-actions">
                <button type="submit" className="btn btn-small btn-primary">
                  <span className="button-icon">✓</span>
                  <span className="button-text">Add Comment</span>
                </button>
                <button 
                  type="button" 
                  className="btn btn-small btn-secondary"
                  onClick={() => setShowCommentForm(false)}
                >
                  <span className="button-icon">✕</span>
                  <span className="button-text">Cancel</span>
                </button>
              </div>
            </form>
          )}

          <div className="comments-list">
            {bet.comments.map((comment, index) => (
              <div key={index} className="comment">
                <div className="comment-header">
                  <strong>{comment.author}</strong>
                  <span className="comment-date">{formatDateToDDMMYYYY(comment.date)}</span>
                </div>
                <p className="comment-text">{comment.text}</p>
              </div>
            ))}
          </div>

          {bet.comments.length === 0 && (
            <div className="no-comments">
              <p>No comments yet. Be the first to comment!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BetCard; 