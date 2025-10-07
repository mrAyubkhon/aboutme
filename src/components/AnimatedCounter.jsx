import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

/**
 * Animated counter with smooth number transitions
 */
export default function AnimatedCounter({ 
  value, 
  duration = 1, 
  decimals = 0,
  prefix = '',
  suffix = '',
  className = '',
  ...props 
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const rounded = useTransform(springValue, (latest) => {
    return Number(latest).toFixed(decimals);
  });

  useEffect(() => {
    setIsAnimating(true);
    motionValue.set(value);
    
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, duration * 1000);

    return () => clearTimeout(timer);
  }, [value, duration, motionValue]);

  return (
    <motion.span
      className={`font-bold ${className}`}
      animate={isAnimating ? {
        scale: [1, 1.1, 1],
        color: ['#3b82f6', '#10b981', '#3b82f6']
      } : {}}
      transition={{
        duration: duration,
        ease: "easeInOut"
      }}
      {...props}
    >
      {prefix}
      <motion.span>
        {rounded}
      </motion.span>
      {suffix}
    </motion.span>
  );
}

/**
 * Animated progress circle
 */
export function AnimatedProgressCircle({ 
  progress, 
  size = 120, 
  strokeWidth = 8,
  color = '#3b82f6',
  backgroundColor = '#1f2937',
  className = '',
  showPercentage = true,
  ...props 
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={`relative ${className}`} {...props}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{
            duration: 1.5,
            ease: "easeInOut"
          }}
          strokeLinecap="round"
        />
      </svg>
      
      {/* Percentage text */}
      {showPercentage && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <AnimatedCounter
            value={progress}
            duration={1.5}
            decimals={0}
            suffix="%"
            className="text-lg font-bold text-gray-50"
          />
        </motion.div>
      )}
    </div>
  );
}

/**
 * Animated bar chart
 */
export function AnimatedBarChart({ 
  data, 
  height = 200,
  className = '',
  ...props 
}) {
  const maxValue = Math.max(...data.map(item => item.value));

  return (
    <div className={`flex items-end space-x-2 h-${height} ${className}`} {...props}>
      {data.map((item, index) => (
        <motion.div
          key={item.label}
          className="flex-1 flex flex-col items-center space-y-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: index * 0.1,
            duration: 0.5
          }}
        >
          {/* Bar */}
          <motion.div
            className="w-full bg-gradient-to-t from-blue-600 to-blue-500 rounded-t-lg relative overflow-hidden"
            initial={{ height: 0 }}
            animate={{ height: `${(item.value / maxValue) * 100}%` }}
            transition={{
              delay: index * 0.1 + 0.2,
              duration: 0.8,
              ease: "easeOut"
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
                ease: "linear",
                delay: index * 0.1 + 1
              }}
            />
          </motion.div>
          
          {/* Label */}
          <motion.span
            className="text-xs text-gray-400 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.5 }}
          >
            {item.label}
          </motion.span>
          
          {/* Value */}
          <motion.span
            className="text-xs text-gray-300 font-semibold"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 + 0.7 }}
          >
            <AnimatedCounter value={item.value} duration={0.5} />
          </motion.span>
        </motion.div>
      ))}
    </div>
  );
}

/**
 * Animated sparkline
 */
export function AnimatedSparkline({ 
  data, 
  height = 40,
  color = '#3b82f6',
  className = '',
  ...props 
}) {
  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  const range = maxValue - minValue;
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((value - minValue) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  const pathData = `M ${points}`;

  return (
    <div className={`relative ${className}`} {...props}>
      <svg width="100%" height={height} viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Background area */}
        <motion.path
          d={`${pathData} L 100,100 L 0,100 Z`}
          fill={`url(#gradient-${color.replace('#', '')})`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        />
        
        {/* Line */}
        <motion.path
          d={pathData}
          stroke={color}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: 1.5,
            ease: "easeInOut"
          }}
        />
        
        {/* Gradient definition */}
        <defs>
          <linearGradient id={`gradient-${color.replace('#', '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

/**
 * Animated stat card with enhanced effects
 */
export function AnimatedStatCard({ 
  title, 
  value, 
  change, 
  icon: Icon,
  color = 'blue',
  className = '',
  ...props 
}) {
  const colors = {
    blue: {
      bg: 'from-blue-500/20 to-blue-600/20',
      border: 'border-blue-500/30',
      text: 'text-blue-400',
      icon: 'text-blue-400'
    },
    green: {
      bg: 'from-green-500/20 to-green-600/20',
      border: 'border-green-500/30',
      text: 'text-green-400',
      icon: 'text-green-400'
    },
    red: {
      bg: 'from-red-500/20 to-red-600/20',
      border: 'border-red-500/30',
      text: 'text-red-400',
      icon: 'text-red-400'
    },
    purple: {
      bg: 'from-purple-500/20 to-purple-600/20',
      border: 'border-purple-500/30',
      text: 'text-purple-400',
      icon: 'text-purple-400'
    }
  };

  const colorScheme = colors[color] || colors.blue;

  return (
    <motion.div
      className={`bg-gray-900 rounded-2xl p-6 border border-gray-800 relative overflow-hidden ${className}`}
      whileHover={{
        scale: 1.03,
        y: -4,
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)"
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25,
        mass: 1
      }}
      {...props}
    >
      {/* Background gradient */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${colorScheme.bg}`}
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.05, 1]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-300">{title}</h3>
          {Icon && (
            <motion.div
              className={`w-10 h-10 rounded-xl flex items-center justify-center border ${colorScheme.border}`}
              whileHover={{
                scale: 1.1,
                rotateZ: 5
              }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 20
              }}
            >
              <Icon size={20} className={colorScheme.icon} />
            </motion.div>
          )}
        </div>
        
        <div className="space-y-2">
          <AnimatedCounter
            value={value}
            duration={1}
            className={`text-2xl ${colorScheme.text}`}
          />
          
          {change !== undefined && (
            <motion.div
              className={`flex items-center space-x-1 text-sm ${
                change > 0 ? 'text-green-400' : change < 0 ? 'text-red-400' : 'text-gray-400'
              }`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              <span>{change > 0 ? '↗' : change < 0 ? '↘' : '→'}</span>
              <span>{Math.abs(change)}%</span>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}



