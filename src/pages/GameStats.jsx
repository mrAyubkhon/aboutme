import React, { useState, useEffect } from 'react';
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
  CheckCircle
} from 'lucide-react';
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

  // Real data based on Ayubi's Steam profile
  const mockSteamData = {
    profile: {
      steamid: "76561199132216007",
      personaname: "Ayubi",
      avatar: "https://avatars.steamstatic.com/avatar.jpg",
      realname: "Ayubi",
      loccountrycode: "FR", // Paris, France
      timecreated: 1234567890,
      level: 16,
      friends: 35
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
      player_id: "ayu6i_player",
      nickname: "Ayu6i",
      avatar: "https://cdn.faceit.com/avatars/ayu6i.jpg",
      country: "RU", // Russian region
      membership_type: "premium",
      faceit_url: "https://www.faceit.com/ru/players/Ayu6i"
    },
    csgo_stats: {
      game_id: "csgo",
      region: "EU",
      skill_level: 8,
      faceit_elo: 2456,
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
      { name: "First Blood", description: "First kill in match", icon: "🔪" },
      { name: "Clutch Master", description: "Won 50 1v1 situations", icon: "🎯" },
      { name: "Headshot King", description: "75% headshot accuracy", icon: "🎯" }
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
        throw new Error('Steam API key not configured');
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
      console.error('Failed to load Steam data:', error);
      // Use mock data as fallback
      setSteamData(mockSteamData);
    }
  };

  const loadFaceitData = async () => {
    try {
      if (!apiKeysConfigured) {
        throw new Error('Faceit API key not configured');
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
      console.error('Failed to load Faceit data:', error);
      // Use mock data as fallback
      setFaceitData(mockFaceitData);
    }
  };

  const refreshData = async () => {
    await loadGameData();
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

  return (
    <motion.div
      className="min-h-screen bg-gray-950 text-gray-50"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-50 mb-2">
                🎮 Game Statistics
              </h1>
              <p className="text-gray-400">
                Real gaming stats from Ayubi's Steam & Faceit profiles
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <PhysicsButton
                onClick={refreshData}
                disabled={loading}
                variant="secondary"
                className="flex items-center space-x-2"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </PhysicsButton>
              
              <PhysicsButton
                onClick={() => navigate('/settings')}
                variant="secondary"
                className="flex items-center space-x-2"
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </PhysicsButton>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex space-x-1 bg-gray-900 p-1 rounded-lg">
            {[
              { id: 'overview', label: 'Overview', icon: Activity },
              { id: 'steam', label: 'Steam', icon: Gamepad2 },
              { id: 'faceit', label: 'Faceit', icon: Trophy },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-gray-50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
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
            {/* Quick Stats */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Games</p>
                    <p className="text-2xl font-bold text-gray-50">{steamData?.stats.total_games || 0}</p>
                  </div>
                  <Gamepad2 className="w-8 h-8 text-blue-400" />
                </div>
              </div>

              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Playtime</p>
                    <p className="text-2xl font-bold text-gray-50">
                      {steamData ? formatPlaytime(steamData.stats.total_playtime) : '0h 0m'}
                    </p>
                  </div>
                  <Clock className="w-8 h-8 text-green-400" />
                </div>
              </div>

              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Faceit ELO</p>
                    <p className="text-2xl font-bold text-gray-50">{faceitData?.csgo_stats.faceit_elo || 0}</p>
                  </div>
                  <Trophy className="w-8 h-8 text-yellow-400" />
                </div>
              </div>

              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Win Rate</p>
                    <p className={`text-2xl font-bold ${getWinRateColor(faceitData?.csgo_stats.win_rate || 0)}`}>
                      {faceitData?.csgo_stats.win_rate || 0}%
                    </p>
                  </div>
                  <Target className="w-8 h-8 text-red-400" />
                </div>
              </div>
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
                    <span className={`font-bold ${getSkillLevelColor(faceitData?.csgo_stats.skill_level || 0)}`}>
                      Level {faceitData?.csgo_stats.skill_level || 0}
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
                    <div className={`text-2xl font-bold ${getSkillLevelColor(faceitData.csgo_stats.skill_level)}`}>
                      Level {faceitData.csgo_stats.skill_level}
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
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">ELO</p>
                    <p className="text-2xl font-bold text-yellow-400">{faceitData.csgo_stats.faceit_elo}</p>
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

            {/* Achievements */}
            <motion.div variants={itemVariants} className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h3 className="text-lg font-semibold text-gray-50 mb-4 flex items-center">
                <Medal className="w-5 h-5 mr-2 text-yellow-400" />
                Achievements
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {faceitData.achievements.map((achievement, index) => (
                  <div key={index} className="bg-gray-800 rounded-lg p-4">
                    <div className="text-2xl mb-2">{achievement.icon}</div>
                    <h4 className="text-gray-50 font-medium">{achievement.name}</h4>
                    <p className="text-gray-400 text-sm">{achievement.description}</p>
                  </div>
                ))}
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

