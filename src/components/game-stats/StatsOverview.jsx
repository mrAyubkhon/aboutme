import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, Clock, Trophy, Target } from 'lucide-react';

const StatsOverview = ({ steamData, faceitData }) => {
  const stats = useMemo(() => {
    if (!steamData || !faceitData) return null;
    
    return {
      totalGames: steamData.stats?.total_games || 0,
      totalPlaytime: steamData.stats?.total_playtime || 0,
      faceitElo: faceitData.cs2_stats?.faceit_elo || faceitData.csgo_stats?.faceit_elo || 0,
      winRate: faceitData.csgo_stats?.win_rate || 0,
      skillLevel: faceitData.cs2_stats?.skill_level || faceitData.csgo_stats?.skill_level || 0
    };
  }, [steamData, faceitData]);

  const formatPlaytime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getWinRateColor = (rate) => {
    if (rate >= 60) return 'text-green-400';
    if (rate >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  if (!stats) return null;

  const statCards = [
    {
      icon: Gamepad2,
      label: 'Total Games',
      value: stats.totalGames,
      subtitle: 'Steam Library',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      hoverColor: 'hover:bg-blue-500/30'
    },
    {
      icon: Clock,
      label: 'Total Playtime',
      value: formatPlaytime(stats.totalPlaytime),
      subtitle: 'Across all games',
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
      hoverColor: 'hover:bg-green-500/30'
    },
    {
      icon: Trophy,
      label: 'Faceit ELO',
      value: stats.faceitElo,
      subtitle: 'Current rating',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20',
      hoverColor: 'hover:bg-yellow-500/30'
    },
    {
      icon: Target,
      label: 'Win Rate',
      value: `${stats.winRate}%`,
      subtitle: 'Match success',
      color: getWinRateColor(stats.winRate),
      bgColor: 'bg-red-500/20',
      hoverColor: 'hover:bg-red-500/30'
    }
  ];

  return (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1 }}
    >
      {statCards.map((card, index) => (
        <motion.div 
          key={card.label}
          className={`bg-gradient-to-br from-gray-900/90 to-gray-800/90 rounded-2xl p-6 border border-gray-600/50 backdrop-blur-sm shadow-lg ${card.hoverColor} transition-all duration-300 group`}
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
          
          {card.label === 'Win Rate' && (
            <div className="mt-4 h-1 bg-gray-700 rounded-full overflow-hidden">
              <motion.div 
                className={`h-full rounded-full ${
                  stats.winRate >= 60 
                    ? 'bg-gradient-to-r from-green-500 to-green-400'
                    : stats.winRate >= 50
                    ? 'bg-gradient-to-r from-yellow-500 to-yellow-400'
                    : 'bg-gradient-to-r from-red-500 to-red-400'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${stats.winRate}%` }}
                transition={{ delay: 0.8, duration: 1 }}
              />
            </div>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default StatsOverview;
