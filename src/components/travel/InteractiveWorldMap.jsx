import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  X,
  MapPin,
  Globe,
  TrendingUp,
  Check
} from 'lucide-react';
import PhysicsButton from '../PhysicsButton';
import EnhancedProgressBar from '../EnhancedProgressBar';

// Simplified world regions with coordinates for visual map
const worldRegions = {
  'Europe': {
    position: { x: 50, y: 30 },
    color: '#3b82f6',
    countries: [
      { name: 'France', iso3: 'FRA', flag: '🇫🇷' },
      { name: 'Germany', iso3: 'DEU', flag: '🇩🇪' },
      { name: 'Italy', iso3: 'ITA', flag: '🇮🇹' },
      { name: 'Spain', iso3: 'ESP', flag: '🇪🇸' },
      { name: 'United Kingdom', iso3: 'GBR', flag: '🇬🇧' },
      { name: 'Netherlands', iso3: 'NLD', flag: '🇳🇱' },
      { name: 'Switzerland', iso3: 'CHE', flag: '🇨🇭' },
      { name: 'Austria', iso3: 'AUT', flag: '🇦🇹' },
      { name: 'Belgium', iso3: 'BEL', flag: '🇧🇪' },
      { name: 'Poland', iso3: 'POL', flag: '🇵🇱' },
      { name: 'Czech Republic', iso3: 'CZE', flag: '🇨🇿' },
      { name: 'Greece', iso3: 'GRC', flag: '🇬🇷' },
      { name: 'Portugal', iso3: 'PRT', flag: '🇵🇹' },
      { name: 'Sweden', iso3: 'SWE', flag: '🇸🇪' },
      { name: 'Norway', iso3: 'NOR', flag: '🇳🇴' },
      { name: 'Denmark', iso3: 'DNK', flag: '🇩🇰' },
      { name: 'Finland', iso3: 'FIN', flag: '🇫🇮' },
      { name: 'Ireland', iso3: 'IRL', flag: '🇮🇪' },
    ]
  },
  'Asia': {
    position: { x: 65, y: 35 },
    color: '#ef4444',
    countries: [
      { name: 'Japan', iso3: 'JPN', flag: '🇯🇵' },
      { name: 'South Korea', iso3: 'KOR', flag: '🇰🇷' },
      { name: 'China', iso3: 'CHN', flag: '🇨🇳' },
      { name: 'Thailand', iso3: 'THA', flag: '🇹🇭' },
      { name: 'Singapore', iso3: 'SGP', flag: '🇸🇬' },
      { name: 'Malaysia', iso3: 'MYS', flag: '🇲🇾' },
      { name: 'Vietnam', iso3: 'VNM', flag: '🇻🇳' },
      { name: 'UAE', iso3: 'ARE', flag: '🇦🇪' },
      { name: 'Turkey', iso3: 'TUR', flag: '🇹🇷' },
      { name: 'India', iso3: 'IND', flag: '🇮🇳' },
      { name: 'Indonesia', iso3: 'IDN', flag: '🇮🇩' },
      { name: 'Israel', iso3: 'ISR', flag: '🇮🇱' },
    ]
  },
  'North America': {
    position: { x: 20, y: 30 },
    color: '#10b981',
    countries: [
      { name: 'United States', iso3: 'USA', flag: '🇺🇸' },
      { name: 'Canada', iso3: 'CAN', flag: '🇨🇦' },
      { name: 'Mexico', iso3: 'MEX', flag: '🇲🇽' },
      { name: 'Costa Rica', iso3: 'CRI', flag: '🇨🇷' },
      { name: 'Panama', iso3: 'PAN', flag: '🇵🇦' },
    ]
  },
  'South America': {
    position: { x: 30, y: 60 },
    color: '#f59e0b',
    countries: [
      { name: 'Brazil', iso3: 'BRA', flag: '🇧🇷' },
      { name: 'Argentina', iso3: 'ARG', flag: '🇦🇷' },
      { name: 'Chile', iso3: 'CHL', flag: '🇨🇱' },
      { name: 'Peru', iso3: 'PER', flag: '🇵🇪' },
      { name: 'Colombia', iso3: 'COL', flag: '🇨🇴' },
      { name: 'Uruguay', iso3: 'URY', flag: '🇺🇾' },
      { name: 'Ecuador', iso3: 'ECU', flag: '🇪🇨' },
    ]
  },
  'Oceania': {
    position: { x: 80, y: 65 },
    color: '#8b5cf6',
    countries: [
      { name: 'Australia', iso3: 'AUS', flag: '🇦🇺' },
      { name: 'New Zealand', iso3: 'NZL', flag: '🇳🇿' },
      { name: 'Fiji', iso3: 'FJI', flag: '🇫🇯' },
    ]
  }
};

