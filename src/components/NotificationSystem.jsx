import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  Info, 
  X, 
  Download,
  Upload,
  Save,
  Trash2,
  Edit,
  Plus,
  Gamepad2,
  Trophy
} from 'lucide-react';

// Notification Context
const NotificationContext = createContext();

// Custom hook to use notifications
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

// Notification Provider Component
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((notification) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      type: 'success',
      duration: 4000,
      ...notification,
    };

    setNotifications(prev => [...prev, newNotification]);

    // Auto remove after duration
    if (newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }

    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider value={{
      addNotification,
      removeNotification,
      clearAll,
      notifications
    }}>
      {children}
      <NotificationContainer notifications={notifications} onRemove={removeNotification} />
    </NotificationContext.Provider>
  );
};

// Notification Container
const NotificationContainer = ({ notifications, onRemove }) => {
  return (
    <div className="fixed top-20 right-4 z-50 space-y-2">
      <AnimatePresence>
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onRemove={onRemove}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

// Individual Notification Component
const NotificationItem = ({ notification, onRemove }) => {
  const { id, type, title, message, icon, actions, persistent } = notification;

  const getIcon = () => {
    if (icon) return icon;
    
    const defaultIcons = {
      success: CheckCircle,
      error: XCircle,
      warning: AlertCircle,
      info: Info,
      save: Save,
      upload: Upload,
      download: Download,
      delete: Trash2,
      edit: Edit,
      add: Plus,
      game: Gamepad2,
      trophy: Trophy
    };
    
    return defaultIcons[type] || CheckCircle;
  };

  const getColors = () => {
    const colorMap = {
      success: {
        bg: 'bg-green-500/10',
        border: 'border-green-500/30',
        icon: 'text-green-400',
        title: 'text-green-100',
        message: 'text-green-200'
      },
      error: {
        bg: 'bg-red-500/10',
        border: 'border-red-500/30',
        icon: 'text-red-400',
        title: 'text-red-100',
        message: 'text-red-200'
      },
      warning: {
        bg: 'bg-yellow-500/10',
        border: 'border-yellow-500/30',
        icon: 'text-yellow-400',
        title: 'text-yellow-100',
        message: 'text-yellow-200'
      },
      info: {
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/30',
        icon: 'text-blue-400',
        title: 'text-blue-100',
        message: 'text-blue-200'
      },
      save: {
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/30',
        icon: 'text-emerald-400',
        title: 'text-emerald-100',
        message: 'text-emerald-200'
      },
      game: {
        bg: 'bg-purple-500/10',
        border: 'border-purple-500/30',
        icon: 'text-purple-400',
        title: 'text-purple-100',
        message: 'text-purple-200'
      },
      trophy: {
        bg: 'bg-yellow-500/10',
        border: 'border-yellow-500/30',
        icon: 'text-yellow-400',
        title: 'text-yellow-100',
        message: 'text-yellow-200'
      }
    };
    
    return colorMap[type] || colorMap.success;
  };

  const IconComponent = getIcon();
  const colors = getColors();

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.8 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25,
        mass: 0.8
      }}
      className={`
        relative max-w-sm w-full
        ${colors.bg} ${colors.border}
        border backdrop-blur-md rounded-xl p-4
        shadow-2xl
      `}
    >
      {/* Close button */}
      {!persistent && (
        <button
          onClick={() => onRemove(id)}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-200 transition-colors"
        >
          <X size={16} />
        </button>
      )}

      {/* Content */}
      <div className="flex items-start space-x-3 pr-6">
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 400 }}
          className={`flex-shrink-0 ${colors.icon}`}
        >
          <IconComponent size={20} />
        </motion.div>

        {/* Text content */}
        <div className="flex-1 min-w-0">
          {title && (
            <motion.h4
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`text-sm font-semibold ${colors.title}`}
            >
              {title}
            </motion.h4>
          )}
          
          {message && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={`text-sm mt-1 ${colors.message}`}
            >
              {message}
            </motion.p>
          )}

          {/* Actions */}
          {actions && actions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex space-x-2 mt-3"
            >
              {actions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.onClick}
                  className={`
                    px-3 py-1 text-xs font-medium rounded-md
                    transition-colors duration-200
                    ${action.primary 
                      ? `${colors.icon} bg-white/10 hover:bg-white/20` 
                      : 'text-gray-300 bg-gray-700/50 hover:bg-gray-600/50'
                    }
                  `}
                >
                  {action.label}
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Progress bar for auto-dismiss */}
      {!persistent && (
        <motion.div
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 0 }}
          transition={{ duration: 4, ease: "linear" }}
          className="absolute bottom-0 left-0 h-1 bg-white/30 rounded-b-xl origin-left"
        />
      )}
    </motion.div>
  );
};

