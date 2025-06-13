import React, { useState, useEffect, useCallback } from 'react';
import { Bet, User } from '../types';
import { formatDateToYYYYMMDD } from '../utils/dateUtils';
import { motion } from 'framer-motion';

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

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
      // Auto-select first user on mobile for convenience
      const defaultOwner = isMobile && users.length > 0 ? users[0].name : '';
      setFormData({
        owner: defaultOwner,
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
    
    // Clear any existing errors when bet changes
    setFormErrors({});
  }, [bet, users, isMobile]);


  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Inline validation to avoid circular dependencies
    const errors: Record<string, string> = {};
    
    if (!formData.what.trim()) {
      errors.what = 'Bet name is required';
    } else if (formData.what.length < 5) {
      errors.what = 'Bet name must be at least 5 characters';
    }
    
    if (!formData.owner) {
      errors.owner = 'Owner is required';
    }
    
    if (!formData.why.trim()) {
      errors.why = 'Problem statement is required';
    } else if (formData.why.length < 10) {
      errors.why = 'Problem statement should be more detailed (at least 10 characters)';
    }
    
    if (!formData.how.trim()) {
      errors.how = 'Solution is required';
    } else if (formData.how.length < 10) {
      errors.how = 'Solution should be more detailed (at least 10 characters)';
    }
    
    if (!formData.when) {
      errors.when = 'Due date is required';
    } else {
      const dueDate = new Date(formData.when);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (dueDate < today) {
        errors.when = 'Due date cannot be in the past';
      }
    }
    
    setFormErrors(errors);
    const isValid = Object.keys(errors).length === 0;
    
    if (!isValid) {
      // Focus first error field on mobile
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField && isMobile) {
        const errorElement = document.getElementById(firstErrorField);
        errorElement?.focus();
        errorElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate async operation for better UX
      await new Promise(resolve => setTimeout(resolve, 300));
      onSave(formData);
    } catch (error) {
      console.error('Error saving bet:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, isMobile, onSave]);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Enhanced mobile keyboard handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
      
      // Submit on Ctrl/Cmd + Enter
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        handleSubmit(e as any);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose, handleSubmit]);

  // Prevent body scroll when modal is open (mobile)
  useEffect(() => {
    if (isMobile) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isMobile]);

  const getFieldError = (field: string) => formErrors[field];

  const motionProps = isMobile 
    ? {
        initial: { y: '100%' },
        animate: { y: 0 },
        exit: { y: '100%' },
        transition: { duration: 0.3, ease: "easeOut" }
      }
    : {
        initial: { x: '100%' },
        animate: { x: 0 },
        exit: { x: '100%' },
        transition: { duration: 0.5, ease: "easeInOut" }
      };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="editor-overlay" 
      onClick={handleOverlayClick}
    >
      <motion.div 
        className={`editor-panel ${isMobile ? 'editor-panel-mobile' : ''}`}
        {...motionProps}
      >
        <div className="editor-header">
          <h2>{bet ? 'Edit Bet' : 'New Bet'}</h2>
          <button 
            className="close-btn"
            onClick={onClose}
            type="button"
            aria-label="Close editor"
          >
            ✕
          </button>
        </div>

        <form className="editor-form" onSubmit={handleSubmit}>
          <div className="form-scroll-container">
            <div className="form-group">
              <label htmlFor="what">
                Bet Name *
                {isMobile && <span className="mobile-hint"> (swipe up for more fields)</span>}
              </label>
              <textarea
                id="what"
                value={formData.what}
                onChange={(e) => handleInputChange('what', e.target.value)}
                placeholder="What are you committing to deliver?"
                required
                rows={isMobile ? 2 : 3}
                className={getFieldError('what') ? 'field-error' : ''}
                aria-describedby={getFieldError('what') ? 'what-error' : undefined}
              />
              {getFieldError('what') && (
                <div id="what-error" className="error-message" role="alert">
                  {getFieldError('what')}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="owner">Owner *</label>
              <select
                id="owner"
                value={formData.owner}
                onChange={(e) => handleInputChange('owner', e.target.value)}
                required
                className={getFieldError('owner') ? 'field-error' : ''}
                aria-describedby={getFieldError('owner') ? 'owner-error' : undefined}
              >
                <option value="">Select owner...</option>
                {users.map(user => (
                  <option key={user.name} value={user.name}>
                    {user.name}
                  </option>
                ))}
              </select>
              {getFieldError('owner') && (
                <div id="owner-error" className="error-message" role="alert">
                  {getFieldError('owner')}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="why">Problem Statement *</label>
              <textarea
                id="why"
                value={formData.why}
                onChange={(e) => handleInputChange('why', e.target.value)}
                placeholder="Why is this important? What problem does it solve?"
                required
                rows={isMobile ? 3 : 4}
                className={getFieldError('why') ? 'field-error' : ''}
                aria-describedby={getFieldError('why') ? 'why-error' : undefined}
              />
              {getFieldError('why') && (
                <div id="why-error" className="error-message" role="alert">
                  {getFieldError('why')}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="how">Solution *</label>
              <textarea
                id="how"
                value={formData.how}
                onChange={(e) => handleInputChange('how', e.target.value)}
                placeholder="How will you achieve this? What's your approach?"
                required
                rows={isMobile ? 3 : 4}
                className={getFieldError('how') ? 'field-error' : ''}
                aria-describedby={getFieldError('how') ? 'how-error' : undefined}
              />
              {getFieldError('how') && (
                <div id="how-error" className="error-message" role="alert">
                  {getFieldError('how')}
                </div>
              )}
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
                  min={new Date().toISOString().split('T')[0]}
                  className={getFieldError('when') ? 'field-error' : ''}
                  aria-describedby={getFieldError('when') ? 'when-error' : undefined}
                />
                {getFieldError('when') && (
                  <div id="when-error" className="error-message" role="alert">
                    {getFieldError('when')}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value as Bet['status'])}
                  className="status-select"
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Blocked">Blocked</option>
                  <option value="Done">Done</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              <span className="button-icon">✕</span>
              <span className="button-text">Cancel</span>
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              <span className="button-icon">
                {isSubmitting ? '⏳' : (bet ? '💾' : '✨')}
              </span>
              <span className="button-text">
                {isSubmitting 
                  ? 'Saving...' 
                  : (bet ? 'Update Bet' : 'Create Bet')
                }
              </span>
            </button>
          </div>

          {/* Mobile keyboard shortcuts hint */}
          {isMobile && (
            <div className="mobile-shortcuts">
              <small>💡 Tip: Use Ctrl+Enter to save quickly</small>
            </div>
          )}
        </form>
      </motion.div>
    </motion.div>
  );
};

export default BetEditor; 