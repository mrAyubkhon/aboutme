import { motion } from 'framer-motion';
import { useState } from 'react';
import { Plus, Target, Sparkles } from 'lucide-react';
import { useHabits } from '../hooks/useHabits';
import { DEFAULT_HABITS } from '../data/constants';
import { PREDEFINED_HABITS } from '../data/habitsData';
import Card from '../components/Card';
import HabitItem from '../components/HabitItem';
import PhysicsButton from '../components/PhysicsButton';
import EnhancedProgressBar from '../components/EnhancedProgressBar';
import AddHabitModal from '../components/AddHabitModal';

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
  const [showAddModal, setShowAddModal] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  const completionRate = getCompletionRate();
  const completedCount = getCompletedCount();

  const handleAddHabit = (habitData) => {
    addHabit(habitData.name, habitData.description, habitData.icon, habitData.color, habitData.category);
  };

  const handleQuickAdd = (habitName) => {
    addHabit(habitName);
    setShowQuickAdd(false);
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
            <div className="flex items-center space-x-3">
              <PhysicsButton
                onClick={() => setShowAddModal(true)}
                icon={Plus}
                variant="primary"
                className="flex items-center space-x-2"
              >
                Add Habit
              </PhysicsButton>
              <PhysicsButton
                onClick={() => setShowQuickAdd(true)}
                icon={Sparkles}
                variant="secondary"
                size="sm"
              >
                Quick Add
              </PhysicsButton>
            </div>
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
            <EnhancedProgressBar 
              current={completedCount}
              goal={habits.length}
              label="Daily Habits"
              type="habits"
              className="mb-4"
            />
            <p className="text-sm text-gray-400">
              {completionRate === 100 
                ? "🎉 All habits completed! Great job!" 
                : `${habits.length - completedCount} habits remaining`}
            </p>
          </Card>
        </motion.div>

        {/* Quick Add Popular Habits */}
        {showQuickAdd && (
          <motion.div
            variants={itemVariants}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-50 mb-4 flex items-center">
                <Sparkles className="mr-2 text-yellow-400" size={20} />
                Quick Add Popular Habits
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {PREDEFINED_HABITS.slice(0, 8).map((habit) => (
                  <PhysicsButton
                    key={habit.id}
                    onClick={() => handleQuickAdd(habit.name)}
                    variant="ghost"
                    className="flex flex-col items-center space-y-2 p-3 h-auto"
                  >
                    <span className="text-2xl">{habit.icon}</span>
                    <span className="text-sm font-medium text-gray-300 text-center">
                      {habit.name}
                    </span>
                  </PhysicsButton>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-800">
                <PhysicsButton
                  onClick={() => setShowQuickAdd(false)}
                  variant="secondary"
                  className="w-full"
                >
                  Close Quick Add
                </PhysicsButton>
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
              <PhysicsButton
                onClick={() => setShowAddModal(true)}
                icon={Plus}
                variant="primary"
                className="flex items-center space-x-2"
              >
                Add Your First Habit
              </PhysicsButton>
            </Card>
          )}
        </motion.div>
      </div>

      {/* Add Habit Modal */}
      <AddHabitModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddHabit={handleAddHabit}
      />
    </motion.div>
  );
}