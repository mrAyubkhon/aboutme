import { useState, useEffect, useCallback } from 'react';
import GameStatsApiService from '../services/realApi';

/**
 * Custom hook for real game statistics
 * Fetches data from actual Steam and Faceit APIs
 */
export const useRealGameStats = () => {
  const [gameData, setGameData] = useState({
    steam: null,
    faceit: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isLive, setIsLive] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);

  // Live stats simulation
  const [liveStats, setLiveStats] = useState({
    isOnline: false,
    currentStatus: 'Offline',
    currentGame: null,
    eloChange: 0
  });

  /**
   * Load real game data from APIs
   */
  const loadGameData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Loading real game data...');
      
      const data = await GameStatsApiService.getAllGameStats();
      
      if (data) {
        setGameData(data);
        setLastUpdated(new Date());
        
        // Simulate live stats based on real data
        setLiveStats(prev => ({
          ...prev,
          isOnline: Math.random() > 0.3, // 70% chance of being online
          currentStatus: Math.random() > 0.3 ? 'In-Game' : 'Online',
          currentGame: data.steam?.recentGames?.[0]?.name || 'Counter-Strike 2',
          eloChange: Math.floor(Math.random() * 20) - 10
        }));
        
        console.log('✅ Game data loaded successfully');
      }
    } catch (err) {
      setError(err.message);
      console.error('❌ Error loading game data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Auto-refresh functionality
   */
  useEffect(() => {
    let interval;
    
    if (autoRefresh && isLive) {
      console.log('🔄 Starting auto-refresh (30s interval)');
      interval = setInterval(() => {
        loadGameData();
      }, 30000); // 30 seconds
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
        console.log('⏹️ Auto-refresh stopped');
      }
    };
  }, [autoRefresh, isLive, loadGameData]);

  /**
   * Live stats simulation
   */
  useEffect(() => {
    const liveInterval = setInterval(() => {
      setLiveStats(prev => ({
        ...prev,
        isOnline: Math.random() > 0.3,
        currentStatus: Math.random() > 0.3 ? 'In-Game' : 'Online',
        currentGame: gameData.steam?.recentGames?.[0]?.name || 'Counter-Strike 2',
        eloChange: Math.floor(Math.random() * 20) - 10
      }));
    }, 5000); // Update every 5 seconds
    
    return () => clearInterval(liveInterval);
  }, [gameData]);

  /**
   * Toggle live mode
   */
  const toggleLiveMode = useCallback(() => {
    setIsLive(!isLive);
    if (!isLive) {
      setAutoRefresh(true);
      console.log('🔴 Live mode enabled');
    } else {
      setAutoRefresh(false);
      console.log('⏹️ Live mode disabled');
    }
  }, [isLive]);

  /**
   * Manual refresh
   */
  const refreshData = useCallback(async () => {
    console.log('🔄 Manual refresh triggered');
    await loadGameData();
  }, [loadGameData]);

  /**
   * Initialize data on mount
   */
  useEffect(() => {
    console.log('🚀 Initializing real game stats...');
    loadGameData();
  }, [loadGameData]);

  /**
   * Computed values
   */
  const recentGames = gameData.steam?.recentGames || [];
  const recentMatches = gameData.faceit?.matches?.items || [];
  const ownedGames = gameData.steam?.ownedGames || [];

  const stats = {
    // Steam stats
    totalGames: gameData.steam?.totalGames || 0,
    totalPlaytime: gameData.steam?.totalPlaytime || 0,
    steamLevel: gameData.steam?.profile?.level || 0,
    
    // Faceit stats
    faceitElo: gameData.faceit?.elo || 0,
    winRate: gameData.faceit?.winRate || 0,
    skillLevel: gameData.faceit?.skillLevel || 0,
    totalMatches: gameData.faceit?.totalMatches || 0,
    kdRatio: gameData.faceit?.kdRatio || 0,
    
    // Computed stats
    wins: Math.round((gameData.faceit?.totalMatches || 0) * (gameData.faceit?.winRate || 0) / 100),
    losses: (gameData.faceit?.totalMatches || 0) - Math.round((gameData.faceit?.totalMatches || 0) * (gameData.faceit?.winRate || 0) / 100),
    currentStreak: Math.floor(Math.random() * 10) + 1, // Mock current streak
    longestStreak: Math.floor(Math.random() * 20) + 5 // Mock longest streak
  };

  return {
    gameData,
    loading,
    error,
    lastUpdated,
    isLive,
    autoRefresh,
    liveStats,
    recentGames,
    recentMatches,
    ownedGames,
    stats,
    toggleLiveMode,
    refreshData,
    loadGameData
  };
};

export default useRealGameStats;
