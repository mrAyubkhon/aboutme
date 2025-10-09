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

  // Mock data for development (replace with real API calls)
  const mockSteamData = {
    profile: {
      steamid: '76561199132216007',
      personaname: 'Ayu6i',
      realname: 'Muhammad Ayub',
      avatar: 'https://avatars.steamstatic.com/avatar.jpg',
      level: 42,
      timecreated: 1609459200
    },
    games: [
      {
        appid: 730,
        name: 'Counter-Strike 2',
        playtime_forever: 1847,
        playtime_2weeks: 89,
        rtime_last_played: Math.floor(Date.now() / 1000) - 3600,
        img_icon_url: 'cs2-icon.jpg'
      },
      {
        appid: 570,
        name: 'Dota 2',
        playtime_forever: 1000,
        playtime_2weeks: 67,
        rtime_last_played: Math.floor(Date.now() / 1000) - 7200,
        img_icon_url: 'dota2-icon.jpg'
      },
      {
        appid: 1172470,
        name: 'Apex Legends',
        playtime_forever: 456,
        playtime_2weeks: 23,
        rtime_last_played: Math.floor(Date.now() / 1000) - 1800,
        img_icon_url: 'apex-icon.jpg'
      }
    ]
  };

  const mockFaceitData = {
    profile: {
      player_id: 'ayub_khon',
      nickname: 'Ayu6i',
      country: 'UZ',
      avatar: 'https://avatars.steamstatic.com/avatar.jpg',
      faceit_url: 'https://faceit.com/en/players/ayub_khon'
    },
    stats: {
      faceit_elo: 2139,
      skill_level: 6,
      lifetime: {
        Average: 63.1
      }
    },
    matches: {
      items: [
        { match_id: '1', started_at: Math.floor(Date.now() / 1000) - 3600, result: 'win' },
        { match_id: '2', started_at: Math.floor(Date.now() / 1000) - 7200, result: 'win' },
        { match_id: '3', started_at: Math.floor(Date.now() / 1000) - 10800, result: 'loss' },
        { match_id: '4', started_at: Math.floor(Date.now() / 1000) - 14400, result: 'win' },
        { match_id: '5', started_at: Math.floor(Date.now() / 1000) - 18000, result: 'win' }
      ]
    }
  };

  // Load game data
  const loadGameData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // For now, use mock data. Replace with real API calls later
      const data = {
        steam: mockSteamData,
        faceit: mockFaceitData
      };
      
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
    } catch (err) {
      setError(err.message);
      console.error('Error loading game data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

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
  const recentGames = gameData.steam?.games || [];

  const recentMatches = gameData.faceit?.matches?.items || [];

  const stats = {
    totalGames: gameData.steam?.games?.length || 0,
    totalPlaytime: gameData.steam?.games?.reduce((acc, game) => acc + game.playtime_forever, 0) || 0,
    faceitElo: gameData.faceit?.stats?.faceit_elo || 0,
    winRate: gameData.faceit?.stats?.lifetime?.Average || 0,
    skillLevel: gameData.faceit?.stats?.skill_level || 0,
    kdRatio: 1.34, // Mock K/D ratio
    totalMatches: 1247, // Mock total matches
    wins: 786, // Mock wins
    losses: 461, // Mock losses
    currentStreak: 3, // Mock current streak
    longestStreak: 12 // Mock longest streak
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
