import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import Button from './Button';

/**
 * Habit item component with completion toggle
 */
export default function HabitItem({ 
  habit, 
  onToggle, 
  onDelete,
  className = '' 
}) {
  const handleToggle = () => {
    onToggle(habit.id);
  };
  
  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(habit.id);
  };
  
  return (
    <motion.div
      className={`flex items-center justify-between p-4 bg-gray-900 rounded-xl border border-gray-800 hover:border-blue-500/50 transition-all duration-200 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center space-x-3">
        <button
          onClick={handleToggle}
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
            habit.completed
              ? 'bg-blue-500 border-blue-500 text-white'
              : 'border-gray-600 hover:border-blue-500'
          }`}
        >
          {habit.completed && <Check size={14} />}
        </button>
        
        <span className={`font-medium transition-all duration-200 ${
          habit.completed
            ? 'text-gray-400 line-through'
            : 'text-gray-50'
        }`}>
          {habit.name}
        </span>
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDelete}
        className="text-gray-500 hover:text-red-400"
      >
        <X size={16} />
      </Button>
    </motion.div>
  );
}