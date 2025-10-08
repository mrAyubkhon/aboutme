import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Search, 
  Plus,
  Filter,
  Star,
  Clock,
  Target
} from 'lucide-react';
import { 
  PREDEFINED_HABITS, 
  HABIT_CATEGORIES, 
  getHabitsByCategory,
  searchHabits 
} from '../data/habitsData';
import PhysicsButton from './PhysicsButton';

/**
 * Modal for adding new habits with predefined options
 */
export default function AddHabitModal({ 
  isOpen, 
  onClose, 
  onAddHabit,
  className = '' 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [showCustomForm, setShowCustomForm] = useState(false);

  const categories = [
    { id: 'all', name: 'All', icon: '🌟', count: PREDEFINED_HABITS.length },
    { id: HABIT_CATEGORIES.HEALTH, name: 'Health', icon: '💊', count: getHabitsByCategory(HABIT_CATEGORIES.HEALTH).length },
    { id: HABIT_CATEGORIES.PRODUCTIVITY, name: 'Productivity', icon: '⚡', count: getHabitsByCategory(HABIT_CATEGORIES.PRODUCTIVITY).length },
    { id: HABIT_CATEGORIES.LEARNING, name: 'Learning', icon: '📚', count: getHabitsByCategory(HABIT_CATEGORIES.LEARNING).length },
    { id: HABIT_CATEGORIES.FITNESS, name: 'Fitness', icon: '💪', count: getHabitsByCategory(HABIT_CATEGORIES.FITNESS).length },
    { id: HABIT_CATEGORIES.MINDFULNESS, name: 'Mindfulness', icon: '🧘‍♂️', count: getHabitsByCategory(HABIT_CATEGORIES.MINDFULNESS).length },
    { id: HABIT_CATEGORIES.CREATIVITY, name: 'Creativity', icon: '🎨', count: getHabitsByCategory(HABIT_CATEGORIES.CREATIVITY).length },
    { id: HABIT_CATEGORIES.SOCIAL, name: 'Social', icon: '👥', count: getHabitsByCategory(HABIT_CATEGORIES.SOCIAL).length },
    { id: HABIT_CATEGORIES.PERSONAL, name: 'Personal', icon: '🎯', count: getHabitsByCategory(HABIT_CATEGORIES.PERSONAL).length }
  ];

  const getFilteredHabits = () => {
    let habits = PREDEFINED_HABITS;

    // Filter by category
    if (selectedCategory !== 'all') {
      habits = habits.filter(habit => habit.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      habits = searchHabits(searchQuery);
      if (selectedCategory !== 'all') {
        habits = habits.filter(habit => habit.category === selectedCategory);
      }
    }

    return habits;
  };

  const filteredHabits = getFilteredHabits();

  const handleSelectHabit = (habit) => {
    setSelectedHabit(habit);
  };

  const handleAddHabit = () => {
    if (selectedHabit) {
      onAddHabit({
        id: `custom-${Date.now()}`,
        name: selectedHabit.name,
        description: selectedHabit.description,
        icon: selectedHabit.icon,
        color: selectedHabit.color,
        category: selectedHabit.category,
        tags: selectedHabit.tags,
        frequency: selectedHabit.frequency,
        difficulty: selectedHabit.difficulty
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedHabit(null);
    setShowCustomForm(false);
    onClose();
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400 bg-green-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'hard': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getColorClass = (color) => {
    switch (color) {
      case 'blue': return 'border-blue-500 bg-blue-500/10';
      case 'green': return 'border-green-500 bg-green-500/10';
      case 'red': return 'border-red-500 bg-red-500/10';
      case 'purple': return 'border-purple-500 bg-purple-500/10';
      case 'yellow': return 'border-yellow-500 bg-yellow-500/10';
      case 'orange': return 'border-orange-500 bg-orange-500/10';
      case 'pink': return 'border-pink-500 bg-pink-500/10';
      case 'cyan': return 'border-cyan-500 bg-cyan-500/10';
      default: return 'border-gray-500 bg-gray-500/10';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl max-h-[90vh] bg-gray-900 rounded-2xl border border-gray-800 shadow-2xl z-50 overflow-hidden ${className}`}
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <div>
                <h2 className="text-2xl font-bold text-gray-50">Add New Habit</h2>
                <p className="text-gray-400 mt-1">Choose from {PREDEFINED_HABITS.length} predefined habits or create your own</p>
              </div>
              <PhysicsButton
                onClick={handleClose}
                icon={X}
                variant="ghost"
                size="sm"
              />
            </div>

            {/* Search and Filters */}
            <div className="p-6 border-b border-gray-800">
              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search habits..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-gray-50 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Category Filters */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <PhysicsButton
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    variant={selectedCategory === category.id ? 'primary' : 'ghost'}
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    <span>{category.icon}</span>
                    <span>{category.name}</span>
                    <span className="text-xs opacity-75">({category.count})</span>
                  </PhysicsButton>
                ))}
              </div>
            </div>

            {/* Habits Grid */}
            <div className="p-6 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredHabits.map((habit, index) => (
                  <motion.div
                    key={habit.id}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedHabit?.id === habit.id 
                        ? `${getColorClass(habit.color)} border-opacity-100` 
                        : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                    }`}
                    onClick={() => handleSelectHabit(habit)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{habit.icon}</span>
                        <div>
                          <h3 className="font-semibold text-gray-50">{habit.name}</h3>
                          <p className="text-sm text-gray-400">{habit.description}</p>
                        </div>
                      </div>
                      {selectedHabit?.id === habit.id && (
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(habit.difficulty)}`}>
                        {habit.difficulty}
                      </span>
                      <div className="flex items-center space-x-1 text-gray-400">
                        <Clock size={12} />
                        <span className="text-xs">{habit.frequency}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {filteredHabits.length === 0 && (
                <div className="text-center py-12">
                  <Search className="mx-auto text-gray-400 mb-4" size={48} />
                  <h3 className="text-lg font-semibold text-gray-50 mb-2">No habits found</h3>
                  <p className="text-gray-400">Try adjusting your search or category filter</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-800 bg-gray-800/50">
              <div className="text-sm text-gray-400">
                {selectedHabit ? `Selected: ${selectedHabit.name}` : 'Select a habit to continue'}
              </div>
              <div className="flex items-center space-x-3">
                <PhysicsButton
                  onClick={handleClose}
                  variant="ghost"
                >
                  Cancel
                </PhysicsButton>
                <PhysicsButton
                  onClick={handleAddHabit}
                  variant="primary"
                  disabled={!selectedHabit}
                  icon={Plus}
                >
                  Add Habit
                </PhysicsButton>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
