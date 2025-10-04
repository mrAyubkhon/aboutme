import { motion } from 'framer-motion';
import { Check, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../utils/cn';

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.3 }
  },
  exit: { 
    opacity: 0, 
    x: 20,
    transition: { duration: 0.2 }
  }
};

export default function HabitItem({ 
  habit, 
  onToggle, 
  onDelete,
  className = ''
}) {
  const { id, name, completed } = habit;

  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
      className={cn(
        'flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 transition-all duration-200',
        completed && 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700',
        className
      )}
    >
      <div className="flex items-center space-x-3">
        <motion.button
          onClick={() => onToggle(id)}
          className={cn(
            'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200',
            completed
              ? 'bg-green-500 border-green-500 text-white'
              : 'border-gray-300 dark:border-gray-600 hover:border-green-400 dark:hover:border-green-500'
          )}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {completed && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <Check size={14} />
            </motion.div>
          )}
        </motion.button>
        
        <span className={cn(
          'font-medium transition-all duration-200',
          completed 
            ? 'text-green-700 dark:text-green-300 line-through' 
            : 'text-gray-900 dark:text-gray-100'
        )}>
          {name}
        </span>
      </div>

      <motion.button
        onClick={() => onDelete(id)}
        className="p-1 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Trash2 size={16} />
      </motion.button>
    </motion.div>
  );
}

export function HabitForm({ onSubmit, onCancel, className = '' }) {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
      setName('');
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className={cn('p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700', className)}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center space-x-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter habit name..."
          className="flex-1 input text-sm"
          autoFocus
        />
        <motion.button
          type="submit"
          className="btn-primary text-sm px-3 py-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Add
        </motion.button>
        <motion.button
          type="button"
          onClick={onCancel}
          className="btn-secondary text-sm px-3 py-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Cancel
        </motion.button>
      </div>
    </motion.form>
  );
}
