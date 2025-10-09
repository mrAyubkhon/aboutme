import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Import new components
import StatsHeader from '../components/game-stats/StatsHeader';
import LiveIndicator from '../components/game-stats/LiveIndicator';
import TabsNavigation from '../components/game-stats/TabsNavigation';
import StatsOverview from '../components/game-stats/StatsOverview';
import ProfileCard from '../components/game-stats/ProfileCard';
import RecentGames from '../components/game-stats/RecentGames';
import MatchHistory from '../components/game-stats/MatchHistory';
import RecentResults from '../components/game-stats/RecentResults';

// Import hooks
import useGameStats from '../hooks/useGameStats';

// Import charts components
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
  Cell, 
  Pie 
} from 'recharts';

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

const GameStats = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Use the custom hook for game stats
  const {
    gameData,
    loading,
    error,
    lastUpdated,
    isLive,
    liveStats,
    recentGames,
    recentMatches,
    stats,
    toggleLiveMode,
    refreshData
  } = useGameStats();

  // Mock data for charts (replace with real data from API)
  const chartData = [
    { day: 'Mon', playtime: 120, matches: 8, wins: 5 },
    { day: 'Tue', playtime: 180, matches: 12, wins: 8 },
    { day: 'Wed', playtime: 90, matches: 6, wins: 4 },
    { day: 'Thu', playtime: 240, matches: 16, wins: 10 },
    { day: 'Fri', playtime: 300, matches: 20, wins: 12 },
    { day: 'Sat', playtime: 420, matches: 28, wins: 18 },
    { day: 'Sun', playtime: 360, matches: 24, wins: 15 }
  ];

  const gameDistribution = [
    { name: 'CS2', value: 45, color: '#3b82f6' },
    { name: 'Dota 2', value: 30, color: '#10b981' },
    { name: 'Other', value: 25, color: '#6b7280' }
  ];

  const performanceData = [
    { metric: 'K/D', value: 1.34, color: '#ef4444' },
    { metric: 'HS%', value: 45.2, color: '#f59e0b' },
    { metric: 'Win%', value: 63.1, color: '#10b981' },
    { metric: 'Rating', value: 1.2, color: '#8b5cf6' }
  ];

  const eloTrendData = [
    { match: 1, elo: 2100 },
    { match: 2, elo: 2115 },
    { match: 3, elo: 2098 },
    { match: 4, elo: 2123 },
    { match: 5, elo: 2139 },
    { match: 6, elo: 2152 },
    { match: 7, elo: 2139 }
  ];

  // Mock data for recent results (Win/Lose circles)
  const recentResults = ['W', 'W', 'L', 'W', 'W', 'L', 'W', 'W', 'W', 'L'];

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Error Loading Data</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button 
            onClick={refreshData}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Retry
          </button>
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

        {/* Tabs Navigation */}
        <TabsNavigation 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* Content based on active tab */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <StatsOverview 
                  steamData={gameData.steam}
                  faceitData={gameData.faceit}
                />
                
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

            {/* Charts Tab */}
            {activeTab === 'charts' && (
              <div className="space-y-8">
                {/* Gaming Activity Trends */}
                <motion.div variants={itemVariants} className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700">
                  <h3 className="text-xl font-bold text-gray-50 mb-6">Gaming Activity Trends</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorPlaytime" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af' }} />
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
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
                        stroke="#3b82f6" 
                        fillOpacity={1} 
                        fill="url(#colorPlaytime)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </motion.div>

                {/* Game Distribution */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <motion.div variants={itemVariants} className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700">
                    <h3 className="text-xl font-bold text-gray-50 mb-6">Game Time Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsPieChart>
                        <Pie
                          data={gameDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {gameDistribution.map((entry, index) => (
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
                  </motion.div>

                  <motion.div variants={itemVariants} className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700">
                    <h3 className="text-xl font-bold text-gray-50 mb-6">Performance Metrics</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={performanceData}>
                        <XAxis dataKey="metric" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af' }} />
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1f2937', 
                            border: '1px solid #374151', 
                            borderRadius: '8px',
                            color: '#f9fafb'
                          }} 
                        />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                          {performanceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </motion.div>
                </div>

                {/* ELO Trend */}
                <motion.div variants={itemVariants} className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700">
                  <h3 className="text-xl font-bold text-gray-50 mb-6">Recent ELO Changes</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={eloTrendData}>
                      <XAxis dataKey="match" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af' }} />
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
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
                </motion.div>
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
                <StatsOverview 
                  steamData={gameData.steam}
                  faceitData={gameData.faceit}
                />
                
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
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Steam API Key
                      </label>
                      <input
                        type="password"
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your Steam API key"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Faceit API Key
                      </label>
                      <input
                        type="password"
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your Faceit API key"
                      />
                    </div>
                    <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-medium">
                      Save Configuration
                    </button>
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

export default GameStats;