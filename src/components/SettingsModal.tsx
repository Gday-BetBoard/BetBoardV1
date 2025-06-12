import React, { useState, useEffect, useCallback } from 'react';
import { User, ToastType } from '../types';

interface SettingsModalProps {
  users: User[];
  onUpdateUsers: (users: User[]) => void;
  onClose: () => void;
  showToast: (message: string, type: ToastType) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
  users, 
  onUpdateUsers, 
  onClose, 
  showToast 
}) => {
  const [newUserName, setNewUserName] = useState('');
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 500);
  }, [onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [handleClose]);

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = newUserName.trim();
    
    if (!trimmedName) {
      showToast('Please enter a valid name', 'error');
      return;
    }

    if (users.some(user => user.name.toLowerCase() === trimmedName.toLowerCase())) {
      showToast('User already exists', 'error');
      return;
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: trimmedName
    };
    const newUsers = [...users, newUser].sort((a, b) => 
      a.name.localeCompare(b.name)
    );
    
    onUpdateUsers(newUsers);
    setNewUserName('');
    showToast('User added successfully!', 'success');
  };

  const handleRemoveUser = (userName: string) => {
    if (window.confirm(`Are you sure you want to remove ${userName}?`)) {
      const newUsers = users.filter(user => user.name !== userName);
      onUpdateUsers(newUsers);
      showToast('User removed successfully!', 'success');
    }
  };

  return (
    <div 
      className={`modal-overlay ${isClosing ? 'closing' : ''}`}
      data-testid="modal-overlay"
      onClick={handleOverlayClick}
    >
      <div className="modal-content settings-modal">
        <div className="modal-header">
          <h2>Settings</h2>
          <button 
            className="close-btn"
            onClick={handleClose}
            type="button"
          >
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="settings-section">
            <h3>Manage Users</h3>
            <p>Add or remove users who can be assigned as bet owners or comment authors.</p>

            <form className="add-user-form" onSubmit={handleAddUser}>
              <div className="form-group">
                <label htmlFor="new-user-name">Add New User:</label>
                <div className="input-group">
                  <input
                    type="text"
                    id="new-user-name"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    placeholder="Enter user name..."
                    maxLength={50}
                  />
                  <button type="submit" className="btn btn-primary">
                    Add User
                  </button>
                </div>
              </div>
            </form>

            <div className="users-list">
              <h4>Current Users ({users.length})</h4>
              {users.length === 0 ? (
                <p className="no-users">No users found. Add some users to get started.</p>
              ) : (
                <div className="user-items">
                  {users.map(user => (
                    <div key={user.name} className="user-item">
                      <span className="user-name">{user.name}</span>
                      <button
                        className="btn btn-small btn-danger"
                        onClick={() => handleRemoveUser(user.name)}
                        title={`Remove ${user.name}`}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button 
            className="btn btn-secondary"
            onClick={handleClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal; 