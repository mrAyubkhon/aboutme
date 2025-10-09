import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Globe, 
  RotateCcw,
  X,
  MapPin,
  Target,
  TrendingUp
} from 'lucide-react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import PhysicsButton from '../PhysicsButton';
import EnhancedProgressBar from '../EnhancedProgressBar';

// Use the correct geo source with fallback
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

/**
 * Normalize country data to handle different property name formats
 */
const normalize = (geo) => {
  const properties = geo.properties;
  
  // Try different property name formats for world-atlas
  const iso = properties.ISO_A3 || properties.iso_a3 || properties.ISO_A3_EH || properties.iso_a3_eh || properties.ADM0_A3 || properties.adm0_a3;
  const name = properties.NAME || properties.name || properties.NAME_EN || properties.name_en || properties.NAME_LONG || properties.name_long || properties.ADMIN || properties.admin;
  const continent = properties.CONTINENT || properties.continent || properties.REGION_UN || properties.region_un || properties.REGION_WB || properties.region_wb;
  
  return {
    iso: iso || 'UNK',
    name: name || 'Unknown Country',
    continent: continent || 'Unknown'
  };
};

/**
 * Get country flag emoji based on ISO code or name
 */
const getCountryFlag = (iso, name) => {
  const flagMap = {
    'USA': '🇺🇸', 'CAN': '🇨🇦', 'MEX': '🇲🇽', 'GBR': '🇬🇧', 'FRA': '🇫🇷',
    'DEU': '🇩🇪', 'ITA': '🇮🇹', 'ESP': '🇪🇸', 'PRT': '🇵🇹', 'NLD': '🇳🇱',
    'BEL': '🇧🇪', 'CHE': '🇨🇭', 'AUT': '🇦🇹', 'POL': '🇵🇱', 'CZE': '🇨🇿',
    'SVK': '🇸🇰', 'HUN': '🇭🇺', 'ROU': '🇷🇴', 'BGR': '🇧🇬', 'GRC': '🇬🇷',
    'HRV': '🇭🇷', 'SVN': '🇸🇮', 'SRB': '🇷🇸', 'BIH': '🇧🇦', 'MNE': '🇲🇪',
    'ALB': '🇦🇱', 'MKD': '🇲🇰', 'JPN': '🇯🇵', 'KOR': '🇰🇷', 'CHN': '🇨🇳',
    'IND': '🇮🇳', 'THA': '🇹🇭', 'VNM': '🇻🇳', 'IDN': '🇮🇩', 'SGP': '🇸🇬',
    'PHL': '🇵🇭', 'MYS': '🇲🇾', 'NPL': '🇳🇵', 'PAK': '🇵🇰', 'LKA': '🇱🇰',
    'KHM': '🇰🇭', 'BGD': '🇧🇩', 'LAO': '🇱🇦', 'MNG': '🇲🇳', 'UZB': '🇺🇿',
    'KAZ': '🇰🇿', 'TKM': '🇹🇲', 'KGZ': '🇰🇬', 'TJK': '🇹🇯', 'GEO': '🇬🇪',
    'ARM': '🇦🇲', 'AZE': '🇦🇿', 'TUR': '🇹🇷', 'SAU': '🇸🇦', 'ARE': '🇦🇪',
    'QAT': '🇶🇦', 'KWT': '🇰🇼', 'BHR': '🇧🇭', 'OMN': '🇴🇲', 'JOR': '🇯🇴',
    'ISR': '🇮🇱', 'LBN': '🇱🇧', 'IRN': '🇮🇷', 'IRQ': '🇮🇶', 'SYR': '🇸🇾',
    'YEM': '🇾🇪', 'BRA': '🇧🇷', 'ARG': '🇦🇷', 'CHL': '🇨🇱', 'PER': '🇵🇪',
    'COL': '🇨🇴', 'URY': '🇺🇾', 'PRY': '🇵🇾', 'BOL': '🇧🇴', 'ECU': '🇪🇨',
    'VEN': '🇻🇪', 'AUS': '🇦🇺', 'NZL': '🇳🇿', 'FJI': '🇫🇯', 'PNG': '🇵🇬',
    'WSM': '🇼🇸', 'TON': '🇹🇴', 'VUT': '🇻🇺', 'FSM': '🇫🇲', 'PLW': '🇵🇼',
    'KIR': '🇰🇮', 'RUS': '🇷🇺', 'UKR': '🇺🇦', 'BLR': '🇧🇾', 'MDA': '🇲🇩'
  };
  
  return flagMap[iso] || '🏳️';
};

/**
 * Check if country is in Africa
 */
const isAfrica = (continent) => {
  return continent === 'Africa' || continent === 'AF' || continent === 'africa';
};

/**
 * Interactive Travel Map Component
 */
