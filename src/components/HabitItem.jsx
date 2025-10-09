import { motion } from 'framer-motion';
import { Check, X, Flame, Target } from 'lucide-react';
import PhysicsButton from './PhysicsButton';

/**
 * Habit item component with completion toggle
 */
export default function HabitItem({ 
  habit, 
  onToggle, 
  onDelete,
  className = '' 
}) {
  const playHabitSound = (type = 'complete') => {
    // Sound disabled
    return;
  };

  const handleToggle = () => {
    onToggle(habit.id);
    if (!habit.completed) {
      playHabitSound('complete');
    }
  };
  
  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(habit.id);
    playHabitSound('delete');
  };
  
  return (
    <motion.div
      className={`flex items-center justify-between p-4 bg-gray-900 rounded-xl border border-gray-800 hover:border-blue-500/50 transition-all duration-300 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        scale: 1.03,
        y: -3,
        boxShadow: "0 12px 28px rgba(0, 0, 0, 0.3)",
        rotateX: -0.5,
        rotateY: 0.5
      }}
      transition={{ 
        type: "spring",
        stiffness: 280,
        damping: 22,
        mass: 1.1,
        duration: 0.35
      }}
    >
      <div className="flex items-center space-x-4">
        <motion.button
          onClick={handleToggle}
          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
            habit.completed
              ? 'bg-blue-500 border-blue-500 text-white'
              : 'border-gray-600 hover:border-blue-500'
          }`}
          whileHover={{ 
            scale: 1.15,
            rotateZ: 5,
            boxShadow: "0 4px 12px rgba(59, 130, 246, 0.4)"
          }}
          whileTap={{ 
            scale: 0.85,
            rotateZ: -2,
            boxShadow: "0 2px 6px rgba(59, 130, 246, 0.6)"
          }}
          animate={habit.completed ? {
            scale: [1, 1.3, 1.1, 1],
            backgroundColor: ["#3b82f6", "#10b981", "#3b82f6"],
            rotateZ: [0, 10, -5, 0],
            boxShadow: [
              "0 0 0 rgba(59, 130, 246, 0)",
              "0 0 20px rgba(16, 185, 129, 0.6)",
              "0 0 0 rgba(59, 130, 246, 0)"
            ]
          } : {}}
          transition={{ 
            type: "spring",
            stiffness: 400,
            damping: 15,
            mass: 0.8,
            duration: 0.4
          }}
        >
          {habit.completed && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                type: "spring",
                stiffness: 300,
                damping: 15,
                duration: 0.5
              }}
            >
              <Check size={16} />
            </motion.div>
          )}
        </motion.button>

        {/* Habit Icon */}
        <div className="text-2xl">
          {habit.icon || '🎯'}
        </div>
        
        <div className="flex-1">
          <motion.div 
            className={`font-semibold transition-all duration-300 ${
              habit.completed
                ? 'text-gray-400 line-through'
                : 'text-gray-50'
            }`}
            animate={habit.completed ? {
              opacity: [1, 0.6, 1],
              scale: [1, 0.98, 1]
            } : {}}
            transition={{ duration: 0.5 }}
          >
            {habit.name}
          </motion.div>
          
          {habit.description && (
            <div className="text-sm text-gray-400 mt-1">
              {habit.description}
            </div>
          )}

          <div className="flex items-center space-x-3 mt-2">
            {habit.category && (
              <span className="text-xs px-2 py-1 bg-gray-700 rounded-full text-gray-300">
                {habit.category}
              </span>
            )}
            
            {habit.streak > 0 && (
              <div className="flex items-center space-x-1 text-orange-400">
                <Flame size={12} />
                <span className="text-xs">{habit.streak} day streak</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <PhysicsButton
        onClick={handleDelete}
        icon={X}
        variant="ghost"
        size="sm"
        className="text-gray-500 hover:text-red-400"
      />
    </motion.div>
  );
}