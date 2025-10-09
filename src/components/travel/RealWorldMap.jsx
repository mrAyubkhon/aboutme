import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ComposableMap, 
  Geographies, 
  Geography,
  ZoomableGroup 
} from 'react-simple-maps';
import { 
  Heart, 
  X,
  MapPin,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Globe
} from 'lucide-react';
import PhysicsButton from '../PhysicsButton';
import EnhancedProgressBar from '../EnhancedProgressBar';

// TopoJSON URL for world map
const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// ISO3 to ISO2 mapping for flags (partial list for common countries)
const iso3ToIso2 = {
  USA: 'us', CAN: 'ca', MEX: 'mx', BRA: 'br', ARG: 'ar', CHL: 'cl', PER: 'pe',
  GBR: 'gb', FRA: 'fr', DEU: 'de', ITA: 'it', ESP: 'es', PRT: 'pt', NLD: 'nl',
  BEL: 'be', CHE: 'ch', AUT: 'at', POL: 'pl', CZE: 'cz', HUN: 'hu', GRC: 'gr',
  SWE: 'se', NOR: 'no', DNK: 'dk', FIN: 'fi', IRL: 'ie', ISL: 'is',
  JPN: 'jp', CHN: 'cn', KOR: 'kr', IND: 'in', THA: 'th', VNM: 'vn', SGP: 'sg',
  MYS: 'my', IDN: 'id', PHL: 'ph', AUS: 'au', NZL: 'nz', RUS: 'ru', TUR: 'tr',
  ARE: 'ae', SAU: 'sa', ISR: 'il', EGY: 'eg', ZAF: 'za', KEN: 'ke', NGA: 'ng',
  COL: 'co', VEN: 've', ECU: 'ec', BOL: 'bo', PRY: 'py', URY: 'uy',
  UKR: 'ua', GEO: 'ge', ARM: 'am', AZE: 'az', KAZ: 'kz'
};

// Country name to flag emoji mapping
const countryFlags = {
  'United States of America': '🇺🇸', 'Canada': '🇨🇦', 'Mexico': '🇲🇽',
  'Brazil': '🇧🇷', 'Argentina': '🇦🇷', 'Chile': '🇨🇱', 'Peru': '🇵🇪',
  'United Kingdom': '🇬🇧', 'France': '🇫🇷', 'Germany': '🇩🇪', 'Italy': '🇮🇹',
  'Spain': '🇪🇸', 'Portugal': '🇵🇹', 'Netherlands': '🇳🇱', 'Belgium': '🇧🇪',
  'Switzerland': '🇨🇭', 'Austria': '🇦🇹', 'Poland': '🇵🇱', 'Czechia': '🇨🇿',
  'Hungary': '🇭🇺', 'Greece': '🇬🇷', 'Sweden': '🇸🇪', 'Norway': '🇳🇴',
  'Denmark': '🇩🇰', 'Finland': '🇫🇮', 'Ireland': '🇮🇪', 'Iceland': '🇮🇸',
  'Japan': '🇯🇵', 'China': '🇨🇳', 'South Korea': '🇰🇷', 'India': '🇮🇳',
  'Thailand': '🇹🇭', 'Vietnam': '🇻🇳', 'Singapore': '🇸🇬', 'Malaysia': '🇲🇾',
  'Indonesia': '🇮🇩', 'Philippines': '🇵🇭', 'Australia': '🇦🇺', 'New Zealand': '🇳🇿',
  'Russia': '🇷🇺', 'Turkey': '🇹🇷', 'United Arab Emirates': '🇦🇪', 'Saudi Arabia': '🇸🇦',
  'Israel': '🇮🇱', 'Egypt': '🇪🇬', 'South Africa': '🇿🇦', 'Colombia': '🇨🇴',
  'Venezuela': '🇻🇪', 'Ecuador': '🇪🇨', 'Uruguay': '🇺🇾', 'Ukraine': '🇺🇦',
  'Georgia': '🇬🇪', 'Armenia': '🇦🇲', 'Azerbaijan': '🇦🇿'
};

/**
 * Real World Map Component with react-simple-maps
 */