export default function TravelMap() {
  const [wishlist, setWishlist] = useState(new Set());
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [mapCenter, setMapCenter] = useState([0, 0]);
  const [zoom, setZoom] = useState(1);
  const [mapError, setMapError] = useState(null);
  const [mapLoading, setMapLoading] = useState(true);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('travel_wishlist_iso');
    if (saved) {
      try {
        const savedArray = JSON.parse(saved);
        setWishlist(new Set(savedArray));
      } catch (error) {
        console.error('Error loading wishlist:', error);
      }
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('travel_wishlist_iso', JSON.stringify([...wishlist]));
  }, [wishlist]);

  // Handle country click
  const handleCountryClick = useCallback((geo) => {
    const country = normalize(geo);
    
    // Don't allow interaction with African countries
    if (isAfrica(country.continent)) {
      return;
    }
    
    setSelectedCountry(country);
  }, []);

  // Toggle country in wishlist
  const toggleCountry = useCallback((countryIso) => {
    setWishlist(prev => {
      const newWishlist = new Set(prev);
      if (newWishlist.has(countryIso)) {
        newWishlist.delete(countryIso);
      } else {
        newWishlist.add(countryIso);
      }
      return newWishlist;
    });
  }, []);

  // Reset wishlist
  const resetWishlist = useCallback(() => {
    setWishlist(new Set());
    localStorage.removeItem('travel_wishlist_iso');
  }, []);

  // Get country fill color
  const getCountryFill = useCallback((geo) => {
    const country = normalize(geo);
    
    // African countries should be disabled (gray)
    if (isAfrica(country.continent)) {
      return '#4B5563'; // Gray for disabled
    }
    
    // Selected countries should be red
    if (wishlist.has(country.iso)) {
      return '#EF4444'; // Red for selected
    }
    
    // Default color for available countries
    return '#374151'; // Dark gray for available
  }, [wishlist]);

  // Calculate statistics
  const totalCountries = 195; // Approximate number of non-African countries
  const selectedCount = wishlist.size;
  const progress = totalCountries > 0 ? (selectedCount / totalCountries) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-950 p-4 pt-20">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-gray-50 mb-2 flex items-center justify-center gap-3">
            <Globe className="text-blue-400" size={40} />
            Interactive Travel Map
          </h1>
          <p className="text-gray-400 text-lg">
            Click on countries to add them to your travel wishlist
          </p>
        </motion.div>

        {/* Statistics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Total Countries */}
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-blue-500/50 transition-all duration-300 hover:shadow-blue-500/25 hover:shadow-lg"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Target className="text-blue-400" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-50">Available</h3>
            </div>
            <p className="text-3xl font-bold text-blue-400">{totalCountries}</p>
            <p className="text-gray-400 text-sm">Countries to visit</p>
          </motion.div>

          {/* Selected Countries */}
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-red-500/50 transition-all duration-300 hover:shadow-red-500/25 hover:shadow-lg"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <Heart className="text-red-400" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-50">In Wishlist</h3>
            </div>
            <p className="text-3xl font-bold text-red-400">{selectedCount}</p>
            <p className="text-gray-400 text-sm">Countries selected</p>
          </motion.div>

          {/* Progress */}
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-green-500/50 transition-all duration-300 hover:shadow-green-500/25 hover:shadow-lg"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <TrendingUp className="text-green-400" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-50">Progress</h3>
            </div>
            <p className="text-3xl font-bold text-green-400">{Math.round(progress)}%</p>
            <p className="text-gray-400 text-sm">Of total countries</p>
          </motion.div>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900 p-6 rounded-2xl border border-gray-800"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-50">Travel Progress</h3>
            <span className="text-gray-400">{selectedCount} / {totalCountries} countries</span>
          </div>
          <EnhancedProgressBar
            value={selectedCount}
            max={totalCountries}
            variant="gradient"
            size="lg"
            glow={true}
            animated={true}
          />
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <PhysicsButton
            onClick={() => {
              setMapCenter([0, 0]);
              setZoom(1);
            }}
            icon={Globe}
            variant="secondary"
            className="hover:shadow-blue-500/25 hover:shadow-lg transition-all duration-300"
          >
            Reset View
          </PhysicsButton>

          <PhysicsButton
            onClick={resetWishlist}
            icon={RotateCcw}
            variant="danger"
            className="hover:shadow-red-500/25 hover:shadow-lg transition-all duration-300"
          >
            Clear Wishlist
          </PhysicsButton>
        </motion.div>

        {/* Map Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-blue-500/50 transition-all duration-300 hover:shadow-blue-500/25 hover:shadow-lg"
        >
          <div className="relative">
            {mapError ? (
              <div className="flex items-center justify-center h-[500px] bg-gray-800 rounded-lg border border-gray-700">
                <div className="text-center">
                  <Globe className="mx-auto text-gray-500 mb-4" size={64} />
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">Map Loading Error</h3>
                  <p className="text-gray-400 mb-4">Unable to load world map data</p>
                  <PhysicsButton
                    onClick={() => {
                      setMapError(null);
                      setMapLoading(true);
                      window.location.reload();
                    }}
                    variant="primary"
                  >
                    Retry Loading
                  </PhysicsButton>
                </div>
              </div>
            ) : (
              <ComposableMap
                projection="geoMercator"
                projectionConfig={{
                  scale: 140,
                  center: mapCenter
                }}
                style={{ width: '100%', height: '500px' }}
              >
                <ZoomableGroup center={mapCenter} zoom={zoom}>
                  <Geographies 
                    geography={geoUrl}
                    onError={(error) => {
                      console.error('Map loading error:', error);
                      console.error('Geo URL:', geoUrl);
                      setMapError(error);
                      setMapLoading(false);
                    }}
                    onReady={() => {
                      console.log('Map loaded successfully');
                      setMapLoading(false);
                      setMapError(null);
                    }}
                  >
                    {({ geographies }) => {
                      if (mapLoading) {
                        return (
                          <g>
                            <rect 
                              width="100%" 
                              height="100%" 
                              fill="#1f2937" 
                              opacity="0.5"
                            />
                            <text 
                              x="50%" 
                              y="50%" 
                              textAnchor="middle" 
                              fill="#9ca3af" 
                              fontSize="16"
                            >
                              Loading map...
                            </text>
                          </g>
                        );
                      }
                      
                      return geographies.map((geo) => {
                        const country = normalize(geo);
                        const isDisabled = isAfrica(country.continent);
                        const isSelected = wishlist.has(country.iso);
                        
                        // Debug logging for first few countries
                        if (geo.rsmKey < 5) {
                          console.log(`Country ${geo.rsmKey}:`, country);
                        }
                        
                        return (
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            fill={getCountryFill(geo)}
                            stroke="#1f2937"
                            strokeWidth={0.5}
                            style={{
                              default: {
                                fill: getCountryFill(geo),
                                stroke: '#1f2937',
                                strokeWidth: 0.5,
                                outline: 'none',
                              },
                              hover: {
                                fill: isDisabled 
                                  ? '#4B5563' 
                                  : isSelected 
                                    ? '#F87171' 
                                    : '#6B7280',
                                stroke: isDisabled ? '#374151' : '#3B82F6',
                                strokeWidth: isDisabled ? 0.5 : 1,
                                outline: 'none',
                                cursor: isDisabled ? 'not-allowed' : 'pointer'
                              },
                              pressed: {
                                fill: isDisabled 
                                  ? '#4B5563' 
                                  : '#3B82F6',
                                stroke: isDisabled ? '#374151' : '#1D4ED8',
                                strokeWidth: isDisabled ? 0.5 : 2,
                                outline: 'none',
                              },
                            }}
                            onClick={() => handleCountryClick(geo)}
                            className={isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}
                          />
                        );
                      });
                    }}
                  </Geographies>
                </ZoomableGroup>
              </ComposableMap>
            )}

            {/* Map Legend */}
            <div className="absolute bottom-4 left-4 bg-gray-900/90 backdrop-blur-sm p-4 rounded-lg border border-gray-700">
              <h4 className="text-sm font-semibold text-gray-50 mb-2">Legend</h4>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span className="text-xs text-gray-300">In Wishlist</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-600 rounded"></div>
                  <span className="text-xs text-gray-300">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-500 rounded"></div>
                  <span className="text-xs text-gray-300">Disabled (Africa)</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Country Details Modal */}
        <AnimatePresence>
          {selectedCountry && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <motion.div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setSelectedCountry(null)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                className="relative bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-2xl max-w-md w-full"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{getCountryFlag(selectedCountry.iso, selectedCountry.name)}</span>
                    <div>
                      <h3 className="text-xl font-bold text-gray-50">{selectedCountry.name}</h3>
                      <p className="text-gray-400 flex items-center gap-1">
                        <MapPin size={16} />
                        {selectedCountry.continent}
                      </p>
                    </div>
                  </div>
                  <PhysicsButton
                    onClick={() => setSelectedCountry(null)}
                    icon={X}
                    variant="ghost"
                    size="sm"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                    <span className="text-gray-300">Status</span>
                    <span className={`font-semibold ${
                      wishlist.has(selectedCountry.iso)
                        ? 'text-green-400'
                        : 'text-gray-400'
                    }`}>
                      {wishlist.has(selectedCountry.iso)
                        ? 'In Wishlist ❤️'
                        : 'Not Selected'
                      }
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                    <span className="text-gray-300">ISO Code</span>
                    <span className="text-gray-400 font-mono">{selectedCountry.iso}</span>
                  </div>

                  {!isAfrica(selectedCountry.continent) && (
                    <PhysicsButton
                      onClick={() => {
                        toggleCountry(selectedCountry.iso);
                        setSelectedCountry(null);
                      }}
                      icon={Heart}
                      variant={wishlist.has(selectedCountry.iso) ? "danger" : "primary"}
                      className="w-full hover:shadow-red-500/25 hover:shadow-lg transition-all duration-300"
                    >
                      {wishlist.has(selectedCountry.iso)
                        ? 'Remove from Wishlist'
                        : 'Add to Wishlist'
                      }
                    </PhysicsButton>
                  )}

                  {isAfrica(selectedCountry.continent) && (
                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                      <p className="text-yellow-400 text-sm text-center">
                        🚫 Africa is disabled in this travel map
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
