import { motion } from 'framer-motion';

/**
 * Progress bar component with smooth animations
 */
export default function ProgressBar({ 
  progress = 0, 
  label = '', 
  showPercentage = true,
  className = '',
  size = 'md',
  showParticles = false
}) {
  const clampedProgress = Math.max(0, Math.min(100, progress));
  const isComplete = clampedProgress >= 100;
  
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
            <motion.span 
              key={Math.round(clampedProgress)}
              initial={{ scale: 1.2, color: '#3b82f6' }}
              animate={{ scale: 1, color: isComplete ? '#10b981' : '#9ca3af' }}
              transition={{ duration: 0.3 }}
              className="text-sm font-medium"
            >
              {Math.round(clampedProgress)}%
            </motion.span>
          )}
        </div>
      )}
      
      <div className={`w-full bg-gray-800 rounded-full overflow-hidden ${sizes[size]} relative`}>
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full relative"
          initial={{ width: 0, scaleX: 0 }}
          animate={{ 
            width: `${clampedProgress}%`,
            scaleX: 1
          }}
          transition={{ 
            type: "spring",
            stiffness: 200,
            damping: 25,
            mass: 1.5,
            duration: 1.5,
            delay: 0.1
          }}
        >
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{
              x: ['-100%', '100%']
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "loop",
              ease: "linear"
            }}
          />
          
          {/* Completion particles */}
          {isComplete && showParticles && (
            <>
              <motion.div
                className="absolute -top-1 left-1/4 w-1 h-1 bg-yellow-400 rounded-full"
                animate={{
                  y: [-2, -8, -2],
                  opacity: [1, 0, 1]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: 0
                }}
              />
              <motion.div
                className="absolute -top-1 right-1/4 w-1 h-1 bg-green-400 rounded-full"
                animate={{
                  y: [-2, -6, -2],
                  opacity: [1, 0, 1]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: 0.3
                }}
              />
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}