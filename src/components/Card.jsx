import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

/**
 * Base Card component with hover effects and animations
 */
export default function Card({ 
  children, 
  hoverable = false, 
  className = '', 
  onClick,
  glow = false,
  ...props 
}) {
  const cardClasses = cn(
    'card',
    hoverable && 'cursor-pointer hover:shadow-xl hover:border-blue-500/50',
    glow && 'relative overflow-hidden',
    className
  );
  
  if (onClick) {
    return (
      <motion.div
        className={cardClasses}
        onClick={onClick}
        whileHover={{ 
          y: hoverable ? -6 : 0,
          scale: hoverable ? 1.03 : 1,
          boxShadow: hoverable ? "0 15px 35px rgba(0, 0, 0, 0.4)" : "0 4px 6px rgba(0, 0, 0, 0.1)",
          rotateX: hoverable ? -1 : 0,
          rotateY: hoverable ? 1 : 0
        }}
        whileTap={{ 
          scale: 0.96,
          y: hoverable ? -2 : 0,
          rotateX: 0.5,
          rotateY: -0.5
        }}
        transition={{ 
          type: "spring",
          stiffness: 260,
          damping: 25,
          mass: 1.2,
          duration: 0.4
        }}
        {...props}
      >
        {/* Glow effect */}
        {glow && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-transparent to-blue-500/20"
            animate={{
              x: ['-100%', '100%']
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "loop",
              ease: "linear"
            }}
          />
        )}
        <div className={glow ? "relative z-10" : ""}>
          {children}
        </div>
      </motion.div>
    );
  }
  
  return (
    <div className={cardClasses} {...props}>
      {/* Glow effect for non-clickable cards */}
      {glow && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-transparent to-blue-500/20"
          animate={{
            x: ['-100%', '100%']
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear"
          }}
        />
      )}
      <div className={glow ? "relative z-10" : ""}>
        {children}
      </div>
    </div>
  );
}

/**
 * StatCard component for displaying statistics with icons
 */
export function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  color = 'primary',
  trend,
  className = '' 
}) {
  const colorClasses = {
    primary: 'text-blue-400 bg-blue-500/20 border border-blue-500/30',
    green: 'text-green-400 bg-green-500/20 border border-green-500/30',
    red: 'text-red-400 bg-red-500/20 border border-red-500/30',
    yellow: 'text-yellow-400 bg-yellow-500/20 border border-yellow-500/30'
  };

  return (
    <Card className={cn('p-6', className)} hoverable>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-300 mb-1">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-50">
            {value}
          </p>
          {subtitle && (
            <p className="text-sm text-gray-400 mt-1">
              {subtitle}
            </p>
          )}
          {trend && (
            <div className={cn(
              'inline-flex items-center text-xs font-medium mt-2 px-2 py-1 rounded-full',
              trend > 0 ? 'text-green-300 bg-green-500/20 border border-green-500/30' :
              trend < 0 ? 'text-red-300 bg-red-500/20 border border-red-500/30' :
              'text-gray-300 bg-gray-500/20 border border-gray-500/30'
            )}>
              {trend > 0 && '↗'} {trend < 0 && '↘'} {trend === 0 && '→'} 
              {Math.abs(trend)}%
            </div>
          )}
        </div>
        {Icon && (
          <div className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center',
            colorClasses[color] || colorClasses.primary
          )}>
            <Icon size={24} />
          </div>
        )}
      </div>
    </Card>
  );
}

/**
 * ActionCard component for clickable action items
 */
export function ActionCard({ 
  title, 
  description, 
  icon: Icon, 
  onClick,
  className = '' 
}) {
  return (
    <Card
      className={cn('p-6 cursor-pointer group', className)}
      hoverable
      onClick={onClick}
    >
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center group-hover:bg-blue-500/20 group-hover:border-blue-500/50 border border-transparent transition-all duration-200">
          <Icon size={24} className="text-gray-300 group-hover:text-blue-400 transition-colors duration-200" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-50 group-hover:text-blue-400 transition-colors duration-200">
            {title}
          </h3>
          <p className="text-sm text-gray-300 mt-1">
            {description}
          </p>
        </div>
      </div>
    </Card>
  );
}