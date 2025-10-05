import { useLocalStorage } from './useLocalStorage';
import { WATER_GOALS } from '../data/constants';

/**
 * Custom hook for managing water intake tracking
 * Handles adding water, setting goals, and calculating progress
 */
export function useWater() {
  const [waterData, setWaterData] = useLocalStorage('ayubi_water', {
    current: 0,
    goal: WATER_GOALS.DEFAULT,
    lastReset: new Date().toDateString()
  });
  
  // Reset daily if it's a new day
  const resetIfNewDay = () => {
    const today = new Date().toDateString();
    if (waterData.lastReset !== today) {
      setWaterData(prev => ({
        ...prev,
        current: 0,
        lastReset: today
      }));
    }
  };
  
  // Add water intake
  const addWater = (amount = 250) => {
    resetIfNewDay();
    setWaterData(prev => ({
      ...prev,
      current: Math.min(prev.current + amount, prev.goal * 2) // Cap at 2x goal
    }));
  };
  
  // Set daily water goal
  const setGoal = (goal) => {
    setWaterData(prev => ({
      ...prev,
      goal: Math.max(WATER_GOALS.MIN, Math.min(WATER_GOALS.MAX, goal))
    }));
  };
  
  // Calculate progress percentage
  const getProgress = () => {
    resetIfNewDay();
    return Math.min((waterData.current / waterData.goal) * 100, 100);
  };
  
  // Get remaining water needed
  const getRemaining = () => {
    resetIfNewDay();
    return Math.max(waterData.goal - waterData.current, 0);
  };
  
  // Check if goal is achieved
  const isGoalAchieved = () => {
    return getProgress() >= 100;
  };
  
  return {
    waterData,
    addWater,
    setGoal,
    getProgress,
    getRemaining,
    isGoalAchieved
  };
}
