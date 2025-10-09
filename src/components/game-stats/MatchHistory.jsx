import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

const MatchHistory = ({ matches }) => {
  if (!matches || matches.length === 0) return null;

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const getMatchIcon = (result) => {
    switch (result) {
      case 'win':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'loss':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getMatchColor = (result) => {
    switch (result) {
      case 'win':
        return 'bg-green-500/20 border-green-500/30 text-green-300';
      case 'loss':
        return 'bg-red-500/20 border-red-500/30 text-red-300';
      default:
        return 'bg-gray-500/20 border-gray-500/30 text-gray-300';
    }
  };

  return (
    <motion.div 
      className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 rounded-2xl p-6 border border-gray-600/50 backdrop-blur-sm shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h3 className="text-xl font-bold text-gray-50 mb-6 flex items-center gap-2">
        <span className="text-2xl">🎯</span>
        Recent Matches
      </h3>
      
      <div className="space-y-3">
        {matches.slice(0, 10).map((match, index) => (
          <motion.div
            key={match.match_id}
            className={`flex items-center justify-between p-3 rounded-lg border ${getMatchColor(match.result)}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-3">
              {getMatchIcon(match.result)}
              <div>
                <div className="font-medium capitalize">
                  {match.result === 'win' ? 'Victory' : match.result === 'loss' ? 'Defeat' : 'Unknown'}
                </div>
                <div className="text-xs opacity-75">
                  {formatDate(match.started_at)}
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-sm font-bold">
                {match.result === 'win' ? '+15' : match.result === 'loss' ? '-12' : '0'} ELO
              </div>
              <div className="text-xs opacity-75">
                {match.map || 'de_dust2'}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {matches.length > 10 && (
        <div className="mt-4 text-center">
          <button className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
            View All Matches ({matches.length})
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default MatchHistory;
