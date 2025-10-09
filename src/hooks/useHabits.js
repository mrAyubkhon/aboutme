import { useLocalStorage } from './useLocalStorage';
import { safePercentage, safeRound, safeArray } from '../utils/safeMath';
import { useEffect } from 'react';

/**
 * Custom hook for managing habits
 * Handles adding, toggling, deleting habits and calculating completion rates
 */
export function useHabits() {
  const [habits, setHabits] = useLocalStorage('ayubi_habits', []);
  const [lastResetDate, setLastResetDate] = useLocalStorage('ayubi_habits_last_reset', '');
  
  // Ensure habits is always an array
  const safeHabits = safeArray(habits, []);
  
  // Auto-reset habits daily and add default habits if none exist
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    
    // Add default habits if none exist
    if (safeHabits.length === 0) {
      console.log('Adding default habits');
      setHabits([
        {
          id: '1',
          name: 'Walk 10,000 Steps',
          description: 'Reach your daily step goal',
          icon: '🚶',
          color: 'blue',
          category: 'fitness',
          completed: false,
          createdAt: new Date().toISOString(),
          streak: 0,
          lastCompleted: null
        },
        {
          id: '2',
          name: 'Morning Stretch',
          description: 'Start your day with gentle stretching',
          icon: '🤸',
          color: 'green',
          category: 'health',
          completed: false,
          createdAt: new Date().toISOString(),
          streak: 0,
          lastCompleted: null
        }
      ]);
    }
    
    // Reset habits for new day
    if (lastResetDate !== today && safeHabits.length > 0) {
      console.log('Resetting habits for new day:', today);
      setHabits(prev => prev.map(habit => ({ ...habit, completed: false })));
      setLastResetDate(today);
    }
  }, [lastResetDate, safeHabits.length, setHabits, setLastResetDate]);
  
  // Add a new habit
  const addHabit = (name, description = '', icon = '🎯', color = 'blue', category = 'personal') => {
    const newHabit = {
      id: Date.now().toString(),
      name: name.trim(),
      description: description.trim(),
      icon,
      color,
      category,
      completed: false,
      createdAt: new Date().toISOString(),
      streak: 0,
      lastCompleted: null
    };
    setHabits(prev => [...prev, newHabit]);
  };
  
  // Toggle habit completion status
  const toggleHabit = (id) => {
    setHabits(prev => prev.map(habit => 
      habit.id === id ? { ...habit, completed: !habit.completed } : habit
    ));
    
    // Dispatch custom event for UI updates
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('habitsUpdated'));
    }, 100);
  };
  
  // Delete a habit
  const deleteHabit = (id) => {
    setHabits(prev => prev.filter(habit => habit.id !== id));
  };
  
  // Reset all habits for a new day
  const resetDailyHabits = () => {
    setHabits(prev => prev.map(habit => ({ ...habit, completed: false })));
  };
  
  // Calculate completion percentage
  const getCompletionRate = () => {
    if (safeHabits.length === 0) return 0;
    const completed = safeHabits.filter(h => h && h.completed).length;
    return safeRound(safePercentage(completed, safeHabits.length), 0);
  };
  
  // Get completed count
  const getCompletedCount = () => {
    return safeHabits.filter(h => h && h.completed).length;
  };
  
  return {
    habits: safeHabits,
    addHabit,
    toggleHabit,
    deleteHabit,
    resetDailyHabits,
    getCompletionRate,
    getCompletedCount
  };
}
