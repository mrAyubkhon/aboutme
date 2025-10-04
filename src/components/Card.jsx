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
        hoverable && 'cursor-pointer hover:shadow-md dark:hover:shadow-xl',
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
    primary: 'text-primary-500 bg-primary-100 dark:bg-primary-900',
    green: 'text-green-500 bg-green-100 dark:bg-green-900',
    red: 'text-red-500 bg-red-100 dark:bg-red-900',
    blue: 'text-blue-500 bg-blue-100 dark:bg-blue-900',
    yellow: 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900',
  };

  return (
    <Card className={cn('p-6', className)} hoverable>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {value}
          </p>
          {subtitle && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {subtitle}
            </p>
          )}
          {trend && (
            <div className={cn(
              'inline-flex items-center text-xs font-medium mt-2 px-2 py-1 rounded-full',
              trend > 0 ? 'text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900' :
              trend < 0 ? 'text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900' :
              'text-gray-700 bg-gray-100 dark:text-gray-300 dark:bg-gray-700'
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
        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center group-hover:bg-primary-100 dark:group-hover:bg-primary-900 transition-colors duration-200">
          <Icon size={24} className="text-gray-600 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors duration-200">
            {title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {description}
          </p>
        </div>
      </div>
    </Card>
  );
}
