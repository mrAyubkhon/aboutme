import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

const ProfileCard = ({ profile }) => {
  if (!profile) return null;

  return (
    <motion.div 
      className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 rounded-2xl p-6 border border-gray-600/50 backdrop-blur-sm shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      whileHover={{ y: -5, scale: 1.02 }}
    >
      <div className="flex items-center space-x-4">
        <div className="relative">
          <img
            src={profile.avatar || '/default-avatar.png'}
            alt={profile.personaname || 'Player'}
            className="w-16 h-16 rounded-full border-2 border-gray-600"
          />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-gray-800"></div>
        </div>
        
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-50 mb-1">
            {profile.personaname || 'Unknown Player'}
          </h3>
          <p className="text-gray-400 text-sm mb-2">
            {profile.realname || 'Steam User'}
          </p>
          <p className="text-gray-500 text-xs">
            Member since {profile.timecreated ? new Date(profile.timecreated * 1000).toLocaleDateString() : 'Unknown'}
          </p>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold text-yellow-400 mb-1">
            Level {profile.level || 'N/A'}
          </div>
          <p className="text-xs text-gray-400 mb-3">Steam Level</p>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm font-medium">
            <ExternalLink className="w-4 h-4" />
            <span>View Profile</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileCard;
