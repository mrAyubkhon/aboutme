import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ErrorBoundary from '../ErrorBoundary';
import { 
  Heart, 
  Globe, 
  RotateCcw,
  X,
  MapPin,
  Target,
  TrendingUp,
  Zap
} from 'lucide-react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import PhysicsButton from '../PhysicsButton';
import EnhancedProgressBar from '../EnhancedProgressBar';

// Simple and reliable world data source
const GEO_URL = "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson";

// Simple ISO mapping for major countries
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
  'IRL': 'ie', 'LUX': 'lu', 'MLT': 'mt', 'CYP': 'cy', 'EGY': 'eg', 'LBY': 'ly', 'TUN': 'tn', 'DZA': 'dz', 'MAR': 'ma', 'SDN': 'sd'
};

/**
 * Extract country data from geo object
 */
function extractCountryData(geo) {
  const props = geo.properties || {};
  
  // Try different property names for country identification
  const iso3 = props.ISO_A3 || props.ADM0_A3 || props.iso_a3 || props.ISO || props.iso || 'UNK';
  const name = props.NAME || props.ADMIN || props.NAME_LONG || props.NAME_EN || props.name || props.admin || 'Unknown';
  const continent = props.CONTINENT || props.continent || props.REGION_UN || props.region_un || 'Unknown';
  const iso2 = isoMap[iso3] || null;
  
  return { iso3, iso2, name, continent };
}

/**
 * Check if country is in Africa (disabled)
 */
const isAfrica = (continent) => {
  return continent === 'Africa';
};

/**
 * Get country flag URL
 */
const getCountryFlagUrl = (iso2) => {
  if (!iso2) return null;
  return `https://flagcdn.com/w320/${iso2.toLowerCase()}.png`;
};

/**
 * Interactive Travel Map Component
 */
