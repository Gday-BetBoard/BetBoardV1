// API Configuration for different environments
export const API_CONFIG = {
  development: {
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
    timeout: 10000,
  },
  production: {
    baseURL: process.env.REACT_APP_API_URL || 'https://api.betboard.com/api',
    timeout: 15000,
  },
  test: {
    baseURL: 'http://localhost:3001/api',
    timeout: 5000,
  }
};

export const getApiConfig = () => {
  const env = process.env.NODE_ENV || 'development';
  return API_CONFIG[env as keyof typeof API_CONFIG] || API_CONFIG.development;
};

// Feature flags for different environments
export const FEATURES = {
  enableOfflineMode: true,
  enableRealTimeSync: process.env.NODE_ENV === 'production',
  enableAnalytics: process.env.NODE_ENV === 'production',
  maxOfflineStorage: 100, // Maximum number of bets to store offline
};

// Storage keys
export const STORAGE_KEYS = {
  BETS: 'betboard-bets',
  USERS: 'betboard-users',
  SETTINGS: 'betboard-settings',
  OFFLINE_QUEUE: 'betboard-offline-queue',
}; 