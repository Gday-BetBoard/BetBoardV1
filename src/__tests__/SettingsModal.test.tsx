import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SettingsModal from '../components/SettingsModal';
import { User } from '../types';

describe('SettingsModal', () => {
  const mockUsers: User[] = [
    { id: '1', name: 'John Doe' },
    { id: '2', name: 'Jane Smith' }
  ];

  const mockProps = {
    users: mockUsers,
    onUpdateUsers: jest.fn(),
    onClose: jest.fn(),
    showToast: jest.fn(),
    archivedBets: [],
    onRestoreBet: jest.fn(),
    onDeleteBet: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders settings modal with fade-in animation', () => {
    render(<SettingsModal {...mockProps} />);
    
    const modalOverlay = screen.getByTestId('modal-overlay');
    
    expect(modalOverlay).toBeInTheDocument();
    expect(modalOverlay).toHaveClass('modal-overlay');
    expect(modalOverlay).not.toHaveClass('closing');
  });

  it('applies closing animation class when closing', () => {
    render(<SettingsModal {...mockProps} />);
    
    const modalOverlay = screen.getByTestId('modal-overlay');
    const closeButton = screen.getByRole('button', { name: '✕' });
    
    fireEvent.click(closeButton);
    
    expect(modalOverlay).toHaveClass('closing');
  });

  it('handles overlay click with animation', () => {
    render(<SettingsModal {...mockProps} />);
    
    const modalOverlay = screen.getByTestId('modal-overlay');
    
    fireEvent.click(modalOverlay);
    
    expect(modalOverlay).toHaveClass('closing');
  });

  it('handles escape key with animation', () => {
    render(<SettingsModal {...mockProps} />);
    
    const modalOverlay = screen.getByTestId('modal-overlay');
    
    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
    
    expect(modalOverlay).toHaveClass('closing');
  });

  it('handles footer close button with animation', () => {
    render(<SettingsModal {...mockProps} />);
    
    const modalOverlay = screen.getByTestId('modal-overlay');
    const footerCloseButton = screen.getByRole('button', { name: 'Close' });
    
    fireEvent.click(footerCloseButton);
    
    expect(modalOverlay).toHaveClass('closing');
  });

  it('calls onClose after animation delay', (done) => {
    render(<SettingsModal {...mockProps} />);
    
    const closeButton = screen.getByRole('button', { name: '✕' });
    
    fireEvent.click(closeButton);
    
    setTimeout(() => {
      expect(mockProps.onClose).toHaveBeenCalled();
      done();
    }, 600); // Wait slightly longer than animation duration
  });

  it('renders user management functionality', () => {
    render(<SettingsModal {...mockProps} />);
    
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Manage Users')).toBeInTheDocument();
    expect(screen.getByText('Current Users (2)')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });
}); 