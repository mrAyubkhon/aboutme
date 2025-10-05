import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

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
        y: -1,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)"
      }}
      whileTap={disabled || loading ? {} : { 
        scale: 0.95,
        y: 0
      }}
      transition={{ 
        type: "spring",
        stiffness: 400,
        damping: 17,
        duration: 0.2
      }}
      {...props}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
      ) : null}
      {children}
    </motion.button>
  );
}
