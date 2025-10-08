import React from 'react';
import { motion } from 'framer-motion';

/**
 * Enhanced Card component with advanced animations and effects
 */
export default function EnhancedCard({
  children,
  className = '',
  hover = true,
  glow = false,
  gradient = false,
  border = true,
  padding = 'default',
  ...props
}) {
  const baseClasses = "rounded-xl transition-all duration-300";
  
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  };

  const cardClasses = `
    ${baseClasses}
    ${paddingClasses[padding]}
    ${border ? 'border border-gray-800' : ''}
    ${glow ? 'shadow-lg hover:shadow-xl' : 'shadow-sm hover:shadow-md'}
    ${gradient ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gray-900'}
    ${hover ? 'hover:border-gray-700' : ''}
    ${className}
  `;

  return (
    <motion.div
      className={cardClasses}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? {
        y: -2,
        transition: { duration: 0.2 }
      } : {}}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Enhanced Stat Card
export function EnhancedStatCard({
  title,
  value,
  change,
  icon,
  color = 'blue',
  trend = 'neutral',
  className = '',
  ...props
}) {
  const colorClasses = {
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    green: 'text-green-400 bg-green-500/10 border-green-500/20',
    red: 'text-red-400 bg-red-500/10 border-red-500/20',
    yellow: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
    purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20'
  };

  const trendIcons = {
    up: '↗️',
    down: '↘️',
    neutral: '→'
  };

  return (
    <EnhancedCard
      className={`${colorClasses[color]} ${className}`}
      hover={true}
      glow={true}
      {...props}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium opacity-80 mb-1">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          {change && (
            <div className="flex items-center space-x-1 mt-2">
              <span className={`text-xs ${trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-gray-400'}`}>
                {trendIcons[trend]} {change}
              </span>
            </div>
          )}
        </div>
        {icon && (
          <motion.div
            className="opacity-60"
            whileHover={{ scale: 1.1, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {icon}
          </motion.div>
        )}
      </div>
    </EnhancedCard>
  );
}

// Enhanced Action Card
export function EnhancedActionCard({
  title,
  description,
  icon,
  onClick,
  variant = 'primary',
  disabled = false,
  className = '',
  ...props
}) {
  const variantClasses = {
    primary: 'hover:border-blue-500/50 hover:bg-blue-500/5',
    secondary: 'hover:border-gray-600 hover:bg-gray-800/50',
    success: 'hover:border-green-500/50 hover:bg-green-500/5',
    danger: 'hover:border-red-500/50 hover:bg-red-500/5'
  };

  return (
    <motion.button
      className={`
        w-full text-left rounded-xl p-6 border border-gray-800 
        bg-gray-900 transition-all duration-300 focus:outline-none 
        focus:ring-2 focus:ring-blue-500/50
        ${variantClasses[variant]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : {
        y: -2,
        transition: { duration: 0.2 }
      }}
      whileTap={disabled ? {} : {
        scale: 0.98,
        transition: { duration: 0.1 }
      }}
      {...props}
    >
      <div className="flex items-center space-x-4">
        {icon && (
          <motion.div
            className="flex-shrink-0"
            whileHover={{ rotate: 5 }}
            transition={{ duration: 0.2 }}
          >
            {icon}
          </motion.div>
        )}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-50 mb-1">{title}</h3>
          <p className="text-gray-400 text-sm">{description}</p>
        </div>
      </div>
    </motion.button>
  );
}
