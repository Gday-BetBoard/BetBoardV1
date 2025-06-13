import React, { useState, useEffect, useMemo } from 'react';
import './App.css';
import { Bet, User, Comment as BetComment } from './types';
import BetCard from './components/BetCard';
import BetEditor from './components/BetEditor';
import SettingsModal from './components/SettingsModal';
import ToastContainer from './components/ToastContainer';
import FilterBar from './components/FilterBar';
import GanttChart from './components/GanttChart';
import betsData from './data/bets.json';
import { getCurrentDateYYYYMMDD } from './utils/dateUtils';
import { AnimatePresence } from 'framer-motion';
import { useBetStore } from './store/betStore';

function App() {
  // Use Zustand store instead of local state
  const {
    bets,
    users,
    filters,
    toasts,
    setBets,
    addBet,
    updateBet,
    deleteBet: deleteStoreBet,
    archiveBet,
    restoreBet,
    getArchivedBets,
    setUsers,
    setFilters,
    showToast,
    removeToast
  } = useBetStore();

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [currentBet, setCurrentBet] = useState<Bet | null>(null);

  // Initialize data from JSON if store is empty (first time load)
  useEffect(() => {
    if (bets.length === 0) {
      setBets(betsData as Bet[]);
    }
  }, [bets.length, setBets]);

  // Apply filters using useMemo for better performance
  const filteredBets = useMemo(() => {
    // First filter out archived bets
    let filtered = bets.filter(bet => !bet.archived);

    if (filters.owner) {
      filtered = filtered.filter(bet => bet.owner === filters.owner);
    }

    if (filters.status) {
      filtered = filtered.filter(bet => bet.status === filters.status);
    }

    return filtered;
  }, [bets, filters]);

  const openEditor = (bet?: Bet) => {
    setCurrentBet(bet || null);
    setIsEditorOpen(true);
  };

  const closeEditor = () => {
    setIsEditorOpen(false);
    setCurrentBet(null);
  };

  const saveBet = (betData: Omit<Bet, 'id' | 'lastUpdated'>) => {
    const now = getCurrentDateYYYYMMDD();
    
    if (currentBet) {
      // Update existing bet
      const updatedBet: Bet = {
        ...betData,
        id: currentBet.id,
        lastUpdated: now
      };
      updateBet(currentBet.id, updatedBet);
      showToast('Bet updated successfully!', 'success');
    } else {
      // Create new bet
      const newBet: Bet = {
        ...betData,
        id: `bet-${Date.now()}`,
        lastUpdated: now
      };
      addBet(newBet);
      showToast('New bet created successfully!', 'success');
    }
    
    closeEditor();
  };

  const handleArchiveBet = (betId: string) => {
    archiveBet(betId);
    showToast('Bet archived successfully!', 'success');
  };

  const addComment = (betId: string, comment: { author: string; text: string }) => {
    const now = getCurrentDateYYYYMMDD();
    const newComment: BetComment = {
      id: `comment-${Date.now()}`,
      author: comment.author,
      text: comment.text,
      date: now
    };
    
    const bet = bets.find(b => b.id === betId);
    if (bet) {
      const updatedBet = { 
        ...bet, 
        comments: [...bet.comments, newComment],
        lastUpdated: now
      };
      updateBet(betId, updatedBet);
      showToast('Comment added successfully!', 'success');
    }
  };

  const updateUsers = (newUsers: User[]) => {
    setUsers(newUsers);
  };

  return (
    <div className="App">
      <header className="header">
        <div className="header-content">
          <div className="logo-section">
            <svg className="logo" width="174" height="60" viewBox="0 0 236 81.2318841" xmlns="http://www.w3.org/2000/svg">
              <g fill="none" fillRule="evenodd">
                <path d="m117.575713 43.6086957c-21.7372402 0-42.0363887-10.5778831-54.3003507-28.2962333l22.7693827-15.3124624c7.1251362 10.2937071 18.912356 16.4393901 31.530968 16.4393901 12.615875 0 24.401727-6.1436604 31.527206-16.43365939l22.766646 15.31650769c-12.264646 17.7119452-32.5614 28.2864573-54.293852 28.2864573" fill="#fd0"/>
                <g fill="#fdfdfd">
                  <path d="m236 63.0865345v-.0711864c0-4.8891362-3.758283-7.865263-9.46677-7.865263h-9.46711v24.8016133h2.854414v-8.7522524h6.142698c5.383339 0 9.936768-2.7632359 9.936768-8.1129115zm-2.890882.1062783c0 3.2588672-2.746031 5.4559539-6.937503 5.4559539h-6.251081v-10.9125762h6.395591c4.082748 0 6.792993 1.8424915 6.792993 5.3857701zm-20.63494 6.1648101v-14.2075378h-2.854755v14.4200944c0 5.4211962-2.962455 8.1840979-7.623926 8.1840979-4.841767 0-7.732649-3.0112186-7.732649-8.3615626v-14.2426297h-2.854073v14.4200944c0 7.0150366 4.263386 10.771206 10.514808 10.771206 6.322995 0 10.550595-3.7561694 10.550595-10.9837626zm-24.538074-1.8070654c.036468-.0354261.036468-.0354261 0-.0708522 0-6.8382402-5.166574-12.7550676-12.863096-12.7550676-7.696181 0-12.935692 5.9876796-12.935692 12.8259198v.0711864c0 6.8382403 5.167256 12.7550677 12.863437 12.7550677s12.935351-5.9880138 12.935351-12.8262541zm-2.962797.0711864c0 5.6327502-4.119217 10.1682939-9.900299 10.1682939-5.781083 0-9.972555-4.6057275-9.972555-10.2394803v-.0708522c0-5.6337528 4.118876-10.168628 9.9003-10.168628 5.781423 0 9.972554 4.6057274 9.972554 10.2394802zm-24.754157 12.3299545-7.768095-10.1335362c3.974366-.708522 6.864907-3.1174969 6.864907-7.2282615v-.0708522c0-1.9477672-.72255-3.6843146-1.950885-4.8888021-1.590292-1.5590826-4.08343-2.4801613-7.190737-2.4801613h-10.875742v24.8016133h2.854755v-9.6372365h7.153927.072255l7.335247 9.6372365zm-10.297702-12.1531582h-7.768095v-10.0623497h7.804222c4.082749 0 6.467846 1.8424915 6.467846 4.8898047v.070518c0 3.1890176-2.709904 5.102027-6.503973 5.102027zm-25.043519 12.5782714c4.263728 0 7.804905-1.7362132 10.153193-3.7912613v-9.8852192h-10.442213v2.5159216h7.696181v6.1644759c-1.73412 1.3822864-4.408578 2.4804956-7.299119 2.4804956-6.142357 0-10.008341-4.3938393-10.008341-10.3106667v-.0708522c0-5.5271402 4.010835-10.168628 9.611279-10.168628 3.576964 0 5.745296 1.1690614 7.696181 2.8347566l1.842503-2.1262346c-2.528925-2.0904742-5.166574-3.2949616-9.430301-3.2949616-7.588139 0-12.682799 6.0231057-12.682799 12.8259198v.0711864c0 7.086223 4.914704 12.7550677 12.863436 12.7550677z"/>
                  <path d="m112.014493 55.2341888h-7.917607l-5.2907245 9.2849644-5.2537647-9.2849644h-8.0630504l9.705023 15.9480627v9.5397399h7.1147586v-9.6486855zm-21.109854 25.4878026-10.7956787-25.4878026h-6.7749335l-10.7590612 25.4878026h7.3543123l1.2508149-3.1884514h10.9448867l1.2443127 3.1884514zm-10.9828732-8.833472h-6.5264816l3.2719674-8.3389478zm-17.0596775-3.9831735v-.0730858c0-7.3550223-5.2903822-12.5980713-14.4115775-12.5980713h-9.851151v25.4878026h9.705023c9.1944304 0 14.5577055-5.4612817 14.5577055-12.8166455zm-7.260544.1092871c0 4.1143181-2.8092857 6.4445241-7.041523 6.4445241h-2.8821787v-12.962134h2.8821787c4.2322373 0 7.041523 2.3664074 7.041523 6.4445241zm-19.5852626-7.826323c0-2.8178998-1.5687375-5.3233067-4.6285284-5.3233067-2.1967115 0-4.236344 1.4480542-4.236344 4.1098783 0 2.8971329 2.0396325 3.875594 4.0399096 3.7581104 0 1.291637-1.3726453 1.8790552-3.3339093 2.0747474v3.1314172c5.1384365 0 8.1588721-2.4657904 8.1588721-7.7508466zm-22.1152967 21.0435741c4.6340038 0 8.391924-1.7113678 11.0916992-3.9322868v-11.4696819h-11.7484198v5.1706463h5.0347437v3.0945327c-1.0578026.6922655-2.3709016 1.0559867-4.0861093 1.0559867-4.049834 0-6.93235481-2.9493858-6.93235481-7.0637039v-.0727442c0-3.8960854 2.84624551-6.9909597 6.53127271-6.9909597 2.5173719 0 4.3417478.8736138 6.1657816 2.4029503l4.1593444-4.9882734c-2.6997752-2.330206-5.8738677-3.7137125-10.3617435-3.7137125-7.91760684 0-13.7551992 5.8256858-13.7551992 13.2534524v.0730858c0 7.719085 5.94710282 13.1807082 13.900985 13.1807082z"/>
                </g>
              </g>
            </svg>
          </div>
          <div className="header-title">
            <h1>G'day BetBoard</h1>
            <p>Digital Delivery Tracker</p>
          </div>
          <div className="header-actions">
            <button 
              className="btn btn-primary"
              onClick={() => openEditor()}
              title="New Bet"
            >
              <span className="button-text">New Bet</span>
              <span className="button-icon">✏️</span>
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => setIsSettingsOpen(true)}
              title="Settings"
            >
              <span className="button-text">Settings</span>
              <span className="button-icon">⚙️</span>
            </button>
          </div>
        </div>
      </header>

      <main className="main-content">
        <FilterBar 
          filters={{
            owner: filters.owner || '',
            status: filters.status || ''
          }}
          onFiltersChange={(newFilters) => setFilters({
            owner: newFilters.owner || undefined,
            status: newFilters.status as any || undefined  
          })}
          users={users}
        />

        <GanttChart bets={filteredBets} />

        <div className="bets-grid">
          {filteredBets.map(bet => (
            <BetCard
              key={bet.id}
              bet={bet}
              users={users}
              onEdit={() => openEditor(bet)}
              onDelete={() => handleArchiveBet(bet.id)}
              onAddComment={(comment) => addComment(bet.id, comment)}
            />
          ))}
        </div>

        {filteredBets.length === 0 && (
          <div className="empty-state">
            <h3>No bets found</h3>
            <p>Try adjusting your filters or create a new bet to get started.</p>
          </div>
        )}
      </main>

      <AnimatePresence>
      {isEditorOpen && (
        <BetEditor
          bet={currentBet}
          users={users}
          onSave={saveBet}
          onClose={closeEditor}
        />
      )}
      </AnimatePresence>

      {isSettingsOpen && (
        <SettingsModal
          users={users}
          onUpdateUsers={updateUsers}
          onClose={() => setIsSettingsOpen(false)}
          showToast={showToast}
          archivedBets={getArchivedBets()}
          onRestoreBet={(betId) => {
            restoreBet(betId);
            showToast('Bet restored successfully!', 'success');
          }}
          onDeleteBet={(betId) => {
            deleteStoreBet(betId);
            showToast('Bet permanently deleted!', 'success');
          }}
        />
      )}

      <ToastContainer 
        toasts={toasts}
        onRemoveToast={removeToast}
      />
    </div>
  );
}

export default App; 