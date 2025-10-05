import { useLocalStorage } from './useLocalStorage';

/**
 * Custom hook for managing journal entries
 * Handles creating, editing, deleting, and filtering journal entries
 */
export function useJournal() {
  const [journalEntries, setJournalEntries] = useLocalStorage('ayubi_journal', []);
  
  // Add a new journal entry
  const addEntry = (title, content, tags = []) => {
    const entry = {
      id: Date.now().toString(),
      title: title.trim(),
      content: content.trim(),
      tags: Array.isArray(tags) ? tags.map(tag => tag.trim()).filter(Boolean) : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setJournalEntries(prev => [entry, ...prev]);
  };
  
  // Update an existing entry
  const updateEntry = (id, title, content, tags = []) => {
    setJournalEntries(prev => prev.map(entry => 
      entry.id === id 
        ? {
            ...entry,
            title: title.trim(),
            content: content.trim(),
            tags: Array.isArray(tags) ? tags.map(tag => tag.trim()).filter(Boolean) : [],
            updatedAt: new Date().toISOString()
          }
        : entry
    ));
  };
  
  // Delete an entry
  const deleteEntry = (id) => {
    setJournalEntries(prev => prev.filter(entry => entry.id !== id));
  };
  
  // Get entry by ID
  const getEntry = (id) => {
    return journalEntries.find(entry => entry.id === id);
  };
  
  // Search entries by title or content
  const searchEntries = (query) => {
    if (!query.trim()) return journalEntries;
    
    const searchTerm = query.toLowerCase();
    return journalEntries.filter(entry => 
      entry.title.toLowerCase().includes(searchTerm) ||
      entry.content.toLowerCase().includes(searchTerm) ||
      entry.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  };
  
  // Filter entries by tags
  const filterByTags = (tags) => {
    if (!tags || tags.length === 0) return journalEntries;
    
    return journalEntries.filter(entry => 
      tags.some(tag => entry.tags.includes(tag))
    );
  };
  
  // Get all unique tags
  const getAllTags = () => {
    const allTags = journalEntries.flatMap(entry => entry.tags);
    return [...new Set(allTags)].sort();
  };
  
  // Get recent entries (last N days)
  const getRecentEntries = (days = 7) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return journalEntries.filter(entry => 
      new Date(entry.createdAt) >= cutoffDate
    );
  };
  
  // Get entries count
  const getEntriesCount = () => journalEntries.length;
  
  return {
    journalEntries,
    addEntry,
    updateEntry,
    deleteEntry,
    getEntry,
    searchEntries,
    filterByTags,
    getAllTags,
    getRecentEntries,
    getEntriesCount
  };
}
