import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Map, 
  ChevronLeft, 
  ChevronRight,
  Globe,
  Heart,
  Target,
  TrendingUp,
  Info
} from 'lucide-react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import PhysicsButton from './PhysicsButton';
import EnhancedProgressBar from './EnhancedProgressBar';
import countriesWithoutAfrica from './countriesWithoutAfrica.json';

// World map topology
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

/**
 * Interactive Travel Map component with wishlist functionality
 */
export default function TravelMap() {
  const [wishlistCountries, setWishlistCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [mapCenter, setMapCenter] = useState([0, 0]);
  const [zoom, setZoom] = useState(1);
  const [showWishlist, setShowWishlist] = useState(false);

  // Load wishlist from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('travel_wishlist');
    if (saved) {
      try {
        setWishlistCountries(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading wishlist:', error);
      }
    }
  }, []);

  // Save wishlist to localStorage
  const saveWishlist = (newWishlist) => {
    setWishlistCountries(newWishlist);
    localStorage.setItem('travel_wishlist', JSON.stringify(newWishlist));
  };

  // Toggle country in wishlist
  const toggleCountry = (countryName) => {
    const newWishlist = wishlistCountries.includes(countryName)
      ? wishlistCountries.filter(name => name !== countryName)
      : [...wishlistCountries, countryName];
    saveWishlist(newWishlist);
  };

  // Get country data
  const getCountryData = (countryName) => {
    for (const continent of Object.keys(countriesWithoutAfrica)) {
      const countries = countriesWithoutAfrica[continent];
      if (countries.includes(countryName)) {
        return { name: countryName, continent };
      }
    }
    return { name: countryName, continent: 'Unknown' };
  };

  // Calculate progress
  const totalCountries = Object.values(countriesWithoutAfrica).flat().length;
  const visitedCount = wishlistCountries.length;
  const progress = (visitedCount / totalCountries) * 100;

  // Get country color based on wishlist status
  const getCountryColor = (countryName) => {
    if (wishlistCountries.includes(countryName)) {
      return '#ef4444'; // Red for wishlist
    }
    return '#374151'; // Gray for not selected
  };

  // Handle country click
  const handleCountryClick = (countryName) => {
    const countryData = getCountryData(countryName);
    setSelectedCountry(countryData);
  };

  // Get continent emoji
  const getContinentEmoji = (continent) => {
    const emojis = {
      'Asia': '🌏',
      'Europe': '🇪🇺',
      'North America': '🌎',
      'South America': '🌎',
      'Oceania': '🌏'
    };
    return emojis[continent] || '🌍';
  };

  // Get country flag emoji (simplified)
  const getCountryFlag = (countryName) => {
    const flags = {
      'Japan': '🇯🇵',
      'South Korea': '🇰🇷',
      'China': '🇨🇳',
      'India': '🇮🇳',
      'Thailand': '🇹🇭',
      'France': '🇫🇷',
      'Germany': '🇩🇪',
      'Italy': '🇮🇹',
      'Spain': '🇪🇸',
      'United Kingdom': '🇬🇧',
      'United States': '🇺🇸',
      'Canada': '🇨🇦',
      'Brazil': '🇧🇷',
      'Australia': '🇦🇺',
      'New Zealand': '🇳🇿'
    };
    return flags[countryName] || '🏳️';
  };

  return (
    <div className="min-h-screen bg-gray-950 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-gray-50 mb-2 flex items-center justify-center gap-3">
            <Globe className="text-blue-400" size={40} />
            Travel Map
          </h1>
          <p className="text-gray-400 text-lg">
            Explore the world and build your travel wishlist
          </p>
        </motion.div>

        {/* Stats Cards */}
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
              <h3 className="text-xl font-semibold text-gray-50">Total Countries</h3>
            </div>
            <p className="text-3xl font-bold text-blue-400">{totalCountries}</p>
            <p className="text-gray-400 text-sm">Available to visit</p>
          </motion.div>

          {/* Visited Countries */}
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-green-500/50 transition-all duration-300 hover:shadow-green-500/25 hover:shadow-lg"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Heart className="text-green-400" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-50">In Wishlist</h3>
            </div>
            <p className="text-3xl font-bold text-green-400">{visitedCount}</p>
            <p className="text-gray-400 text-sm">Countries selected</p>
          </motion.div>

          {/* Progress */}
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-purple-500/50 transition-all duration-300 hover:shadow-purple-500/25 hover:shadow-lg"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <TrendingUp className="text-purple-400" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-50">Progress</h3>
            </div>
            <p className="text-3xl font-bold text-purple-400">{Math.round(progress)}%</p>
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
            <span className="text-gray-400">{visitedCount} / {totalCountries} countries</span>
          </div>
          <EnhancedProgressBar
            value={visitedCount}
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
            onClick={() => setShowWishlist(!showWishlist)}
            icon={Heart}
            variant={showWishlist ? "primary" : "secondary"}
            className="hover:shadow-red-500/25 hover:shadow-lg transition-all duration-300"
          >
            {showWishlist ? 'Hide' : 'Show'} Wishlist
          </PhysicsButton>

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
        </motion.div>

        {/* Map Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-blue-500/50 transition-all duration-300 hover:shadow-blue-500/25 hover:shadow-lg"
        >
          <div className="relative">
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{
                scale: 140,
                center: mapCenter
              }}
              style={{ width: '100%', height: '500px' }}
            >
              <ZoomableGroup center={mapCenter} zoom={zoom}>
                <Geographies geography={geoUrl}>
                  {({ geographies }) =>
                    geographies.map((geo) => {
                      const countryName = geo.properties.NAME;
                      const isInWishlist = wishlistCountries.includes(countryName);
                      
                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill={getCountryColor(countryName)}
                          stroke="#1f2937"
                          strokeWidth={0.5}
                          style={{
                            default: {
                              fill: getCountryColor(countryName),
                              stroke: '#1f2937',
                              strokeWidth: 0.5,
                              outline: 'none',
                            },
                            hover: {
                              fill: isInWishlist ? '#f87171' : '#6b7280',
                              stroke: '#3b82f6',
                              strokeWidth: 1,
                              outline: 'none',
                            },
                            pressed: {
                              fill: '#3b82f6',
                              stroke: '#1d4ed8',
                              strokeWidth: 2,
                              outline: 'none',
                            },
                          }}
                          onClick={() => handleCountryClick(countryName)}
                          className="cursor-pointer transition-all duration-200"
                        />
                      );
                    })
                  }
                </Geographies>
              </ZoomableGroup>
            </ComposableMap>

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
                  <span className="text-xs text-gray-300">Not Selected</span>
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
                    <span className="text-4xl">{getCountryFlag(selectedCountry.name)}</span>
                    <div>
                      <h3 className="text-xl font-bold text-gray-50">{selectedCountry.name}</h3>
                      <p className="text-gray-400 flex items-center gap-1">
                        {getContinentEmoji(selectedCountry.continent)} {selectedCountry.continent}
                      </p>
                    </div>
                  </div>
                  <PhysicsButton
                    onClick={() => setSelectedCountry(null)}
                    icon={ChevronLeft}
                    variant="ghost"
                    size="sm"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                    <span className="text-gray-300">Status</span>
                    <span className={`font-semibold ${
                      wishlistCountries.includes(selectedCountry.name)
                        ? 'text-green-400'
                        : 'text-gray-400'
                    }`}>
                      {wishlistCountries.includes(selectedCountry.name)
                        ? 'In Wishlist ❤️'
                        : 'Not Selected'
                      }
                    </span>
                  </div>

                  <PhysicsButton
                    onClick={() => {
                      toggleCountry(selectedCountry.name);
                      setSelectedCountry(null);
                    }}
                    icon={wishlistCountries.includes(selectedCountry.name) ? Heart : Heart}
                    variant={wishlistCountries.includes(selectedCountry.name) ? "danger" : "primary"}
                    className="w-full hover:shadow-red-500/25 hover:shadow-lg transition-all duration-300"
                  >
                    {wishlistCountries.includes(selectedCountry.name)
                      ? 'Remove from Wishlist'
                      : 'Add to Wishlist'
                    }
                  </PhysicsButton>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Wishlist Panel */}
        <AnimatePresence>
          {showWishlist && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-gray-900 p-6 rounded-2xl border border-gray-800"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-50 flex items-center gap-2">
                  <Heart className="text-red-400" size={24} />
                  My Travel Wishlist
                </h3>
                <span className="text-gray-400">{wishlistCountries.length} countries</span>
              </div>

              {wishlistCountries.length === 0 ? (
                <div className="text-center py-8">
                  <Heart className="mx-auto text-gray-600 mb-2" size={48} />
                  <p className="text-gray-400">No countries in your wishlist yet</p>
                  <p className="text-gray-500 text-sm">Click on countries on the map to add them</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {wishlistCountries.map((countryName, index) => {
                    const countryData = getCountryData(countryName);
                    return (
                      <motion.div
                        key={countryName}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.05, y: -2 }}
                        className="bg-gray-800 p-3 rounded-lg border border-gray-700 hover:border-red-500/50 transition-all duration-300 hover:shadow-red-500/25 hover:shadow-lg"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xl">{getCountryFlag(countryName)}</span>
                          <span className="font-medium text-gray-50 text-sm truncate">
                            {countryName}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                          {getContinentEmoji(countryData.continent)} {countryData.continent}
                        </p>
                        <PhysicsButton
                          onClick={() => toggleCountry(countryName)}
                          icon={Heart}
                          variant="ghost"
                          size="sm"
                          className="mt-2 w-full text-xs hover:bg-red-500/20 hover:text-red-400"
                        >
                          Remove
                        </PhysicsButton>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
