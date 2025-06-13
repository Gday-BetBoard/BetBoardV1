import { getApiConfig, FEATURES, STORAGE_KEYS } from './apiConfig';
import { Bet, User } from '../types';

interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

interface OfflineAction {
  id: string;
  type: 'CREATE' | 'UPDATE' | 'DELETE';
  endpoint: string;
  data?: any;
  timestamp: number;
}

export class EnhancedApiService {
  private config = getApiConfig();
  private isOnline = navigator.onLine;
  private offlineQueue: OfflineAction[] = [];

  constructor() {
    this.initializeOfflineHandling();
    this.loadOfflineQueue();
  }

  private initializeOfflineHandling() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.syncOfflineQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  private loadOfflineQueue() {
    const stored = localStorage.getItem(STORAGE_KEYS.OFFLINE_QUEUE);
    if (stored) {
      this.offlineQueue = JSON.parse(stored);
    }
  }

  private saveOfflineQueue() {
    localStorage.setItem(STORAGE_KEYS.OFFLINE_QUEUE, JSON.stringify(this.offlineQueue));
  }

  private async syncOfflineQueue() {
    if (!this.isOnline || this.offlineQueue.length === 0) return;

    console.log(`Syncing ${this.offlineQueue.length} offline actions...`);
    
    for (const action of this.offlineQueue) {
      try {
        await this.executeAction(action);
      } catch (error) {
        console.error('Failed to sync offline action:', error);
        // Keep failed actions in queue for retry
        continue;
      }
    }

    // Clear successfully synced actions
    this.offlineQueue = [];
    this.saveOfflineQueue();
  }

  private async executeAction(action: OfflineAction) {
    const { type, endpoint, data } = action;
    
    switch (type) {
      case 'CREATE':
        return this.request(endpoint, { method: 'POST', body: JSON.stringify(data) });
      case 'UPDATE':
        return this.request(endpoint, { method: 'PUT', body: JSON.stringify(data) });
      case 'DELETE':
        return this.request(endpoint, { method: 'DELETE' });
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.config.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);
      
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        data,
        status: response.status,
        message: 'Success'
      };
    } catch (error) {
      if (!this.isOnline && FEATURES.enableOfflineMode) {
        throw new Error('Currently offline. Changes will sync when connection is restored.');
      }
      throw error;
    }
  }

  private addToOfflineQueue(action: Omit<OfflineAction, 'id' | 'timestamp'>) {
    if (!FEATURES.enableOfflineMode) return;

    const offlineAction: OfflineAction = {
      ...action,
      id: `offline-${Date.now()}`,
      timestamp: Date.now(),
    };

    this.offlineQueue.push(offlineAction);
    this.saveOfflineQueue();
  }

  // Bet operations
  async getBets(): Promise<Bet[]> {
    try {
      const response = await this.request<Bet[]>('/bets');
      return response.data;
    } catch (error) {
      // Fallback to localStorage in offline mode
      if (!this.isOnline) {
        const stored = localStorage.getItem(STORAGE_KEYS.BETS);
        return stored ? JSON.parse(stored) : [];
      }
      throw error;
    }
  }

  async createBet(data: Omit<Bet, 'id' | 'lastUpdated'>): Promise<Bet> {
    const newBet: Bet = {
      ...data,
      id: `bet-${Date.now()}`,
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    if (!this.isOnline && FEATURES.enableOfflineMode) {
      // Store locally and queue for sync
      this.addToOfflineQueue({
        type: 'CREATE',
        endpoint: '/bets',
        data: newBet
      });
      return newBet;
    }

    try {
      const response = await this.request<Bet>('/bets', {
        method: 'POST',
        body: JSON.stringify(newBet),
      });
      return response.data;
    } catch (error) {
      if (FEATURES.enableOfflineMode) {
        this.addToOfflineQueue({
          type: 'CREATE',
          endpoint: '/bets',
          data: newBet
        });
        return newBet;
      }
      throw error;
    }
  }

  async updateBet(id: string, data: Partial<Bet>): Promise<Bet> {
    const updatedData = {
      ...data,
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    if (!this.isOnline && FEATURES.enableOfflineMode) {
      this.addToOfflineQueue({
        type: 'UPDATE',
        endpoint: `/bets/${id}`,
        data: updatedData
      });
      return { id, ...updatedData } as Bet;
    }

    try {
      const response = await this.request<Bet>(`/bets/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedData),
      });
      return response.data;
    } catch (error) {
      if (FEATURES.enableOfflineMode) {
        this.addToOfflineQueue({
          type: 'UPDATE',
          endpoint: `/bets/${id}`,
          data: updatedData
        });
        return { id, ...updatedData } as Bet;
      }
      throw error;
    }
  }

  async deleteBet(id: string): Promise<void> {
    if (!this.isOnline && FEATURES.enableOfflineMode) {
      this.addToOfflineQueue({
        type: 'DELETE',
        endpoint: `/bets/${id}`
      });
      return;
    }

    try {
      await this.request(`/bets/${id}`, { method: 'DELETE' });
    } catch (error) {
      if (FEATURES.enableOfflineMode) {
        this.addToOfflineQueue({
          type: 'DELETE',
          endpoint: `/bets/${id}`
        });
        return;
      }
      throw error;
    }
  }

  // User operations
  async getUsers(): Promise<User[]> {
    try {
      const response = await this.request<User[]>('/users');
      return response.data;
    } catch (error) {
      // Fallback to localStorage
      const stored = localStorage.getItem(STORAGE_KEYS.USERS);
      return stored ? JSON.parse(stored) : [];
    }
  }

  // Utility methods
  getConnectionStatus(): { isOnline: boolean; pendingActions: number } {
    return {
      isOnline: this.isOnline,
      pendingActions: this.offlineQueue.length
    };
  }

  async forceSyncOfflineQueue(): Promise<void> {
    if (this.isOnline) {
      await this.syncOfflineQueue();
    }
  }

  clearOfflineQueue(): void {
    this.offlineQueue = [];
    localStorage.removeItem(STORAGE_KEYS.OFFLINE_QUEUE);
  }
}

export const apiService = new EnhancedApiService(); 