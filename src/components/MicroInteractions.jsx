import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

/**
 * Ripple effect for buttons and interactive elements
 */
export function RippleButton({ children, onClick, className = '', ...props }) {
  const [ripples, setRipples] = useState([]);
  const buttonRef = useRef(null);

  const addRipple = (e) => {
    const rect = buttonRef.current.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    const newRipple = {
      x,
      y,
      size,
      id: Date.now()
    };

    setRipples(prev => [...prev, newRipple]);

    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);
  };

  const handleClick = (e) => {
    addRipple(e);
    onClick?.(e);
  };

  return (
    <motion.button
      ref={buttonRef}
      onClick={handleClick}
      className={`relative overflow-hidden ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 20,
        mass: 0.8
      }}
      {...props}
    >
      {children}
      
      {ripples.map(ripple => (
        <motion.span
          key={ripple.id}
          className="absolute bg-white/30 rounded-full pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{
            duration: 0.6,
            ease: "easeOut"
          }}
        />
      ))}
    </motion.button>
  );
}

/**
 * Magnetic hover effect for elements
 */
export function MagneticElement({ children, strength = 0.3, className = '' }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const elementRef = useRef(null);

  const handleMouseMove = (e) => {
    const rect = elementRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;
    
    setPosition({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={elementRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        x: position.x,
        y: position.y
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        mass: 0.8
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Staggered animation container
 */
export function StaggerContainer({ children, staggerDelay = 0.1, className = '' }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay
          }
        }
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Staggered animation item
 */
export function StaggerItem({ children, className = '' }) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 20, scale: 0.9 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            type: "spring",
            stiffness: 300,
            damping: 25,
            mass: 1
          }
        }
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Floating animation for decorative elements
 */
export function FloatingElement({ 
  children, 
  intensity = 10, 
  duration = 3, 
  className = '' 
}) {
  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -intensity, 0, intensity, 0],
        rotate: [0, 2, 0, -2, 0]
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Tilt effect for cards and interactive elements
 */
export function TiltElement({ children, intensity = 15, className = '' }) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = (e.clientX - centerX) / rect.width;
    const deltaY = (e.clientY - centerY) / rect.height;
    
    setRotateX(deltaY * intensity);
    setRotateY(deltaX * -intensity);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX,
        rotateY
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        mass: 0.8
      }}
      style={{
        transformStyle: "preserve-3d"
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Particle system for celebrations
 */
export function ParticleSystem({ trigger, particleCount = 20, className = '' }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (trigger) {
      const newParticles = Array.from({ length: particleCount }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        vx: (Math.random() - 0.5) * 200,
        vy: (Math.random() - 0.5) * 200,
        color: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'][Math.floor(Math.random() * 4)],
        size: Math.random() * 4 + 2
      }));

      setParticles(newParticles);

      setTimeout(() => {
        setParticles([]);
      }, 2000);
    }
  }, [trigger, particleCount]);

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            backgroundColor: particle.color,
            width: particle.size,
            height: particle.size
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{
            x: particle.vx,
            y: particle.vy,
            scale: [0, 1, 0],
            opacity: [1, 1, 0]
          }}
          transition={{
            duration: 2,
            ease: "easeOut"
          }}
        />
      ))}
    </div>
  );
}

/**
 * Morphing button with shape transitions
 */
export function MorphingButton({ 
  children, 
  onClick, 
  className = '', 
  morphShape = 'circle',
  ...props 
}) {
  const [isPressed, setIsPressed] = useState(false);

  const shapes = {
    circle: 'rounded-full',
    square: 'rounded-lg',
    pill: 'rounded-full px-8'
  };

  return (
    <motion.button
      onClick={onClick}
      className={`relative ${className}`}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      whileHover={{
        scale: 1.05,
        rotateZ: 2
      }}
      whileTap={{
        scale: 0.95,
        rotateZ: -2
      }}
      animate={{
        borderRadius: isPressed ? '50%' : '0.5rem'
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 20,
        mass: 0.8
      }}
      {...props}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-inherit"
        animate={{
          opacity: isPressed ? 1 : 0,
          scale: isPressed ? 1.2 : 0.8
        }}
        transition={{
          duration: 0.2
        }}
      />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}

/**
 * Elastic input with bounce effects
 */
export function ElasticInput({ 
  value, 
  onChange, 
  placeholder, 
  className = '',
  ...props 
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div
      className={`relative ${className}`}
      whileFocus={{ scale: 1.02 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 25,
        mass: 0.8
      }}
    >
      <motion.input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="w-full px-4 py-3 bg-gray-900 border-2 border-gray-700 rounded-xl text-gray-50 placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors duration-200"
        animate={{
          borderColor: isFocused ? '#3b82f6' : '#374151',
          boxShadow: isFocused ? '0 0 0 3px rgba(59, 130, 246, 0.1)' : '0 0 0 0px'
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 25,
          mass: 0.8
        }}
        {...props}
      />
      
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded-xl pointer-events-none"
        animate={{
          opacity: isFocused ? 1 : 0,
          scale: isFocused ? 1.05 : 0.95
        }}
        transition={{
          duration: 0.2
        }}
      />
    </motion.div>
  );
}
