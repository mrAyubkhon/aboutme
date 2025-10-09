import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types
export type WaterEntry = { 
  date: string; 
  ml: number; 
};

export type FoodEntry = { 
  id: string; 
  date: string; 
  name: string; 
  kcal: number; 
  protein?: number; 
  carbs?: number; 
  fat?: number; 
};

export type WorkoutEntry = { 
  id: string; 
  date: string; 
  name: string; 
  durationMin: number; 
  kcalBurned: number; 
};

export type SportState = {
  water: Record<string, number>; // date -> total ml
  foods: FoodEntry[];
  workouts: WorkoutEntry[];
  goals: { 
    waterMlPerDay: number; 
    kcalPerDay: number; 
  };
};

// Default state
const defaultState: SportState = {
  water: {},
  foods: [],
  workouts: [],
  goals: {
    waterMlPerDay: 3000,
    kcalPerDay: 2200
  }
};

// Context type
type SportContextType = {
  state: SportState;
  // Water functions
  addWater: (date: string, ml: number) => void;
  setWater: (date: string, ml: number) => void;
  getWater: (date: string) => number;
  progressWater: (date: string) => number;
  
  // Food functions
  addFood: (entry: Omit<FoodEntry, 'id'>) => void;
  deleteFood: (id: string) => void;
  getFoodsForDate: (date: string) => FoodEntry[];
  
  // Workout functions
  addWorkout: (entry: Omit<WorkoutEntry, 'id'>) => void;
  deleteWorkout: (id: string) => void;
  getWorkoutsForDate: (date: string) => WorkoutEntry[];
  
  // Kcal calculations
  totalKcal: (date: string) => number;
  totalBurned: (date: string) => number;
  netKcal: (date: string) => number;
  
  // Goals
  updateGoals: (goals: Partial<SportState['goals']>) => void;
  
  // Utilities
  getToday: () => string;
  getWeekDates: (date: string) => string[];
};

// Create context
const SportContext = createContext<SportContextType | undefined>(undefined);

// Storage key
const STORAGE_KEY = 'SPORT_STATE_V1';

// Helper functions
const getToday = (): string => {
  return new Date().toISOString().split('T')[0];
};

const generateId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

// Migration function for old water data
const migrateOldWaterData = (): Record<string, number> => {
  const migrated: Record<string, number> = {};
  
  // Try to find old water data keys
  const possibleKeys = [
    'waterTrackerState',
    'VITE_WATER_TRACKER',
    'ayubi_water',
    'waterData'
  ];
  
  for (const key of possibleKeys) {
    try {
      const oldData = localStorage.getItem(key);
      if (oldData) {
        const parsed = JSON.parse(oldData);
        console.log(`Found old water data in ${key}:`, parsed);
        
        // Handle different data structures
        if (parsed.current && parsed.goal) {
          // Simple structure: { current: number, goal: number }
          migrated[getToday()] = parsed.current || 0;
        } else if (parsed.water && typeof parsed.water === 'object') {
          // Object structure: { water: { date: ml } }
          Object.assign(migrated, parsed.water);
        } else if (Array.isArray(parsed)) {
          // Array structure: [{ date, ml }]
          parsed.forEach((entry: any) => {
            if (entry.date && entry.ml) {
              migrated[entry.date] = entry.ml;
            }
          });
        }
        
        console.log(`Migrated water data from ${key}:`, migrated);
        break; // Use first found data
      }
    } catch (error) {
      console.warn(`Failed to migrate water data from ${key}:`, error);
    }
  }
  
  return migrated;
};

