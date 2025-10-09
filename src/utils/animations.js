/**
 * Enhanced animation presets and utilities
 */

// Stagger animations
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

// Page transitions
export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: {
      duration: 0.3,
      ease: [0.55, 0.06, 0.68, 0.19]
    }
  }
};

// Modal animations
export const modalAnimation = {
  backdrop: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },
  modal: {
    initial: { 
      opacity: 0, 
      scale: 0.9, 
      y: -20 
    },
    animate: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.9, 
      y: -20,
      transition: {
        duration: 0.2
      }
    }
  }
};

// Card hover animations
export const cardHover = {
  initial: { scale: 1 },
  hover: { 
    scale: 1.02,
    y: -4,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 300
    }
  }
};

// Button animations
export const buttonTap = {
  tap: { scale: 0.95 }
};

// Loading animations
export const loadingPulse = {
  animate: {
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Progress animations
export const progressAnimation = {
  initial: { width: 0 },
  animate: { 
    width: "100%",
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

// Text reveal animation
export const textReveal = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

// Icon animations
export const iconBounce = {
  initial: { scale: 1 },
  hover: {
    scale: 1.1,
    transition: {
      type: "spring",
      damping: 10,
      stiffness: 400
    }
  },
  tap: { scale: 0.9 }
};

// Floating animation
export const floating = {
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Glow effect
export const glowEffect = {
  initial: { boxShadow: "0 0 0 0 rgba(59, 130, 246, 0)" },
  animate: {
    boxShadow: [
      "0 0 0 0 rgba(59, 130, 246, 0)",
      "0 0 20px 5px rgba(59, 130, 246, 0.3)",
      "0 0 0 0 rgba(59, 130, 246, 0)"
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Utility function to create custom spring animations
export const createSpringAnimation = (stiffness = 300, damping = 30) => ({
  type: "spring",
  stiffness,
  damping
});

// Utility function to create custom easing
export const createEasing = (ease = [0.25, 0.46, 0.45, 0.94]) => ({
  duration: 0.6,
  ease
});
