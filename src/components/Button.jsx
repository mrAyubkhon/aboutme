import { motion } from 'framer-motion';
import { cn } from '../utils/cn';
import LoadingSpinner from './LoadingSpinner';

/**
 * Reusable Button component with variants and animations
 */
export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  loading = false,
  onClick,
  className = '',
  type = 'button',
  ...props 
}) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-950 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 shadow-sm hover:shadow-md',
    secondary: 'bg-transparent border border-gray-800 hover:border-blue-500 text-gray-300 hover:text-white focus:ring-blue-500',
    ghost: 'bg-transparent hover:bg-gray-800 text-gray-300 hover:text-white focus:ring-blue-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow-sm hover:shadow-md'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };
  
  const buttonClasses = cn(
    baseClasses,
    variants[variant],
    sizes[size],
    className
  );
  
  return (
    <motion.button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={disabled || loading ? {} : { 
        scale: 1.05,
        y: -2,
        boxShadow: "0 8px 25px rgba(0, 0, 0, 0.4)",
        rotateX: -2,
        rotateY: 1
      }}
      whileTap={disabled || loading ? {} : { 
        scale: 0.92,
        y: 1,
        rotateX: 1,
        rotateY: -0.5
      }}
      whileFocus={{ 
        scale: 1.02,
        boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.3)",
        y: -1
      }}
      transition={{ 
        type: "spring",
        stiffness: 300,
        damping: 20,
        mass: 0.8,
        duration: 0.3
      }}
      {...props}
        >
          {loading && (
            <LoadingSpinner variant="dots" size="sm" color="white" className="mr-2" />
          )}
          {children}
    </motion.button>
  );
}
