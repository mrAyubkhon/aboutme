import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown, X } from 'lucide-react';
import PhysicsButton from './PhysicsButton';

/**
 * Finance entry component for displaying income/expense items
 */
export default function FinanceItem({ 
  entry, 
  onDelete,
  className = '' 
}) {
  const isIncome = entry.type === 'income';
  const amount = entry.amount;
  const formattedAmount = amount.toLocaleString();
  
  const handleDelete = () => {
    onDelete(entry.id);
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
      <div className="flex items-center space-x-3">
        <motion.div 
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isIncome 
              ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
              : 'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}
          whileHover={{
            scale: 1.1,
            rotateZ: 5,
            boxShadow: isIncome 
              ? "0 4px 12px rgba(34, 197, 94, 0.4)" 
              : "0 4px 12px rgba(239, 68, 68, 0.4)"
          }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 20,
            mass: 0.8
          }}
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotateZ: isIncome ? [0, 5, 0] : [0, -5, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {isIncome ? <ArrowUp size={18} /> : <ArrowDown size={18} />}
          </motion.div>
        </motion.div>
        
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <span className={`font-semibold ${
              isIncome ? 'text-green-400' : 'text-red-400'
            }`}>
              {isIncome ? '+' : '-'}{formattedAmount} UZS
            </span>
            <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded-full">
              {entry.category}
            </span>
          </div>
          {entry.note && (
            <p className="text-sm text-gray-300 mt-1">{entry.note}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            {new Date(entry.date).toLocaleDateString()}
          </p>
        </div>
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
