import { motion } from 'framer-motion';
import { Zap, Target, TrendingUp } from 'lucide-react';

/**
 * Animated logo component for Ayubi aka System
 */
export default function Logo({ size = 'md', animated = true, className = '' }) {
  const sizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl'
  };

  const iconSizes = {
    sm: 16,
    md: 24,
    lg: 32,
    xl: 40
  };

  const LogoIcon = () => (
    <motion.div 
      className="relative"
      animate={animated ? {
        rotate: [0, 8, -8, 0],
        scale: [1, 1.05, 1],
      } : {}}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 15,
        mass: 1,
        duration: 3,
        repeat: Infinity,
        repeatType: "reverse"
      }}
    >
      {/* Main circle */}
      <motion.div
        className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center shadow-lg"
        animate={animated ? {
          boxShadow: [
            "0 0 0 0 rgba(59, 130, 246, 0.4)",
            "0 0 0 12px rgba(59, 130, 246, 0.1)",
            "0 0 0 0 rgba(59, 130, 246, 0.4)"
          ],
          scale: [1, 1.1, 1]
        } : {}}
        transition={{
          type: "spring",
          stiffness: 80,
          damping: 20,
          mass: 1.5,
          duration: 2.5,
          repeat: Infinity
        }}
      >
        {/* Inner icon */}
        <motion.div
          animate={animated ? {
            scale: [1, 1.1, 1],
          } : {}}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <Zap size={iconSizes[size]} className="text-white" />
        </motion.div>
      </motion.div>
      
      {/* Floating particles */}
      {animated && (
        <>
          <motion.div
            className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full"
            animate={{
              y: [0, -4, 0],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: 0.5
            }}
          />
          <motion.div
            className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-yellow-400 rounded-full"
            animate={{
              y: [0, 4, 0],
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              delay: 1
            }}
          />
        </>
      )}
    </motion.div>
  );

  return (
    <motion.div 
      className={`flex items-center space-x-3 ${className}`}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <LogoIcon />
      <div>
        <motion.h1 
          className={`font-bold ${sizes[size]}`}
          animate={animated ? {
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
          } : {}}
          style={{
            background: "linear-gradient(90deg, #3b82f6, #10b981, #f59e0b, #3b82f6)",
            backgroundSize: "200% 100%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          Ayubi aka
        </motion.h1>
        <motion.p 
          className="text-xs text-gray-400 font-medium"
          animate={animated ? {
            opacity: [0.6, 1, 0.6]
          } : {}}
          transition={{
            duration: 2,
            repeat: Infinity
          }}
        >
          System
        </motion.p>
      </div>
    </motion.div>
  );
}

/**
 * Simple logo variant without animations
 */
export function SimpleLogo({ size = 'md', className = '' }) {
  const sizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl'
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center shadow-lg">
        <Zap size={24} className="text-white" />
      </div>
      <div>
        <h1 className={`font-bold ${sizes[size]} bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent`}>
          Ayubi aka
        </h1>
        <p className="text-xs text-gray-400 font-medium">System</p>
      </div>
    </div>
  );
}