// Provider component
export const SportProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<SportState>(defaultState);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize state from localStorage
  useEffect(() => {
    console.log('SportContext: Initializing...');
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setState(parsed);
        console.log('SportContext: Loaded sport state from localStorage:', parsed);
      } else {
        // No saved data, try to migrate old water data
        const migratedWater = migrateOldWaterData();
        if (Object.keys(migratedWater).length > 0) {
          const newState = {
            ...defaultState,
            water: migratedWater
          };
          setState(newState);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
          console.log('Migrated and saved old water data:', newState);
        }
      }
    } catch (error) {
      console.error('Failed to load sport state:', error);
      // Try migration as fallback
      const migratedWater = migrateOldWaterData();
      if (Object.keys(migratedWater).length > 0) {
        const newState = {
          ...defaultState,
          water: migratedWater
        };
        setState(newState);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      }
    } finally {
      console.log('SportContext: Initialization complete');
      setIsInitialized(true);
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, isInitialized]);

  // Water functions
  const addWater = (date: string, ml: number) => {
    setState(prev => ({
      ...prev,
      water: {
        ...prev.water,
        [date]: (prev.water[date] || 0) + ml
      }
    }));
    
    // Dispatch custom event for UI updates
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('waterUpdated'));
    }, 100);
  };

  const setWater = (date: string, ml: number) => {
    setState(prev => ({
      ...prev,
      water: {
        ...prev.water,
        [date]: ml
      }
    }));
  };

  const getWater = (date: string): number => {
    return state.water[date] || 0;
  };

  const progressWater = (date: string): number => {
    const water = getWater(date);
    const goal = state.goals.waterMlPerDay;
    return goal > 0 ? Math.min(water / goal, 1) : 0;
  };

  // Food functions
  const addFood = (entry: Omit<FoodEntry, 'id'>) => {
    const newFood: FoodEntry = {
      ...entry,
      id: generateId()
    };
    setState(prev => ({
      ...prev,
      foods: [...prev.foods, newFood]
    }));
  };

  const deleteFood = (id: string) => {
    setState(prev => ({
      ...prev,
      foods: prev.foods.filter(food => food.id !== id)
    }));
  };

  const getFoodsForDate = (date: string): FoodEntry[] => {
    return state.foods.filter(food => food.date === date);
  };

  // Workout functions
  const addWorkout = (entry: Omit<WorkoutEntry, 'id'>) => {
    const newWorkout: WorkoutEntry = {
      ...entry,
      id: generateId()
    };
    setState(prev => ({
      ...prev,
      workouts: [...prev.workouts, newWorkout]
    }));
  };

  const deleteWorkout = (id: string) => {
    setState(prev => ({
      ...prev,
      workouts: prev.workouts.filter(workout => workout.id !== id)
    }));
  };

  const getWorkoutsForDate = (date: string): WorkoutEntry[] => {
    return state.workouts.filter(workout => workout.date === date);
  };

  // Kcal calculations
  const totalKcal = (date: string): number => {
    return getFoodsForDate(date).reduce((sum, food) => sum + food.kcal, 0);
  };

  const totalBurned = (date: string): number => {
    return getWorkoutsForDate(date).reduce((sum, workout) => sum + workout.kcalBurned, 0);
  };

  const netKcal = (date: string): number => {
    return totalKcal(date) - totalBurned(date);
  };

  // Goals
  const updateGoals = (goals: Partial<SportState['goals']>) => {
    setState(prev => ({
      ...prev,
      goals: {
        ...prev.goals,
        ...goals
      }
    }));
  };

  // Utilities
  const getWeekDates = (date: string): string[] => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday
    const monday = new Date(d.setDate(diff));
    
    const week = [];
    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(monday);
      currentDay.setDate(monday.getDate() + i);
      week.push(currentDay.toISOString().split('T')[0]);
    }
    return week;
  };

  const contextValue: SportContextType = {
    state,
    addWater,
    setWater,
    getWater,
    progressWater,
    addFood,
    deleteFood,
    getFoodsForDate,
    addWorkout,
    deleteWorkout,
    getWorkoutsForDate,
    totalKcal,
    totalBurned,
    netKcal,
    updateGoals,
    getToday,
    getWeekDates
  };

  return (
    <SportContext.Provider value={contextValue}>
      {children}
    </SportContext.Provider>
  );
};

// Hook
export const useSport = (): SportContextType => {
  const context = useContext(SportContext);
  if (context === undefined) {
    throw new Error('useSport must be used within a SportProvider');
  }
  return context;
};
