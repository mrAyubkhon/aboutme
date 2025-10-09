import React from 'react';
import { motion } from 'framer-motion';

const RecentResults = ({ results }) => {
  if (!results || results.length === 0) return null;

  return (
    <motion.div 
      className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 rounded-2xl p-6 border border-gray-600/50 backdrop-blur-sm shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h3 className="text-xl font-bold text-gray-50 mb-6 flex items-center gap-2">
        <span className="text-2xl">🔥</span>
        Recent Results
      </h3>
      
      <div className="flex items-center gap-3 flex-wrap">
        {results.map((result, index) => (
          <motion.div
            key={index}
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-lg ${
              result === 'W' 
                ? 'bg-green-500 text-white shadow-green-500/50' 
                : 'bg-red-500 text-white shadow-red-500/50'
            }`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            whileHover={{ scale: 1.2, y: -2 }}
            whileTap={{ scale: 0.9 }}
          >
            {result}
          </motion.div>
        ))}
      </div>
      
      <div className="mt-4 flex items-center justify-between text-sm">
        <div className="text-gray-400">
          Last {results.length} matches
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-400">
              {results.filter(r => r === 'W').length} Wins
            </span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-gray-400">
              {results.filter(r => r === 'L').length} Losses
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RecentResults;
