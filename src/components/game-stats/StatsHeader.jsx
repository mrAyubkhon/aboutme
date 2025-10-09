import React from 'react';
import { motion } from 'framer-motion';
import { Zap, RefreshCw, Settings } from 'lucide-react';
import PhysicsButton from '../PhysicsButton';

const StatsHeader = ({ 
  lastUpdated, 
  isLive, 
  toggleLiveMode, 
  refreshData, 
  loading, 
  navigate 
}) => {
  return (
    <motion.div 
      className="mb-8 sm:mb-10"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex-1">
          <motion.h1 
            className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4 leading-tight pt-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            🎮 Game Statistics
          </motion.h1>
          
          <motion.p 
            className="text-gray-300 text-base sm:text-lg lg:text-xl font-medium mb-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            🚀 Live gaming performance & achievements dashboard
          </motion.p>
          
          {lastUpdated && (
            <motion.div 
              className="flex items-center gap-2 text-xs sm:text-sm text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Updated: {lastUpdated.toLocaleTimeString()}</span>
            </motion.div>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
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
  );
};

export default StatsHeader;
