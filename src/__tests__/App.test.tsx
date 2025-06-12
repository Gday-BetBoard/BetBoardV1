import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('App Component', () => {
  test('renders main application components', () => {
    render(<App />);
    
    // Check for header elements
    expect(screen.getByText('G\'day BetBoard')).toBeInTheDocument();
    expect(screen.getByText('Digital Delivery Tracker')).toBeInTheDocument();
    
    // Check for main action buttons
    expect(screen.getByRole('button', { name: /new bet/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /settings/i })).toBeInTheDocument();
    
    // Check for timeline section
    expect(screen.getByText('Timeline')).toBeInTheDocument();
  });

  test('displays filter options', () => {
    render(<App />);
    
    expect(screen.getByLabelText(/filter by owner/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/filter by status/i)).toBeInTheDocument();
  });

  test('displays existing bets from JSON data', () => {
    render(<App />);
    
    // Check if bet data is being displayed
    expect(screen.getByText('Timeline')).toBeInTheDocument();
    
    // The bets should be rendered in the grid - check for Due: text
    const betElements = screen.getAllByText(/Due:/);
    expect(betElements.length).toBeGreaterThan(0);
  });
}); 