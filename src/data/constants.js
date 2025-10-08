// App Constants
export const APP_NAME = 'Ayubi aka System';

// Color Palette - Dark Minimal Theme
export const COLORS = {
  background: '#0a0a0a',      // true black
  card: '#111827',           // dark navy
  border: '#1f2937',         // subtle borders
  accent: '#2563eb',         // bright blue
  text: {
    primary: '#f9fafb',      // white/near-white
    secondary: '#9ca3af',    // soft gray
    muted: '#6b7280'         // muted gray
  },
  hover: '#1e3a8a'           // blue glow on hover
};

// Navigation Items
export const NAV_ITEMS = [
  { path: '/', icon: 'Home', label: 'Home' },
  { path: '/routine', icon: 'Calendar', label: 'Routine' },
  { path: '/water', icon: 'Droplets', label: 'Water' },
  { path: '/finance', icon: 'DollarSign', label: 'Finance' },
  { path: '/journal', icon: 'BookOpen', label: 'Journal' },
  { path: '/travel', icon: 'Globe', label: 'Travel' },
  { path: '/gamestats', icon: 'Gamepad2', label: 'Game Stats' },
  { path: '/diagnostics', icon: 'Wrench', label: 'Diagnostics' },
  { path: '/settings', icon: 'Settings', label: 'Settings' },
];

// Default Habits
export const DEFAULT_HABITS = [
  'Wake up early',
  'Morning workout',
  'Python coding',
  'English practice',
  'Arabic study',
  'Read for 30 minutes',
  'Study tickets',
  'Meditation',
  'Drink water',
  'Evening walk'
];

// Finance Categories
export const FINANCE_CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Health',
  'Education',
  'Utilities',
  'Other'
];

// Water Goals
export const WATER_GOALS = {
  MIN: 500,    // 500ml
  MAX: 10000,  // 10L
  DEFAULT: 3000 // 3L
};

// Animations
export const ANIMATIONS = {
  fadeIn: { duration: 0.3, ease: 'easeOut' },
  slideUp: { duration: 0.3, ease: 'easeOut' },
  hover: { duration: 0.2 },
  transition: 'transition-all duration-200'
};

// Local Storage Keys
export const STORAGE_KEYS = {
  HABITS: 'ayubi_habits',
  WATER: 'ayubi_water',
  FINANCES: 'ayubi_finances',
  JOURNAL: 'ayubi_journal',
  SETTINGS: 'ayubi_settings'
};
