import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, Calendar, Tag, Trash2 } from 'lucide-react';
import { cn } from '../utils/cn';

export default function FinanceCard({ 
  transaction, 
  onDelete,
  className = '' 
}) {
  const { id, type, amount, category, note, date } = transaction;
  const isIncome = type === 'income';

  return (
    <motion.div
      className={cn(
        'p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 transition-all duration-200',
        isIncome ? 'border-green-200 dark:border-green-700' : 'border-red-200 dark:border-red-700',
        className
      )}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={cn(
            'w-10 h-10 rounded-full flex items-center justify-center',
            isIncome 
              ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400'
              : 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400'
          )}>
            {isIncome ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {formatCurrency(amount)}
              </span>
              <span className={cn(
                'text-xs px-2 py-1 rounded-full font-medium',
                isIncome 
                  ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                  : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
              )}>
                {isIncome ? 'Income' : 'Expense'}
              </span>
            </div>
            
            {category && (
              <div className="flex items-center space-x-1 mt-1">
                <Tag size={12} className="text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {category}
                </span>
              </div>
            )}
            
            {note && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {note}
              </p>
            )}
          </div>
        </div>

        <div className="text-right">
          <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
            <Calendar size={12} />
            <span>{formatDate(date)}</span>
          </div>
          
          {onDelete && (
            <motion.button
              onClick={() => onDelete(id)}
              className="mt-2 p-1 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Trash2 size={14} />
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function FinanceSummaryCard({ 
  title, 
  amount, 
  type = 'total',
  trend,
  className = '' 
}) {
  const isPositive = amount >= 0;
  const isIncome = type === 'income';
  const isExpense = type === 'expense';

  return (
    <motion.div
      className={cn(
        'p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700',
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </p>
          <p className={cn(
            'text-2xl font-bold',
            isIncome ? 'text-green-600 dark:text-green-400' :
            isExpense ? 'text-red-600 dark:text-red-400' :
            isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          )}>
            {formatCurrency(amount)}
          </p>
          {trend !== undefined && (
            <div className={cn(
              'inline-flex items-center text-xs font-medium mt-2 px-2 py-1 rounded-full',
              trend > 0 ? 'text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900' :
              trend < 0 ? 'text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900' :
              'text-gray-700 bg-gray-100 dark:text-gray-300 dark:bg-gray-700'
            )}>
              {trend > 0 && '↗'} {trend < 0 && '↘'} {trend === 0 && '→'} 
              {Math.abs(trend)}%
            </div>
          )}
        </div>
        
        <div className={cn(
          'w-12 h-12 rounded-xl flex items-center justify-center',
          isIncome ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400' :
          isExpense ? 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400' :
          'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400'
        )}>
          <DollarSign size={24} />
        </div>
      </div>
    </motion.div>
  );
}

export function BudgetProgressCard({ 
  spent, 
  limit, 
  className = '' 
}) {
  const progress = Math.min((spent / limit) * 100, 100);
  const remaining = limit - spent;
  const isOverLimit = spent > limit;

  return (
    <motion.div
      className={cn(
        'p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700',
        isOverLimit && 'border-red-200 dark:border-red-700',
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
            Daily Budget
          </h3>
          <span className={cn(
            'text-sm font-medium',
            isOverLimit ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'
          )}>
            {formatCurrency(spent)} / {formatCurrency(limit)}
          </span>
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
          <motion.div
            className={cn(
              'h-full rounded-full transition-all duration-500',
              isOverLimit 
                ? 'bg-gradient-to-r from-red-500 to-red-600' 
                : 'bg-gradient-to-r from-primary-500 to-primary-600'
            )}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>
      
      <div className="flex items-center justify-between text-sm">
        <span className={cn(
          isOverLimit ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'
        )}>
          {isOverLimit ? 'Over budget by' : 'Remaining'}
        </span>
        <span className={cn(
          'font-medium',
          isOverLimit ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
        )}>
          {formatCurrency(Math.abs(remaining))}
        </span>
      </div>
    </motion.div>
  );
}

// Utility functions
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
