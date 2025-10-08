import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  Target, 
  TrendingUp, 
  Zap, 
  Award,
  Droplets,
  Calendar,
  DollarSign,
  BookOpen
} from 'lucide-react';

/**
 * Enhanced Progress Bar with animations, goals, and motivational messages
 */
export default function EnhancedProgressBar({ 
  current = 0, 
  goal = 100, 
  label = "Progress",
  type = "default",
  showGoal = true,
  showMotivation = true,
  className = ""
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [pulseAnimation, setPulseAnimation] = useState(false);

  const percentage = Math.min((current / goal) * 100, 100);
  const isComplete = percentage >= 100;
  const isNearGoal = percentage >= 80;

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Trigger pulse animation when near goal
  useEffect(() => {
    if (isNearGoal && !isComplete) {
      setPulseAnimation(true);
      const timer = setTimeout(() => setPulseAnimation(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isNearGoal, isComplete]);

  const getTypeConfig = () => {
    const configs = {
      water: {
        icon: Droplets,
        color: 'from-blue-400 to-cyan-500',
        bgColor: 'bg-blue-500/20',
        borderColor: 'border-blue-500/30',
        emptyColor: 'bg-blue-500/10',
        motivationalMessages: [
          "💧 Every drop counts!",
          "🌊 You're making waves!",
          "💙 Stay hydrated, stay healthy!",
          "🚰 Water is life!"
        ]
      },
      habits: {
        icon: Calendar,
        color: 'from-green-400 to-emerald-500',
        bgColor: 'bg-green-500/20',
        borderColor: 'border-green-500/30',
        emptyColor: 'bg-green-500/10',
        motivationalMessages: [
          "🎯 Consistency is key!",
          "✨ Small steps, big changes!",
          "🚀 You're building great habits!",
          "💪 Keep the momentum going!"
        ]
      },
      finance: {
        icon: DollarSign,
        color: 'from-yellow-400 to-orange-500',
        bgColor: 'bg-yellow-500/20',
        borderColor: 'border-yellow-500/30',
        emptyColor: 'bg-yellow-500/10',
        motivationalMessages: [
          "💰 Smart spending today!",
          "📊 Every penny tracked!",
          "🎯 Financial goals in sight!",
          "💎 Building wealth habits!"
        ]
      },
      journal: {
        icon: BookOpen,
        color: 'from-purple-400 to-pink-500',
        bgColor: 'bg-purple-500/20',
        borderColor: 'border-purple-500/30',
        emptyColor: 'bg-purple-500/10',
        motivationalMessages: [
          "📝 Your thoughts matter!",
          "✨ Reflection leads to growth!",
          "🌟 Writing your story!",
          "💭 Mindful moments captured!"
        ]
      },
      default: {
        icon: Target,
        color: 'from-gray-400 to-gray-600',
        bgColor: 'bg-gray-500/20',
        borderColor: 'border-gray-500/30',
        emptyColor: 'bg-gray-500/10',
        motivationalMessages: [
          "🎯 Progress in motion!",
          "⚡ Every step counts!",
          "🔥 You're on fire!",
          "🌟 Shining bright!"
        ]
      }
    };
    return configs[type] || configs.default;
  };

  const config = getTypeConfig();
  const Icon = config.icon;

  const getMotivationalMessage = () => {
    if (isComplete) {
      return "🎉 Goal achieved! Amazing work!";
    }
    if (isNearGoal) {
      return "🔥 So close! You've got this!";
    }
    if (percentage >= 50) {
      return "💪 Halfway there! Keep going!";
    }
    if (current === 0) {
      return "🚀 Ready to start your journey?";
    }
    return config.motivationalMessages[Math.floor(Math.random() * config.motivationalMessages.length)];
  };

  const getProgressAnimation = () => {
    return {
      width: isVisible ? `${percentage}%` : "0%",
      transition: {
        duration: 1.2,
        ease: "easeOut",
        delay: 0.3
      }
    };
  };

  return (
    <motion.div
      className={`relative p-4 rounded-xl border ${config.borderColor} ${config.bgColor} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <motion.div
            className={`p-2 rounded-lg bg-gradient-to-r ${config.color} bg-clip-text text-transparent`}
            animate={pulseAnimation ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.6, repeat: pulseAnimation ? 2 : 0 }}
          >
            <Icon size={20} />
          </motion.div>
          <div>
            <h3 className="font-semibold text-gray-50">{label}</h3>
            {showGoal && (
              <p className="text-sm text-gray-400">
                {current} / {goal} {type === 'water' ? 'ml' : type === 'finance' ? 'UZS' : ''}
              </p>
            )}
          </div>
        </div>

        {/* Percentage Badge */}
        <motion.div
          className={`px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r ${config.color} bg-clip-text text-transparent border ${config.borderColor}`}
          animate={pulseAnimation ? { scale: [1, 1.05, 1] } : {}}
          transition={{ duration: 0.6, repeat: pulseAnimation ? 2 : 0 }}
        >
          {Math.round(percentage)}%
        </motion.div>
      </div>

      {/* Progress Bar Container */}
      <div className={`relative h-3 rounded-full overflow-hidden ${config.emptyColor} border ${config.borderColor}`}>
        {/* Progress Fill */}
        <motion.div
          className={`h-full bg-gradient-to-r ${config.color} relative`}
          style={getProgressAnimation()}
        >
          {/* Shimmer Effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{
              x: ["-100%", "100%"]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
              ease: "linear"
            }}
          />

          {/* Completion Sparkles */}
          <AnimatePresence>
            {isComplete && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <motion.div
                  animate={{
                    scale: [0.8, 1.2, 0.8],
                    rotate: [0, 180, 360]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Award className="text-white" size={16} />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Goal Marker */}
        {showGoal && percentage < 100 && (
          <div
            className="absolute top-0 w-0.5 h-full bg-white/50"
            style={{ left: "100%" }}
          />
        )}
      </div>

      {/* Motivational Message */}
      {showMotivation && (
        <motion.div
          className="mt-3 text-sm text-gray-300 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {getMotivationalMessage()}
        </motion.div>
      )}

      {/* Trend Indicator */}
      {current > 0 && (
        <motion.div
          className="absolute top-2 right-2"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
        >
          <TrendingUp size={16} className="text-green-400" />
        </motion.div>
      )}
    </motion.div>
  );
}

/**
 * Quick Progress Bar for compact spaces
 */
export function QuickProgressBar({ 
  current = 0, 
  goal = 100, 
  type = "default",
  className = ""
}) {
  const percentage = Math.min((current / goal) * 100, 100);
  const config = {
    water: 'from-blue-400 to-cyan-500',
    habits: 'from-green-400 to-emerald-500',
    finance: 'from-yellow-400 to-orange-500',
    journal: 'from-purple-400 to-pink-500',
    default: 'from-gray-400 to-gray-600'
  }[type];

  return (
    <div className={`relative ${className}`}>
      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          className={`h-full bg-gradient-to-r ${config}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
      <div className="text-xs text-gray-400 mt-1 text-center">
        {Math.round(percentage)}%
      </div>
    </div>
  );
}
