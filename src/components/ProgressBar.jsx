import { motion } from 'framer-motion';

/**
 * Progress bar component with smooth animations
 */
export default function ProgressBar({ 
  progress = 0, 
  label = '', 
  showPercentage = true,
  className = '',
  size = 'md'
}) {
  const clampedProgress = Math.max(0, Math.min(100, progress));
  
  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };
  
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-300">{label}</span>
          {showPercentage && (
            <span className="text-sm text-gray-400">{Math.round(clampedProgress)}%</span>
          )}
        </div>
      )}
      
      <div className={`w-full bg-gray-800 rounded-full overflow-hidden ${sizes[size]}`}>
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${clampedProgress}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}