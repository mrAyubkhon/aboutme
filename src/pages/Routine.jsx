import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Plus, Target, RotateCcw, Zap } from 'lucide-react';
import { useHabits } from '../hooks/useLocalStorage';
import Card from '../components/Card';
import HabitItem, { HabitForm } from '../components/HabitItem';
import ProgressBar, { CircularProgress } from '../components/ProgressBar';

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
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3 }
  }
};

export default function Routine() {
  const { habits, addHabit, toggleHabit, deleteHabit, resetDailyHabits, getCompletionRate } = useHabits();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const completionRate = getCompletionRate();
  const completedCount = habits.filter(h => h.completed).length;
  const totalCount = habits.length;

  const handleAddHabit = (name) => {
    addHabit(name);
    setShowAddForm(false);
  };

  const handleResetHabits = () => {
    resetDailyHabits();
    setShowResetConfirm(false);
  };

  const defaultHabits = [
    'Wake up early',
    'Morning workout',
    'Python coding',
    'English practice',
    'Arabic study',
    'Read for 30 minutes',
    'Study tickets',
    'Meditation',
    'Drink water',
    'Evening walk'
  ];

  return (
    <motion.div
      className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Daily Routine
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Track your habits and build consistency
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <motion.button
                onClick={() => setShowResetConfirm(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RotateCcw size={16} />
                <span className="text-sm font-medium">Reset</span>
              </motion.button>
              
              <motion.button
                onClick={() => setShowAddForm(true)}
                className="flex items-center space-x-2 btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus size={16} />
                <span>Add Habit</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Progress Overview */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Overall Progress */}
          <Card className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <CircularProgress 
                progress={completionRate} 
                size={120}
                showPercentage={false}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {completionRate}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Complete
                  </div>
                </div>
              </CircularProgress>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Today's Progress
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {completedCount} of {totalCount} habits completed
            </p>
          </Card>

          {/* Completion Stats */}
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-xl flex items-center justify-center">
                <Target size={20} className="text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  Habits Completed
                </h3>
                <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {completedCount}
                </p>
              </div>
            </div>
            <ProgressBar 
              progress={completionRate} 
              className="mb-2"
              showPercentage={false}
            />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {completionRate >= 80 ? 'Excellent progress!' : 
               completionRate >= 60 ? 'Good job!' : 
               completionRate >= 40 ? 'Keep going!' : 
               'You can do this!'}
            </p>
          </Card>

          {/* Motivational Card */}
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center">
                <Zap size={20} className="text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  Streak
                </h3>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {Math.floor(Math.random() * 7) + 1} days
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {completionRate >= 100 ? 'Perfect day! Keep it up! 🎉' :
               'Consistency is key to success'}
            </p>
          </Card>
        </motion.div>

        {/* Habits List */}
        <motion.div variants={itemVariants} className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Today's Habits
            </h2>
            {habits.length === 0 && (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                No habits yet
              </div>
            )}
          </div>

          {/* Add Habit Form */}
          <AnimatePresence>
            {showAddForm && (
              <HabitForm
                onSubmit={handleAddHabit}
                onCancel={() => setShowAddForm(false)}
              />
            )}
          </AnimatePresence>

          {/* Habits List */}
          <div className="space-y-3">
            <AnimatePresence>
              {habits.length === 0 ? (
                <Card className="p-8 text-center">
                  <div className="text-gray-500 dark:text-gray-400 mb-4">
                    <Target size={48} className="mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No habits yet</h3>
                    <p className="text-sm mb-6">
                      Start building your daily routine by adding some habits
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-md mx-auto">
                      {defaultHabits.slice(0, 6).map((habit) => (
                        <motion.button
                          key={habit}
                          onClick={() => addHabit(habit)}
                          className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {habit}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </Card>
              ) : (
                habits.map((habit) => (
                  <HabitItem
                    key={habit.id}
                    habit={habit}
                    onToggle={toggleHabit}
                    onDelete={deleteHabit}
                  />
                ))
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Reset Confirmation Modal */}
        <AnimatePresence>
          {showResetConfirm && (
            <motion.div
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowResetConfirm(false)}
            >
              <motion.div
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Reset Daily Habits?
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  This will mark all habits as incomplete for today. This action cannot be undone.
                </p>
                <div className="flex space-x-3">
                  <motion.button
                    onClick={() => setShowResetConfirm(false)}
                    className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={handleResetHabits}
                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Reset
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
