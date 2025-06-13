import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Bet, User, BetFilters, Toast } from '../types';

interface BetStore {
  // State
  bets: Bet[];
  users: User[];
  filters: BetFilters;
  isLoading: boolean;
  error: string | null;
  toasts: Toast[];
  
  // Actions
  setBets: (bets: Bet[]) => void;
  addBet: (bet: Bet) => void;
  updateBet: (id: string, updates: Partial<Bet>) => void;
  deleteBet: (id: string) => void;
  archiveBet: (id: string) => void;
  restoreBet: (id: string) => void;
  getArchivedBets: () => Bet[];
  setUsers: (users: User[]) => void;
  setFilters: (filters: Partial<BetFilters>) => void;
  clearFilters: () => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useBetStore = create<BetStore>()(
  persist(
    (set, get) => ({
      // Initial state
      bets: [],
      users: [
        { id: 'user-1', name: 'Steve P' },
        { id: 'user-2', name: 'Jane D' },
        { id: 'user-3', name: 'John Doe' },
        { id: 'user-4', name: 'Emily R' },
        { id: 'user-5', name: 'Michael B' }
      ],
      filters: {},
      isLoading: false,
      error: null,
      toasts: [],

      // Actions
      setBets: (bets) => set({ bets }),
      
      addBet: (bet) => set((state) => ({ 
        bets: [...state.bets, bet] 
      })),
      
      updateBet: (id, updates) => set((state) => {
        const currentBet = state.bets.find(bet => bet.id === id);
        
        // Check if status is being updated to "Done" and bet is not already archived
        const shouldAutoArchive = 
          updates.status === 'Done' && 
          currentBet && 
          !currentBet.archived &&
          currentBet.status !== 'Done';

        const updatedBet = { ...currentBet, ...updates };
        
        // If auto-archiving, add archive fields and show toast
        if (shouldAutoArchive) {
          updatedBet.archived = true;
          updatedBet.archivedAt = new Date().toISOString();
          updatedBet.archivedBy = 'Auto-archived (Status: Done)';
          
          // Show toast notification for auto-archiving
          setTimeout(() => {
            get().showToast(
              `Bet "${currentBet.what}" automatically archived (Status: Done)`, 
              'success'
            );
          }, 100);
        }

        return {
          bets: state.bets.map(bet => 
            bet.id === id ? updatedBet : bet
          )
        };
      }),
      
      deleteBet: (id) => set((state) => ({
        bets: state.bets.filter(bet => bet.id !== id)
      })),

      archiveBet: (id) => set((state) => ({
        bets: state.bets.map(bet => 
          bet.id === id 
            ? { 
                ...bet, 
                archived: true, 
                archivedAt: new Date().toISOString(),
                archivedBy: 'Current User' // TODO: Replace with actual user when auth is implemented
              }
            : bet
        )
      })),

      restoreBet: (id) => set((state) => ({
        bets: state.bets.map(bet => 
          bet.id === id 
            ? { 
                ...bet, 
                archived: false, 
                archivedAt: undefined,
                archivedBy: undefined
              }
            : bet
        )
      })),

      getArchivedBets: () => {
        const state = get();
        return state.bets.filter(bet => bet.archived === true);
      },
      
      setUsers: (users) => set({ users }),
      
      setFilters: (filters) => set((state) => ({
        filters: { ...state.filters, ...filters }
      })),
      
      clearFilters: () => set({ filters: {} }),
      
      showToast: (message, type = 'info') => set((state) => ({
        toasts: [...state.toasts, {
          id: Date.now().toString(),
          message,
          type
        }]
      })),
      
      removeToast: (id) => set((state) => ({
        toasts: state.toasts.filter(toast => toast.id !== id)
      })),
      
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      reset: () => set({
        bets: [],
        filters: {},
        isLoading: false,
        error: null,
        toasts: []
      })
    }),
    {
      name: 'betboard-storage',
      storage: createJSONStorage(() => localStorage),
      // Only persist essential data
      partialize: (state) => ({
        bets: state.bets,
        users: state.users,
        filters: state.filters
      })
    }
  )
); 