import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

export default function ProgressBar({ 
  progress, 
  className = '', 
  showPercentage = false,
  animated = true,
  color = 'primary',
  size = 'md'
}) {
  const colorClasses = {
    primary: 'from-primary-500 to-primary-600',
    green: 'from-green-500 to-green-600',
    red: 'from-red-500 to-red-600',
    blue: 'from-blue-500 to-blue-600',
    yellow: 'from-yellow-500 to-yellow-600',
  };

  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
    xl: 'h-4',
  };

  const progressValue = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={cn('w-full', className)}>
      <div className={cn(
        'progress-bar',
        sizeClasses[size]
      )}>
        <motion.div
          className={cn(
            'progress-fill bg-gradient-to-r',
            colorClasses[color] || colorClasses.primary
          )}
          initial={{ width: 0 }}
          animate={{ width: animated ? `${progressValue}%` : `${progressValue}%` }}
          transition={{ 
            duration: animated ? 0.8 : 0,
            ease: "easeOut"
          }}
        />
      </div>
      {showPercentage && (
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Progress
          </span>
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {Math.round(progressValue)}%
          </span>
        </div>
      )}
    </div>
  );
}

export function CircularProgress({ 
  progress, 
  size = 120, 
  strokeWidth = 8,
  color = 'primary',
  className = '',
  showPercentage = true,
  children
}) {
  const colorClasses = {
    primary: 'stroke-primary-500',
    green: 'stroke-green-500',
    red: 'stroke-red-500',
    blue: 'stroke-blue-500',
    yellow: 'stroke-yellow-500',
  };

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-gray-200 dark:text-gray-700"
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={cn(colorClasses[color] || colorClasses.primary)}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </svg>
      {children || (
        <div className="absolute inset-0 flex items-center justify-center">
          {showPercentage && (
            <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {Math.round(progress)}%
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export function WaterWaveProgress({ progress, className = '' }) {
  const waveHeight = 20;
  const waveLength = 100;
  const amplitude = 10;

  return (
    <div className={cn('relative overflow-hidden rounded-2xl bg-gradient-to-b from-blue-400 to-blue-600', className)}>
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-blue-500/30 to-transparent"
        style={{
          clipPath: `polygon(0 0, 100% 0, 100% ${100 - progress}%, 0 ${100 - progress}%)`
        }}
        initial={{ clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%)` }}
        animate={{
          clipPath: `polygon(0 0, 100% 0, 100% ${100 - progress}%, 0 ${100 - progress}%)`
        }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
      
      {/* Animated wave effect */}
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 20'%3E%3Cpath d='M0,10 Q25,0 50,10 T100,10 L100,20 L0,20 Z' fill='white'/%3E%3C/svg%3E") repeat-x`,
          backgroundSize: '100px 20px',
          transform: 'translateY(100%)'
        }}
        animate={{
          transform: `translateY(${100 - progress}%)`,
          x: [0, -100, 0]
        }}
        transition={{
          transform: { duration: 1, ease: "easeOut" },
          x: { duration: 3, repeat: Infinity, ease: "linear" }
        }}
      />
    </div>
  );
}
