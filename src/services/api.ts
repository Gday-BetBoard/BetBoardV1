// Simplified API service for basic functionality
export class ApiService {
  private baseURL = '/api';
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
  }

  clearToken() {
    this.token = null;
  }

  // Basic fetch wrapper
  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Basic CRUD operations
  async getBets() {
    return this.request('/bets');
  }

  async createBet(data: any) {
    return this.request('/bets', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateBet(id: string, data: any) {
    return this.request(`/bets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteBet(id: string) {
    return this.request(`/bets/${id}`, {
      method: 'DELETE',
    });
  }

  async addComment(betId: string, data: any) {
    return this.request(`/bets/${betId}/comments`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const apiService = new ApiService(); 