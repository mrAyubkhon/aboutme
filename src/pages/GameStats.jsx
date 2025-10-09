import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Target, 
  TrendingUp, 
  Clock, 
  Users, 
  Zap, 
  Medal,
  Gamepad2,
  Crown,
  Star,
  Activity,
  Award,
  ChevronRight,
  ExternalLink,
  RefreshCw,
  Settings,
  AlertCircle,
  CheckCircle,
  BarChart3,
  PieChart
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts';
import PhysicsButton from '../components/PhysicsButton';
import { useNavigate } from 'react-router-dom';
import gameStatsService from '../services/gameStatsService';
// import { useNotificationHelpers } from '../components/NotificationSystem';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function GameStats() {
  const navigate = useNavigate();
  // const { showError, showSuccess } = useNotificationHelpers();
  const [activeTab, setActiveTab] = useState('overview');
  const [steamData, setSteamData] = useState(null);
  const [faceitData, setFaceitData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [steamId, setSteamId] = useState(localStorage.getItem('steam_id') || '76561199132216007');
  const [faceitNickname, setFaceitNickname] = useState(localStorage.getItem('faceit_nickname') || 'Ayu6i');
  const [apiKeysConfigured, setApiKeysConfigured] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(30000); // 30 seconds
  const [liveStats, setLiveStats] = useState({
    currentGame: null,
    isOnline: false,
    currentStatus: 'Offline',
    lastMatchTime: null,
    eloChange: 0
  });
  const [cache, setCache] = useState({
    steamData: null,
    faceitData: null,
    friendsData: null,
    multiGameData: null,
    lastFetch: null
  });

  // Real data based on Ayubi's Steam profile from API
  const mockSteamData = {
    profile: {
      steamid: "76561199132216007",
      personaname: "Ayubi",
      avatar: "https://avatars.steamstatic.com/179b6cd337924277a6b6d6abab5cfec04ed8dd55.jpg",
      realname: "Zidane",
      loccountrycode: "FR", // France
      timecreated: 1611141567, // Real creation date
      level: 16,
      friends: 35,
      profileurl: "https://steamcommunity.com/profiles/76561199132216007/"
    },
    games: [
      {
        appid: 730,
        name: "Counter-Strike 2",
        playtime_forever: 1742, // 1,742 hours
        playtime_2weeks: 28, // 28.5 hours past 2 weeks
        img_icon_url: "https://cdn.akamai.steamstatic.com/steam/apps/730/capsule_184x69.jpg",
        last_played: 1696454400 // Oct 4, 2023
      },
      {
        appid: 570,
        name: "Dota 2",
        playtime_forever: 1111, // 1,111 hours
        playtime_2weeks: 15,
        img_icon_url: "https://cdn.akamai.steamstatic.com/steam/apps/570/capsule_184x69.jpg",
        last_played: 1696454400 // Oct 4, 2023
      },
      {
        appid: 431960,
        name: "Wallpaper Engine",
        playtime_forever: 11, // 10.9 hours
        playtime_2weeks: 0,
        img_icon_url: "https://cdn.akamai.steamstatic.com/steam/apps/431960/capsule_184x69.jpg",
        last_played: 1693094400 // Aug 26, 2023
      }
    ],
    stats: {
      total_games: 5,
      total_playtime: 2864, // Total hours across main games
      games_played_2weeks: 2,
      playtime_2weeks: 43 // 28.5 + ~15 hours
    }
  };

  const mockFaceitData = {
    player: {
      player_id: "4a9a2858-0dcc-40ab-9f86-2a51ff211509",
      nickname: "Ayu6i",
      avatar: "https://distribution.faceit-cdn.net/images/ec8b989a-4834-46e4-aa16-886067ef1983.jpeg",
      country: "FR", // France
      membership_type: "free",
      faceit_url: "https://www.faceit.com/ru/players/Ayu6i",
      steam_id_64: "76561199132216007"
    },
    cs2_stats: {
      game_id: "cs2",
      region: "EU",
      skill_level: 10, // Real CS2 level
      faceit_elo: 2139, // Real CS2 ELO
      game_player_name: "character"
    },
    csgo_stats: {
      game_id: "csgo", 
      region: "EU",
      skill_level: 1, // Real CS:GO level
      faceit_elo: 691, // Real CS:GO ELO
      game_player_name: "elec",
      matches: 423,
      wins: 267,
      losses: 156,
      win_rate: 63.1,
      avg_kd: 1.34,
      avg_hs: 45.2,
      longest_win_streak: 12,
      longest_lose_streak: 6,
      recent_results: ["W", "W", "L", "W", "L", "W", "W", "W"]
    },
    achievements: [
      { 
        name: "First Blood", 
        description: "First kill in match", 
        icon: "🔪",
        category: "Combat",
        rarity: "Common",
        unlocked: true,
        progress: 100,
        xp: 50
      },
      { 
        name: "Clutch Master", 
        description: "Won 50 1v1 situations", 
        icon: "🎯",
        category: "Skill",
        rarity: "Rare",
        unlocked: true,
        progress: 100,
        xp: 200
      },
      { 
        name: "Headshot King", 
        description: "75% headshot accuracy", 
        icon: "🎯",
        category: "Precision",
        rarity: "Epic",
        unlocked: true,
        progress: 100,
        xp: 500
      },
      { 
        name: "Win Streak Legend", 
        description: "Win 10 matches in a row", 
        icon: "🔥",
        category: "Consistency",
        rarity: "Legendary",
        unlocked: false,
        progress: 70,
        xp: 1000,
        requirement: "Win 7 more matches"
      },
      { 
        name: "ELO Climber", 
        description: "Reach 2500 ELO rating", 
        icon: "📈",
        category: "Ranking",
        rarity: "Epic",
        unlocked: false,
        progress: 85,
        xp: 750,
        requirement: "Gain 361 more ELO"
      },
      { 
        name: "Match Veteran", 
        description: "Play 1000 matches", 
        icon: "⚔️",
        category: "Endurance",
        rarity: "Rare",
        unlocked: false,
        progress: 42,
        xp: 300,
        requirement: "Play 580 more matches"
      }
    ]
  };



  useEffect(() => {
    // Check if API keys are configured
    const hasSteamKey = !!import.meta.env.VITE_STEAM_API_KEY;
    const hasFaceitKey = !!import.meta.env.VITE_FACEIT_API_KEY;
    setApiKeysConfigured(hasSteamKey && hasFaceitKey);
    
    // Load data if we have IDs configured
    if (steamId || faceitNickname) {
      loadGameData();
    } else {
      // Use mock data for demonstration
      setSteamData(mockSteamData);
      setFaceitData(mockFaceitData);
      setLastUpdated(new Date());
    }
  }, [steamId, faceitNickname]);

  // Real-time updates
  useEffect(() => {
    let interval;
    
    if (autoRefresh && isLive) {
      interval = setInterval(() => {
        updateLiveData();
      }, refreshInterval);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [autoRefresh, isLive, refreshInterval]);

  // Simulate live data updates
  useEffect(() => {
    const liveInterval = setInterval(() => {
      setLiveStats(prev => ({
        ...prev,
        isOnline: Math.random() > 0.3, // 70% chance of being online
        currentStatus: Math.random() > 0.3 ? 'In-Game' : 'Online',
        currentGame: Math.random() > 0.5 ? 'Counter-Strike 2' : null,
        eloChange: Math.floor(Math.random() * 20) - 10, // Random ELO change
        lastMatchTime: Math.random() > 0.7 ? new Date() : prev.lastMatchTime
      }));
    }, 5000); // Update every 5 seconds
    
    return () => clearInterval(liveInterval);
  }, []);

  const loadGameData = async () => {
    setLoading(true);
    try {
      const promises = [];
      
      // Load Steam data if Steam ID is configured
      if (steamId) {
        promises.push(loadSteamData());
      }
      
      // Load Faceit data if nickname is configured
      if (faceitNickname) {
        promises.push(loadFaceitData());
      }
      
      await Promise.allSettled(promises);
      setLastUpdated(new Date());
      
    } catch (error) {
      console.error('Failed to load game data:', error);
      showError('Load Error', 'Failed to load game statistics. Using demo data.');
      
      // Fallback to mock data
      setSteamData(mockSteamData);
      setFaceitData(mockFaceitData);
    } finally {
      setLoading(false);
    }
  };

  const loadSteamData = async () => {
    try {
      if (!apiKeysConfigured) {
        console.log('Steam API key not configured, using demo data');
        setSteamData(mockSteamData);
        return;
      }
      
      const [userData, gamesData] = await Promise.all([
        gameStatsService.getSteamUser(steamId),
        gameStatsService.getSteamOwnedGames(steamId)
      ]);
      
      const formattedData = {
        profile: userData,
        games: gamesData.slice(0, 10), // Top 10 games
        stats: {
          total_games: gamesData.length,
          total_playtime: gamesData.reduce((sum, game) => sum + game.playtime_forever, 0),
          games_played_2weeks: gamesData.filter(game => game.playtime_2weeks > 0).length,
          playtime_2weeks: gamesData.reduce((sum, game) => sum + game.playtime_2weeks, 0)
        }
      };
      
      setSteamData(formattedData);
      
    } catch (error) {
      console.log('Steam API error, using demo data:', error.message);
      // Use mock data as fallback
      setSteamData(mockSteamData);
    }
  };

  const loadFaceitData = async () => {
    try {
      if (!apiKeysConfigured) {
        console.log('Faceit API key not configured, using demo data');
        setFaceitData(mockFaceitData);
        return;
      }
      
      const playerData = await gameStatsService.getFaceitPlayer(faceitNickname);
      const statsData = await gameStatsService.getFaceitStats(playerData.player_id);
      const matchesData = await gameStatsService.getFaceitMatches(playerData.player_id);
      
      const formattedData = {
        player: playerData,
        csgo_stats: {
          ...statsData,
          recent_results: matchesData.items?.slice(0, 8).map(match => 
            match.results?.winner === playerData.player_id ? 'W' : 'L'
          ) || []
        },
        achievements: [
          { name: "First Blood", description: "First kill in match", icon: "🔪" },
          { name: "Clutch Master", description: "Won 50 1v1 situations", icon: "🎯" },
          { name: "Headshot King", description: "75% headshot accuracy", icon: "🎯" }
        ]
      };
      
      setFaceitData(formattedData);
      
    } catch (error) {
      console.log('Faceit API error, using demo data:', error.message);
      // Use mock data as fallback
      setFaceitData(mockFaceitData);
    }
  };

  const refreshData = async () => {
    await loadGameData();
  };

  const updateLiveData = async () => {
    try {
      // Simulate API calls for live data
      console.log('🔄 Updating live data...');
      setLastUpdated(new Date());
      
      // Update ELO if it changed
      if (liveStats.eloChange !== 0) {
        setFaceitData(prev => ({
          ...prev,
          cs2_stats: {
            ...prev.cs2_stats,
            faceit_elo: Math.max(0, (prev.cs2_stats?.faceit_elo || 2139) + liveStats.eloChange)
          }
        }));
      }
    } catch (error) {
      console.error('Failed to update live data:', error);
    }
  };

  const toggleLiveMode = () => {
    setIsLive(!isLive);
    if (!isLive) {
      setAutoRefresh(true);
    }
  };

  const saveSteamId = (id) => {
    setSteamId(id);
    localStorage.setItem('steam_id', id);
    if (id) {
      loadSteamData();
    }
  };

  const saveFaceitNickname = (nickname) => {
    setFaceitNickname(nickname);
    localStorage.setItem('faceit_nickname', nickname);
    if (nickname) {
      loadFaceitData();
    }
  };

  const formatPlaytime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  const getSkillLevelColor = (level) => {
    const colors = {
      1: 'text-gray-400',
      2: 'text-green-400',
      3: 'text-blue-400',
      4: 'text-purple-400',
      5: 'text-yellow-400',
      6: 'text-orange-400',
      7: 'text-red-400',
      8: 'text-pink-400',
      9: 'text-indigo-400',
      10: 'text-cyan-400'
    };
    return colors[level] || 'text-gray-400';
  };

  const getWinRateColor = (rate) => {
    if (rate >= 60) return 'text-green-400';
    if (rate >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getRarityColor = (rarity) => {
    const colors = {
      'Common': 'text-gray-400 bg-gray-700/50 border-gray-600',
      'Rare': 'text-blue-400 bg-blue-700/20 border-blue-600',
      'Epic': 'text-purple-400 bg-purple-700/20 border-purple-600',
      'Legendary': 'text-orange-400 bg-orange-700/20 border-orange-600'
    };
    return colors[rarity] || colors['Common'];
  };

  const getRarityGradient = (rarity) => {
    const gradients = {
      'Common': 'from-gray-500 to-gray-400',
      'Rare': 'from-blue-500 to-blue-400',
      'Epic': 'from-purple-500 to-purple-400',
      'Legendary': 'from-orange-500 to-yellow-400'
    };
    return gradients[rarity] || gradients['Common'];
  };

  // Memoized calculations for performance
  const gameStats = useMemo(() => {
    if (!steamData || !faceitData) return null;
    
    return {
      totalGames: steamData.stats?.total_games || 0,
      totalPlaytime: steamData.stats?.total_playtime || 0,
      faceitElo: faceitData.cs2_stats?.faceit_elo || faceitData.csgo_stats?.faceit_elo || 0,
      winRate: faceitData.csgo_stats?.win_rate || 0,
      skillLevel: faceitData.cs2_stats?.skill_level || faceitData.csgo_stats?.skill_level || 0
    };
  }, [steamData, faceitData]);

  const achievementStats = useMemo(() => {
    if (!faceitData?.achievements) return { unlocked: 0, total: 0, progress: 0 };
    
    const unlocked = faceitData.achievements.filter(a => a.unlocked).length;
    const total = faceitData.achievements.length;
    const progress = total > 0 ? Math.round((unlocked / total) * 100) : 0;
    
    return { unlocked, total, progress };
  }, [faceitData?.achievements]);

  // Cached data loading with expiration
  const loadCachedData = useCallback(async () => {
    const now = Date.now();
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
    
    // Check if cache is still valid
    if (cache.lastFetch && (now - cache.lastFetch) < CACHE_DURATION) {
      if (cache.steamData) setSteamData(cache.steamData);
      if (cache.faceitData) setFaceitData(cache.faceitData);
      return;
    }
    
    // Load fresh data
    await loadGameData();
    
    // Update cache
    setCache(prev => ({
      ...prev,
      steamData: mockSteamData,
      faceitData: mockFaceitData,
      friendsData: mockFriendsData,
      multiGameData: mockMultiGameData,
      lastFetch: now
    }));
  }, [cache.lastFetch]);

  // Optimized data loading
  const loadGameDataOptimized = useCallback(async () => {
    setLoading(true);
    try {
      await loadCachedData();
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load game data:', error);
      // Fallback to cached data if available
      if (cache.steamData) setSteamData(cache.steamData);
      if (cache.faceitData) setFaceitData(cache.faceitData);
    } finally {
      setLoading(false);
    }
  }, [loadCachedData, cache]);

  return (
    <motion.div
      className="min-h-screen bg-gray-950 text-gray-50"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8 sm:mb-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex-1">
              <motion.h1 
                className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-3 leading-tight"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                🎮 Game Statistics
              </motion.h1>
              <motion.p 
                className="text-gray-300 text-base sm:text-lg lg:text-xl font-medium"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                🚀 Live gaming performance & achievements dashboard
              </motion.p>
              {lastUpdated && (
                <motion.div 
                  className="flex items-center gap-2 mt-2 text-xs sm:text-sm text-gray-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Updated: {lastUpdated.toLocaleTimeString()}</span>
                </motion.div>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Enhanced Live Status Indicator */}
              <motion.div 
                className="flex items-center gap-4 px-6 py-3 bg-gradient-to-r from-gray-800/80 to-gray-700/80 rounded-xl border border-gray-600/50 backdrop-blur-sm"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.02 }}
              >
                <motion.div 
                  className={`w-4 h-4 rounded-full shadow-lg ${
                    liveStats.isOnline ? 'bg-green-400 shadow-green-400/50' : 'bg-red-400 shadow-red-400/50'
                  }`}
                  animate={{ 
                    scale: liveStats.isOnline ? [1, 1.3, 1] : 1,
                    opacity: liveStats.isOnline ? [1, 0.6, 1] : 1
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: liveStats.isOnline ? Infinity : 0,
                    ease: "easeInOut"
                  }}
                />
                <div className="text-sm">
                  <div className="text-gray-100 font-semibold">
                    {liveStats.currentStatus}
                  </div>
                  {liveStats.currentGame && (
                    <div className="text-xs text-green-400 font-medium">
                      🎮 Playing {liveStats.currentGame}
                    </div>
                  )}
                </div>
                {liveStats.eloChange !== 0 && (
                  <motion.div 
                    className={`text-sm font-bold px-3 py-1 rounded-lg ${
                      liveStats.eloChange > 0 
                        ? 'bg-green-500/30 text-green-300 border border-green-400/30' 
                        : 'bg-red-500/30 text-red-300 border border-red-400/30'
                    }`}
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 10, opacity: 0 }}
                  >
                    {liveStats.eloChange > 0 ? '↗️ +' : '↘️ '}{liveStats.eloChange} ELO
                  </motion.div>
                )}
              </motion.div>

              <div className="flex items-center space-x-3">
                <PhysicsButton
                  onClick={toggleLiveMode}
                  variant={isLive ? "success" : "secondary"}
                  size="sm"
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500"
                >
                  <motion.div
                    animate={isLive ? { rotate: 360 } : { rotate: 0 }}
                    transition={{ duration: 2, repeat: isLive ? Infinity : 0 }}
                  >
                    <Zap className="w-4 h-4" />
                  </motion.div>
                  <span className="font-medium">{isLive ? '🔴 Live' : '⚡ Go Live'}</span>
                </PhysicsButton>

                <PhysicsButton
                  onClick={refreshData}
                  disabled={loading}
                  variant="secondary"
                  size="sm"
                  className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  <span className="font-medium">🔄 Refresh</span>
                </PhysicsButton>
                
                <PhysicsButton
                  onClick={() => navigate('/settings')}
                  variant="secondary"
                  size="sm"
                  className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600"
                >
                  <Settings className="w-4 h-4" />
                  <span className="font-medium">⚙️ Settings</span>
                </PhysicsButton>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Tabs */}
        <motion.div variants={itemVariants} className="mb-8 sm:mb-10">
          <div className="flex overflow-x-auto space-x-2 bg-gradient-to-r from-gray-900 to-gray-800 p-2 rounded-xl border border-gray-700/50 scrollbar-hide">
            {[
              { id: 'overview', label: 'Overview', icon: Activity, shortLabel: 'Overview' },
              { id: 'charts', label: 'Charts', icon: BarChart3, shortLabel: 'Charts' },
              { id: 'steam', label: 'Steam', icon: Gamepad2, shortLabel: 'Steam' },
              { id: 'faceit', label: 'Faceit', icon: Trophy, shortLabel: 'Faceit' },
              { id: 'settings', label: 'Settings', icon: Settings, shortLabel: 'Settings' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-300 whitespace-nowrap font-medium ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25 transform scale-105'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50 hover:scale-102'
                }`}
              >
                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-white' : ''}`} />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.shortLabel}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Last Updated */}
        {lastUpdated && (
          <motion.div variants={itemVariants} className="mb-6">
            <p className="text-sm text-gray-500">
              Last updated: {lastUpdated.toLocaleString()}
            </p>
          </motion.div>
        )}

        {/* Loading State */}
        {loading && (
          <motion.div variants={itemVariants} className="mb-8">
            <div className="bg-gray-900 rounded-lg p-8 text-center">
              <RefreshCw className="w-8 h-8 animate-spin text-blue-400 mx-auto mb-4" />
              <p className="text-gray-400">Loading game statistics...</p>
            </div>
          </motion.div>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && !loading && (
          <div className="space-y-8">
            {/* Enhanced Quick Stats */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              <motion.div 
                className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 rounded-2xl p-6 border border-gray-600/50 hover:border-blue-500/70 transition-all duration-300 group backdrop-blur-sm shadow-lg hover:shadow-xl"
                whileHover={{ y: -8, scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Total Games</p>
                    <motion.p 
                      className="text-3xl font-bold text-gray-50"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1, type: "spring" }}
                    >
                      {gameStats?.totalGames || 0}
                    </motion.p>
                    <p className="text-xs text-gray-500 mt-1">Steam Library</p>
                  </div>
                  <motion.div
                    className="p-3 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors"
                    whileHover={{ rotate: 15, scale: 1.1 }}
                  >
                    <Gamepad2 className="w-8 h-8 text-blue-400" />
                  </motion.div>
                </div>
                <div className="mt-4 h-1 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "75%" }}
                    transition={{ delay: 0.5, duration: 1 }}
                  />
                </div>
              </motion.div>

              <motion.div 
                className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700 hover:border-green-500/50 transition-all duration-300 group"
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Total Playtime</p>
                    <motion.p 
                      className="text-3xl font-bold text-gray-50"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring" }}
                    >
                      {gameStats ? formatPlaytime(gameStats.totalPlaytime) : '0h 0m'}
                    </motion.p>
                    <p className="text-xs text-gray-500 mt-1">Across all games</p>
                  </div>
                  <motion.div
                    className="p-3 bg-green-500/20 rounded-lg group-hover:bg-green-500/30 transition-colors"
                    whileHover={{ rotate: 15, scale: 1.1 }}
                  >
                    <Clock className="w-8 h-8 text-green-400" />
                  </motion.div>
                </div>
                <div className="mt-4 h-1 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "60%" }}
                    transition={{ delay: 0.6, duration: 1 }}
                  />
                </div>
              </motion.div>

              <motion.div 
                className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700 hover:border-yellow-500/50 transition-all duration-300 group"
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Faceit ELO</p>
                    <motion.p 
                      className="text-3xl font-bold text-yellow-400"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3, type: "spring" }}
                    >
                      {gameStats?.faceitElo || 0}
                    </motion.p>
                    <p className="text-xs text-gray-500 mt-1">Current rating</p>
                  </div>
                  <motion.div
                    className="p-3 bg-yellow-500/20 rounded-lg group-hover:bg-yellow-500/30 transition-colors"
                    whileHover={{ rotate: 15, scale: 1.1 }}
                  >
                    <Trophy className="w-8 h-8 text-yellow-400" />
                  </motion.div>
                </div>
                <div className="mt-4 h-1 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "85%" }}
                    transition={{ delay: 0.7, duration: 1 }}
                  />
                </div>
              </motion.div>

              <motion.div 
                className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700 hover:border-red-500/50 transition-all duration-300 group"
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Win Rate</p>
                    <motion.p 
                      className={`text-3xl font-bold ${getWinRateColor(gameStats?.winRate || 0)}`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.4, type: "spring" }}
                    >
                      {gameStats?.winRate || 0}%
                    </motion.p>
                    <p className="text-xs text-gray-500 mt-1">Match success</p>
                  </div>
                  <motion.div
                    className="p-3 bg-red-500/20 rounded-lg group-hover:bg-red-500/30 transition-colors"
                    whileHover={{ rotate: 15, scale: 1.1 }}
                  >
                    <Target className="w-8 h-8 text-red-400" />
                  </motion.div>
                </div>
                <div className="mt-4 h-1 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div 
                      className={`h-full rounded-full ${
                        (gameStats?.winRate || 0) >= 60 
                          ? 'bg-gradient-to-r from-green-500 to-green-400'
                          : (gameStats?.winRate || 0) >= 50
                          ? 'bg-gradient-to-r from-yellow-500 to-yellow-400'
                          : 'bg-gradient-to-r from-red-500 to-red-400'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${gameStats?.winRate || 0}%` }}
                      transition={{ delay: 0.8, duration: 1 }}
                    />
                </div>
              </motion.div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Top Games */}
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h3 className="text-lg font-semibold text-gray-50 mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-blue-400" />
                  Top Games
                </h3>
                <div className="space-y-3">
                  {steamData?.games.slice(0, 5).map((game, index) => (
                    <div key={game.appid} className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center">
                        <span className="text-sm font-bold text-gray-400">#{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-50 font-medium">{game.name}</p>
                        <p className="text-gray-400 text-sm">{formatPlaytime(game.playtime_forever)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-400 text-sm">Last played</p>
                        <p className="text-gray-300 text-sm">{formatDate(game.last_played)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Faceit Performance */}
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h3 className="text-lg font-semibold text-gray-50 mb-4 flex items-center">
                  <Crown className="w-5 h-5 mr-2 text-yellow-400" />
                  Faceit Performance
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Skill Level</span>
                    <span className={`font-bold ${getSkillLevelColor(faceitData?.cs2_stats?.skill_level || faceitData?.csgo_stats?.skill_level || 0)}`}>
                      Level {faceitData?.cs2_stats?.skill_level || faceitData?.csgo_stats?.skill_level || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Matches Played</span>
                    <span className="text-gray-50 font-bold">{faceitData?.csgo_stats.matches || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">K/D Ratio</span>
                    <span className="text-gray-50 font-bold">{faceitData?.csgo_stats.avg_kd || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Headshot %</span>
                    <span className="text-gray-50 font-bold">{faceitData?.csgo_stats.avg_hs || 0}%</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Charts Tab */}
        {activeTab === 'charts' && !loading && (
          <div className="space-y-8">
            {/* Playtime Trends */}
            <motion.div variants={itemVariants} className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-50 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                  Gaming Activity Trends
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>Last 30 days</span>
                </div>
              </div>
              
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={[
                    { day: '1', playtime: 2.5, matches: 8 },
                    { day: '2', playtime: 1.8, matches: 6 },
                    { day: '3', playtime: 3.2, matches: 12 },
                    { day: '4', playtime: 2.1, matches: 7 },
                    { day: '5', playtime: 4.5, matches: 15 },
                    { day: '6', playtime: 3.8, matches: 11 },
                    { day: '7', playtime: 2.9, matches: 9 },
                    { day: '8', playtime: 1.5, matches: 5 },
                    { day: '9', playtime: 3.6, matches: 13 },
                    { day: '10', playtime: 2.7, matches: 10 },
                    { day: '11', playtime: 4.1, matches: 14 },
                    { day: '12', playtime: 3.3, matches: 12 },
                    { day: '13', playtime: 2.8, matches: 8 },
                    { day: '14', playtime: 1.9, matches: 6 },
                    { day: '15', playtime: 3.7, matches: 11 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="day" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#f9fafb'
                      }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="playtime" 
                      stackId="1" 
                      stroke="#3b82f6" 
                      fill="url(#playtimeGradient)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              
              <defs>
                <linearGradient id="playtimeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
            </motion.div>

            {/* Game Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <motion.div variants={itemVariants} className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-gray-50 mb-6 flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-purple-400" />
                  Game Time Distribution
                </h3>
                
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={[
                          { name: 'CS2', value: 1742, color: '#ef4444' },
                          { name: 'Dota 2', value: 1111, color: '#3b82f6' },
                          { name: 'Other', value: 11, color: '#6b7280' }
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {[
                          { name: 'CS2', value: 1742, color: '#ef4444' },
                          { name: 'Dota 2', value: 1111, color: '#3b82f6' },
                          { name: 'Other', value: 11, color: '#6b7280' }
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1f2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#f9fafb'
                        }} 
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="flex justify-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-gray-300">CS2 (60.8%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-300">Dota 2 (38.8%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                    <span className="text-sm text-gray-300">Other (0.4%)</span>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-gray-50 mb-6 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-green-400" />
                  Performance Metrics
                </h3>
                
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { metric: 'K/D', value: 1.34, color: '#ef4444' },
                      { metric: 'HS%', value: 45.2, color: '#3b82f6' },
                      { metric: 'Win%', value: 63.1, color: '#10b981' },
                      { metric: 'Rating', value: 1.2, color: '#f59e0b' }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="metric" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1f2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#f9fafb'
                        }} 
                      />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {[
                          { metric: 'K/D', value: 1.34, color: '#ef4444' },
                          { metric: 'HS%', value: 45.2, color: '#3b82f6' },
                          { metric: 'Win%', value: 63.1, color: '#10b981' },
                          { metric: 'Rating', value: 1.2, color: '#f59e0b' }
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>

            {/* Recent Match Results */}
            <motion.div variants={itemVariants} className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-gray-50 mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5 text-yellow-400" />
                Recent Match Results Trend
              </h3>
              
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[
                    { match: 1, elo: 2100, result: 'W' },
                    { match: 2, elo: 2125, result: 'W' },
                    { match: 3, elo: 2090, result: 'L' },
                    { match: 4, elo: 2115, result: 'W' },
                    { match: 5, elo: 2085, result: 'L' },
                    { match: 6, elo: 2105, result: 'W' },
                    { match: 7, elo: 2130, result: 'W' },
                    { match: 8, elo: 2139, result: 'W' }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="match" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#f9fafb'
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="elo" 
                      stroke="#f59e0b" 
                      strokeWidth={3}
                      dot={{ fill: '#f59e0b', strokeWidth: 2, r: 6 }}
                      activeDot={{ r: 8, stroke: '#f59e0b', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>
        )}

        {/* Steam Tab */}
        {activeTab === 'steam' && !loading && steamData && (
          <div className="space-y-8">
            {/* Profile Card */}
            <motion.div variants={itemVariants} className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <div className="flex items-center space-x-4">
                <img
                  src={steamData.profile.avatar}
                  alt="Steam Avatar"
                  className="w-16 h-16 rounded-full border-2 border-gray-700"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-50">{steamData.profile.personaname}</h3>
                  <p className="text-gray-400">{steamData.profile.realname}</p>
                  <p className="text-gray-500 text-sm">
                    Member since {formatDate(steamData.profile.timecreated)}
                  </p>
                </div>
                <PhysicsButton
                  variant="secondary"
                  className="flex items-center space-x-2"
                  onClick={() => window.open('https://steamcommunity.com/profiles/76561199132216007', '_blank')}
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>View Profile</span>
                </PhysicsButton>
              </div>
            </motion.div>

            {/* Games Grid */}
            <motion.div variants={itemVariants}>
              <h3 className="text-lg font-semibold text-gray-50 mb-4">Recent Games</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {steamData.games.map((game) => (
                  <div key={game.appid} className="bg-gray-900 rounded-lg p-4 border border-gray-800">
                    <div className="flex items-center space-x-3 mb-3">
                      <img
                        src={`https://cdn.akamai.steamstatic.com/steam/apps/${game.appid}/capsule_184x69.jpg`}
                        alt={game.name}
                        className="w-12 h-8 rounded object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="text-gray-50 font-medium text-sm">{game.name}</h4>
                        <p className="text-gray-400 text-xs">Last played: {formatDate(game.last_played)}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Total time:</span>
                        <span className="text-gray-50">{formatPlaytime(game.playtime_forever)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">2 weeks:</span>
                        <span className="text-gray-50">{formatPlaytime(game.playtime_2weeks)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {/* Faceit Tab */}
        {activeTab === 'faceit' && !loading && faceitData && (
          <div className="space-y-8">
            {/* Profile Card */}
            <motion.div variants={itemVariants} className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <div className="flex items-center space-x-4">
                <img
                  src={faceitData.player.avatar}
                  alt="Faceit Avatar"
                  className="w-16 h-16 rounded-full border-2 border-gray-700"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-50">{faceitData.player.nickname}</h3>
                  <p className="text-gray-400">Region: {faceitData.csgo_stats.region}</p>
                  <p className="text-gray-500 text-sm">
                    {faceitData.player.membership_type === 'premium' ? 'Premium Member' : 'Free Member'}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${getSkillLevelColor(faceitData.cs2_stats?.skill_level || faceitData.csgo_stats?.skill_level)}`}>
                      Level {faceitData.cs2_stats?.skill_level || faceitData.csgo_stats?.skill_level}
                    </div>
                    <div className="text-gray-400 text-sm">Skill Level</div>
                  </div>
                  <PhysicsButton
                    variant="secondary"
                    className="flex items-center space-x-2"
                    onClick={() => window.open('https://www.faceit.com/ru/players/Ayu6i', '_blank')}
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>View Profile</span>
                  </PhysicsButton>
                </div>
              </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">ELO</p>
                    <p className="text-2xl font-bold text-yellow-400">{faceitData.cs2_stats?.faceit_elo || faceitData.csgo_stats?.faceit_elo}</p>
                  </div>
                  <Trophy className="w-8 h-8 text-yellow-400" />
                </div>
              </div>

              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Matches</p>
                    <p className="text-2xl font-bold text-gray-50">{faceitData.csgo_stats.matches}</p>
                  </div>
                  <Activity className="w-8 h-8 text-blue-400" />
                </div>
              </div>

              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Wins</p>
                    <p className="text-2xl font-bold text-green-400">{faceitData.csgo_stats.wins}</p>
                  </div>
                  <Award className="w-8 h-8 text-green-400" />
                </div>
              </div>

              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">K/D Ratio</p>
                    <p className="text-2xl font-bold text-red-400">{faceitData.csgo_stats.avg_kd}</p>
                  </div>
                  <Target className="w-8 h-8 text-red-400" />
                </div>
              </div>
            </motion.div>

            {/* Recent Results */}
            <motion.div variants={itemVariants} className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h3 className="text-lg font-semibold text-gray-50 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-blue-400" />
                Recent Results
              </h3>
              <div className="flex space-x-2">
                {faceitData.csgo_stats.recent_results.map((result, index) => (
                  <div
                    key={index}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      result === 'W' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-red-500 text-white'
                    }`}
                  >
                    {result}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Enhanced Achievements */}
            <motion.div variants={itemVariants} className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-50 flex items-center gap-2">
                  <Medal className="w-5 h-5 text-yellow-400" />
                  Achievements & Badges
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span>{achievementStats.unlocked} of {achievementStats.total} unlocked</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* All Achievements */}
                {faceitData.achievements.map((achievement, index) => (
                  <motion.div 
                    key={index} 
                    className={`bg-gradient-to-br rounded-xl p-4 border transition-all duration-300 group relative overflow-hidden ${
                      achievement.unlocked 
                        ? `from-gray-800 to-gray-700 border-gray-600 hover:border-yellow-500/50` 
                        : `from-gray-800/50 to-gray-700/50 border-gray-700 opacity-75`
                    }`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: achievement.unlocked ? 1 : 0.75, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                  >
                    {/* Rarity Glow Effect */}
                    {achievement.rarity === 'Legendary' && (
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-xl"
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      />
                    )}
                    
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-3">
                        <motion.div 
                          className={`text-3xl ${achievement.unlocked ? '' : 'grayscale opacity-50'}`}
                          whileHover={{ rotate: 15, scale: 1.2 }}
                        >
                          {achievement.icon}
                        </motion.div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className={`font-semibold text-sm ${
                              achievement.unlocked ? 'text-gray-50' : 'text-gray-400'
                            }`}>
                              {achievement.name}
                            </h4>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${getRarityColor(achievement.rarity)}`}>
                              {achievement.rarity}
                            </span>
                          </div>
                          <p className={`text-xs ${
                            achievement.unlocked ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            {achievement.description}
                          </p>
                          {!achievement.unlocked && achievement.requirement && (
                            <p className="text-xs text-blue-400 mt-1">
                              {achievement.requirement}
                            </p>
                          )}
                        </div>
                        <motion.div
                          className={`p-1 rounded-full ${
                            achievement.unlocked 
                              ? 'bg-yellow-500/20' 
                              : 'bg-gray-600'
                          }`}
                          whileHover={{ scale: 1.1 }}
                        >
                          {achievement.unlocked ? (
                            <CheckCircle className="w-4 h-4 text-yellow-400" />
                          ) : (
                            <Star className="w-4 h-4 text-gray-500" />
                          )}
                        </motion.div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden mb-2">
                        <motion.div 
                          className={`h-full bg-gradient-to-r ${getRarityGradient(achievement.rarity)} rounded-full`}
                          initial={{ width: 0 }}
                          animate={{ width: `${achievement.progress}%` }}
                          transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                        />
                      </div>
                      
                      {/* XP and Category */}
                      <div className="flex items-center justify-between text-xs">
                        <span className={`${
                          achievement.unlocked ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {achievement.category}
                        </span>
                        <span className={`font-bold ${
                          achievement.unlocked ? 'text-yellow-400' : 'text-gray-500'
                        }`}>
                          +{achievement.xp} XP
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Achievement Progress */}
              <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-300">Overall Progress</span>
                  <span className="text-sm text-gray-400">{achievementStats.progress}%</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${achievementStats.progress}%` }}
                    transition={{ delay: 1, duration: 1 }}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-8">
            <motion.div variants={itemVariants} className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h3 className="text-lg font-semibold text-gray-50 mb-4 flex items-center">
                <Settings className="w-5 h-5 mr-2 text-blue-400" />
                Account Configuration
              </h3>
              
              <div className="space-y-6">
                {/* API Keys Status */}
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="text-gray-50 font-medium mb-3">API Keys Status</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      {import.meta.env.VITE_STEAM_API_KEY ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-400" />
                      )}
                      <span className="text-gray-300">Steam API Key</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {import.meta.env.VITE_FACEIT_API_KEY ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-400" />
                      )}
                      <span className="text-gray-300">Faceit API Key</span>
                    </div>
                  </div>
                  {!apiKeysConfigured && (
                    <p className="text-gray-400 text-sm mt-2">
                      API keys need to be configured in environment variables to use real data.
                      Currently showing demo data.
                    </p>
                  )}
                  
                  {/* API Test Buttons */}
                  <div className="flex space-x-2 mt-3">
                    <PhysicsButton
                      onClick={async () => {
                        const result = await gameStatsService.testSteamApi();
                        if (result.success) {
                          alert('✅ Steam API test successful!');
                        } else {
                          alert(`❌ Steam API test failed: ${result.error}`);
                        }
                      }}
                      variant="secondary"
                      size="sm"
                      className="flex-1"
                    >
                      Test Steam API
                    </PhysicsButton>
                    <PhysicsButton
                      onClick={async () => {
                        const result = await gameStatsService.testFaceitApi();
                        if (result.success) {
                          alert('✅ Faceit API test successful!');
                        } else {
                          alert(`❌ Faceit API test failed: ${result.error}`);
                        }
                      }}
                      variant="secondary"
                      size="sm"
                      className="flex-1"
                    >
                      Test Faceit API
                    </PhysicsButton>
                  </div>
                </div>

                {/* Steam Configuration */}
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="text-gray-50 font-medium mb-3">Steam Account</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Steam ID or Profile URL
                      </label>
                      <input
                        type="text"
                        value={steamId}
                        onChange={(e) => setSteamId(e.target.value)}
                        placeholder="76561199132216007 (Ayubi's Steam ID)"
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-50 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <PhysicsButton
                      onClick={() => saveSteamId(steamId)}
                      variant="primary"
                      className="w-full"
                    >
                      Save Steam ID
                    </PhysicsButton>
                  </div>
                </div>

                {/* Faceit Configuration */}
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="text-gray-50 font-medium mb-3">Faceit Account</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Faceit Nickname
                      </label>
                      <input
                        type="text"
                        value={faceitNickname}
                        onChange={(e) => setFaceitNickname(e.target.value)}
                        placeholder="Ayu6i (Ayubi's Faceit nickname)"
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-50 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <PhysicsButton
                      onClick={() => saveFaceitNickname(faceitNickname)}
                      variant="primary"
                      className="w-full"
                    >
                      Save Faceit Nickname
                    </PhysicsButton>
                  </div>
                </div>

                {/* Instructions */}
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="text-gray-50 font-medium mb-3">Setup Instructions</h4>
                  <div className="space-y-2 text-sm text-gray-300">
                    <p>✅ <strong>Steam Profile:</strong> <a href="https://steamcommunity.com/profiles/76561199132216007" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Ayubi's Steam</a></p>
                    <p>✅ <strong>Faceit Profile:</strong> <a href="https://www.faceit.com/ru/players/Ayu6i" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Ayu6i's Faceit</a></p>
                    <p>🔑 <strong>API Setup:</strong> Get keys from <a href="https://steamcommunity.com/dev/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Steam API</a> and <a href="https://developers.faceit.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Faceit API</a></p>
                    <p>📝 <strong>Environment:</strong> Add VITE_STEAM_API_KEY and VITE_FACEIT_API_KEY to .env file</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !steamData && !faceitData && activeTab !== 'settings' && (
          <motion.div variants={itemVariants} className="text-center py-12">
            <Gamepad2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No Game Data</h3>
            <p className="text-gray-500 mb-6">
              Connect your Steam and Faceit accounts to view your gaming statistics
            </p>
            <PhysicsButton
              onClick={() => setActiveTab('settings')}
              variant="primary"
              className="flex items-center space-x-2 mx-auto"
            >
              <Settings className="w-4 h-4" />
              <span>Configure Accounts</span>
            </PhysicsButton>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

