import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Bet, User, BetFilters, Toast, Session, BetAnalytics } from '../types';

// Helper function to filter bets
const filterBets = (bets: Bet[], filters: BetFilters) => {
  return bets.filter(bet => {
    if (filters.owner && bet.owner !== filters.owner) return false;
    if (filters.status && bet.status !== filters.status) return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      if (!bet.what.toLowerCase().includes(searchLower) && 
          !bet.why.toLowerCase().includes(searchLower) && 
          !bet.how.toLowerCase().includes(searchLower)) return false;
    }
    return true;
  });
};

// Store interface
export interface BetBoardStore {
  // State
  bets: Bet[];
  filteredBets: Bet[];
  filters: BetFilters;
  isLoading: boolean;
  error: string | null;
  users: User[];
  currentUser: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  toasts: Toast[];
  analytics: BetAnalytics | null;

  // Actions
  setBets: (bets: Bet[]) => void;
  addBet: (bet: Bet) => void;
  updateBet: (id: string, updates: Partial<Bet>) => void;
  deleteBet: (id: string) => void;
  setFilters: (filters: Partial<BetFilters>) => void;
  clearFilters: () => void;
  setUsers: (users: User[]) => void;
  addUser: (user: User) => void;
  removeUser: (userId: string) => void;
  setCurrentUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  login: (user: User, session: Session) => void;
  logout: () => void;
  showToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  setAnalytics: (analytics: BetAnalytics) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

// Initial state
const initialState: {
  bets: Bet[];
  filteredBets: Bet[];
  filters: BetFilters;
  isLoading: boolean;
  error: string | null;
  users: User[];
  currentUser: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  toasts: Toast[];
  analytics: BetAnalytics | null;
} = {
  bets: [],
  filteredBets: [],
  filters: {},
  isLoading: false,
  error: null,
  users: [],
  currentUser: null,
  session: null,
  isAuthenticated: false,
  toasts: [],
  analytics: null,
};

// Context
const BetBoardContext = createContext<BetBoardStore | undefined>(undefined);

// Provider component
export const BetBoardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState(initialState);

  const store: BetBoardStore = {
    ...state,

    setBets: (bets: Bet[]) => {
      setState(prev => ({
        ...prev,
        bets,
        filteredBets: filterBets(bets, prev.filters),
      }));
    },

    addBet: (bet: Bet) => {
      setState(prev => {
        const newBets = [...prev.bets, bet];
        return {
          ...prev,
          bets: newBets,
          filteredBets: filterBets(newBets, prev.filters),
        };
      });
    },

    updateBet: (id: string, updates: Partial<Bet>) => {
      setState(prev => {
        const newBets = prev.bets.map(bet =>
          bet.id === id ? { ...bet, ...updates } : bet
        );
        return {
          ...prev,
          bets: newBets,
          filteredBets: filterBets(newBets, prev.filters),
        };
      });
    },

    deleteBet: (id: string) => {
      setState(prev => {
        const newBets = prev.bets.filter(bet => bet.id !== id);
        return {
          ...prev,
          bets: newBets,
          filteredBets: filterBets(newBets, prev.filters),
        };
      });
    },

    setFilters: (filters: Partial<BetFilters>) => {
      setState(prev => {
        const newFilters = { ...prev.filters, ...filters };
        return {
          ...prev,
          filters: newFilters,
          filteredBets: filterBets(prev.bets, newFilters),
        };
      });
    },

    clearFilters: () => {
      setState(prev => ({
        ...prev,
        filters: {},
        filteredBets: prev.bets,
      }));
    },

    setUsers: (users: User[]) => {
      setState(prev => ({ ...prev, users }));
    },

    addUser: (user: User) => {
      setState(prev => ({
        ...prev,
        users: [...prev.users, user],
      }));
    },

    removeUser: (userId: string) => {
      setState(prev => ({
        ...prev,
        users: prev.users.filter(user => user.id !== userId),
      }));
    },

    setCurrentUser: (user: User | null) => {
      setState(prev => ({
        ...prev,
        currentUser: user,
        isAuthenticated: !!user,
      }));
    },

    setSession: (session: Session | null) => {
      setState(prev => ({ ...prev, session }));
    },

    login: (user: User, session: Session) => {
      setState(prev => ({
        ...prev,
        currentUser: user,
        session,
        isAuthenticated: true,
      }));
    },

    logout: () => {
      setState(prev => ({
        ...prev,
        currentUser: null,
        session: null,
        isAuthenticated: false,
      }));
    },

    showToast: (toast: Omit<Toast, 'id'>) => {
      const newToast: Toast = {
        ...toast,
        id: Date.now().toString(),
      };
      setState(prev => ({
        ...prev,
        toasts: [...prev.toasts, newToast],
      }));
    },

    removeToast: (id: string) => {
      setState(prev => ({
        ...prev,
        toasts: prev.toasts.filter(toast => toast.id !== id),
      }));
    },

    setAnalytics: (analytics: BetAnalytics) => {
      setState(prev => ({ ...prev, analytics }));
    },

    setLoading: (loading: boolean) => {
      setState(prev => ({ ...prev, isLoading: loading }));
    },

    setError: (error: string | null) => {
      setState(prev => ({ ...prev, error }));
    },

    reset: () => {
      setState(initialState);
    },
  };

  return React.createElement(
    BetBoardContext.Provider,
    { value: store },
    children
  );
};

// Hook to use the store
export const useBetBoardStore = (): BetBoardStore => {
  const context = useContext(BetBoardContext);
  if (!context) {
    throw new Error('useBetBoardStore must be used within a BetBoardProvider');
  }
  return context;
}; 