/**
 * Enhanced Interactive World Map Component
 */
export default function InteractiveWorldMap() {
  const [wishlist, setWishlist] = useState(new Set());
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);

  // Load wishlist from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('travel_wishlist_iso');
    if (saved) {
      try {
        setWishlist(new Set(JSON.parse(saved)));
      } catch (error) {
        console.error('Error loading wishlist:', error);
      }
    }
  }, []);

  // Save wishlist to localStorage
  useEffect(() => {
    localStorage.setItem('travel_wishlist_iso', JSON.stringify([...wishlist]));
  }, [wishlist]);

  // Toggle country in wishlist
  const toggleWishlist = (countryIso3) => {
    setWishlist(prev => {
      const newWishlist = new Set(prev);
      if (newWishlist.has(countryIso3)) {
        newWishlist.delete(countryIso3);
      } else {
        newWishlist.add(countryIso3);
      }
      return newWishlist;
    });
  };

  // Calculate statistics
  const totalCountries = Object.values(worldRegions).reduce((acc, region) => acc + region.countries.length, 0);
  const selectedCount = wishlist.size;

  return (
    <div className="space-y-8">
      {/* Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Countries Selected</span>
            <Globe className="text-blue-400" size={20} />
          </div>
          <div className="text-3xl font-bold text-gray-50">{selectedCount}</div>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Total Countries</span>
            <MapPin className="text-green-400" size={20} />
          </div>
          <div className="text-3xl font-bold text-gray-50">{totalCountries}</div>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Progress</span>
            <TrendingUp className="text-purple-400" size={20} />
          </div>
          <div className="text-3xl font-bold text-gray-50">
            {totalCountries > 0 ? Math.round((selectedCount / totalCountries) * 100) : 0}%
          </div>
        </div>
      </motion.div>

      {/* Interactive Map Visualization */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700 relative overflow-hidden"
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="relative">
          <h3 className="text-2xl font-bold text-gray-50 mb-6 text-center flex items-center justify-center gap-2">
            <Globe className="text-blue-400" size={28} />
            World Regions Map
          </h3>

          {/* SVG World Map */}
          <svg 
            viewBox="0 0 100 80" 
            className="w-full h-auto"
            style={{ maxHeight: '500px' }}
          >
            {/* Ocean background */}
            <rect x="0" y="0" width="100" height="80" fill="#0a192f" opacity="0.3" />
            
            {/* Grid lines */}
            {[...Array(10)].map((_, i) => (
              <React.Fragment key={`grid-${i}`}>
                <line 
                  x1={i * 10} 
                  y1="0" 
                  x2={i * 10} 
                  y2="80" 
                  stroke="#1f2937" 
                  strokeWidth="0.1"
                  opacity="0.3"
                />
                <line 
                  x1="0" 
                  y1={i * 8} 
                  x2="100" 
                  y2={i * 8} 
                  stroke="#1f2937" 
                  strokeWidth="0.1"
                  opacity="0.3"
                />
              </React.Fragment>
            ))}

            {/* Region circles */}
            {Object.entries(worldRegions).map(([regionName, region]) => {
              const isHovered = hoveredRegion === regionName;
              const isSelected = selectedRegion === regionName;
              const regionCountriesInWishlist = region.countries.filter(c => wishlist.has(c.iso3)).length;
              const allSelected = regionCountriesInWishlist === region.countries.length;
              
              return (
                <motion.g
                  key={regionName}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  onMouseEnter={() => setHoveredRegion(regionName)}
                  onMouseLeave={() => setHoveredRegion(null)}
                  onClick={() => setSelectedRegion(isSelected ? null : regionName)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Glow effect */}
                  {(isHovered || isSelected) && (
                    <circle
                      cx={region.position.x}
                      cy={region.position.y}
                      r={isSelected ? 8 : 7}
                      fill={region.color}
                      opacity="0.2"
                      className="animate-pulse"
                    />
                  )}
                  
                  {/* Main circle */}
                  <circle
                    cx={region.position.x}
                    cy={region.position.y}
                    r={isHovered || isSelected ? 5 : 4}
                    fill={allSelected ? '#10b981' : region.color}
                    stroke={isSelected ? '#fff' : region.color}
                    strokeWidth={isSelected ? 0.5 : 0.3}
                    opacity={isHovered || isSelected ? 1 : 0.8}
                    className="transition-all duration-300"
                  />
                  
                  {/* Progress indicator */}
                  {regionCountriesInWishlist > 0 && (
                    <circle
                      cx={region.position.x}
                      cy={region.position.y}
                      r={3}
                      fill="none"
                      stroke="#10b981"
                      strokeWidth={0.8}
                      opacity={0.8}
                    />
                  )}

                  {/* Label */}
                  <text
                    x={region.position.x}
                    y={region.position.y + 8}
                    textAnchor="middle"
                    fill="#fff"
                    fontSize="2.5"
                    fontWeight={isSelected ? "bold" : "normal"}
                    opacity={isHovered || isSelected ? 1 : 0.7}
                  >
                    {regionName}
                  </text>

                  {/* Country count */}
                  <text
                    x={region.position.x}
                    y={region.position.y + 10.5}
                    textAnchor="middle"
                    fill="#9ca3af"
                    fontSize="1.8"
                    opacity={0.8}
                  >
                    {regionCountriesInWishlist}/{region.countries.length}
                  </text>
                </motion.g>
              );
            })}

            {/* Connection lines for selected region */}
            {selectedRegion && (
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {Object.entries(worldRegions).map(([name, region]) => {
                  if (name !== selectedRegion) {
                    const selectedPos = worldRegions[selectedRegion].position;
                    return (
                      <line
                        key={name}
                        x1={selectedPos.x}
                        y1={selectedPos.y}
                        x2={region.position.x}
                        y2={region.position.y}
                        stroke={worldRegions[selectedRegion].color}
                        strokeWidth="0.1"
                        opacity="0.2"
                        strokeDasharray="1,1"
                      />
                    );
                  }
                  return null;
                })}
              </motion.g>
            )}
          </svg>

          {/* Legend */}
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            {Object.entries(worldRegions).map(([regionName, region]) => (
              <div key={regionName} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: region.color }}
                ></div>
                <span className="text-sm text-gray-400">{regionName}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Selected Region Countries */}
      <AnimatePresence>
        {selectedRegion && (
          <motion.div
            initial={{ opacity: 0, y: 20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-50 flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: worldRegions[selectedRegion].color }}
                  ></div>
                  {selectedRegion} Countries
                </h3>
                <PhysicsButton
                  onClick={() => setSelectedRegion(null)}
                  icon={X}
                  variant="ghost"
                  size="sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {worldRegions[selectedRegion].countries.map((country) => {
                  const isInWishlist = wishlist.has(country.iso3);
                  
                  return (
                    <motion.div
                      key={country.iso3}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.05 }}
                      className={`
                        p-4 rounded-lg border transition-all duration-300 cursor-pointer
                        ${isInWishlist 
                          ? 'bg-green-500/20 border-green-500/50' 
                          : 'bg-gray-700 border-gray-600 hover:border-blue-500'
                        }
                      `}
                      onClick={() => setSelectedCountry(country)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{country.flag}</span>
                          <span className="font-medium text-gray-50">{country.name}</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(country.iso3);
                          }}
                          className={`
                            p-1 rounded-full transition-colors
                            ${isInWishlist 
                              ? 'text-green-500 hover:bg-green-500/20' 
                              : 'text-gray-400 hover:bg-gray-600 hover:text-green-500'
                            }
                          `}
                        >
                          {isInWishlist ? <Check size={16} /> : <Heart size={16} />}
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Country Detail Modal */}
      <AnimatePresence>
        {selectedCountry && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSelectedCountry(null)}
            />
            <motion.div
              className="relative bg-gray-900 p-6 rounded-xl border border-gray-700 shadow-2xl max-w-md w-full"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
            >
              <PhysicsButton
                onClick={() => setSelectedCountry(null)}
                icon={X}
                variant="ghost"
                size="sm"
                className="absolute top-3 right-3"
              />
              
              <div className="flex items-center mb-4">
                <span className="text-4xl mr-3">{selectedCountry.flag}</span>
                <div>
                  <h3 className="text-2xl font-bold text-gray-50">{selectedCountry.name}</h3>
                  <p className="text-gray-400 text-sm">{selectedCountry.iso3}</p>
                </div>
              </div>

              <div className="mb-6">
                <div className={`
                  px-4 py-2 rounded-lg text-center font-semibold
                  ${wishlist.has(selectedCountry.iso3)
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-gray-800 text-gray-400'
                  }
                `}>
                  {wishlist.has(selectedCountry.iso3) ? '✓ In Your Wishlist' : 'Not in Wishlist'}
                </div>
              </div>

              <PhysicsButton
                onClick={() => {
                  toggleWishlist(selectedCountry.iso3);
                  setSelectedCountry(null);
                }}
                icon={wishlist.has(selectedCountry.iso3) ? X : Heart}
                variant={wishlist.has(selectedCountry.iso3) ? 'danger' : 'primary'}
                className="w-full"
              >
                {wishlist.has(selectedCountry.iso3) ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </PhysicsButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

