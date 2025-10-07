import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

/**
 * Enhanced scroll container with physics-based scrolling
 */
export function ScrollContainer({ children, className = '' }) {
  const [scrollY, setScrollY] = useState(0);
  const { scrollYProgress } = useScroll();
  
  // Smooth scroll physics
  const smoothScrollY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Parallax effects
  const parallaxY = useTransform(smoothScrollY, [0, 1], ['0%', '50%']);
  const fadeOut = useTransform(smoothScrollY, [0, 0.2], [1, 0]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.div
      className={className}
      style={{ y: parallaxY, opacity: fadeOut }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Scroll-triggered animations with physics
 */
export function ScrollTrigger({ children, triggerPoint = 0.1, className = '' }) {
  const { scrollYProgress } = useScroll();
  
  const scale = useTransform(scrollYProgress, [0, triggerPoint, 1], [0.8, 1, 1]);
  const opacity = useTransform(scrollYProgress, [0, triggerPoint, 1], [0, 1, 1]);
  const y = useTransform(scrollYProgress, [0, triggerPoint, 1], [50, 0, 0]);

  // Smooth spring physics
  const smoothScale = useSpring(scale, {
    stiffness: 200,
    damping: 30,
    restDelta: 0.001
  });

  const smoothOpacity = useSpring(opacity, {
    stiffness: 200,
    damping: 30,
    restDelta: 0.001
  });

  const smoothY = useSpring(y, {
    stiffness: 200,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      className={className}
      style={{
        scale: smoothScale,
        opacity: smoothOpacity,
        y: smoothY
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Momentum-based scroll indicator
 */
export function ScrollIndicator({ className = '' }) {
  const { scrollYProgress } = useScroll();
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollDirection, setScrollDirection] = useState('down');

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateScrollDirection = () => {
      const currentScrollY = window.scrollY;
      
      if (Math.abs(currentScrollY - lastScrollY) > 5) {
        setScrollDirection(currentScrollY > lastScrollY ? 'down' : 'up');
        setIsScrolling(true);
        lastScrollY = currentScrollY;
      }

      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollDirection);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    const timeout = setTimeout(() => {
      setIsScrolling(false);
    }, 150);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeout);
    };
  }, []);

  const scale = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);

  return (
    <motion.div
      className={`fixed right-4 top-1/2 -translate-y-1/2 z-40 ${className}`}
      style={{
        scale,
        rotate: isScrolling ? rotate : 0
      }}
      animate={{
        y: scrollDirection === 'down' ? 5 : -5,
        opacity: isScrolling ? 0.8 : 0.3
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 25,
        mass: 0.8
      }}
    >
      <div className="w-2 h-16 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full shadow-lg" />
    </motion.div>
  );
}

/**
 * Smooth scroll to element with physics
 */
export function SmoothScrollLink({ to, children, className = '', ...props }) {
  const handleClick = (e) => {
    e.preventDefault();
    const element = document.querySelector(to);
    
    if (element) {
      const startPosition = window.pageYOffset;
      const targetPosition = element.offsetTop - 80; // Account for navbar
      const distance = targetPosition - startPosition;
      const duration = Math.min(Math.abs(distance) / 1000, 1); // Max 1 second
      
      let startTime = null;

      const animation = (currentTime) => {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / (duration * 1000), 1);
        
        // Easing function (ease-out)
        const ease = 1 - Math.pow(1 - progress, 3);
        
        window.scrollTo(0, startPosition + distance * ease);
        
        if (progress < 1) {
          requestAnimationFrame(animation);
        }
      };

      requestAnimationFrame(animation);
    }
  };

  return (
    <motion.a
      href={to}
      onClick={handleClick}
      className={className}
      whileHover={{
        scale: 1.05,
        y: -2
      }}
      whileTap={{
        scale: 0.95,
        y: 0
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 20,
        mass: 0.8
      }}
      {...props}
    >
      {children}
    </motion.a>
  );
}

/**
 * Momentum-based scroll restoration
 */
export function ScrollRestoration({ children }) {
  useEffect(() => {
    // Save scroll position before page unload
    const saveScrollPosition = () => {
      sessionStorage.setItem('scrollPosition', window.scrollY.toString());
    };

    // Restore scroll position after page load
    const restoreScrollPosition = () => {
      const savedPosition = sessionStorage.getItem('scrollPosition');
      if (savedPosition) {
        const targetPosition = parseInt(savedPosition, 10);
        
        // Smooth scroll to saved position
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        sessionStorage.removeItem('scrollPosition');
      }
    };

    window.addEventListener('beforeunload', saveScrollPosition);
    restoreScrollPosition();

    return () => {
      window.removeEventListener('beforeunload', saveScrollPosition);
    };
  }, []);

  return children;
}

/**
 * Physics-based page transitions
 */
export function PageTransition({ children, className = '' }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 1.05 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        mass: 1,
        duration: 0.5
      }}
    >
      {children}
    </motion.div>
  );
}
