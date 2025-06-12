import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import BetCard from '../components/BetCard';
import { Bet, User } from '../types';

const mockBet: Bet = {
  id: 'test-bet-1',
  owner: 'John Doe',
  what: 'Test bet description',
  why: 'Test problem statement',
  how: 'Test solution',
  when: '2025-12-31',
  status: 'Open',
  lastUpdated: '2025-06-13',
  comments: [
    {
      id: 'comment-1',
      author: 'Jane Smith',
      text: 'Great idea!',
      date: '2025-06-12'
    }
  ],
  tags: ['urgent', 'frontend'],
  assignees: ['John Doe', 'Jane Smith']
};

const mockUsers: User[] = [
  { id: 'user-1', name: 'John Doe' },
  { id: 'user-2', name: 'Jane Smith' }
];

const mockProps = {
  bet: mockBet,
  users: mockUsers,
  onEdit: jest.fn(),
  onDelete: jest.fn(),
  onAddComment: jest.fn()
};

// Mock window.confirm
global.confirm = jest.fn();

describe('BetCard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders bet information correctly', () => {
    render(<BetCard {...mockProps} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Test bet description')).toBeInTheDocument();
    expect(screen.getByText('Test problem statement')).toBeInTheDocument();
    expect(screen.getByText('Test solution')).toBeInTheDocument();
    expect(screen.getByText('31/12/2025')).toBeInTheDocument();
  });

  test('displays correct status styling', () => {
    render(<BetCard {...mockProps} />);
    
    const statusElement = screen.getByText('Open');
    expect(statusElement).toHaveClass('status-open');
  });

  test('calls onEdit when edit button is clicked', () => {
    render(<BetCard {...mockProps} />);
    
    const editButton = screen.getByText('✏️ Edit');
    fireEvent.click(editButton);
    
    expect(mockProps.onEdit).toHaveBeenCalledTimes(1);
  });

  test('calls onDelete when delete button is clicked and confirmed', () => {
    (global.confirm as jest.Mock).mockReturnValue(true);
    render(<BetCard {...mockProps} />);
    
    const deleteButton = screen.getByText('🗑️ Delete');
    fireEvent.click(deleteButton);
    
    expect(global.confirm).toHaveBeenCalledWith('Are you sure you want to delete this bet?');
    expect(mockProps.onDelete).toHaveBeenCalledTimes(1);
  });

  test('does not call onDelete when delete is cancelled', () => {
    (global.confirm as jest.Mock).mockReturnValue(false);
    render(<BetCard {...mockProps} />);
    
    const deleteButton = screen.getByText('🗑️ Delete');
    fireEvent.click(deleteButton);
    
    expect(global.confirm).toHaveBeenCalledWith('Are you sure you want to delete this bet?');
    expect(mockProps.onDelete).not.toHaveBeenCalled();
  });

  test('shows comments when comments button is clicked', () => {
    render(<BetCard {...mockProps} />);
    
    const commentsButton = screen.getByText('💬 Comments');
    fireEvent.click(commentsButton);
    
    expect(screen.getByText('Comments')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('Great idea!')).toBeInTheDocument();
  });

  test('handles bet with different status', () => {
    const completedBet = { ...mockBet, status: 'Done' as const };
    render(<BetCard {...mockProps} bet={completedBet} />);
    
    const statusElement = screen.getByText('Done');
    expect(statusElement).toHaveClass('status-done');
  });

  test('displays empty state when no comments', () => {
    const betWithoutComments = { ...mockBet, comments: [] };
    render(<BetCard {...mockProps} bet={betWithoutComments} />);
    
    // Click to show comments section
    const commentsButton = screen.getByText('💬 Comments');
    fireEvent.click(commentsButton);
    
    expect(screen.getByText('No comments yet. Be the first to comment!')).toBeInTheDocument();
  });

  test('shows comment form when add comment button is clicked', () => {
    render(<BetCard {...mockProps} />);
    
    // First show comments section
    const commentsButton = screen.getByText('💬 Comments');
    fireEvent.click(commentsButton);
    
    // Then click add comment
    const addCommentButton = screen.getByText('+ Add Comment');
    fireEvent.click(addCommentButton);
    
    expect(screen.getByDisplayValue('Select author...')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your comment...')).toBeInTheDocument();
  });

  test('adds new comment correctly', () => {
    render(<BetCard {...mockProps} />);
    
    // Show comments section
    const commentsButton = screen.getByText('💬 Comments');
    fireEvent.click(commentsButton);
    
    // Show comment form
    const addCommentButton = screen.getByText('+ Add Comment');
    fireEvent.click(addCommentButton);
    
    // Fill out the form
    const authorSelect = screen.getByDisplayValue('Select author...');
    const commentTextarea = screen.getByPlaceholderText('Enter your comment...');
    const submitButton = screen.getByText('Add Comment');
    
    fireEvent.change(authorSelect, { target: { value: 'John Doe' } });
    fireEvent.change(commentTextarea, { target: { value: 'New test comment' } });
    fireEvent.click(submitButton);
    
    expect(mockProps.onAddComment).toHaveBeenCalledWith({
      author: 'John Doe',
      text: 'New test comment'
    });
  });
}); 