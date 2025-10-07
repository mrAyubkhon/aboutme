import { motion } from 'framer-motion';

/**
 * Page transition wrapper for smooth page changes
 */
export default function PageTransition({ children, className = '' }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 1.02 }}
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
