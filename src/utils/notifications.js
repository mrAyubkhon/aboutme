/**
 * Universal notification system for the application
 */

export const showNotification = (message, type = 'success', duration = 4000) => {
  const notification = document.createElement('div');
  
  const typeConfig = {
    success: {
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30',
      iconColor: 'text-green-400',
      titleColor: 'text-green-100'
    },
    error: {
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/30',
      iconColor: 'text-red-400',
      titleColor: 'text-red-100'
    },
    warning: {
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/30',
      iconColor: 'text-yellow-400',
      titleColor: 'text-yellow-100'
    },
    info: {
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
      iconColor: 'text-blue-400',
      titleColor: 'text-blue-100'
    }
  };

  const config = typeConfig[type];
  
  notification.className = `fixed top-4 right-4 z-50 ${config.bgColor} ${config.borderColor} border rounded-xl p-4 shadow-lg backdrop-blur-sm max-w-sm transform transition-all duration-300`;
  
  const icons = {
    success: `<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>`,
    error: `<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>`,
    warning: `<path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>`,
    info: `<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>`
  };

  const titles = {
    success: 'Success!',
    error: 'Error!',
    warning: 'Warning!',
    info: 'Info'
  };

  notification.innerHTML = `
    <div class="flex items-center space-x-3">
      <div class="flex-shrink-0 ${config.iconColor}">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          ${icons[type]}
        </svg>
      </div>
      <div class="flex-1">
        <p class="text-sm font-medium ${config.titleColor}">${titles[type]}</p>
        <p class="text-sm text-gray-200">${message}</p>
      </div>
      <button onclick="this.parentElement.parentElement.remove()" class="flex-shrink-0 text-gray-400 hover:text-gray-200 transition-colors">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
        </svg>
      </button>
    </div>
  `;

  // Add to DOM with animation
  notification.style.transform = 'translateX(100%)';
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 10);

  // Auto remove
  if (duration > 0) {
    setTimeout(() => {
      if (notification.parentElement) {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
          if (notification.parentElement) {
            notification.remove();
          }
        }, 300);
      }
    }, duration);
  }

  return notification;
};

// Convenience functions
export const showSuccess = (message, duration = 4000) => 
  showNotification(message, 'success', duration);

export const showError = (message, duration = 7000) => 
  showNotification(message, 'error', duration);

export const showWarning = (message, duration = 6000) => 
  showNotification(message, 'warning', duration);

export const showInfo = (message, duration = 5000) => 
  showNotification(message, 'info', duration);
