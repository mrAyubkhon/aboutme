import { useLocalStorage } from './useLocalStorage';
import { FINANCE_CATEGORIES } from '../data/constants';

/**
 * Custom hook for managing financial tracking
 * Handles income/expense entries, daily limits, and financial summaries
 */
export function useFinance() {
  const [financeData, setFinanceData] = useLocalStorage('ayubi_finances', {
    entries: [],
    dailyLimit: 100000, // 100k UZS default
    currency: 'UZS'
  });
  
  // Add income or expense entry
  const addEntry = (type, amount, category, note = '') => {
    const entry = {
      id: Date.now().toString(),
      type, // 'income' or 'expense'
      amount: Math.abs(Number(amount)),
      category,
      note: note.trim(),
      date: new Date().toISOString()
    };
    
    setFinanceData(prev => ({
      ...prev,
      entries: [entry, ...prev.entries]
    }));
  };
  
  // Delete an entry
  const deleteEntry = (id) => {
    setFinanceData(prev => ({
      ...prev,
      entries: prev.entries.filter(entry => entry.id !== id)
    }));
  };
  
  // Set daily spending limit
  const setDailyLimit = (limit) => {
    setFinanceData(prev => ({
      ...prev,
      dailyLimit: Math.max(0, Number(limit))
    }));
  };
  
  // Get today's expenses
  const getTodayExpenses = () => {
    const today = new Date().toDateString();
    return financeData.entries.filter(entry => 
      entry.type === 'expense' && 
      new Date(entry.date).toDateString() === today
    );
  };
  
  // Get today's income
  const getTodayIncome = () => {
    const today = new Date().toDateString();
    return financeData.entries.filter(entry => 
      entry.type === 'income' && 
      new Date(entry.date).toDateString() === today
    );
  };
  
  // Calculate today's totals
  const getTodayTotals = () => {
    const todayExpenses = getTodayExpenses();
    const todayIncome = getTodayIncome();
    
    const totalExpenses = todayExpenses.reduce((sum, entry) => sum + entry.amount, 0);
    const totalIncome = todayIncome.reduce((sum, entry) => sum + entry.amount, 0);
    
    return {
      expenses: totalExpenses,
      income: totalIncome,
      net: totalIncome - totalExpenses
    };
  };
  
  // Check if over daily limit
  const isOverLimit = () => {
    const { expenses } = getTodayTotals();
    return expenses > financeData.dailyLimit;
  };
  
  // Get remaining budget
  const getRemainingBudget = () => {
    const { expenses } = getTodayTotals();
    return Math.max(financeData.dailyLimit - expenses, 0);
  };
  
  // Get monthly summary (last 30 days)
  const getMonthlySummary = () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentEntries = financeData.entries.filter(entry => 
      new Date(entry.date) >= thirtyDaysAgo
    );
    
    const monthlyExpenses = recentEntries
      .filter(entry => entry.type === 'expense')
      .reduce((sum, entry) => sum + entry.amount, 0);
      
    const monthlyIncome = recentEntries
      .filter(entry => entry.type === 'income')
      .reduce((sum, entry) => sum + entry.amount, 0);
    
    return {
      expenses: monthlyExpenses,
      income: monthlyIncome,
      net: monthlyIncome - monthlyExpenses
    };
  };
  
  return {
    financeData,
    addEntry,
    deleteEntry,
    setDailyLimit,
    getTodayTotals,
    isOverLimit,
    getRemainingBudget,
    getMonthlySummary,
    categories: FINANCE_CATEGORIES
  };
}
