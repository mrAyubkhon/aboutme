import React, { memo } from 'react';
import { motion } from 'framer-motion';

/**
 * Optimized Card component with memoization for better performance
 */
const OptimizedCard = memo(({ 
  children, 
  className = '', 
  hover = true,
  glow = false,
  ...props 
}) => {
  const baseClasses = "bg-gray-900 rounded-2xl border border-gray-800 transition-all duration-300";
  const hoverClasses = hover ? "hover:border-blue-500/50 hover:shadow-blue-500/25 hover:shadow-lg" : "";
  const glowClasses = glow ? "hover:shadow-2xl" : "";
  
  return (
    <motion.div
      className={`${baseClasses} ${hoverClasses} ${glowClasses} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { 
        scale: 1.02,
        transition: { duration: 0.2 }
      } : {}}
      {...props}
    >
      {children}
    </motion.div>
  );
});

OptimizedCard.displayName = 'OptimizedCard';

export default OptimizedCard;