export default function RealWorldMap() {
  const [wishlist, setWishlist] = useState(new Set());
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [tooltipContent, setTooltipContent] = useState('');
  const [position, setPosition] = useState({ coordinates: [0, 0], zoom: 1 });

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
  const toggleWishlist = (countryId) => {
    setWishlist(prev => {
      const newWishlist = new Set(prev);
      if (newWishlist.has(countryId)) {
        newWishlist.delete(countryId);
      } else {
        newWishlist.add(countryId);
      }
      return newWishlist;
    });
  };

  // Reset zoom
  const handleReset = () => {
    setPosition({ coordinates: [0, 0], zoom: 1 });
  };

  // Zoom in
  const handleZoomIn = () => {
    setPosition(pos => ({ ...pos, zoom: Math.min(pos.zoom * 1.5, 8) }));
  };

  // Zoom out
  const handleZoomOut = () => {
    setPosition(pos => ({ ...pos, zoom: Math.max(pos.zoom / 1.5, 1) }));
  };

  // Get country fill color
  const getCountryFill = (geo) => {
    const countryId = geo.id || geo.properties.name;
    if (wishlist.has(countryId)) {
      return '#10b981'; // Green for selected
    }
    return '#374151'; // Gray for unselected
  };

  // Handle country click
  const handleCountryClick = (geo) => {
    const countryName = geo.properties.name || 'Unknown';
    const countryId = geo.id || countryName;
    const flag = countryFlags[countryName] || '🏳️';
    
    setSelectedCountry({
      id: countryId,
      name: countryName,
      flag: flag,
      iso3: geo.id || 'N/A'
    });
  };

  return (
    <div className="space-y-8">
      {/* Header with Controls */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h2 className="text-2xl font-bold text-gray-50 mb-2 flex items-center gap-3">
            <Globe className="text-blue-400" size={28} />
            Interactive World Map
          </h2>
          <p className="text-gray-400">
            Click on countries to add them to your travel wishlist
          </p>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-2">
          <PhysicsButton
            onClick={handleZoomIn}
            icon={ZoomIn}
            variant="secondary"
            size="sm"
            className="hover:shadow-blue-500/25 hover:shadow-lg"
          />
          <PhysicsButton
            onClick={handleZoomOut}
            icon={ZoomOut}
            variant="secondary"
            size="sm"
            className="hover:shadow-blue-500/25 hover:shadow-lg"
          />
          <PhysicsButton
            onClick={handleReset}
            icon={RotateCcw}
            variant="secondary"
            size="sm"
            className="hover:shadow-blue-500/25 hover:shadow-lg"
          />
        </div>
      </motion.div>

      {/* Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 rounded-2xl border border-gray-800"
      >
        <h3 className="text-xl font-semibold text-gray-50 mb-4">Travel Progress</h3>
        <EnhancedProgressBar
          value={wishlist.size}
          max={195}
          label={`${wishlist.size} / 195 countries selected`}
          variant="blue"
          size="lg"
          glow={true}
          animated={true}
        />
      </motion.div>

      {/* World Map */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700 overflow-hidden relative"
      >
        {/* Tooltip */}
        {tooltipContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-gray-900 px-4 py-2 rounded-lg border border-gray-700 z-10 pointer-events-none"
          >
            <span className="text-gray-50 font-medium">{tooltipContent}</span>
          </motion.div>
        )}

        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 140,
            center: [0, 20]
          }}
          className="w-full h-auto"
          style={{ maxHeight: '600px' }}
        >
          <ZoomableGroup
            zoom={position.zoom}
            center={position.coordinates}
            onMoveEnd={setPosition}
          >
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const countryId = geo.id || geo.properties.name;
                  const isInWishlist = wishlist.has(countryId);

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={getCountryFill(geo)}
                      stroke="#1f2937"
                      strokeWidth={0.5}
                      style={{
                        default: {
                          outline: 'none',
                          transition: 'all 0.3s ease'
                        },
                        hover: {
                          fill: isInWishlist ? '#059669' : '#3b82f6',
                          outline: 'none',
                          cursor: 'pointer'
                        },
                        pressed: {
                          fill: '#10b981',
                          outline: 'none'
                        }
                      }}
                      onMouseEnter={() => {
                        const name = geo.properties.name || 'Unknown';
                        const flag = countryFlags[name] || '🏳️';
                        setTooltipContent(`${flag} ${name}`);
                      }}
                      onMouseLeave={() => {
                        setTooltipContent('');
                      }}
                      onClick={() => handleCountryClick(geo)}
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-700 rounded"></div>
            <span className="text-sm text-gray-400">Not Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm text-gray-400">In Wishlist</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-sm text-gray-400">Hover</span>
          </div>
        </div>
      </motion.div>

      {/* Selected Countries List */}
      {wishlist.size > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 p-6 rounded-xl border border-gray-700"
        >
          <h3 className="text-xl font-bold text-gray-50 mb-4 flex items-center gap-2">
            <Heart className="text-red-500 fill-current" size={20} />
            My Wishlist ({wishlist.size} countries)
          </h3>
          <div className="flex flex-wrap gap-2">
            {Array.from(wishlist).map((countryId) => (
              <motion.div
                key={countryId}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-500/20 border border-green-500/50 px-3 py-2 rounded-lg flex items-center gap-2"
              >
                <span className="text-gray-50 font-medium">{countryId}</span>
                <button
                  onClick={() => toggleWishlist(countryId)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <X size={14} />
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

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
                  <p className="text-gray-400 text-sm flex items-center gap-1">
                    <MapPin size={14} /> {selectedCountry.iso3}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <div className={`
                  px-4 py-2 rounded-lg text-center font-semibold
                  ${wishlist.has(selectedCountry.id)
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-gray-800 text-gray-400'
                  }
                `}>
                  {wishlist.has(selectedCountry.id) ? '✓ In Your Wishlist' : 'Not in Wishlist'}
                </div>
              </div>

              <PhysicsButton
                onClick={() => {
                  toggleWishlist(selectedCountry.id);
                  setSelectedCountry(null);
                }}
                icon={wishlist.has(selectedCountry.id) ? X : Heart}
                variant={wishlist.has(selectedCountry.id) ? 'danger' : 'primary'}
                className="w-full"
              >
                {wishlist.has(selectedCountry.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </PhysicsButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

