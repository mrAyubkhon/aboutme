/**
 * API configuration for Ayubi aka System Frontend
 */

// API Configuration
export const API_CONFIG = {
  // Base URL for API requests
  BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1",
  
  // Request timeout in milliseconds
  TIMEOUT: 10000,
  
  // Default headers
  DEFAULT_HEADERS: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
  
  // Endpoints
  ENDPOINTS: {
    // Authentication
    AUTH: {
      LOGIN: "/auth/login",
      REGISTER: "/auth/register",
      LOGOUT: "/auth/logout",
      REFRESH: "/auth/refresh",
      ME: "/auth/me",
    },
    
    // Habits
    HABITS: {
      LIST: "/habits",
      CREATE: "/habits",
      GET: (id) => `/habits/${id}`,
      UPDATE: (id) => `/habits/${id}`,
      DELETE: (id) => `/habits/${id}`,
      COMPLETE: (id) => `/habits/${id}/complete`,
      UNCOMPLETE: (id, date) => `/habits/${id}/complete/${date}`,
      STATS: "/habits/stats/overview",
    },
    
    // Water Tracking
    WATER: {
      ENTRIES: "/water",
      ADD: "/water",
      TODAY: "/water/today",
      HISTORY: "/water/history",
      DASHBOARD: "/water/dashboard",
      GOAL: "/water/goal",
      UPDATE_GOAL: "/water/goal",
      RECOMMENDATION: "/water/recommendation",
      DELETE: (id) => `/water/${id}`,
    },
    
    // Finance
    FINANCE: {
      ENTRIES: "/finance/entries",
      CREATE: "/finance/entries",
      GET: (id) => `/finance/entries/${id}`,
      UPDATE: (id) => `/finance/entries/${id}`,
      DELETE: (id) => `/finance/entries/${id}`,
      CATEGORIES: "/finance/categories",
      CREATE_CATEGORY: "/finance/categories",
      BUDGET: "/finance/budget",
      CREATE_BUDGET: "/finance/budget",
      SUMMARY: "/finance/stats/summary",
    },
    
    // Journal
    JOURNAL: {
      ENTRIES: "/journal/entries",
      CREATE: "/journal/entries",
      GET: (id) => `/journal/entries/${id}`,
      UPDATE: (id) => `/journal/entries/${id}`,
      DELETE: (id) => `/journal/entries/${id}`,
      SEARCH: "/journal/search",
      STATS: "/journal/stats",
      DASHBOARD: "/journal/dashboard",
      TEMPLATES: "/journal/templates",
      CREATE_TEMPLATE: "/journal/templates",
      UPDATE_TEMPLATE: (id) => `/journal/templates/${id}`,
      DELETE_TEMPLATE: (id) => `/journal/templates/${id}`,
    },
    
    // Data Export/Import
    DATA: {
      EXPORT: (userId) => `/export/${userId}`,
      IMPORT: "/import",
    },
  },
};

