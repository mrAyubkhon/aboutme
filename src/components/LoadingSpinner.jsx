import { motion } from 'framer-motion';

/**
 * Enhanced loading spinner with multiple variants
 */
export default function LoadingSpinner({ 
  size = 'md', 
  variant = 'dots', 
  color = 'blue',
  className = '' 
}) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colors = {
    blue: 'text-blue-500',
    green: 'text-green-500',
    red: 'text-red-500',
    yellow: 'text-yellow-500',
    purple: 'text-purple-500',
    white: 'text-white'
  };

  // Classic spinning circle
  if (variant === 'spinner') {
    return (
      <motion.div
        className={`${sizes[size]} ${colors[color]} ${className}`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="60 60"
            strokeDashoffset="60"
          >
            <motion.circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="60 60"
              animate={{ strokeDashoffset: [60, 0] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </circle>
        </svg>
      </motion.div>
    );
  }

  // Bouncing dots
  if (variant === 'dots') {
    return (
      <div className={`flex space-x-1 ${className}`}>
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className={`w-2 h-2 rounded-full ${colors[color]} relative`}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.6, 1, 0.6],
              y: [0, -8, 0]
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
              mass: 0.8,
              duration: 0.8,
              repeat: Infinity,
              delay: index * 0.15,
              ease: "easeInOut"
            }}
          >
            {/* Glow effect */}
            <motion.div
              className={`absolute inset-0 rounded-full ${colors[color]}`}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.8, 0.3]
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: index * 0.15
              }}
            />
          </motion.div>
        ))}
      </div>
    );
  }

  // Pulsing circle
  if (variant === 'pulse') {
    return (
      <motion.div
        className={`${sizes[size]} rounded-full border-2 ${colors[color]} ${className}`}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    );
  }

  // Wave animation
  if (variant === 'wave') {
    return (
      <div className={`flex space-x-1 ${className}`}>
        {[0, 1, 2, 3, 4].map((index) => (
          <motion.div
            key={index}
            className={`w-1 bg-current ${colors[color]}`}
            style={{ height: '16px' }}
            animate={{
              scaleY: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: index * 0.1,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    );
  }

  // Orbit animation
  if (variant === 'orbit') {
    return (
      <div className={`relative ${sizes[size]} ${className}`}>
        <motion.div
          className={`absolute inset-0 rounded-full border-2 border-transparent border-t-current ${colors[color]}`}
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className={`absolute inset-2 rounded-full border-2 border-transparent border-b-current ${colors[color]}`}
          animate={{ rotate: -360 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>
    );
  }

  return null;
}

/**
 * Loading overlay for full-screen loading
 */
export function LoadingOverlay({ 
  message = 'Loading...', 
  variant = 'spinner',
  className = '' 
}) {
  return (
    <motion.div
      className={`fixed inset-0 bg-gray-950/80 backdrop-blur-sm flex items-center justify-center z-50 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col items-center space-y-4">
        <LoadingSpinner variant={variant} size="lg" color="blue" />
        <motion.p
          className="text-gray-300 font-medium"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {message}
        </motion.p>
      </div>
    </motion.div>
  );
}

/**
 * Inline loading component for buttons and small areas
 */
export function InlineLoading({ size = 'sm', className = '' }) {
  return (
    <div className={`inline-flex items-center space-x-2 ${className}`}>
      <LoadingSpinner variant="dots" size={size} color="white" />
      <span className="text-sm text-gray-300">Loading...</span>
    </div>
  );
}
