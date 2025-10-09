import { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';

/**
 * Lazy wrapper component for code splitting
 */
export default function LazyWrapper({ 
  component: Component, 
  fallback = null,
  ...props 
}) {
  const LoadingFallback = () => (
    <motion.div
      className="flex items-center justify-center p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex items-center space-x-2">
        <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse" />
        <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }} />
        <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
      </div>
    </motion.div>
  );

  return (
    <Suspense fallback={fallback || <LoadingFallback />}>
      <Component {...props} />
    </Suspense>
  );
}

/**
 * Create lazy component with custom loading fallback
 */
export function createLazyComponent(importFunc, fallback = null) {
  const LazyComponent = lazy(importFunc);
  
  return function LazyComponentWrapper(props) {
    return (
      <LazyWrapper 
        component={LazyComponent} 
        fallback={fallback}
        {...props} 
      />
    );
  };
}
