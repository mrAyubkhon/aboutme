import { useState, useEffect } from 'react';

/**
 * Custom hook for managing localStorage with React state
 * @param {string} key - localStorage key
 * @param {any} initialValue - initial value if key doesn't exist
 * @returns {[any, function]} - [value, setValue]
 */
export function useLocalStorage(key, initialValue) {
  // Get from local storage then parse stored json or return initialValue
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to local storage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}

/**
 * Hook for managing habits data
 */
export function useHabits() {
  const [habits, setHabits] = useLocalStorage('ayubi_habits', []);
  
  const addHabit = (name) => {
    const newHabit = {
      id: Date.now().toString(),
      name,
      completed: false,
      createdAt: new Date().toISOString()
    };
    setHabits(prev => [...prev, newHabit]);
  };
  
  const toggleHabit = (id) => {
    setHabits(prev => prev.map(habit => 
      habit.id === id ? { ...habit, completed: !habit.completed } : habit
    ));
  };
  
  const deleteHabit = (id) => {
    setHabits(prev => prev.filter(habit => habit.id !== id));
  };
  
  const resetDailyHabits = () => {
    setHabits(prev => prev.map(habit => ({ ...habit, completed: false })));
  };
  
  const getCompletionRate = () => {
    if (habits.length === 0) return 0;
    const completed = habits.filter(h => h.completed).length;
    return Math.round((completed / habits.length) * 100);
  };
  
  return {
    habits,
    addHabit,
    toggleHabit,
    deleteHabit,
    resetDailyHabits,
    getCompletionRate
  };
}

/**
 * Hook for managing water tracking data
 */
export function useWater() {
  const [waterData, setWaterData] = useLocalStorage('ayubi_water', {
    current: 0,
    goal: 3000, // 3 liters default
    lastReset: new Date().toDateString()
  });
  
  // Reset daily if it's a new day
  useEffect(() => {
    const today = new Date().toDateString();
    if (waterData.lastReset !== today) {
      setWaterData(prev => ({
        ...prev,
        current: 0,
        lastReset: today
      }));
    }
  }, [waterData.lastReset, setWaterData]);
  
  const addWater = (amount = 250) => {
    setWaterData(prev => ({
      ...prev,
      current: Math.min(prev.current + amount, prev.goal * 2) // Cap at 2x goal
    }));
  };
  
  const setGoal = (goal) => {
    setWaterData(prev => ({
      ...prev,
      goal: Math.max(500, Math.min(10000, goal)) // Min 500ml, Max 10L
    }));
  };
  
  const getProgress = () => {
    return Math.min((waterData.current / waterData.goal) * 100, 100);
  };
  
  return {
    waterData,
    addWater,
    setGoal,
    getProgress
  };
}

/**
 * Hook for managing finance data
 */
export function useFinance() {
  const [financeData, setFinanceData] = useLocalStorage('ayubi_finances', {
    transactions: [],
    dailyLimit: 100000, // 100,000 UZS default
    currency: 'UZS'
  });
  
  const addTransaction = (type, amount, category, note = '') => {
    const transaction = {
      id: Date.now().toString(),
      type, // 'income' or 'expense'
      amount: parseFloat(amount),
      category,
      note,
      date: new Date().toISOString(),
      dateString: new Date().toDateString()
    };
    
    setFinanceData(prev => ({
      ...prev,
      transactions: [transaction, ...prev.transactions]
    }));
  };
  
  const deleteTransaction = (id) => {
    setFinanceData(prev => ({
      ...prev,
      transactions: prev.transactions.filter(t => t.id !== id)
    }));
  };
  
  const setDailyLimit = (limit) => {
    setFinanceData(prev => ({
      ...prev,
      dailyLimit: parseFloat(limit)
    }));
  };
  
  const getTodayStats = () => {
    const today = new Date().toDateString();
    const todayTransactions = financeData.transactions.filter(t => t.dateString === today);
    
    const todayExpenses = todayTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const todayIncome = todayTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      expenses: todayExpenses,
      income: todayIncome,
      remaining: financeData.dailyLimit - todayExpenses,
      isOverLimit: todayExpenses > financeData.dailyLimit,
      transactions: todayTransactions
    };
  };
  
  const getMonthlyStats = () => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const monthlyTransactions = financeData.transactions.filter(t => 
      new Date(t.date) >= monthStart
    );
    
    const monthlyExpenses = monthlyTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const monthlyIncome = monthlyTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      expenses: monthlyExpenses,
      income: monthlyIncome,
      net: monthlyIncome - monthlyExpenses,
      transactions: monthlyTransactions
    };
  };
  
  return {
    financeData,
    addTransaction,
    deleteTransaction,
    setDailyLimit,
    getTodayStats,
    getMonthlyStats
  };
}

/**
 * Hook for managing journal entries
 */
export function useJournal() {
  const [entries, setEntries] = useLocalStorage('ayubi_journal', []);
  
  const addEntry = (title, content, tag = '') => {
    const entry = {
      id: Date.now().toString(),
      title,
      content,
      tag,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setEntries(prev => [entry, ...prev]);
  };
  
  const updateEntry = (id, title, content, tag) => {
    setEntries(prev => prev.map(entry => 
      entry.id === id 
        ? { ...entry, title, content, tag, updatedAt: new Date().toISOString() }
        : entry
    ));
  };
  
  const deleteEntry = (id) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
  };
  
  const getRecentEntries = (limit = 5) => {
    return entries.slice(0, limit);
  };
  
  return {
    entries,
    addEntry,
    updateEntry,
    deleteEntry,
    getRecentEntries
  };
}

/**
 * Hook for managing app settings
 */
export function useSettings() {
  const [settings, setSettings] = useLocalStorage('ayubi_settings', {
    language: 'en',
    theme: 'light',
    name: 'Ayubi aka',
    notifications: true,
    autoDarkMode: true
  });
  
  const updateSetting = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const toggleTheme = () => {
    const newTheme = settings.theme === 'light' ? 'dark' : 'light';
    updateSetting('theme', newTheme);
    
    // Apply theme to document
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  
  const resetAllData = () => {
    if (confirm('Are you sure you want to delete all data? This cannot be undone.')) {
      const keys = ['ayubi_habits', 'ayubi_water', 'ayubi_finances', 'ayubi_journal'];
      keys.forEach(key => {
        localStorage.removeItem(key);
      });
      window.location.reload();
    }
  };
  
  return {
    settings,
    updateSetting,
    toggleTheme,
    resetAllData
  };
}
