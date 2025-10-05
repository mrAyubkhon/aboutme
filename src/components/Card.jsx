import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" }
  },
  hover: { 
    y: -2,
    transition: { duration: 0.2 }
  }
};

export default function Card({ 
  children, 
  className = '', 
  hoverable = false, 
  onClick,
  ...props 
}) {
  const Component = motion.div;
  
  return (
    <Component
      className={cn(
        'card',
        hoverable && 'cursor-pointer hover:shadow-xl hover:border-primary-500/50',
        className
      )}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={hoverable ? "hover" : undefined}
      onClick={onClick}
      {...props}
    >
      {children}
    </Component>
  );
}

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
    primary: 'text-primary-400 bg-primary-500/20 border border-primary-500/30',
    green: 'text-green-400 bg-green-500/20 border border-green-500/30',
    red: 'text-red-400 bg-red-500/20 border border-red-500/30',
    blue: 'text-blue-400 bg-blue-500/20 border border-blue-500/30',
    yellow: 'text-yellow-400 bg-yellow-500/20 border border-yellow-500/30',
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
        <div className="w-12 h-12 bg-dark-border rounded-xl flex items-center justify-center group-hover:bg-primary-500/20 group-hover:border-primary-500/50 border border-transparent transition-all duration-200">
          <Icon size={24} className="text-gray-300 group-hover:text-primary-400 transition-colors duration-200" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-50 group-hover:text-primary-400 transition-colors duration-200">
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
