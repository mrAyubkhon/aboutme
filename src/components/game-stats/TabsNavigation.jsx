import React from 'react';
import { motion } from 'framer-motion';
import { Activity, BarChart3, Gamepad2, Trophy, Settings } from 'lucide-react';

const TabsNavigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity, shortLabel: 'Overview' },
    { id: 'charts', label: 'Charts', icon: BarChart3, shortLabel: 'Charts' },
    { id: 'steam', label: 'Steam', icon: Gamepad2, shortLabel: 'Steam' },
    { id: 'faceit', label: 'Faceit', icon: Trophy, shortLabel: 'Faceit' },
    { id: 'settings', label: 'Settings', icon: Settings, shortLabel: 'Settings' }
  ];

  return (
    <motion.div 
      className="mb-8 sm:mb-10 sticky top-0 z-40 bg-gray-950/95 backdrop-blur-sm border-b border-gray-800/50"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex overflow-x-auto space-x-2 bg-gradient-to-r from-gray-900 to-gray-800 p-2 rounded-xl border border-gray-700/50 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-300 whitespace-nowrap font-medium ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25 transform scale-105'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50 hover:scale-102'
              }`}
            >
              <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-white' : ''}`} />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.shortLabel}</span>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default TabsNavigation;
