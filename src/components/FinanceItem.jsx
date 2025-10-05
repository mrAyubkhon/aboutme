import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown, X } from 'lucide-react';
import Button from './Button';

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
        scale: 1.02,
        y: -2,
        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)"
      }}
      transition={{ 
        type: "spring",
        stiffness: 300,
        damping: 20,
        duration: 0.3
      }}
    >
      <div className="flex items-center space-x-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          isIncome 
            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
            : 'bg-red-500/20 text-red-400 border border-red-500/30'
        }`}>
          {isIncome ? <ArrowUp size={18} /> : <ArrowDown size={18} />}
        </div>
        
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
