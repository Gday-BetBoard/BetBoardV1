import React, { useState, useEffect } from 'react';
import { Bet, User } from '../types';
import { formatDateToYYYYMMDD } from '../utils/dateUtils';

interface BetEditorProps {
  bet: Bet | null;
  users: User[];
  onSave: (bet: Omit<Bet, 'id' | 'lastUpdated'>) => void;
  onClose: () => void;
}

const BetEditor: React.FC<BetEditorProps> = ({ bet, users, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    owner: '',
    what: '',
    why: '',
    how: '',
    when: '',
    status: 'Open' as Bet['status'],
    comments: [] as Bet['comments'],
    tags: [] as string[],
    assignees: [] as string[]
  });

  useEffect(() => {
    if (bet) {
      setFormData({
        owner: bet.owner,
        what: bet.what,
        why: bet.why,
        how: bet.how,
        when: bet.when,
        status: bet.status,
        comments: bet.comments,
        tags: bet.tags || [],
        assignees: bet.assignees || []
      });
    } else {
      setFormData({
        owner: '',
        what: '',
        why: '',
        how: '',
        when: '',
        status: 'Open',
        comments: [],
        tags: [],
        assignees: []
      });
    }
  }, [bet]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="editor-overlay" onClick={handleOverlayClick}>
      <div className="editor-panel">
        <div className="editor-header">
          <h2>{bet ? 'Edit Bet' : 'New Bet'}</h2>
          <button 
            className="close-btn"
            onClick={onClose}
            type="button"
          >
            ✕
          </button>
        </div>

        <form className="editor-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="what">Bet Name *</label>
            <textarea
              id="what"
              value={formData.what}
              onChange={(e) => handleInputChange('what', e.target.value)}
              placeholder="What are you committing to deliver?"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="owner">Owner *</label>
            <select
              id="owner"
              value={formData.owner}
              onChange={(e) => handleInputChange('owner', e.target.value)}
              required
            >
              <option value="">Select owner...</option>
              {users.map(user => (
                <option key={user.name} value={user.name}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="why">Problem Statement *</label>
            <textarea
              id="why"
              value={formData.why}
              onChange={(e) => handleInputChange('why', e.target.value)}
              placeholder="Why is this important?"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="how">Solution *</label>
            <textarea
              id="how"
              value={formData.how}
              onChange={(e) => handleInputChange('how', e.target.value)}
              placeholder="How will you achieve this?"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="when">Due Date *</label>
              <input
                type="date"
                id="when"
                value={formatDateToYYYYMMDD(formData.when)}
                onChange={(e) => handleInputChange('when', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value as Bet['status'])}
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Blocked">Blocked</option>
                <option value="Done">Done</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
            >
              {bet ? 'Update Bet' : 'Create Bet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BetEditor; 