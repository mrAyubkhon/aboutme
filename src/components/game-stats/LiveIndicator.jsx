import React from 'react';
import { motion } from 'framer-motion';

const LiveIndicator = ({ 
  isOnline, 
  currentStatus, 
  currentGame, 
  eloChange 
}) => {
  return (
    <motion.div 
      className="flex items-center gap-4 px-6 py-3 bg-gradient-to-r from-gray-800/80 to-gray-700/80 rounded-xl border border-gray-600/50 backdrop-blur-sm"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5 }}
      whileHover={{ scale: 1.02 }}
    >
      <motion.div 
        className={`w-4 h-4 rounded-full shadow-lg ${
          isOnline ? 'bg-green-400 shadow-green-400/50' : 'bg-red-400 shadow-red-400/50'
        }`}
        animate={{ 
          scale: isOnline ? [1, 1.3, 1] : 1,
          opacity: isOnline ? [1, 0.6, 1] : 1
        }}
        transition={{ 
          duration: 2, 
          repeat: isOnline ? Infinity : 0,
          ease: "easeInOut"
        }}
      />
      
      <div className="text-sm">
        <div className="text-gray-100 font-semibold">
          {currentStatus}
        </div>
        {currentGame && (
          <div className="text-xs text-green-400 font-medium">
            🎮 Playing {currentGame}
          </div>
        )}
      </div>
      
      {eloChange !== 0 && (
        <motion.div 
          className={`text-sm font-bold px-3 py-1 rounded-lg ${
            eloChange > 0 
              ? 'bg-green-500/30 text-green-300 border border-green-400/30' 
              : 'bg-red-500/30 text-red-300 border border-red-400/30'
          }`}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 10, opacity: 0 }}
        >
          {eloChange > 0 ? '↗️ +' : '↘️ '}{eloChange} ELO
        </motion.div>
      )}
    </motion.div>
  );
};

export default LiveIndicator;