export default function TravelMap() {
  const [wishlist, setWishlist] = useState(new Set());
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [mapCenter, setMapCenter] = useState([0, 0]);
  const [zoom, setZoom] = useState(1);
  const [mapLoading, setMapLoading] = useState(true);
  const [mapError, setMapError] = useState(false);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('travel_wishlist_iso');
    if (saved) {
      try {
        const parsedWishlist = JSON.parse(saved);
        setWishlist(new Set(parsedWishlist));
        console.log('Loaded wishlist:', parsedWishlist);
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
    const country = extractCountryData(geo);
    console.log('Country clicked:', country);

    if (isAfrica(country.continent)) {
      setSelectedCountry(null);
      return;
    }

    setSelectedCountry(country);
  }, []);

  // Toggle country in wishlist
  const toggleWishlist = useCallback(() => {
    if (selectedCountry) {
      setWishlist(prev => {
        const newWishlist = new Set(prev);
        if (newWishlist.has(selectedCountry.iso3)) {
          newWishlist.delete(selectedCountry.iso3);
          console.log(`Removed ${selectedCountry.name} from wishlist`);
        } else {
          newWishlist.add(selectedCountry.iso3);
          console.log(`Added ${selectedCountry.name} to wishlist`);
        }
        return newWishlist;
      });
      setSelectedCountry(null);
    }
  }, [selectedCountry]);

  // Reset map view
  const resetMapView = useCallback(() => {
    setMapCenter([0, 0]);
    setZoom(1);
  }, []);

  // Clear all countries from wishlist
  const clearWishlist = useCallback(() => {
    setWishlist(new Set());
    localStorage.removeItem('travel_wishlist_iso');
  }, []);

  // Get country fill color
  const getCountryFill = useCallback((geo) => {
    const country = extractCountryData(geo);

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
    <ErrorBoundary fallback={
      <div className="min-h-screen bg-gray-950 pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <X size={48} />
          </div>
          <h2 className="text-xl font-bold text-gray-50 mb-2">Map Loading Error</h2>
          <p className="text-gray-400 mb-4">Failed to load travel map. Please try again later.</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    }>
      <div className="min-h-screen bg-gray-950 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-50 mb-2 flex items-center gap-3">
              <Globe className="text-blue-400" size={40} />
              Travel Map
            </h1>
            <p className="text-gray-400 text-lg">
              Explore the world and plan your next adventure
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span>Map Active</span>
            </div>
          </div>
        </motion.div>

        {/* Travel Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 rounded-2xl border border-gray-800 hover:border-blue-500/50 transition-all duration-300 hover:shadow-blue-500/25 hover:shadow-lg hover:shadow-2xl"
        >
          <h3 className="text-xl font-semibold text-gray-50 mb-4">Travel Progress</h3>
          <EnhancedProgressBar
            value={selectedCount}
            max={totalCountries}
            label={`${selectedCount} / ${totalCountries} countries`}
            variant="blue"
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
            onClick={resetMapView}
            icon={Globe}
            variant="secondary"
            className="hover:shadow-blue-500/25 hover:shadow-lg transition-all duration-300"
          >
            Reset View
          </PhysicsButton>

          <PhysicsButton
            onClick={clearWishlist}
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
            {mapLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 rounded-xl z-10">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-gray-400">Loading world map...</p>
                </div>
              </div>
            )}

            {mapError && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 rounded-xl z-10">
                <div className="text-center">
                  <div className="text-red-500 mb-4">
                    <X size={48} />
                  </div>
                  <p className="text-red-400 mb-4">Failed to load map</p>
                  <PhysicsButton
                    onClick={() => {
                      setMapError(false);
                      setMapLoading(true);
                    }}
                    variant="primary"
                  >
                    Retry
                  </PhysicsButton>
                </div>
              </div>
            )}

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
                  geography={GEO_URL}
                  onError={() => {
                    console.error('Map loading error');
                    setMapError(true);
                    setMapLoading(false);
                  }}
                  onReady={() => {
                    console.log('Map loaded successfully');
                    setMapLoading(false);
                    setMapError(false);
                  }}
                >
                  {({ geographies }) => {
                    if (!geographies || geographies.length === 0) {
                      return null;
                    }

                    return geographies.map((geo) => {
                      const country = extractCountryData(geo);
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
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                  <span className="text-xs text-gray-300">In Wishlist</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-gray-700 rounded-full mr-2"></span>
                  <span className="text-xs text-gray-300">Available</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-gray-600 rounded-full mr-2"></span>
                  <span className="text-xs text-gray-300">Disabled (Africa)</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Country Detail Modal */}
        <AnimatePresence>
          {selectedCountry && (
            <motion.div
              className="fixed inset-0 z-[100] flex items-center justify-center p-4"
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
                transition={{ duration: 0.2 }}
              >
                <PhysicsButton
                  onClick={() => setSelectedCountry(null)}
                  icon={X}
                  variant="ghost"
                  size="sm"
                  className="absolute top-3 right-3 text-gray-400 hover:text-gray-50"
                />
                <div className="flex items-center mb-4">
                  {selectedCountry.iso2 && (
                    <img
                      src={getCountryFlagUrl(selectedCountry.iso2)}
                      alt={`${selectedCountry.name} flag`}
                      className="w-10 h-auto mr-3 rounded shadow-md"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  )}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-50">{selectedCountry.name}</h3>
                    <p className="text-gray-400 text-sm flex items-center gap-1">
                      <MapPin size={14} /> {selectedCountry.continent}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  <div className="flex justify-between items-center text-gray-300">
                    <span className="font-medium">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      wishlist.has(selectedCountry.iso3)
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-gray-700/20 text-gray-400'
                    }`}>
                      {wishlist.has(selectedCountry.iso3) ? 'In Wishlist' : 'Not Selected'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-gray-300">
                    <span className="font-medium">ISO Code:</span>
                    <span className="text-gray-400 font-mono">{selectedCountry.iso3}</span>
                  </div>
                </div>

                <PhysicsButton
                  onClick={toggleWishlist}
                  icon={wishlist.has(selectedCountry.iso3) ? Heart : Heart}
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
      </div>
    </ErrorBoundary>
  );
}