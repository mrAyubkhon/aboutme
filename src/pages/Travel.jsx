import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Map, Globe, ArrowRight } from 'lucide-react';
import TravelWishlist from '../components/TravelWishlist';
import PhysicsButton from '../components/PhysicsButton';

/**
 * Travel page - displays the travel wishlist component with navigation
 */
export default function Travel() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-950 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Navigation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-50 mb-2 flex items-center gap-3">
                <Globe className="text-blue-400" size={40} />
                Travel Wishlist
              </h1>
              <p className="text-gray-400 text-lg">
                Plan your next adventure around the world
              </p>
            </div>
            
            <PhysicsButton
              onClick={() => navigate('/travel-map')}
              icon={Map}
              variant="primary"
              size="lg"
              className="hover:shadow-blue-500/25 hover:shadow-lg transition-all duration-300"
            >
              <span className="flex items-center gap-2">
                Interactive Map
                <ArrowRight size={16} />
              </span>
            </PhysicsButton>
          </div>
        </motion.div>

        {/* Travel Wishlist Component */}
        <TravelWishlist />
      </div>
    </div>
  );
}
