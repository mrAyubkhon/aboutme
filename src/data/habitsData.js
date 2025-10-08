/**
 * Predefined habits data with categories and icons
 */

export const HABIT_CATEGORIES = {
  HEALTH: 'health',
  PRODUCTIVITY: 'productivity',
  LEARNING: 'learning',
  FITNESS: 'fitness',
  MINDFULNESS: 'mindfulness',
  CREATIVITY: 'creativity',
  SOCIAL: 'social',
  PERSONAL: 'personal'
};

export const PREDEFINED_HABITS = [
  // Health & Wellness
  {
    id: 'drink-water',
    name: 'Drink Water',
    description: 'Stay hydrated throughout the day',
    category: HABIT_CATEGORIES.HEALTH,
    icon: '💧',
    color: 'blue',
    frequency: 'daily',
    difficulty: 'easy',
    tags: ['health', 'hydration']
  },
  {
    id: 'morning-stretch',
    name: 'Morning Stretch',
    description: 'Start your day with gentle stretching',
    category: HABIT_CATEGORIES.HEALTH,
    icon: '🤸‍♂️',
    color: 'green',
    frequency: 'daily',
    difficulty: 'easy',
    tags: ['health', 'morning', 'flexibility']
  },
  {
    id: 'walk-10k-steps',
    name: 'Walk 10,000 Steps',
    description: 'Reach your daily step goal',
    category: HABIT_CATEGORIES.FITNESS,
    icon: '🚶‍♂️',
    color: 'green',
    frequency: 'daily',
    difficulty: 'medium',
    tags: ['fitness', 'walking', 'steps']
  },
  {
    id: 'get-8-hours-sleep',
    name: '8 Hours of Sleep',
    description: 'Get adequate rest for better health',
    category: HABIT_CATEGORIES.HEALTH,
    icon: '😴',
    color: 'purple',
    frequency: 'daily',
    difficulty: 'medium',
    tags: ['health', 'sleep', 'rest']
  },
  {
    id: 'eat-fruits',
    name: 'Eat Fruits',
    description: 'Include fruits in your daily diet',
    category: HABIT_CATEGORIES.HEALTH,
    icon: '🍎',
    color: 'green',
    frequency: 'daily',
    difficulty: 'easy',
    tags: ['health', 'nutrition', 'fruits']
  },

  // Productivity
  {
    id: 'make-bed',
    name: 'Make Your Bed',
    description: 'Start the day with a small win',
    category: HABIT_CATEGORIES.PRODUCTIVITY,
    icon: '🛏️',
    color: 'blue',
    frequency: 'daily',
    difficulty: 'easy',
    tags: ['productivity', 'morning', 'organization']
  },
  {
    id: 'plan-day',
    name: 'Plan Your Day',
    description: 'Set goals and priorities for the day',
    category: HABIT_CATEGORIES.PRODUCTIVITY,
    icon: '📋',
    color: 'yellow',
    frequency: 'daily',
    difficulty: 'easy',
    tags: ['productivity', 'planning', 'goals']
  },
  {
    id: 'no-phone-morning',
    name: 'No Phone First Hour',
    description: 'Start your day without screens',
    category: HABIT_CATEGORIES.PRODUCTIVITY,
    icon: '📵',
    color: 'red',
    frequency: 'daily',
    difficulty: 'hard',
    tags: ['productivity', 'digital-detox', 'focus']
  },
  {
    id: 'clean-workspace',
    name: 'Clean Workspace',
    description: 'Keep your working area organized',
    category: HABIT_CATEGORIES.PRODUCTIVITY,
    icon: '🧹',
    color: 'blue',
    frequency: 'daily',
    difficulty: 'easy',
    tags: ['productivity', 'organization', 'clean']
  },
  {
    id: 'time-blocking',
    name: 'Time Blocking',
    description: 'Schedule focused work sessions',
    category: HABIT_CATEGORIES.PRODUCTIVITY,
    icon: '⏰',
    color: 'orange',
    frequency: 'daily',
    difficulty: 'medium',
    tags: ['productivity', 'time-management', 'focus']
  },

  // Learning
  {
    id: 'read-30-min',
    name: 'Read 30 Minutes',
    description: 'Daily reading for knowledge and growth',
    category: HABIT_CATEGORIES.LEARNING,
    icon: '📚',
    color: 'purple',
    frequency: 'daily',
    difficulty: 'medium',
    tags: ['learning', 'reading', 'knowledge']
  },
  {
    id: 'learn-language',
    name: 'Practice Language',
    description: 'Study a foreign language daily',
    category: HABIT_CATEGORIES.LEARNING,
    icon: '🗣️',
    color: 'green',
    frequency: 'daily',
    difficulty: 'medium',
    tags: ['learning', 'language', 'communication']
  },
  {
    id: 'write-journal',
    name: 'Write Journal',
    description: 'Reflect and record your thoughts',
    category: HABIT_CATEGORIES.LEARNING,
    icon: '✍️',
    color: 'blue',
    frequency: 'daily',
    difficulty: 'easy',
    tags: ['learning', 'writing', 'reflection']
  },
  {
    id: 'watch-educational',
    name: 'Watch Educational Content',
    description: 'Learn from videos or courses',
    category: HABIT_CATEGORIES.LEARNING,
    icon: '🎓',
    color: 'purple',
    frequency: 'daily',
    difficulty: 'easy',
    tags: ['learning', 'education', 'videos']
  },

  // Mindfulness
  {
    id: 'meditation',
    name: 'Meditate',
    description: 'Practice mindfulness and meditation',
    category: HABIT_CATEGORIES.MINDFULNESS,
    icon: '🧘‍♂️',
    color: 'purple',
    frequency: 'daily',
    difficulty: 'medium',
    tags: ['mindfulness', 'meditation', 'peace']
  },
  {
    id: 'gratitude',
    name: 'Practice Gratitude',
    description: 'Write down things you\'re grateful for',
    category: HABIT_CATEGORIES.MINDFULNESS,
    icon: '🙏',
    color: 'yellow',
    frequency: 'daily',
    difficulty: 'easy',
    tags: ['mindfulness', 'gratitude', 'positive']
  },
  {
    id: 'deep-breathing',
    name: 'Deep Breathing',
    description: 'Practice breathing exercises for calm',
    category: HABIT_CATEGORIES.MINDFULNESS,
    icon: '🌬️',
    color: 'cyan',
    frequency: 'daily',
    difficulty: 'easy',
    tags: ['mindfulness', 'breathing', 'calm']
  },

  // Fitness
  {
    id: 'exercise-30-min',
    name: 'Exercise 30 Minutes',
    description: 'Daily physical activity for health',
    category: HABIT_CATEGORIES.FITNESS,
    icon: '💪',
    color: 'red',
    frequency: 'daily',
    difficulty: 'medium',
    tags: ['fitness', 'exercise', 'health']
  },
  {
    id: 'yoga',
    name: 'Practice Yoga',
    description: 'Yoga for flexibility and strength',
    category: HABIT_CATEGORIES.FITNESS,
    icon: '🧘‍♀️',
    color: 'green',
    frequency: 'daily',
    difficulty: 'medium',
    tags: ['fitness', 'yoga', 'flexibility']
  },
  {
    id: 'push-ups',
    name: 'Do Push-ups',
    description: 'Build upper body strength',
    category: HABIT_CATEGORIES.FITNESS,
    icon: '🏋️‍♂️',
    color: 'red',
    frequency: 'daily',
    difficulty: 'medium',
    tags: ['fitness', 'strength', 'push-ups']
  },

  // Personal Development
  {
    id: 'skill-practice',
    name: 'Practice a Skill',
    description: 'Work on improving a specific skill',
    category: HABIT_CATEGORIES.PERSONAL,
    icon: '🎯',
    color: 'orange',
    frequency: 'daily',
    difficulty: 'medium',
    tags: ['personal', 'skills', 'improvement']
  },
  {
    id: 'call-family',
    name: 'Call Family',
    description: 'Stay connected with loved ones',
    category: HABIT_CATEGORIES.SOCIAL,
    icon: '👨‍👩‍👧‍👦',
    color: 'pink',
    frequency: 'daily',
    difficulty: 'easy',
    tags: ['social', 'family', 'connection']
  }
];

export const getHabitsByCategory = (category) => {
  return PREDEFINED_HABITS.filter(habit => habit.category === category);
};

export const getHabitById = (id) => {
  return PREDEFINED_HABITS.find(habit => habit.id === id);
};

export const getRandomHabits = (count = 5) => {
  const shuffled = [...PREDEFINED_HABITS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const searchHabits = (query) => {
  const lowercaseQuery = query.toLowerCase();
  return PREDEFINED_HABITS.filter(habit => 
    habit.name.toLowerCase().includes(lowercaseQuery) ||
    habit.description.toLowerCase().includes(lowercaseQuery) ||
    habit.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};
