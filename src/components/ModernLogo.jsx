import { motion } from 'framer-motion';

/**
 * Modern Logo Component with animated elements
 */
export default function ModernLogo({ 
  size = 'md', 
  animated = true, 
  showText = true,
  className = '',
  greeting = null 
}) {
  const getSizeStyles = () => {
    const sizes = {
      sm: { icon: 24, text: 'text-sm', spacing: 'space-x-2' },
      md: { icon: 32, text: 'text-lg', spacing: 'space-x-3' },
      lg: { icon: 48, text: 'text-2xl', spacing: 'space-x-4' },
      xl: { icon: 64, text: 'text-4xl', spacing: 'space-x-6' }
    };
    return sizes[size] || sizes.md;
  };

  const { icon: iconSize, text: textSize, spacing } = getSizeStyles();

  const logoVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  };

  const iconVariants = {
    initial: { opacity: 0, y: -20, rotate: -180 },
    animate: { 
      opacity: 1, 
      y: 0, 
      rotate: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const textVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.1, 1],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const glowVariants = {
    animate: {
      boxShadow: [
        "0 0 20px rgba(59, 130, 246, 0.3)",
        "0 0 30px rgba(59, 130, 246, 0.5)",
        "0 0 20px rgba(59, 130, 246, 0.3)"
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      className={`flex items-center ${spacing} ${className}`}
      variants={logoVariants}
      initial="initial"
      animate="animate"
    >
      {/* Modern Icon */}
      <motion.div
        className="relative"
        variants={iconVariants}
        whileHover={animated ? { scale: 1.1, rotate: 5 } : {}}
        transition={{ duration: 0.3 }}
      >
        {/* Main Circle */}
        <motion.div
          className="relative bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center shadow-lg"
          style={{ width: iconSize, height: iconSize }}
          variants={animated ? glowVariants : {}}
          animate={animated ? "animate" : {}}
        >
          {/* Lightning Bolt */}
          <motion.div
            className="text-white"
            style={{ fontSize: iconSize * 0.6 }}
            variants={animated ? pulseVariants : {}}
            animate={animated ? "animate" : {}}
          >
            ⚡
          </motion.div>
          
          {/* Floating Particles */}
          {animated && (
            <>
              <motion.div
                className="absolute w-2 h-2 bg-green-400 rounded-full"
                style={{ top: -4, left: -4 }}
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.7, 1, 0.7],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: 0.5,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="absolute w-1.5 h-1.5 bg-yellow-400 rounded-full"
                style={{ top: -2, right: -6 }}
                animate={{
                  y: [0, -8, 0],
                  opacity: [0.6, 1, 0.6],
                  scale: [1, 1.3, 1]
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  delay: 1,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="absolute w-1 h-1 bg-pink-400 rounded-full"
                style={{ bottom: -3, left: -2 }}
                animate={{
                  y: [0, -6, 0],
                  opacity: [0.5, 1, 0.5],
                  scale: [1, 1.4, 1]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: 1.5,
                  ease: "easeInOut"
                }}
              />
            </>
          )}
        </motion.div>
        
        {/* Glow Ring */}
        {animated && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-blue-400/30"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </motion.div>

      {/* Text */}
      {showText && (
        <motion.div
          className="flex flex-col"
          variants={textVariants}
        >
          {greeting ? (
            <>
              <motion.div
                className={`font-bold ${textSize}`}
                whileHover={animated ? { scale: 1.05 } : {}}
                transition={{ duration: 0.2 }}
              >
                <span className="text-gray-50">
                  {greeting.text}
                </span>
              </motion.div>
              <motion.div
                className="text-gray-300 font-medium"
                style={{ fontSize: iconSize * 0.4 }}
                whileHover={animated ? { scale: 1.05 } : {}}
                transition={{ duration: 0.2 }}
              >
                {greeting.subtext}
              </motion.div>
            </>
          ) : (
            <>
              <motion.div
                className={`font-bold ${textSize}`}
                whileHover={animated ? { scale: 1.05 } : {}}
                transition={{ duration: 0.2 }}
              >
                <span className="bg-gradient-to-r from-green-400 via-green-500 to-green-600 bg-clip-text text-transparent">
                  Ayubi
                </span>
                <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent ml-2">
                  aka
                </span>
              </motion.div>
              <motion.div
                className="text-gray-300 font-medium"
                style={{ fontSize: iconSize * 0.4 }}
                whileHover={animated ? { scale: 1.05 } : {}}
                transition={{ duration: 0.2 }}
              >
                System
              </motion.div>
            </>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

/**
 * Minimal Logo - just the icon
 */
export function MinimalLogo({ size = 'md', animated = true, className = '' }) {
  return (
    <ModernLogo 
      size={size} 
      animated={animated} 
      showText={false} 
      className={className} 
    />
  );
}

/**
 * Text Only Logo
 */
export function TextLogo({ size = 'md', className = '' }) {
  const getTextSize = () => {
    const sizes = {
      sm: 'text-sm',
      md: 'text-lg', 
      lg: 'text-2xl',
      xl: 'text-4xl'
    };
    return sizes[size] || sizes.md;
  };

  return (
    <motion.div
      className={`flex flex-col ${className}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className={`font-bold ${getTextSize()}`}>
        <span className="bg-gradient-to-r from-green-400 via-green-500 to-green-600 bg-clip-text text-transparent">
          Ayubi
        </span>
        <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent ml-2">
          aka
        </span>
      </div>
      <div className={`text-gray-300 font-medium ${getTextSize()}`}>
        System
      </div>
    </motion.div>
  );
}
