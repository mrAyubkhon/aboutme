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

// Use a reliable geo source
const GEO_URL = "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson";

// ISO3 to ISO2 mapping for flags
const isoMap = {
  'RUS': 'ru', 'USA': 'us', 'CAN': 'ca', 'MEX': 'mx', 'BRA': 'br', 'ARG': 'ar', 'CHL': 'cl', 'PER': 'pe', 'COL': 'co', 'VEN': 've',
  'ECU': 'ec', 'BOL': 'bo', 'PRY': 'py', 'URY': 'uy', 'GUY': 'gy', 'SUR': 'sr', 'FRA': 'fr', 'DEU': 'de', 'GBR': 'gb', 'ITA': 'it',
  'ESP': 'es', 'PRT': 'pt', 'NLD': 'nl', 'BEL': 'be', 'CHE': 'ch', 'AUT': 'at', 'POL': 'pl', 'CZE': 'cz', 'SVK': 'sk', 'HUN': 'hu',
  'ROU': 'ro', 'BGR': 'bg', 'GRC': 'gr', 'HRV': 'hr', 'SVN': 'si', 'SRB': 'rs', 'BIH': 'ba', 'MNE': 'me', 'ALB': 'al', 'MKD': 'mk',
  'JPN': 'jp', 'CHN': 'cn', 'KOR': 'kr', 'IND': 'in', 'THA': 'th', 'VNM': 'vn', 'IDN': 'id', 'SGP': 'sg', 'PHL': 'ph', 'MYS': 'my',
  'NPL': 'np', 'PAK': 'pk', 'LKA': 'lk', 'KHM': 'kh', 'BGD': 'bd', 'LAO': 'la', 'MNG': 'mn', 'UZB': 'uz', 'KAZ': 'kz', 'TKM': 'tm',
  'KGZ': 'kg', 'TJK': 'tj', 'GEO': 'ge', 'ARM': 'am', 'AZE': 'az', 'TUR': 'tr', 'SAU': 'sa', 'ARE': 'ae', 'QAT': 'qa', 'KWT': 'kw',
  'BHR': 'bh', 'OMN': 'om', 'JOR': 'jo', 'ISR': 'il', 'LBN': 'lb', 'IRN': 'ir', 'IRQ': 'iq', 'SYR': 'sy', 'YEM': 'ye', 'AUS': 'au',
  'NZL': 'nz', 'FJI': 'fj', 'PNG': 'pg', 'WSM': 'ws', 'TON': 'to', 'VUT': 'vu', 'FSM': 'fm', 'PLW': 'pw', 'KIR': 'ki', 'UKR': 'ua',
  'BLR': 'by', 'MDA': 'md', 'LTU': 'lt', 'LVA': 'lv', 'EST': 'ee', 'FIN': 'fi', 'SWE': 'se', 'NOR': 'no', 'DNK': 'dk', 'ISL': 'is',
  'IRL': 'ie', 'LUX': 'lu', 'MLT': 'mt', 'CYP': 'cy', 'EGY': 'eg', 'LBY': 'ly', 'TUN': 'tn', 'DZA': 'dz', 'MAR': 'ma', 'SDN': 'sd',
  'SSD': 'ss', 'ETH': 'et', 'KEN': 'ke', 'UGA': 'ug', 'TZA': 'tz', 'ZAF': 'za', 'ZWE': 'zw', 'BWA': 'bw', 'NAM': 'na', 'ZMB': 'zm',
  'MWI': 'mw', 'MOZ': 'mz', 'MDG': 'mg', 'MUS': 'mu', 'SYC': 'sc', 'COM': 'km', 'DJI': 'dj', 'SOM': 'so', 'ERI': 'er', 'GAB': 'ga',
  'GNQ': 'gq', 'STP': 'st', 'CAF': 'cf', 'TCD': 'td', 'CMR': 'cm', 'NER': 'ne', 'NGA': 'ng', 'BEN': 'bj', 'TGO': 'tg', 'GHA': 'gh',
  'BFA': 'bf', 'MLI': 'ml', 'SEN': 'sn', 'GMB': 'gm', 'GIN': 'gn', 'GNB': 'gw', 'SLE': 'sl', 'LBR': 'lr', 'CIV': 'ci', 'GHA': 'gh',
  'BEN': 'bj', 'TGO': 'tg', 'BFA': 'bf', 'MLI': 'ml', 'SEN': 'sn', 'GMB': 'gm', 'GIN': 'gn', 'GNB': 'gw', 'SLE': 'sl', 'LBR': 'lr',
  'CIV': 'ci', 'COD': 'cd', 'COG': 'cg', 'AGO': 'ao', 'ZMB': 'zm', 'MWI': 'mw', 'MOZ': 'mz', 'MDG': 'mg', 'MUS': 'mu', 'SYC': 'sc'
};

