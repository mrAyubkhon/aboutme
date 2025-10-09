import { useState, useEffect, useCallback } from 'react';
import gameStatsService from '../services/gameStatsService';

export const useGameStats = () => {
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

  // Get user IDs from localStorage
  const getUserId = useCallback(() => {
    const steamId = localStorage.getItem('steam_id') || '76561199132216007';
    const faceitNickname = localStorage.getItem('faceit_nickname') || 'Ayu6i';
    return { steamId, faceitNickname };
  }, []);

  // Load game data
  const loadGameData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { steamId, faceitNickname } = getUserId();
      
      const data = await gameStatsService.getAllGameData(steamId, faceitNickname);
      
      if (data) {
        setGameData(data);
        setLastUpdated(new Date());
        
        // Simulate live stats based on real data
        setLiveStats(prev => ({
          ...prev,
          isOnline: Math.random() > 0.3, // 70% chance of being online
          currentStatus: Math.random() > 0.3 ? 'In-Game' : 'Online',
          currentGame: Math.random() > 0.5 ? 'Counter-Strike 2' : null,
          eloChange: Math.floor(Math.random() * 20) - 10
        }));
      }
    } catch (err) {
      setError(err.message);
      console.error('Error loading game data:', err);
    } finally {
      setLoading(false);
    }
  }, [getUserId]);

  // Auto-refresh functionality
  useEffect(() => {
    let interval;
    
    if (autoRefresh && isLive) {
      interval = setInterval(() => {
        loadGameData();
      }, 30000); // 30 seconds
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [autoRefresh, isLive, loadGameData]);

  // Live stats simulation
  useEffect(() => {
    const liveInterval = setInterval(() => {
      setLiveStats(prev => ({
        ...prev,
        isOnline: Math.random() > 0.3,
        currentStatus: Math.random() > 0.3 ? 'In-Game' : 'Online',
        currentGame: Math.random() > 0.5 ? 'Counter-Strike 2' : null,
        eloChange: Math.floor(Math.random() * 20) - 10
      }));
    }, 5000); // Update every 5 seconds
    
    return () => clearInterval(liveInterval);
  }, []);

  // Toggle live mode
  const toggleLiveMode = useCallback(() => {
    setIsLive(!isLive);
    if (!isLive) {
      setAutoRefresh(true);
    } else {
      setAutoRefresh(false);
    }
  }, [isLive]);

  // Manual refresh
  const refreshData = useCallback(async () => {
    gameStatsService.clearCache();
    await loadGameData();
  }, [loadGameData]);

  // Initialize data on mount
  useEffect(() => {
    loadGameData();
  }, [loadGameData]);

  // Computed values
  const recentGames = gameStatsService.getRecentGames(
    gameData.steam?.games || [], 
    6
  );

  const recentMatches = gameStatsService.getRecentMatches(
    gameData.faceit?.matches,
    10
  );

  const stats = {
    totalGames: gameData.steam?.games?.length || 0,
    totalPlaytime: gameData.steam?.games?.reduce((acc, game) => acc + game.playtime_forever, 0) || 0,
    faceitElo: gameData.faceit?.stats?.faceit_elo || 0,
    winRate: gameData.faceit?.stats?.lifetime?.Average || 0,
    skillLevel: gameData.faceit?.stats?.skill_level || 0
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
    stats,
    toggleLiveMode,
    refreshData,
    loadGameData
  };
};

export default useGameStats;
