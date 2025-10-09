import { motion } from 'framer-motion';
import { useState } from 'react';
import { Map, Globe, List, MapPinned } from 'lucide-react';
import TravelWishlist from '../components/TravelWishlist';
import TravelMap from '../components/travel/TravelMap';
import InteractiveWorldMap from '../components/travel/InteractiveWorldMap';
import PhysicsButton from '../components/PhysicsButton';

/**
 * Travel page - displays both travel wishlist and interactive map
 */
export default function Travel() {
  const [activeTab, setActiveTab] = useState('wishlist');

  return (
    <div className="min-h-screen bg-gray-950 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-50 mb-2 flex items-center gap-3">
                <Globe className="text-blue-400" size={40} />
                Travel Explorer
              </h1>
              <p className="text-gray-400 text-lg">
                Plan your next adventure around the world
              </p>
            </div>
            
            {/* Tab Switcher */}
            <div className="flex items-center gap-2 bg-gray-800 p-1 rounded-xl flex-wrap">
              <PhysicsButton
                onClick={() => setActiveTab('wishlist')}
                icon={List}
                variant={activeTab === 'wishlist' ? 'primary' : 'ghost'}
                size="sm"
                className="hover:shadow-blue-500/25 hover:shadow-lg transition-all duration-300"
              >
                Country List
              </PhysicsButton>
              <PhysicsButton
                onClick={() => setActiveTab('map')}
                icon={Map}
                variant={activeTab === 'map' ? 'primary' : 'ghost'}
                size="sm"
                className="hover:shadow-blue-500/25 hover:shadow-lg transition-all duration-300"
              >
                Country Cards
              </PhysicsButton>
              <PhysicsButton
                onClick={() => setActiveTab('world')}
                icon={MapPinned}
                variant={activeTab === 'world' ? 'primary' : 'ghost'}
                size="sm"
                className="hover:shadow-blue-500/25 hover:shadow-lg transition-all duration-300"
              >
                World Map
              </PhysicsButton>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'wishlist' && <TravelWishlist />}
          {activeTab === 'map' && <TravelMap />}
          {activeTab === 'world' && <InteractiveWorldMap />}
        </motion.div>
      </div>
    </div>
  );
}
