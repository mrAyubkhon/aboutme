import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, createContext, useContext } from 'react';
import { Check, X, AlertCircle, Info, AlertTriangle, Loader } from 'lucide-react';

/**
 * Toast context for global toast management
 */
const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = (toast) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, ...toast }]);
    
    // Auto remove after duration
    if (toast.duration !== 0) {
      setTimeout(() => {
        removeToast(id);
      }, toast.duration || 4000);
    }
    
    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const updateToast = (id, updates) => {
    setToasts(prev => prev.map(toast => 
      toast.id === id ? { ...toast, ...updates } : toast
    ));
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, updateToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

/**
 * Individual toast component
 */
function Toast({ toast, onRemove }) {
  const [isVisible, setIsVisible] = useState(true);

  const handleRemove = () => {
    setIsVisible(false);
    setTimeout(() => onRemove(toast.id), 300);
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <Check size={20} className="text-green-400" />;
      case 'error':
        return <X size={20} className="text-red-400" />;
      case 'warning':
        return <AlertTriangle size={20} className="text-yellow-400" />;
      case 'loading':
        return <Loader size={20} className="text-blue-400 animate-spin" />;
      default:
        return <Info size={20} className="text-blue-400" />;
    }
  };

  const getColors = () => {
    switch (toast.type) {
      case 'success':
        return {
          bg: 'bg-green-500/10',
          border: 'border-green-500/30',
          text: 'text-green-400'
        };
      case 'error':
        return {
          bg: 'bg-red-500/10',
          border: 'border-red-500/30',
          text: 'text-red-400'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-500/10',
          border: 'border-yellow-500/30',
          text: 'text-yellow-400'
        };
      case 'loading':
        return {
          bg: 'bg-blue-500/10',
          border: 'border-blue-500/30',
          text: 'text-blue-400'
        };
      default:
        return {
          bg: 'bg-blue-500/10',
          border: 'border-blue-500/30',
          text: 'text-blue-400'
        };
    }
  };

  const colors = getColors();

  return (
    <motion.div
      className={`relative max-w-sm w-full ${colors.bg} ${colors.border} border rounded-xl p-4 backdrop-blur-md shadow-lg`}
      initial={{ opacity: 0, x: 100, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.8 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25,
        duration: 0.3
      }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-0.5">
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          {toast.title && (
            <h4 className={`text-sm font-semibold ${colors.text} mb-1`}>
              {toast.title}
            </h4>
          )}
          <p className="text-sm text-gray-300">
            {toast.message}
          </p>
          
          {/* Progress bar for timed toasts */}
          {toast.duration > 0 && (
            <motion.div
              className="mt-2 h-1 bg-gray-700 rounded-full overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                className={`h-full ${colors.bg.replace('/10', '/30')} rounded-full`}
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{
                  duration: toast.duration / 1000,
                  ease: "linear"
                }}
              />
            </motion.div>
          )}
        </div>
        
        {!toast.persistent && (
          <button
            onClick={handleRemove}
            className="flex-shrink-0 p-1 rounded-lg hover:bg-gray-800/50 transition-colors duration-200"
          >
            <X size={16} className="text-gray-400 hover:text-white" />
          </button>
        )}
      </div>
    </motion.div>
  );
}

/**
 * Toast container
 */
function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {toasts.map((toast, index) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
              delay: index * 0.1
            }}
          >
            <Toast toast={toast} onRemove={removeToast} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/**
 * Hook for easy toast usage
 */
export function useToastActions() {
  const { addToast, removeToast, updateToast } = useToast();

  const showSuccess = (message, title = 'Success', options = {}) => {
    return addToast({
      type: 'success',
      title,
      message,
      duration: 4000,
      ...options
    });
  };

  const showError = (message, title = 'Error', options = {}) => {
    return addToast({
      type: 'error',
      title,
      message,
      duration: 6000,
      persistent: false,
      ...options
    });
  };

  const showWarning = (message, title = 'Warning', options = {}) => {
    return addToast({
      type: 'warning',
      title,
      message,
      duration: 5000,
      ...options
    });
  };

  const showInfo = (message, title = 'Info', options = {}) => {
    return addToast({
      type: 'info',
      title,
      message,
      duration: 4000,
      ...options
    });
  };

  const showLoading = (message, title = 'Loading...', options = {}) => {
    return addToast({
      type: 'loading',
      title,
      message,
      duration: 0, // Persistent until manually removed
      persistent: true,
      ...options
    });
  };

  const dismiss = (id) => {
    removeToast(id);
  };

  const dismissAll = () => {
    // This would need to be implemented in the context
    console.log('Dismiss all toasts');
  };

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading,
    dismiss,
    dismissAll
  };
}

/**
 * Toast button component for testing
 */
export function ToastDemo() {
  const { showSuccess, showError, showWarning, showInfo, showLoading } = useToastActions();

  return (
    <div className="flex space-x-2">
      <button
        onClick={() => showSuccess('Operation completed successfully!')}
        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
      >
        Success
      </button>
      
      <button
        onClick={() => showError('Something went wrong!')}
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
      >
        Error
      </button>
      
      <button
        onClick={() => showWarning('Please check your input!')}
        className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
      >
        Warning
      </button>
      
      <button
        onClick={() => showInfo('Here is some information!')}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Info
      </button>
      
      <button
        onClick={() => {
          const id = showLoading('Processing your request...');
          setTimeout(() => {
            dismiss(id);
            showSuccess('Request completed!');
          }, 3000);
        }}
        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
      >
        Loading
      </button>
    </div>
  );
}



