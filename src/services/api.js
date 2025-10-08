/**
 * API service for communicating with the backend
 */

const API_BASE_URL = 'http://localhost:8000';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.loadingCallbacks = null;
  }

  // Setup loading callbacks
  setLoadingCallbacks(startLoading, stopLoading) {
    this.loadingCallbacks = { startLoading, stopLoading };
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Start loading indicator
    if (this.loadingCallbacks) {
      this.loadingCallbacks.startLoading();
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const result = await response.json();
        // Stop loading indicator on success
        if (this.loadingCallbacks) {
          this.loadingCallbacks.stopLoading();
        }
        return result;
      }
      
      // Stop loading indicator on success
      if (this.loadingCallbacks) {
        this.loadingCallbacks.stopLoading();
      }
      return response;
    } catch (error) {
      console.error('API request failed:', error);
      // Stop loading indicator on error
      if (this.loadingCallbacks) {
        this.loadingCallbacks.stopLoading();
      }
      throw error;
    }
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }

  // Journal API
  async getJournalEntries() {
    return this.request('/api/v1/journal');
  }

  async createJournalEntry(entryData) {
    return this.request('/api/v1/journal', {
      method: 'POST',
      body: JSON.stringify(entryData),
    });
  }

  async updateJournalEntry(id, entryData) {
    return this.request(`/api/v1/journal/${id}`, {
      method: 'PUT',
      body: JSON.stringify(entryData),
    });
  }

  async deleteJournalEntry(id) {
    return this.request(`/api/v1/journal/${id}`, {
      method: 'DELETE',
    });
  }

  // Habits API (placeholder)
  async getHabits() {
    return this.request('/api/v1/habits');
  }

  async createHabit(habitData) {
    return this.request('/api/v1/habits', {
      method: 'POST',
      body: JSON.stringify(habitData),
    });
  }

  // Water API (placeholder)
  async getWaterEntries() {
    return this.request('/api/v1/water');
  }

  async createWaterEntry(entryData) {
    return this.request('/api/v1/water', {
      method: 'POST',
      body: JSON.stringify(entryData),
    });
  }

  // Finance API (placeholder)
  async getFinanceEntries() {
    return this.request('/api/v1/finance');
  }

  async createFinanceEntry(entryData) {
    return this.request('/api/v1/finance', {
      method: 'POST',
      body: JSON.stringify(entryData),
    });
  }
}

export default new ApiService();
