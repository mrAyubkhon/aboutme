import { motion } from 'framer-motion';
import { useState } from 'react';
import { Plus, Target } from 'lucide-react';
import { useHabits } from '../hooks/useHabits';
import { DEFAULT_HABITS } from '../data/constants';
import Card from '../components/Card';
import HabitItem from '../components/HabitItem';
import Button from '../components/Button';
import ProgressBar from '../components/ProgressBar';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.3 }
  }
};

export default function Routine() {
  const { habits, addHabit, toggleHabit, deleteHabit, getCompletionRate, getCompletedCount } = useHabits();
  const [newHabitName, setNewHabitName] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const completionRate = getCompletionRate();
  const completedCount = getCompletedCount();

  const handleAddHabit = () => {
    if (newHabitName.trim()) {
      addHabit(newHabitName);
      setNewHabitName('');
      setShowAddForm(false);
    }
  };

  const addDefaultHabits = () => {
    DEFAULT_HABITS.forEach(habitName => {
      if (!habits.find(h => h.name === habitName)) {
        addHabit(habitName);
      }
    });
  };

  return (
    <motion.div
      className="min-h-screen bg-gray-950 pt-16"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-50 mb-2">Routine Tracker</h1>
              <p className="text-gray-300">Track your daily habits and build consistency</p>
            </div>
            <Button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center space-x-2"
            >
              <Plus size={18} />
              <span>Add Habit</span>
            </Button>
          </div>
        </motion.div>

        {/* Progress Overview */}
        <motion.div variants={itemVariants} className="mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-50 flex items-center">
                <Target className="mr-2 text-blue-400" size={20} />
                Daily Progress
              </h3>
              <span className="text-2xl font-bold text-blue-400">
                {completedCount}/{habits.length}
              </span>
            </div>
            <ProgressBar 
              progress={completionRate} 
              label={`${completionRate}% Complete`}
              className="mb-4"
            />
            <p className="text-sm text-gray-400">
              {completionRate === 100 
                ? "🎉 All habits completed! Great job!" 
                : `${habits.length - completedCount} habits remaining`}
            </p>
          </Card>
        </motion.div>

        {/* Add Habit Form */}
        {showAddForm && (
          <motion.div
            variants={itemVariants}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-50 mb-4">Add New Habit</h3>
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={newHabitName}
                  onChange={(e) => setNewHabitName(e.target.value)}
                  placeholder="Enter habit name..."
                  className="flex-1 px-3 py-2 border border-gray-800 rounded-xl bg-gray-800 text-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddHabit()}
                />
                <Button onClick={handleAddHabit} disabled={!newHabitName.trim()}>
                  Add
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Default Habits Button */}
        {habits.length === 0 && (
          <motion.div variants={itemVariants} className="mb-6">
            <Card className="p-6 text-center">
              <p className="text-gray-300 mb-4">No habits yet. Add your first habit or start with some defaults.</p>
              <Button onClick={addDefaultHabits}>
                Add Default Habits
              </Button>
            </Card>
          </motion.div>
        )}

        {/* Habits List */}
        <motion.div variants={itemVariants}>
          <h3 className="text-xl font-semibold text-gray-50 mb-6">
            Your Habits ({habits.length})
          </h3>
          {habits.length > 0 ? (
            <div className="space-y-3">
              {habits.map((habit) => (
                <HabitItem
                  key={habit.id}
                  habit={habit}
                  onToggle={toggleHabit}
                  onDelete={deleteHabit}
                />
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <Target className="mx-auto text-gray-500 mb-4" size={48} />
              <h3 className="text-lg font-semibold text-gray-50 mb-2">No habits yet</h3>
              <p className="text-gray-400 mb-4">Start building your daily routine by adding your first habit.</p>
              <Button onClick={() => setShowAddForm(true)}>
                <Plus size={18} className="mr-2" />
                Add Your First Habit
              </Button>
            </Card>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}