/**
 * Normalize country data from TopoJSON/GeoJSON
 */
function normalize(geo) {
  const p = geo.properties || {};
  const iso3 = p.ISO_A3 || p.ADM0_A3 || p.iso_a3 || p.ISO || p.iso || 'UNK';
  const name = p.NAME || p.ADMIN || p.NAME_LONG || p.NAME_EN || p.name || p.admin || 'Unknown';
  const continent = p.CONTINENT || p.continent || p.REGION_UN || p.region_un || 'Unknown';
  const iso2 = isoMap[iso3] || null;
  
  return { iso3, iso2, name, continent };
}

/**
 * Check if country is in Africa
 */
const isAfrica = (continent) => {
  return continent === 'Africa' || continent === 'AF' || continent === 'africa';
};

/**
 * Get country flag URL from Flagpedia
 */
const getFlagUrl = (iso2) => {
  if (!iso2) return null;
  return `https://flagcdn.com/${iso2.toLowerCase()}.svg`;
};

/**
 * Interactive Travel Map Component
 */
export default function TravelMap() {
  const [wishlist, setWishlist] = useState(new Set());
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [mapCenter, setMapCenter] = useState([0, 0]);
  const [zoom, setZoom] = useState(1);

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

  // Get country fill color - FIXED LOGIC
  const getCountryFill = useCallback((geo) => {
    const country = normalize(geo);
    
    // African countries should be disabled (gray)
    if (isAfrica(country.continent)) {
      return '#4B5563'; // Gray for disabled
    }
    
    // Selected countries should be red
    if (wishlist.has(country.iso3)) {
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
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{
                scale: 140,
                center: mapCenter
              }}
              style={{ width: '100%', height: '500px' }}
            >
              <ZoomableGroup center={mapCenter} zoom={zoom}>
                <Geographies geography={GEO_URL}>
                  {({ geographies }) => {
                    if (!geographies || geographies.length === 0) {
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
                            Loading world map...
                          </text>
                        </g>
                      );
                    }
                    
                    return geographies.map((geo) => {
                      const country = normalize(geo);
                      const isDisabled = isAfrica(country.continent);
                      const isSelected = wishlist.has(country.iso3);
                      
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
                    {/* Flag Display */}
                    {selectedCountry.iso2 ? (
                      <img 
                        src={getFlagUrl(selectedCountry.iso2)} 
                        alt={`${selectedCountry.name} flag`}
                        className="w-12 h-8 object-cover rounded border border-gray-600"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-12 h-8 bg-gray-700 rounded border border-gray-600 flex items-center justify-center">
                        <span className="text-xs text-gray-400">🏳️</span>
                      </div>
                    )}
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
                      wishlist.has(selectedCountry.iso3)
                        ? 'text-green-400'
                        : 'text-gray-400'
                    }`}>
                      {wishlist.has(selectedCountry.iso3)
                        ? 'In Wishlist ❤️'
                        : 'Not Selected'
                      }
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                    <span className="text-gray-300">ISO Code</span>
                    <span className="text-gray-400 font-mono">{selectedCountry.iso3}</span>
                  </div>

                  {!isAfrica(selectedCountry.continent) && (
                    <PhysicsButton
                      onClick={() => {
                        toggleCountry(selectedCountry.iso3);
                        setSelectedCountry(null);
                      }}
                      icon={Heart}
                      variant={wishlist.has(selectedCountry.iso3) ? "danger" : "primary"}
                      className="w-full hover:shadow-red-500/25 hover:shadow-lg transition-all duration-300"
                    >
                      {wishlist.has(selectedCountry.iso3)
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