// Predefined notification functions
export const useNotificationHelpers = () => {
  const { addNotification } = useNotification();

  const showSuccess = useCallback((title, message, options = {}) => {
    return addNotification({
      type: 'success',
      title,
      message,
      ...options
    });
  }, [addNotification]);

  const showError = useCallback((title, message, options = {}) => {
    return addNotification({
      type: 'error',
      title,
      message,
      persistent: true,
      ...options
    });
  }, [addNotification]);

  const showWarning = useCallback((title, message, options = {}) => {
    return addNotification({
      type: 'warning',
      title,
      message,
      ...options
    });
  }, [addNotification]);

  const showInfo = useCallback((title, message, options = {}) => {
    return addNotification({
      type: 'info',
      title,
      message,
      ...options
    });
  }, [addNotification]);

  // Specific notification types
  const showEntrySaved = useCallback((entryType = 'entry', options = {}) => {
    return addNotification({
      type: 'save',
      title: '✅ Saved Successfully!',
      message: `Your ${entryType} has been saved and synced.`,
      icon: Save,
      duration: 3000,
      ...options
    });
  }, [addNotification]);

  const showEntryDeleted = useCallback((entryType = 'entry', options = {}) => {
    return addNotification({
      type: 'error',
      title: '🗑️ Deleted',
      message: `Your ${entryType} has been permanently deleted.`,
      icon: Trash2,
      duration: 3000,
      ...options
    });
  }, [addNotification]);

  const showDataSynced = useCallback((source = 'cloud', options = {}) => {
    return addNotification({
      type: 'info',
      title: '🔄 Data Synced',
      message: `Your data has been synchronized with ${source}.`,
      icon: Upload,
      duration: 2000,
      ...options
    });
  }, [addNotification]);

  const showGameStatsUpdated = useCallback((platform = 'Steam', options = {}) => {
    return addNotification({
      type: 'game',
      title: '🎮 Stats Updated',
      message: `Your ${platform} statistics have been refreshed.`,
      icon: Gamepad2,
      duration: 3000,
      ...options
    });
  }, [addNotification]);

  const showAchievementUnlocked = useCallback((achievement, options = {}) => {
    return addNotification({
      type: 'trophy',
      title: '🏆 Achievement Unlocked!',
      message: `You've earned: ${achievement}`,
      icon: Trophy,
      duration: 5000,
      ...options
    });
  }, [addNotification]);

  const showConnectionError = useCallback((service = 'server', options = {}) => {
    return addNotification({
      type: 'error',
      title: '⚠️ Connection Error',
      message: `Unable to connect to ${service}. Please check your internet connection.`,
      persistent: true,
      actions: [
        {
          label: 'Retry',
          primary: true,
          onClick: () => window.location.reload()
        }
      ],
      ...options
    });
  }, [addNotification]);

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showEntrySaved,
    showEntryDeleted,
    showDataSynced,
    showGameStatsUpdated,
    showAchievementUnlocked,
    showConnectionError
  };
};

export default NotificationSystem;

