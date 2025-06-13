import React, { useState } from 'react';
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

  return (
    <div className="bet-card">
      <div className="bet-header">
        <div className="bet-owner">{bet.what}</div>
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
          <p>{bet.why}</p>
        </div>

        <div className="bet-field">
          <strong>Solution:</strong>
          <p>{bet.how}</p>
        </div>

        <div className="bet-field">
          <strong>Due Date:</strong>
          <p>{formatDateToDDMMYYYY(bet.when)}</p>
        </div>
      </div>

      <div className="bet-footer">
        <div className="bet-meta">
          <span>Last updated: {formatDateToDDMMYYYY(bet.lastUpdated)}</span>
          <span>{bet.comments.length} comment{bet.comments.length !== 1 ? 's' : ''}</span>
        </div>

        <div className="bet-actions">
          <button 
            className="btn btn-small btn-secondary"
            onClick={() => setShowComments(!showComments)}
          >
            💬 Comments
          </button>
          <button 
            className="btn btn-small btn-primary"
            onClick={onEdit}
          >
            ✏️ Edit
          </button>
          <button 
            className="btn btn-small btn-warning"
            onClick={handleArchive}
          >
            📦 Archive
          </button>
        </div>
      </div>

      {showComments && (
        <div className="comments-section">
          <div className="comments-header">
            <h4>Comments</h4>
            <button 
              className="btn btn-small btn-primary"
              onClick={() => setShowCommentForm(!showCommentForm)}
            >
              + Add Comment
            </button>
          </div>

          {showCommentForm && (
            <form className="comment-form" onSubmit={handleAddComment}>
              <select
                value={newComment.author}
                onChange={(e) => setNewComment({ ...newComment, author: e.target.value })}
                required
              >
                <option value="">Select author...</option>
                {users.map(user => (
                  <option key={user.name} value={user.name}>
                    {user.name}
                  </option>
                ))}
              </select>
              <textarea
                value={newComment.text}
                onChange={(e) => setNewComment({ ...newComment, text: e.target.value })}
                placeholder="Enter your comment..."
                required
              />
              <div className="comment-form-actions">
                <button type="submit" className="btn btn-small btn-primary">
                  Add Comment
                </button>
                <button 
                  type="button" 
                  className="btn btn-small btn-secondary"
                  onClick={() => setShowCommentForm(false)}
                >
                  Cancel
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
            <p className="no-comments">No comments yet. Be the first to comment!</p>
          )}
        </div>
      )}
    </div>
  );
};

export default BetCard; 