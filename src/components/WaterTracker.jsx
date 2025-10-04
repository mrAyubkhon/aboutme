import { motion } from 'framer-motion';
import { Droplets, Plus, Target, Zap } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../utils/cn';
import { WaterWaveProgress } from './ProgressBar';

export default function WaterTracker({ 
  waterData, 
  onAddWater, 
  onSetGoal,
  className = '' 
}) {
  const { current, goal } = waterData;
  const progress = Math.min((current / goal) * 100, 100);
  const remaining = goal - current;

  const addWater = (amount = 250) => {
    onAddWater(amount);
  };

  return (
    <motion.div
      className={cn('space-y-6', className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Main Water Display */}
      <div className="relative">
        <WaterWaveProgress 
          progress={progress} 
          className="h-64 w-full"
        />
        
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div 
            className="text-center text-white"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="text-4xl font-bold mb-2">
              {formatWaterAmount(current)}
            </div>
            <div className="text-lg opacity-90">
              / {formatWaterAmount(goal)}
            </div>
            <div className="text-sm opacity-75 mt-1">
              {Math.round(progress)}% complete
            </div>
          </motion.div>
        </div>
      </div>

      {/* Quick Add Buttons */}
      <div className="grid grid-cols-3 gap-3">
        {[250, 500, 1000].map((amount) => (
          <motion.button
            key={amount}
            onClick={() => addWater(amount)}
            className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex items-center justify-center space-x-2">
              <Plus size={16} className="text-blue-600 dark:text-blue-400" />
              <span className="font-medium text-blue-700 dark:text-blue-300">
                +{formatWaterAmount(amount)}
              </span>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Progress Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2 mb-2">
            <Target size={16} className="text-gray-500" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Goal
            </span>
          </div>
          <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {formatWaterAmount(goal)}
          </div>
        </div>
        
        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2 mb-2">
            <Droplets size={16} className="text-blue-500" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Remaining
            </span>
          </div>
          <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {formatWaterAmount(Math.max(remaining, 0))}
          </div>
        </div>
      </div>

      {/* Motivational Message */}
      {progress >= 100 && (
        <motion.div
          className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center space-x-2">
            <Zap size={20} className="text-green-600 dark:text-green-400" />
            <span className="font-medium text-green-700 dark:text-green-300">
              Hydration goal achieved! 🎉
            </span>
          </div>
        </motion.div>
      )}

      {/* Goal Setting */}
      <WaterGoalSettings goal={goal} onSetGoal={onSetGoal} />
    </motion.div>
  );
}

function WaterGoalSettings({ goal, onSetGoal }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newGoal, setNewGoal] = useState(goal);

  const handleSave = () => {
    if (newGoal >= 500 && newGoal <= 10000) {
      onSetGoal(newGoal);
      setIsEditing(false);
    }
  };

  return (
    <motion.div
      className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Target size={16} className="text-gray-500" />
          <span className="font-medium text-gray-900 dark:text-gray-100">
            Daily Goal
          </span>
        </div>
        
        {isEditing ? (
          <div className="flex items-center space-x-2">
            <input
              type="number"
              value={newGoal}
              onChange={(e) => setNewGoal(parseInt(e.target.value) || 0)}
              className="w-20 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              min="500"
              max="10000"
              step="250"
            />
            <span className="text-sm text-gray-500">ml</span>
            <motion.button
              onClick={handleSave}
              className="px-3 py-1 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600 transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Save
            </motion.button>
            <motion.button
              onClick={() => {
                setIsEditing(false);
                setNewGoal(goal);
              }}
              className="px-3 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Cancel
            </motion.button>
          </div>
        ) : (
          <motion.button
            onClick={() => setIsEditing(true)}
            className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Edit
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

// Utility function
function formatWaterAmount(ml) {
  if (ml >= 1000) {
    return `${(ml / 1000).toFixed(1)}L`;
  }
  return `${ml}ml`;
}
