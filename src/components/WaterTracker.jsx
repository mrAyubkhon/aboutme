import { motion } from 'framer-motion';
import { Droplets, Plus, Minus } from 'lucide-react';
import ProgressBar from './ProgressBar';
import PhysicsButton from './PhysicsButton';

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
  
  const playWaterSound = (type = 'add') => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      if (type === 'add') {
        // Pleasant water drop sound
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.2);
      } else {
        // Subtle subtract sound
        oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.1);
      }
      
      gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
    } catch (error) {
      // Fallback: no sound if audio context not supported
    }
  };

  const handleAddWater = (amount = 250) => {
    onAddWater(amount);
    playWaterSound('add');
  };
  
  const handleSubtractWater = (amount = 250) => {
    if (onSubtractWater) {
      onSubtractWater(amount);
    } else {
      // Fallback: add negative amount if no subtract function provided
      onAddWater(-amount);
    }
    playWaterSound('subtract');
  };
  
  return (
    <motion.div 
      className={`bg-gray-900 rounded-2xl p-6 border border-gray-800 transition-all duration-300 hover:border-blue-500/30 hover:shadow-lg ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
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
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: "spring",
              stiffness: 400,
              damping: 15,
              mass: 0.8,
              duration: 0.6
            }}
            className="text-green-400 text-sm font-medium flex items-center space-x-1"
          >
            <motion.span
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ 
                duration: 0.5,
                repeat: 2,
                delay: 0.2
              }}
            >
              🎉
            </motion.span>
            <span>Goal achieved!</span>
          </motion.div>
        )}
      </div>
      
      <ProgressBar 
        progress={progress} 
        label="Daily Progress"
        className="mb-6"
      />
      
      <div className="grid grid-cols-2 gap-3 mb-4">
        <PhysicsButton
          onClick={() => handleAddWater(250)}
          className="flex items-center justify-center space-x-2"
        >
          <Plus size={16} />
          <span>+250ml</span>
        </PhysicsButton>
        
        <PhysicsButton
          onClick={() => handleSubtractWater(250)}
          variant="secondary"
          className="flex items-center justify-center space-x-2"
        >
          <Minus size={16} />
          <span>-250ml</span>
        </PhysicsButton>
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        <PhysicsButton
          onClick={() => handleAddWater(500)}
          size="sm"
          className="text-xs"
        >
          +500ml
        </PhysicsButton>
        
        <PhysicsButton
          onClick={() => handleAddWater(1000)}
          size="sm"
          className="text-xs"
        >
          +1L
        </PhysicsButton>
        
        <PhysicsButton
          onClick={() => handleSubtractWater(500)}
          variant="secondary"
          size="sm"
          className="text-xs"
        >
          -500ml
        </PhysicsButton>
      </div>
      
      {remaining > 0 && (
        <p className="text-center text-sm text-gray-400 mt-4">
          {remaining.toLocaleString()} ml remaining to reach your goal
        </p>
      )}
    </motion.div>
  );
}