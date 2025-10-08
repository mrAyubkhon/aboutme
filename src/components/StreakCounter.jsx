import { motion } from 'framer-motion';
import { Flame, TrendingUp } from 'lucide-react';

/**
 * Streak counter component for tracking consecutive days
 */
export default function StreakCounter({ streak = 0, className = '' }) {
  const getStreakColor = () => {
    if (streak >= 30) return { bg: 'from-purple-500 to-pink-500', text: 'text-purple-400', border: 'border-purple-500/30' };
    if (streak >= 14) return { bg: 'from-orange-500 to-red-500', text: 'text-orange-400', border: 'border-orange-500/30' };
    if (streak >= 7) return { bg: 'from-yellow-500 to-orange-500', text: 'text-yellow-400', border: 'border-yellow-500/30' };
    if (streak >= 3) return { bg: 'from-green-500 to-emerald-500', text: 'text-green-400', border: 'border-green-500/30' };
    return { bg: 'from-blue-500 to-cyan-500', text: 'text-blue-400', border: 'border-blue-500/30' };
  };

  const colors = getStreakColor();

  return (
    <motion.div
      className={`inline-flex items-center space-x-2 px-3 py-2 rounded-xl border ${colors.border} bg-gray-900 ${className}`}
      whileHover={{ scale: 1.05, y: -2 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 20
      }}
    >
      {/* Flame icon with animation */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Flame size={20} className={colors.text} />
      </motion.div>

      {/* Streak count */}
      <div className="flex flex-col items-center">
        <motion.span
          className={`text-2xl font-bold bg-gradient-to-r ${colors.bg} bg-clip-text text-transparent`}
          key={streak}
          initial={{ scale: 1.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 15
          }}
        >
          {streak}
        </motion.span>
        <span className="text-xs text-gray-400 font-medium">day streak</span>
      </div>

      {/* Trend indicator */}
      {streak > 0 && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <TrendingUp size={16} className={colors.text} />
        </motion.div>
      )}
    </motion.div>
  );
}

/**
 * Compact streak badge
 */
export function StreakBadge({ streak = 0, className = '' }) {
  const getStreakColor = () => {
    if (streak >= 30) return 'text-purple-400 bg-purple-500/20 border-purple-500/30';
    if (streak >= 14) return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
    if (streak >= 7) return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
    if (streak >= 3) return 'text-green-400 bg-green-500/20 border-green-500/30';
    return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
  };

  return (
    <motion.div
      className={`inline-flex items-center space-x-1 px-2 py-1 rounded-lg border ${getStreakColor()} ${className}`}
      whileHover={{ scale: 1.1 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 20
      }}
    >
      <Flame size={14} />
      <span className="text-sm font-bold">{streak}</span>
    </motion.div>
  );
}
