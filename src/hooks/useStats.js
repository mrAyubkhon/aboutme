import { useMemo } from 'react';
import { useHabits, useWater, useFinance, useJournal } from './useLocalStorage';

/**
 * Hook for calculating overall statistics and insights
 */
export function useStats() {
  const { habits, getCompletionRate } = useHabits();
  const { waterData, getProgress } = useWater();
  const { getTodayStats, getMonthlyStats } = useFinance();
  const { getRecentEntries } = useJournal();
  
  const stats = useMemo(() => {
    const todayStats = getTodayStats();
    const monthlyStats = getMonthlyStats();
    const waterProgress = getProgress();
    const habitCompletion = getCompletionRate();
    const recentEntries = getRecentEntries(3);
    
    // Calculate streak (consecutive days with 100% habit completion)
    const streak = calculateHabitStreak();
    
    // Calculate productivity score (0-100)
    const productivityScore = calculateProductivityScore(
      habitCompletion,
      waterProgress,
      todayStats.remaining,
      recentEntries.length
    );
    
    // Get motivational message based on progress
    const motivationalMessage = getMotivationalMessage(
      habitCompletion,
      waterProgress,
      todayStats.remaining
    );
    
    return {
      habits: {
        total: habits.length,
        completed: habits.filter(h => h.completed).length,
        completionRate: habitCompletion,
        streak
      },
      water: {
        current: waterData.current,
        goal: waterData.goal,
        progress: waterProgress,
        remaining: waterData.goal - waterData.current
      },
      finance: {
        today: todayStats,
        monthly: monthlyStats
      },
      journal: {
        totalEntries: getRecentEntries().length,
        recentEntries
      },
      overall: {
        productivityScore,
        motivationalMessage
      }
    };
  }, [habits, waterData, getTodayStats, getMonthlyStats, getProgress, getCompletionRate, getRecentEntries]);
  
  return stats;
}

/**
 * Calculate habit streak (simplified version)
 */
function calculateHabitStreak() {
  // This is a simplified version - in a real app, you'd track daily completion rates
  const completionRate = localStorage.getItem('ayubi_habits_completion_history') || '[]';
  const history = JSON.parse(completionRate);
  
  // For demo purposes, return a mock streak
  return Math.floor(Math.random() * 7) + 1;
}

/**
 * Calculate overall productivity score
 */
function calculateProductivityScore(habitCompletion, waterProgress, remainingBudget, recentEntries) {
  const habitScore = habitCompletion;
  const waterScore = waterProgress;
  const financeScore = remainingBudget > 0 ? 100 : 50; // 100 if under budget, 50 if over
  const journalScore = recentEntries > 0 ? 100 : 0;
  
  return Math.round((habitScore + waterScore + financeScore + journalScore) / 4);
}

/**
 * Get motivational message based on current progress
 */
function getMotivationalMessage(habitCompletion, waterProgress, remainingBudget) {
  const messages = {
    excellent: [
      "Outstanding work today! You're crushing it! 🚀",
      "You're on fire! Keep this momentum going! 🔥",
      "Incredible progress! You're unstoppable! 💪"
    ],
    good: [
      "Great job! You're making solid progress! 👍",
      "Nice work! Keep pushing forward! ⭐",
      "You're doing well! Stay consistent! 💯"
    ],
    okay: [
      "You're getting there! Every step counts! 👣",
      "Progress is progress! Keep going! 🎯",
      "Small steps lead to big changes! 🌱"
    ],
    needsImprovement: [
      "Every day is a fresh start! You've got this! 🌅",
      "Consistency beats perfection! Keep trying! 💪",
      "Tomorrow is another opportunity! Don't give up! 🌟"
    ]
  };
  
  const avgProgress = (habitCompletion + waterProgress + (remainingBudget > 0 ? 100 : 0)) / 3;
  
  if (avgProgress >= 80) {
    return messages.excellent[Math.floor(Math.random() * messages.excellent.length)];
  } else if (avgProgress >= 60) {
    return messages.good[Math.floor(Math.random() * messages.good.length)];
  } else if (avgProgress >= 40) {
    return messages.okay[Math.floor(Math.random() * messages.okay.length)];
  } else {
    return messages.needsImprovement[Math.floor(Math.random() * messages.needsImprovement.length)];
  }
}

/**
 * Get quote of the day
 */
export function useQuoteOfTheDay() {
  const quotes = [
    {
      text: "The way to get started is to quit talking and begin doing.",
      author: "Walt Disney"
    },
    {
      text: "Life is what happens to you while you're busy making other plans.",
      author: "John Lennon"
    },
    {
      text: "The future belongs to those who believe in the beauty of their dreams.",
      author: "Eleanor Roosevelt"
    },
    {
      text: "It is during our darkest moments that we must focus to see the light.",
      author: "Aristotle"
    },
    {
      text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
      author: "Winston Churchill"
    },
    {
      text: "The only way to do great work is to love what you do.",
      author: "Steve Jobs"
    },
    {
      text: "If you really look closely, most overnight successes took a long time.",
      author: "Steve Jobs"
    },
    {
      text: "Don't be afraid to give up the good to go for the great.",
      author: "John D. Rockefeller"
    },
    {
      text: "Innovation distinguishes between a leader and a follower.",
      author: "Steve Jobs"
    },
    {
      text: "The way to get started is to quit talking and begin doing.",
      author: "Walt Disney"
    }
  ];
  
  // Get quote based on current date (so it changes daily)
  const today = new Date().getDate();
  const quoteIndex = today % quotes.length;
  
  return quotes[quoteIndex];
}

/**
 * Get greeting based on time of day
 */
export function useGreeting() {
  const hour = new Date().getHours();
  
  if (hour < 12) {
    return "Good morning";
  } else if (hour < 17) {
    return "Good afternoon";
  } else {
    return "Good evening";
  }
}
