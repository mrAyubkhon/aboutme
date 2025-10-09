import { useLocalStorage } from './useLocalStorage';
import { safePercentage, safeRound, safeArray } from '../utils/safeMath';

/**
 * Custom hook for managing habits
 * Handles adding, toggling, deleting habits and calculating completion rates
 */
export function useHabits() {
  const [habits, setHabits] = useLocalStorage('ayubi_habits', []);
  
  // Ensure habits is always an array
  const safeHabits = safeArray(habits, []);
  
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
