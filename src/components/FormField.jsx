import { motion } from 'framer-motion';
import { useState, useRef } from 'react';
import { Eye, EyeOff, AlertCircle, Check } from 'lucide-react';
import { cn } from '../utils/cn';

/**
 * Enhanced form field with physics-based interactions
 */
export default function FormField({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  success,
  required = false,
  disabled = false,
  className = '',
  ...props
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef(null);

  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;
  const hasError = !!error;
  const hasSuccess = !!success && !hasError;

  const handleFocus = () => {
    setIsFocused(true);
    inputRef.current?.focus();
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <motion.div
      className={cn('w-full', className)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25,
        mass: 1
      }}
    >
      {label && (
        <motion.label
          className="block text-sm font-medium text-gray-300 mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </motion.label>
      )}

      <div className="relative">
        <motion.input
          ref={inputRef}
          type={inputType}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 ease-out',
            'bg-gray-900 text-gray-50 placeholder-gray-400',
            'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-950',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            {
              'border-gray-700 focus:border-blue-500 focus:ring-blue-500': !hasError && !hasSuccess,
              'border-red-500 focus:border-red-500 focus:ring-red-500': hasError,
              'border-green-500 focus:border-green-500 focus:ring-green-500': hasSuccess,
            }
          )}
          whileFocus={{
            scale: 1.02,
            y: -1,
            boxShadow: "0 8px 25px rgba(59, 130, 246, 0.15)"
          }}
          whileHover={{
            scale: disabled ? 1 : 1.01,
            y: disabled ? 0 : -0.5
          }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 25,
            mass: 0.8
          }}
          {...props}
        />

        {/* Password toggle button */}
        {isPassword && (
          <motion.button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-gray-800/50 transition-colors duration-200"
            whileHover={{ scale: 1.1, rotateZ: 5 }}
            whileTap={{ scale: 0.9, rotateZ: -5 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 20,
              mass: 0.8
            }}
          >
            {showPassword ? (
              <EyeOff size={18} className="text-gray-400" />
            ) : (
              <Eye size={18} className="text-gray-400" />
            )}
          </motion.button>
        )}

        {/* Success/Error icons */}
        {(hasError || hasSuccess) && (
          <motion.div
            className="absolute right-3 top-1/2 -translate-y-1/2"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 20,
              mass: 0.8
            }}
          >
            {hasError ? (
              <AlertCircle size={18} className="text-red-500" />
            ) : (
              <Check size={18} className="text-green-500" />
            )}
          </motion.div>
        )}

        {/* Focus indicator */}
        <motion.div
          className={cn(
            'absolute inset-0 rounded-xl border-2 pointer-events-none',
            'border-transparent'
          )}
          animate={{
            borderColor: isFocused 
              ? hasError 
                ? 'rgba(239, 68, 68, 0.3)' 
                : hasSuccess 
                  ? 'rgba(34, 197, 94, 0.3)' 
                  : 'rgba(59, 130, 246, 0.3)'
              : 'transparent'
          }}
          transition={{ duration: 0.2 }}
        />
      </div>

      {/* Error/Success messages */}
      {(hasError || hasSuccess) && (
        <motion.div
          className="mt-2 flex items-center space-x-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 25,
            mass: 0.8
          }}
        >
          <motion.div
            className={cn(
              'w-1 h-1 rounded-full',
              hasError ? 'bg-red-500' : 'bg-green-500'
            )}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <span className={cn(
            'text-sm font-medium',
            hasError ? 'text-red-400' : 'text-green-400'
          )}>
            {error || success}
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}

/**
 * Enhanced textarea component
 */
export function FormTextarea({
  label,
  placeholder,
  value,
  onChange,
  error,
  success,
  required = false,
  disabled = false,
  rows = 4,
  className = '',
  ...props
}) {
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef(null);

  const hasError = !!error;
  const hasSuccess = !!success && !hasError;

  const handleFocus = () => {
    setIsFocused(true);
    textareaRef.current?.focus();
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <motion.div
      className={cn('w-full', className)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25,
        mass: 1
      }}
    >
      {label && (
        <motion.label
          className="block text-sm font-medium text-gray-300 mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </motion.label>
      )}

      <div className="relative">
        <motion.textarea
          ref={textareaRef}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          className={cn(
            'w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 ease-out',
            'bg-gray-900 text-gray-50 placeholder-gray-400 resize-none',
            'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-950',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            {
              'border-gray-700 focus:border-blue-500 focus:ring-blue-500': !hasError && !hasSuccess,
              'border-red-500 focus:border-red-500 focus:ring-red-500': hasError,
              'border-green-500 focus:border-green-500 focus:ring-green-500': hasSuccess,
            }
          )}
          whileFocus={{
            scale: 1.02,
            y: -1,
            boxShadow: "0 8px 25px rgba(59, 130, 246, 0.15)"
          }}
          whileHover={{
            scale: disabled ? 1 : 1.01,
            y: disabled ? 0 : -0.5
          }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 25,
            mass: 0.8
          }}
          {...props}
        />

        {/* Character count indicator */}
        {props.maxLength && (
          <motion.div
            className="absolute bottom-2 right-2 text-xs text-gray-400"
            animate={{
              opacity: isFocused ? 1 : 0.5
            }}
            transition={{ duration: 0.2 }}
          >
            {value?.length || 0} / {props.maxLength}
          </motion.div>
        )}
      </div>

      {/* Error/Success messages */}
      {(hasError || hasSuccess) && (
        <motion.div
          className="mt-2 flex items-center space-x-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 25,
            mass: 0.8
          }}
        >
          <motion.div
            className={cn(
              'w-1 h-1 rounded-full',
              hasError ? 'bg-red-500' : 'bg-green-500'
            )}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <span className={cn(
            'text-sm font-medium',
            hasError ? 'text-red-400' : 'text-green-400'
          )}>
            {error || success}
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}
