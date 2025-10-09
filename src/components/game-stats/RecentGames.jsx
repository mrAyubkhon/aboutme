import React from 'react';
import { motion } from 'framer-motion';

const RecentGames = ({ games }) => {
  if (!games || games.length === 0) return null;

  const formatPlaytime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  return (
    <motion.div 
      className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 rounded-2xl p-6 border border-gray-600/50 backdrop-blur-sm shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h3 className="text-xl font-bold text-gray-50 mb-6 flex items-center gap-2">
        <span className="text-2xl">🎮</span>
        Recent Games
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {games.slice(0, 6).map((game, index) => (
          <motion.div
            key={game.appid}
            className="bg-gradient-to-br from-gray-800/50 to-gray-700/50 rounded-xl p-4 border border-gray-600/30 hover:border-blue-500/50 transition-all duration-300"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            whileHover={{ y: -3, scale: 1.02 }}
          >
            <div className="flex items-start gap-3">
              <img
                src={`https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`}
                alt={game.name}
                className="w-12 h-12 rounded-lg"
                onError={(e) => {
                  e.target.src = '/default-game.png';
                }}
              />
              
              <div className="flex-1 min-w-0">
                <h4 className="text-gray-50 font-semibold text-sm mb-1 truncate">
                  {game.name}
                </h4>
                <p className="text-gray-400 text-xs mb-1">
                  Last played: {formatDate(game.rtime_last_played)}
                </p>
                <p className="text-gray-400 text-xs mb-1">
                  Total time: {formatPlaytime(game.playtime_forever)}
                </p>
                <p className="text-gray-500 text-xs">
                  2 weeks: {formatPlaytime(game.playtime_2weeks || 0)}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default RecentGames;
