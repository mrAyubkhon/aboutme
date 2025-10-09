import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

/**
 * Enhanced Stat Card with improved design and animations
 */
export default function EnhancedStatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend = null,
  color = 'blue',
  className = '',
  ...props
}) {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      icon: 'text-blue-400',
      value: 'text-blue-300',
      accent: 'bg-blue-500/20'
    },
    green: {
      bg: 'bg-green-500/10',
      border: 'border-green-500/20',
      icon: 'text-green-400',
      value: 'text-green-300',
      accent: 'bg-green-500/20'
    },
    purple: {
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
      icon: 'text-purple-400',
      value: 'text-purple-300',
      accent: 'bg-purple-500/20'
    },
    orange: {
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/20',
      icon: 'text-orange-400',
      value: 'text-orange-300',
      accent: 'bg-orange-500/20'
    },
    red: {
      bg: 'bg-red-500/10',
      border: 'border-red-500/20',
      icon: 'text-red-400',
      value: 'text-red-300',
      accent: 'bg-red-500/20'
    },
    gray: {
      bg: 'bg-gray-500/10',
      border: 'border-gray-500/20',
      icon: 'text-gray-400',
      value: 'text-gray-300',
      accent: 'bg-gray-500/20'
    }
  };

  const colors = colorClasses[color] || colorClasses.blue;

  const getTrendIcon = () => {
    if (trend === null) return null;
    if (trend > 0) return <TrendingUp className="w-3 h-3" />;
    if (trend < 0) return <TrendingDown className="w-3 h-3" />;
    return <Minus className="w-3 h-3" />;
  };

  const getTrendColor = () => {
    if (trend === null) return 'text-gray-400';
    if (trend > 0) return 'text-green-400';
    if (trend < 0) return 'text-red-400';
    return 'text-gray-400';
  };

  return (
    <motion.div
      className={`relative overflow-hidden rounded-2xl border backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl ${colors.bg} ${colors.border} ${className}`}
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      {...props}
    >
      {/* Gradient overlay */}
      <div className={`absolute inset-0 ${colors.accent} opacity-0 hover:opacity-100 transition-opacity duration-300`} />
      
      {/* Content */}
      <div className="relative p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl ${colors.bg} ${colors.border} border`}>
            <Icon className={`w-6 h-6 ${colors.icon}`} />
          </div>
          
          {trend !== null && (
            <div className={`flex items-center space-x-1 ${getTrendColor()}`}>
              {getTrendIcon()}
              <span className="text-sm font-medium">
                {Math.abs(trend)}%
              </span>
            </div>
          )}
        </div>

        <div className="space-y-1">
          <h3 className={`text-2xl font-bold ${colors.value}`}>
            {value}
          </h3>
          <p className="text-gray-400 text-sm font-medium">
            {title}
          </p>
          {subtitle && (
            <p className="text-gray-500 text-xs">
              {subtitle}
            </p>
          )}
        </div>

        {/* Animated border */}
        <motion.div
          className={`absolute bottom-0 left-0 h-1 ${colors.bg}`}
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />
      </div>
    </motion.div>
  );
}
