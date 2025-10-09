import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Trophy, 
  Target, 
  Clock, 
  Gamepad2, 
  Zap, 
  RefreshCw, 
  Settings,
  Activity,
  TrendingUp,
  Award,
  Users,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

// Import real API hook
import useRealGameStats from '../hooks/useRealGameStats';

// Import components
import StatsHeader from './game-stats/StatsHeader';
import LiveIndicator from './game-stats/LiveIndicator';
import TabsNavigation from './game-stats/TabsNavigation';
import ProfileCard from './game-stats/ProfileCard';
import RecentGames from './game-stats/RecentGames';
import MatchHistory from './game-stats/MatchHistory';
import RecentResults from './game-stats/RecentResults';

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

const GameStatsReal = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Use real API hook
  const {
    gameData,
    loading,
    error,
    lastUpdated,
    isLive,
    liveStats,
    recentGames,
    recentMatches,
    ownedGames,
    stats,
    toggleLiveMode,
    refreshData
  } = useRealGameStats();

  // Mock data for recent results (Win/Lose circles)
  const recentResults = ['W', 'W', 'L', 'W', 'W', 'L', 'W', 'W', 'W', 'L'];

  // Stat cards configuration
  const statCards = [
    {
      icon: Gamepad2,
      label: 'Total Games',
      value: stats.totalGames,
      subtitle: 'Steam Library',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20'
    },
    {
      icon: Clock,
      label: 'Total Playtime',
      value: formatPlaytime(stats.totalPlaytime),
      subtitle: 'Across all games',
      color: 'text-green-400',
      bgColor: 'bg-green-500/20'
    },
    {
      icon: Trophy,
      label: 'Faceit ELO',
      value: stats.faceitElo,
      subtitle: 'Current rating',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20'
    },
    {
      icon: Target,
      label: 'Win Rate',
      value: `${stats.winRate}%`,
      subtitle: 'Match success',
      color: getWinRateColor(stats.winRate),
      bgColor: 'bg-red-500/20'
    },
    {
      icon: TrendingUp,
      label: 'K/D Ratio',
      value: stats.kdRatio.toFixed(2),
      subtitle: 'Kill/Death ratio',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20'
    },
    {
      icon: Users,
      label: 'Total Matches',
      value: stats.totalMatches,
      subtitle: 'Matches played',
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-500/20'
    },
    {
      icon: Zap,
      label: 'Current Streak',
      value: stats.currentStreak,
      subtitle: 'Win streak',
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/20'
    },
    {
      icon: Award,
      label: 'Skill Level',
      value: stats.skillLevel,
      subtitle: 'Faceit level',
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/20'
    }
  ];

  // Utility functions
  function formatPlaytime(minutes) {
    if (!minutes) return '0h 0m';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }

  function getWinRateColor(rate) {
    if (rate >= 60) return 'text-green-400';
    if (rate >= 50) return 'text-yellow-400';
    return 'text-red-400';
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-50 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-500/20 border border-red-500/50 rounded-2xl p-8 max-w-md mx-auto"
          >
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-400 mb-4">API Error</h2>
            <p className="text-gray-300 mb-6">{error}</p>
            <button 
              onClick={refreshData}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition-colors font-medium"
            >
              Retry Connection
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gray-950 text-gray-50 pt-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Header */}
        <StatsHeader 
          lastUpdated={lastUpdated}
          isLive={isLive}
          toggleLiveMode={toggleLiveMode}
          refreshData={refreshData}
          loading={loading}
          navigate={navigate}
        />

        {/* Live Status Indicator */}
        <motion.div variants={itemVariants} className="mb-8">
          <LiveIndicator 
            isOnline={liveStats.isOnline}
            currentStatus={liveStats.currentStatus}
            currentGame={liveStats.currentGame}
            eloChange={liveStats.eloChange}
          />
        </motion.div>

        {/* API Status Indicator */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="bg-gradient-to-r from-green-800/20 to-green-700/20 border border-green-500/30 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <div>
                <div className="text-green-300 font-semibold">Real API Connected</div>
                <div className="text-green-400 text-sm">
                  Steam & Faceit APIs active • Last updated: {lastUpdated?.toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs Navigation */}
        <TabsNavigation 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* Content based on active tab */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading real game data...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Statistics Cards */}
                <motion.div 
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
                  variants={itemVariants}
                >
                  {statCards.map((card, index) => (
                    <motion.div 
                      key={card.label}
                      className={`bg-gradient-to-br from-gray-900/90 to-gray-800/90 rounded-2xl p-6 border border-gray-600/50 backdrop-blur-sm shadow-lg hover:bg-gray-700/30 transition-all duration-300 group`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      whileHover={{ y: -8, scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-400 text-sm mb-1">{card.label}</p>
                          <motion.p 
                            className={`text-3xl font-bold ${card.color}`}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
                          >
                            {card.value}
                          </motion.p>
                          <p className="text-xs text-gray-500 mt-1">{card.subtitle}</p>
                        </div>
                        <motion.div
                          className={`p-3 rounded-lg ${card.bgColor} group-hover:scale-110 transition-transform`}
                          whileHover={{ rotate: 15, scale: 1.1 }}
                        >
                          <card.icon className={`w-8 h-8 ${card.color}`} />
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <ProfileCard profile={gameData.steam?.profile} />
                  <RecentGames games={recentGames} />
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <MatchHistory matches={recentMatches} />
                  <RecentResults results={recentResults} />
                </div>
              </div>
            )}

            {/* Steam Tab */}
            {activeTab === 'steam' && (
              <div className="space-y-8">
                <ProfileCard profile={gameData.steam?.profile} />
                <RecentGames games={recentGames} />
              </div>
            )}

            {/* Faceit Tab */}
            {activeTab === 'faceit' && (
              <div className="space-y-8">
                <motion.div 
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                  variants={itemVariants}
                >
                  {statCards.slice(2, 6).map((card, index) => (
                    <motion.div 
                      key={card.label}
                      className={`bg-gradient-to-br from-gray-900/90 to-gray-800/90 rounded-2xl p-6 border border-gray-600/50 backdrop-blur-sm shadow-lg`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-400 text-sm mb-1">{card.label}</p>
                          <p className={`text-3xl font-bold ${card.color}`}>
                            {card.value}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{card.subtitle}</p>
                        </div>
                        <div className={`p-3 rounded-lg ${card.bgColor}`}>
                          <card.icon className={`w-8 h-8 ${card.color}`} />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <MatchHistory matches={recentMatches} />
                  <RecentResults results={recentResults} />
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-8">
                <motion.div variants={itemVariants} className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700">
                  <h3 className="text-xl font-bold text-gray-50 mb-6">API Configuration</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Steam API Key
                        </label>
                        <input
                          type="password"
                          className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value="C21D331F3CA3B28F0A1723AA596EEF8E"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Faceit API Key
                        </label>
                        <input
                          type="password"
                          className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value="2491711f-76d3-44dc-b7b5-7a9053d79114"
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Steam ID
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value="76561199132216007"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Faceit Nickname
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value="Ayu6i"
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span className="text-green-300 font-medium">APIs are active and connected</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};

export default GameStatsReal;
