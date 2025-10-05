import { motion } from 'framer-motion';
import { Droplets, Plus, Minus } from 'lucide-react';
import ProgressBar from './ProgressBar';
import Button from './Button';

/**
 * Water tracking component with intake controls and progress
 */
export default function WaterTracker({ 
  currentAmount = 0, 
  goal = 3000, 
  onAddWater, 
  onSubtractWater,
  className = '' 
}) {
  const progress = Math.min((currentAmount / goal) * 100, 100);
  const remaining = Math.max(goal - currentAmount, 0);
  const isGoalAchieved = progress >= 100;
  
  const handleAddWater = (amount = 250) => {
    onAddWater(amount);
  };
  
  const handleSubtractWater = (amount = 250) => {
    onSubtractWater(amount);
  };
  
  return (
    <div className={`bg-gray-900 rounded-2xl p-6 border border-gray-800 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center border border-blue-500/30">
            <Droplets className="text-blue-400" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-50">Water Tracker</h3>
            <p className="text-sm text-gray-400">
              {currentAmount.toLocaleString()} / {goal.toLocaleString()} ml
            </p>
          </div>
        </div>
        
        {isGoalAchieved && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-green-400 text-sm font-medium"
          >
            🎉 Goal achieved!
          </motion.div>
        )}
      </div>
      
      <ProgressBar 
        progress={progress} 
        label="Daily Progress"
        className="mb-6"
      />
      
      <div className="grid grid-cols-2 gap-3 mb-4">
        <Button
          onClick={() => handleAddWater(250)}
          className="flex items-center justify-center space-x-2"
        >
          <Plus size={16} />
          <span>+250ml</span>
        </Button>
        
        <Button
          onClick={() => handleSubtractWater(250)}
          variant="secondary"
          className="flex items-center justify-center space-x-2"
        >
          <Minus size={16} />
          <span>-250ml</span>
        </Button>
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        <Button
          onClick={() => handleAddWater(500)}
          size="sm"
          className="text-xs"
        >
          +500ml
        </Button>
        
        <Button
          onClick={() => handleAddWater(1000)}
          size="sm"
          className="text-xs"
        >
          +1L
        </Button>
        
        <Button
          onClick={() => handleSubtractWater(500)}
          variant="secondary"
          size="sm"
          className="text-xs"
        >
          -500ml
        </Button>
      </div>
      
      {remaining > 0 && (
        <p className="text-center text-sm text-gray-400 mt-4">
          {remaining.toLocaleString()} ml remaining to reach your goal
        </p>
      )}
    </div>
  );
}