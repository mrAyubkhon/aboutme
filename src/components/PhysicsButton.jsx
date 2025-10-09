import { motion } from 'framer-motion';
import { useState, useRef } from 'react';

/**
 * Physics-based button with realistic animations
 */
export default function PhysicsButton({
  children,
  onClick,
  className = '',
  variant = 'primary',
  size = 'md',
  disabled = false,
  icon: Icon,
  sound = false,
  ...props
}) {
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState([]);
  const buttonRef = useRef(null);

  // Sound effect
  const playSound = () => {
    if (!sound || disabled) return;
    
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
      console.log('Audio not supported');
    }
  };

  // Ripple effect
  const createRipple = (event) => {
    if (!buttonRef.current) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    const ripple = {
      id: Date.now(),
      x,
      y,
      size
    };
    
    setRipples(prev => [...prev, ripple]);
    
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== ripple.id));
    }, 600);
  };

  const handleClick = (event) => {
    if (disabled) return;
    
    playSound();
    createRipple(event);
    onClick?.(event);
  };

  const handleMouseDown = () => {
    if (disabled) return;
    setIsPressed(true);
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  const handleMouseLeave = () => {
    setIsPressed(false);
  };

  // Variant styles
  const getVariantStyles = () => {
    const variants = {
      primary: {
        bg: 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700',
        text: 'text-white',
        border: 'border-blue-500',
        shadow: 'shadow-lg shadow-blue-500/25'
      },
      secondary: {
        bg: 'bg-gray-800 hover:bg-gray-700 active:bg-gray-600',
        text: 'text-gray-200',
        border: 'border-gray-600',
        shadow: 'shadow-lg shadow-gray-500/25'
      },
      success: {
        bg: 'bg-green-500 hover:bg-green-600 active:bg-green-700',
        text: 'text-white',
        border: 'border-green-500',
        shadow: 'shadow-lg shadow-green-500/25'
      },
      danger: {
        bg: 'bg-red-500 hover:bg-red-600 active:bg-red-700',
        text: 'text-white',
        border: 'border-red-500',
        shadow: 'shadow-lg shadow-red-500/25'
      },
      ghost: {
        bg: 'bg-transparent hover:bg-gray-800 active:bg-gray-700',
        text: 'text-gray-300 hover:text-gray-100',
        border: 'border-gray-600 hover:border-gray-500',
        shadow: 'shadow-none'
      }
    };
    return variants[variant] || variants.primary;
  };

  // Size styles
  const getSizeStyles = () => {
    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
      xl: 'px-8 py-4 text-xl'
    };
    return sizes[size] || sizes.md;
  };

  const styles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  return (
    <motion.button
      ref={buttonRef}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      className={`
        relative overflow-hidden rounded-lg font-medium transition-all duration-150
        ${styles.bg} ${styles.text} ${styles.border} ${styles.shadow}
        ${sizeStyles}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      disabled={disabled}
      
      // Physics animations
      whileHover={!disabled ? {
        scale: 1.05,
        y: -3,
        boxShadow: "0 15px 35px rgba(0,0,0,0.3)",
        transition: {
          type: "spring",
          stiffness: 400,
          damping: 17
        }
      } : {}}
      
      whileTap={!disabled ? {
        scale: 0.95,
        y: 0,
        transition: {
          type: "spring",
          stiffness: 600,
          damping: 15
        }
      } : {}}
      
      animate={isPressed ? {
        scale: 0.98,
        transition: {
          type: "spring",
          stiffness: 400,
          damping: 25
        }
      } : {}}
      
      // Magnetic effect
      onMouseMove={(e) => {
        if (disabled) return;
        
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        const distance = Math.sqrt(x * x + y * y);
        const maxDistance = 50;
        
        if (distance < maxDistance) {
          const strength = (maxDistance - distance) / maxDistance;
          const moveX = x * strength * 0.1;
          const moveY = y * strength * 0.1;
          
          e.currentTarget.style.transform = `translate(${moveX}px, ${moveY}px)`;
        }
      }}
      
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translate(0px, 0px)';
        handleMouseLeave();
        // Call any additional onMouseLeave from props
        if (props.onMouseLeave) {
          props.onMouseLeave(e);
        }
      }}
    >
      {/* Ripple effects */}
      {ripples.map(ripple => (
        <motion.div
          key={ripple.id}
          className="absolute bg-white/30 rounded-full pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ 
            scale: 1, 
            opacity: 0,
            transition: {
              duration: 0.6,
              ease: "easeOut"
            }
          }}
        />
      ))}
      
      {/* Button content */}
      <div className="relative flex items-center justify-center space-x-2">
        {Icon && (
          <motion.div
            animate={isPressed ? { scale: 0.9 } : { scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Icon size={size === 'sm' ? 16 : size === 'lg' ? 24 : size === 'xl' ? 28 : 20} />
          </motion.div>
        )}
        
        <motion.span
          animate={isPressed ? { scale: 0.95 } : { scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          {children}
        </motion.span>
      </div>
      
      {/* Glow effect on hover */}
      <motion.div
        className="absolute inset-0 rounded-lg bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0"
        animate={{
          opacity: 0,
          x: ["-100%", "100%"]
        }}
        whileHover={{
          opacity: 1,
          x: ["-100%", "100%"],
          transition: {
            duration: 0.8,
            ease: "easeInOut"
          }
        }}
      />
    </motion.button>
  );
}

/**
 * Floating Action Button with physics
 */
export function FloatingActionButton({
  children,
  onClick,
  className = '',
  icon: Icon,
  position = 'bottom-right',
  size = 'lg'
}) {
  const getPositionStyles = () => {
    const positions = {
      'bottom-right': 'bottom-6 right-6',
      'bottom-left': 'bottom-6 left-6',
      'top-right': 'top-6 right-6',
      'top-left': 'top-6 left-6'
    };
    return positions[position] || positions['bottom-right'];
  };

  return (
    <motion.div
      className={`fixed z-50 ${getPositionStyles()}`}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20
      }}
    >
      <PhysicsButton
        onClick={onClick}
        className={`rounded-full shadow-2xl ${className}`}
        icon={Icon}
        size={size}
        variant="primary"
      >
        {children}
      </PhysicsButton>
    </motion.div>
  );
}

/**
 * Icon Button with physics
 */
export function IconButton({
  icon: Icon,
  onClick,
  className = '',
  size = 'md',
  variant = 'ghost',
  ...props
}) {
  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
    xl: 28
  };

  return (
    <PhysicsButton
      onClick={onClick}
      className={`p-2 rounded-lg ${className}`}
      variant={variant}
      size={size}
      {...props}
    >
      <Icon size={iconSizes[size]} />
    </PhysicsButton>
  );
}

/**
 * Toggle Button with physics
 */
export function ToggleButton({
  active = false,
  onClick,
  children,
  className = '',
  activeVariant = 'primary',
  inactiveVariant = 'ghost',
  ...props
}) {
  return (
    <PhysicsButton
      onClick={onClick}
      className={className}
      variant={active ? activeVariant : inactiveVariant}
      {...props}
    >
      {children}
    </PhysicsButton>
  );
}
