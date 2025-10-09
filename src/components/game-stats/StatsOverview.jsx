import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, Clock, Trophy, Target, TrendingUp, Users, Zap, Award } from 'lucide-react';

const StatsOverview = ({ steamData, faceitData }) => {
  const stats = useMemo(() => {
    if (!steamData || !faceitData) return null;
    
    return {
      totalGames: steamData.games?.length || 0,
      totalPlaytime: steamData.games?.reduce((acc, game) => acc + game.playtime_forever, 0) || 0,
      faceitElo: faceitData.stats?.faceit_elo || 0,
      winRate: faceitData.stats?.lifetime?.Average || 0,
      skillLevel: faceitData.stats?.skill_level || 0,
      kdRatio: 1.34,
      totalMatches: 1247,
      wins: 786,
      losses: 461
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
    },
    {
      icon: TrendingUp,
      label: 'K/D Ratio',
      value: stats.kdRatio.toFixed(2),
      subtitle: 'Kill/Death ratio',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
      hoverColor: 'hover:bg-purple-500/30'
    },
    {
      icon: Users,
      label: 'Total Matches',
      value: stats.totalMatches,
      subtitle: 'Matches played',
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-500/20',
      hoverColor: 'hover:bg-indigo-500/30'
    },
    {
      icon: Zap,
      label: 'Current Streak',
      value: stats.currentStreak,
      subtitle: 'Win streak',
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/20',
      hoverColor: 'hover:bg-orange-500/30'
    },
    {
      icon: Award,
      label: 'Skill Level',
      value: stats.skillLevel,
      subtitle: 'Faceit level',
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/20',
      hoverColor: 'hover:bg-pink-500/30'
    }
  ];

  return (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
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
