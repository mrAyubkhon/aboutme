import { useLocalStorage } from './useLocalStorage';

/**
 * Custom hook for managing habits
 * Handles adding, toggling, deleting habits and calculating completion rates
 */
export function useHabits() {
  const [habits, setHabits] = useLocalStorage('ayubi_habits', []);
  
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
    if (habits.length === 0) return 0;
    const completed = habits.filter(h => h.completed).length;
    return Math.round((completed / habits.length) * 100);
  };
  
  // Get completed count
  const getCompletedCount = () => {
    return habits.filter(h => h.completed).length;
  };
  
  return {
    habits,
    addHabit,
    toggleHabit,
    deleteHabit,
    resetDailyHabits,
    getCompletionRate,
    getCompletedCount
  };
}
