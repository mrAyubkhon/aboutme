import React from 'react';
import { motion } from 'framer-motion';

/**
 * Enhanced Progress Bar component with advanced animations and effects
 */
export default function EnhancedProgressBar({
  value = 0,
  max = 100,
  size = 'md',
  variant = 'default',
  showLabel = true,
  label,
  showPercentage = true,
  animated = true,
  glow = false,
  className = '',
  ...props
}) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
    xl: 'h-6'
  };

  const variantClasses = {
    default: 'bg-blue-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500',
    purple: 'bg-purple-500',
    gradient: 'bg-gradient-to-r from-blue-500 to-purple-500'
  };

  const glowClasses = glow ? 'shadow-lg shadow-current/50' : '';

  return (
    <div className={`w-full ${className}`} {...props}>
      {/* Label */}
      {showLabel && (label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className="text-sm font-medium text-gray-300">{label}</span>
          )}
          {showPercentage && (
            <span className="text-sm text-gray-400">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}

      {/* Progress Bar Container */}
      <div className={`w-full bg-gray-800 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <motion.div
          className={`h-full rounded-full ${variantClasses[variant]} ${glowClasses}`}
          initial={{ width: 0 }}
          animate={{ width: animated ? `${percentage}%` : `${percentage}%` }}
          transition={{
            duration: animated ? 1.5 : 0,
            ease: "easeOut"
          }}
          whileHover={glow ? {
            boxShadow: "0 0 20px currentColor",
            transition: { duration: 0.3 }
          } : {}}
        />
      </div>

      {/* Value Display */}
      {showLabel && (
        <div className="flex justify-between items-center mt-1 text-xs text-gray-500">
          <span>{value}</span>
          <span>{max}</span>
        </div>
      )}
    </div>
  );
}

// Circular Progress Component
export function CircularProgress({
  value = 0,
  max = 100,
  size = 120,
  strokeWidth = 8,
  variant = 'default',
  showLabel = true,
  label,
  animated = true,
  className = '',
  ...props
}) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const variantClasses = {
    default: 'text-blue-500',
    success: 'text-green-500',
    warning: 'text-yellow-500',
    danger: 'text-red-500',
    purple: 'text-purple-500'
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`} {...props}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-gray-800"
        />
        
        {/* Progress Circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          className={variantClasses[variant]}
          initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
          animate={{ strokeDasharray: circumference, strokeDashoffset: animated ? strokeDashoffset : strokeDashoffset }}
          transition={{
            duration: animated ? 1.5 : 0,
            ease: "easeOut"
          }}
        />
      </svg>

      {/* Center Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {showLabel && (
          <>
            <span className="text-2xl font-bold text-gray-50">
              {Math.round(percentage)}%
            </span>
            {label && (
              <span className="text-xs text-gray-400 mt-1">{label}</span>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Step Progress Component
export function StepProgress({
  steps = [],
  currentStep = 0,
  variant = 'default',
  className = '',
  ...props
}) {
  const variantClasses = {
    default: {
      completed: 'bg-blue-500 text-white',
      current: 'bg-blue-500/20 text-blue-400 border-blue-500',
      pending: 'bg-gray-800 text-gray-400 border-gray-600'
    },
    success: {
      completed: 'bg-green-500 text-white',
      current: 'bg-green-500/20 text-green-400 border-green-500',
      pending: 'bg-gray-800 text-gray-400 border-gray-600'
    }
  };

  const config = variantClasses[variant];

  return (
    <div className={`flex items-center justify-between ${className}`} {...props}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const isPending = index > currentStep;

        let stepClasses = 'flex items-center justify-center w-8 h-8 rounded-full border-2 font-medium text-sm transition-all duration-300';
        
        if (isCompleted) {
          stepClasses += ` ${config.completed}`;
        } else if (isCurrent) {
          stepClasses += ` ${config.current}`;
        } else {
          stepClasses += ` ${config.pending}`;
        }

        return (
          <div key={index} className="flex items-center">
            <motion.div
              className={stepClasses}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.1 }}
            >
              {isCompleted ? '✓' : index + 1}
            </motion.div>
            
            {index < steps.length - 1 && (
              <motion.div
                className={`w-12 h-0.5 mx-2 ${
                  isCompleted ? 'bg-blue-500' : 'bg-gray-600'
                }`}
                initial={{ width: 0 }}
                animate={{ width: isCompleted ? '3rem' : '3rem' }}
                transition={{ delay: index * 0.1 + 0.2 }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}