// API Helper Functions
export class ApiClient {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
    this.defaultHeaders = API_CONFIG.DEFAULT_HEADERS;
  }

  /**
   * Get authentication token from localStorage
   */
  getAuthToken() {
    return localStorage.getItem("auth_token");
  }

  /**
   * Set authentication token in localStorage
   */
  setAuthToken(token) {
    localStorage.setItem("auth_token", token);
  }

  /**
   * Remove authentication token from localStorage
   */
  removeAuthToken() {
    localStorage.removeItem("auth_token");
  }

  /**
   * Get headers with authentication token
   */
  getHeaders(customHeaders = {}) {
    const headers = { ...this.defaultHeaders, ...customHeaders };
    
    const token = this.getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    return headers;
  }

  /**
   * Make HTTP request
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = this.getHeaders(options.headers);
    
    const config = {
      method: options.method || "GET",
      headers,
      ...options,
    };

    // Add body for non-GET requests
    if (options.body && config.method !== "GET") {
      config.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url, config);
      
      // Handle non-JSON responses
      if (!response.headers.get("content-type")?.includes("application/json")) {
        if (response.ok) {
          return { success: true, data: null };
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      }

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || `HTTP ${response.status}: ${response.statusText}`);
      }

      return { success: true, data };
    } catch (error) {
      console.error(`API Request failed: ${endpoint}`, error);
      
      // Handle authentication errors
      if (error.message.includes("401") || error.message.includes("Unauthorized")) {
        this.removeAuthToken();
        // Redirect to login or show login modal
        window.dispatchEvent(new CustomEvent("auth:unauthorized"));
      }
      
      return { success: false, error: error.message };
    }
  }

  // HTTP Methods
  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: "GET" });
  }

  async post(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: "POST", body });
  }

  async put(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: "PUT", body });
  }

  async patch(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: "PATCH", body });
  }

  async delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: "DELETE" });
  }
}

// Create global API client instance
export const apiClient = new ApiClient();

// Authentication API functions
export const authAPI = {
  async login(username, password) {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    
    const response = await apiClient.request(API_CONFIG.ENDPOINTS.AUTH.LOGIN, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    });
    
    if (response.success) {
      apiClient.setAuthToken(response.data.access_token);
      return response.data;
    }
    
    return null;
  },

  async register(userData) {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.REGISTER, userData);
    
    if (response.success) {
      apiClient.setAuthToken(response.data.access_token);
      return response.data;
    }
    
    return null;
  },

  async logout() {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
    apiClient.removeAuthToken();
    return response.success;
  },

  async getCurrentUser() {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.AUTH.ME);
    return response.success ? response.data : null;
  },

  async refreshToken() {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.REFRESH);
    
    if (response.success) {
      apiClient.setAuthToken(response.data.access_token);
      return response.data;
    }
    
    return null;
  },
};

// Habits API functions
export const habitsAPI = {
  async getHabits(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const endpoint = `${API_CONFIG.ENDPOINTS.HABITS.LIST}${queryParams ? `?${queryParams}` : ""}`;
    const response = await apiClient.get(endpoint);
    return response.success ? response.data : [];
  },

  async createHabit(habitData) {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.HABITS.CREATE, habitData);
    return response.success ? response.data : null;
  },

  async getHabit(id) {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.HABITS.GET(id));
    return response.success ? response.data : null;
  },

  async updateHabit(id, habitData) {
    const response = await apiClient.put(API_CONFIG.ENDPOINTS.HABITS.UPDATE(id), habitData);
    return response.success ? response.data : null;
  },

  async deleteHabit(id) {
    const response = await apiClient.delete(API_CONFIG.ENDPOINTS.HABITS.DELETE(id));
    return response.success;
  },

  async completeHabit(id, completionData) {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.HABITS.COMPLETE(id), completionData);
    return response.success ? response.data : null;
  },

  async uncompleteHabit(id, date) {
    const response = await apiClient.delete(API_CONFIG.ENDPOINTS.HABITS.UNCOMPLETE(id, date));
    return response.success;
  },

  async getHabitsStats() {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.HABITS.STATS);
    return response.success ? response.data : null;
  },
};

// Water API functions
export const waterAPI = {
  async getWaterEntries(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const endpoint = `${API_CONFIG.ENDPOINTS.WATER.ENTRIES}${queryParams ? `?${queryParams}` : ""}`;
    const response = await apiClient.get(endpoint);
    return response.success ? response.data : [];
  },

  async addWaterEntry(entryData) {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.WATER.ADD, entryData);
    return response.success ? response.data : null;
  },

  async getTodayStats() {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.WATER.TODAY);
    return response.success ? response.data : null;
  },

  async getWaterHistory(days = 7) {
    const response = await apiClient.get(`${API_CONFIG.ENDPOINTS.WATER.HISTORY}?days=${days}`);
    return response.success ? response.data : [];
  },

  async getWaterDashboard() {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.WATER.DASHBOARD);
    return response.success ? response.data : null;
  },

  async getWaterGoal() {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.WATER.GOAL);
    return response.success ? response.data : null;
  },

  async updateWaterGoal(goalData) {
    const response = await apiClient.put(API_CONFIG.ENDPOINTS.WATER.UPDATE_GOAL, goalData);
    return response.success ? response.data : null;
  },

  async getWaterRecommendation(weather = null) {
    const endpoint = weather 
      ? `${API_CONFIG.ENDPOINTS.WATER.RECOMMENDATION}?weather=${encodeURIComponent(weather)}`
      : API_CONFIG.ENDPOINTS.WATER.RECOMMENDATION;
    const response = await apiClient.get(endpoint);
    return response.success ? response.data : null;
  },

  async deleteWaterEntry(id) {
    const response = await apiClient.delete(API_CONFIG.ENDPOINTS.WATER.DELETE(id));
    return response.success;
  },
};

// Finance API functions
export const financeAPI = {
  async getFinanceEntries(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const endpoint = `${API_CONFIG.ENDPOINTS.FINANCE.ENTRIES}${queryParams ? `?${queryParams}` : ""}`;
    const response = await apiClient.get(endpoint);
    return response.success ? response.data : [];
  },

  async createFinanceEntry(entryData) {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.FINANCE.CREATE, entryData);
    return response.success ? response.data : null;
  },

  async getFinanceEntry(id) {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.FINANCE.GET(id));
    return response.success ? response.data : null;
  },

  async updateFinanceEntry(id, entryData) {
    const response = await apiClient.put(API_CONFIG.ENDPOINTS.FINANCE.UPDATE(id), entryData);
    return response.success ? response.data : null;
  },

  async deleteFinanceEntry(id) {
    const response = await apiClient.delete(API_CONFIG.ENDPOINTS.FINANCE.DELETE(id));
    return response.success;
  },

  async getFinanceCategories(categoryType = null) {
    const endpoint = categoryType 
      ? `${API_CONFIG.ENDPOINTS.FINANCE.CATEGORIES}?category_type=${categoryType}`
      : API_CONFIG.ENDPOINTS.FINANCE.CATEGORIES;
    const response = await apiClient.get(endpoint);
    return response.success ? response.data : [];
  },

  async createFinanceCategory(categoryData) {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.FINANCE.CREATE_CATEGORY, categoryData);
    return response.success ? response.data : null;
  },

  async getFinanceSummary() {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.FINANCE.SUMMARY);
    return response.success ? response.data : null;
  },
};

// Journal API functions
export const journalAPI = {
  async getJournalEntries(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const endpoint = `${API_CONFIG.ENDPOINTS.JOURNAL.ENTRIES}${queryParams ? `?${queryParams}` : ""}`;
    const response = await apiClient.get(endpoint);
    return response.success ? response.data : [];
  },

  async createJournalEntry(entryData) {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.JOURNAL.CREATE, entryData);
    return response.success ? response.data : null;
  },

  async getJournalEntry(id) {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.JOURNAL.GET(id));
    return response.success ? response.data : null;
  },

  async updateJournalEntry(id, entryData) {
    const response = await apiClient.put(API_CONFIG.ENDPOINTS.JOURNAL.UPDATE(id), entryData);
    return response.success ? response.data : null;
  },

  async deleteJournalEntry(id) {
    const response = await apiClient.delete(API_CONFIG.ENDPOINTS.JOURNAL.DELETE(id));
    return response.success;
  },

  async searchJournalEntries(searchData) {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.JOURNAL.SEARCH, searchData);
    return response.success ? response.data : [];
  },

  async getJournalStats() {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.JOURNAL.STATS);
    return response.success ? response.data : null;
  },

  async getJournalDashboard() {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.JOURNAL.DASHBOARD);
    return response.success ? response.data : null;
  },

  async getJournalTemplates() {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.JOURNAL.TEMPLATES);
    return response.success ? response.data : [];
  },

  async createJournalTemplate(templateData) {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.JOURNAL.CREATE_TEMPLATE, templateData);
    return response.success ? response.data : null;
  },

  async updateJournalTemplate(id, templateData) {
    const response = await apiClient.put(API_CONFIG.ENDPOINTS.JOURNAL.UPDATE_TEMPLATE(id), templateData);
    return response.success ? response.data : null;
  },

  async deleteJournalTemplate(id) {
    const response = await apiClient.delete(API_CONFIG.ENDPOINTS.JOURNAL.DELETE_TEMPLATE(id));
    return response.success;
  },
};

// Data Export/Import API functions
export const dataAPI = {
  async exportUserData(userId) {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.DATA.EXPORT(userId));
    return response.success ? response.data : null;
  },

  async importUserData(importData) {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.DATA.IMPORT, importData);
    return response.success ? response.data : null;
  },
};

// Error handling
export const handleApiError = (error, context = "API request") => {
  console.error(`${context} failed:`, error);
  
  // Show user-friendly error message
  const errorMessage = error.message || "An unexpected error occurred";
  
  // You can integrate with your notification system here
  // For example: showNotification(errorMessage, "error");
  
  return errorMessage;
};

// Utility functions
export const isAuthenticated = () => {
  return !!apiClient.getAuthToken();
};

export const clearAuthData = () => {
  apiClient.removeAuthToken();
  // Clear any other user-related data
  localStorage.removeItem("user_data");
};

// Event listeners for authentication
window.addEventListener("auth:unauthorized", () => {
  clearAuthData();
  // Redirect to login or show login modal
  window.location.href = "/login";
});

export default {
  API_CONFIG,
  apiClient,
  authAPI,
  habitsAPI,
  waterAPI,
  financeAPI,
  journalAPI,
  dataAPI,
  handleApiError,
  isAuthenticated,
  clearAuthData,
};
