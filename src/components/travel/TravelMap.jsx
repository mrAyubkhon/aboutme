import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import PhysicsButton from '../PhysicsButton';
import EnhancedProgressBar from '../EnhancedProgressBar';

// Simple countries data
const countriesData = [
  // Europe
  { name: 'France', continent: 'Europe', iso3: 'FRA', iso2: 'fr', flag: '🇫🇷' },
  { name: 'Germany', continent: 'Europe', iso3: 'DEU', iso2: 'de', flag: '🇩🇪' },
  { name: 'Italy', continent: 'Europe', iso3: 'ITA', iso2: 'it', flag: '🇮🇹' },
  { name: 'Spain', continent: 'Europe', iso3: 'ESP', iso2: 'es', flag: '🇪🇸' },
  { name: 'United Kingdom', continent: 'Europe', iso3: 'GBR', iso2: 'gb', flag: '🇬🇧' },
  { name: 'Netherlands', continent: 'Europe', iso3: 'NLD', iso2: 'nl', flag: '🇳🇱' },
  { name: 'Switzerland', continent: 'Europe', iso3: 'CHE', iso2: 'ch', flag: '🇨🇭' },
  { name: 'Austria', continent: 'Europe', iso3: 'AUT', iso2: 'at', flag: '🇦🇹' },
  { name: 'Belgium', continent: 'Europe', iso3: 'BEL', iso2: 'be', flag: '🇧🇪' },
  { name: 'Poland', continent: 'Europe', iso3: 'POL', iso2: 'pl', flag: '🇵🇱' },
  { name: 'Czech Republic', continent: 'Europe', iso3: 'CZE', iso2: 'cz', flag: '🇨🇿' },
  { name: 'Hungary', continent: 'Europe', iso3: 'HUN', iso2: 'hu', flag: '🇭🇺' },
  { name: 'Portugal', continent: 'Europe', iso3: 'PRT', iso2: 'pt', flag: '🇵🇹' },
  { name: 'Greece', continent: 'Europe', iso3: 'GRC', iso2: 'gr', flag: '🇬🇷' },
  { name: 'Sweden', continent: 'Europe', iso3: 'SWE', iso2: 'se', flag: '🇸🇪' },
  { name: 'Norway', continent: 'Europe', iso3: 'NOR', iso2: 'no', flag: '🇳🇴' },
  { name: 'Finland', continent: 'Europe', iso3: 'FIN', iso2: 'fi', flag: '🇫🇮' },
  { name: 'Denmark', continent: 'Europe', iso3: 'DNK', iso2: 'dk', flag: '🇩🇰' },
  { name: 'Ireland', continent: 'Europe', iso3: 'IRL', iso2: 'ie', flag: '🇮🇪' },
  { name: 'Iceland', continent: 'Europe', iso3: 'ISL', iso2: 'is', flag: '🇮🇸' },
  
  // Asia
  { name: 'Japan', continent: 'Asia', iso3: 'JPN', iso2: 'jp', flag: '🇯🇵' },
  { name: 'South Korea', continent: 'Asia', iso3: 'KOR', iso2: 'kr', flag: '🇰🇷' },
  { name: 'China', continent: 'Asia', iso3: 'CHN', iso2: 'cn', flag: '🇨🇳' },
  { name: 'India', continent: 'Asia', iso3: 'IND', iso2: 'in', flag: '🇮🇳' },
  { name: 'Thailand', continent: 'Asia', iso3: 'THA', iso2: 'th', flag: '🇹🇭' },
  { name: 'Vietnam', continent: 'Asia', iso3: 'VNM', iso2: 'vn', flag: '🇻🇳' },
  { name: 'Singapore', continent: 'Asia', iso3: 'SGP', iso2: 'sg', flag: '🇸🇬' },
  { name: 'Malaysia', continent: 'Asia', iso3: 'MYS', iso2: 'my', flag: '🇲🇾' },
  { name: 'Indonesia', continent: 'Asia', iso3: 'IDN', iso2: 'id', flag: '🇮🇩' },
  { name: 'Philippines', continent: 'Asia', iso3: 'PHL', iso2: 'ph', flag: '🇵🇭' },
  { name: 'Taiwan', continent: 'Asia', iso3: 'TWN', iso2: 'tw', flag: '🇹🇼' },
  { name: 'Hong Kong', continent: 'Asia', iso3: 'HKG', iso2: 'hk', flag: '🇭🇰' },
  { name: 'Israel', continent: 'Asia', iso3: 'ISR', iso2: 'il', flag: '🇮🇱' },
  { name: 'UAE', continent: 'Asia', iso3: 'ARE', iso2: 'ae', flag: '🇦🇪' },
  { name: 'Saudi Arabia', continent: 'Asia', iso3: 'SAU', iso2: 'sa', flag: '🇸🇦' },
  { name: 'Turkey', continent: 'Asia', iso3: 'TUR', iso2: 'tr', flag: '🇹🇷' },
  { name: 'Georgia', continent: 'Asia', iso3: 'GEO', iso2: 'ge', flag: '🇬🇪' },
  { name: 'Armenia', continent: 'Asia', iso3: 'ARM', iso2: 'am', flag: '🇦🇲' },
  { name: 'Azerbaijan', continent: 'Asia', iso3: 'AZE', iso2: 'az', flag: '🇦🇿' },
  
  // North America
  { name: 'United States', continent: 'North America', iso3: 'USA', iso2: 'us', flag: '🇺🇸' },
  { name: 'Canada', continent: 'North America', iso3: 'CAN', iso2: 'ca', flag: '🇨🇦' },
  { name: 'Mexico', continent: 'North America', iso3: 'MEX', iso2: 'mx', flag: '🇲🇽' },
  { name: 'Costa Rica', continent: 'North America', iso3: 'CRI', iso2: 'cr', flag: '🇨🇷' },
  { name: 'Panama', continent: 'North America', iso3: 'PAN', iso2: 'pa', flag: '🇵🇦' },
  { name: 'Guatemala', continent: 'North America', iso3: 'GTM', iso2: 'gt', flag: '🇬🇹' },
  { name: 'Belize', continent: 'North America', iso3: 'BLZ', iso2: 'bz', flag: '🇧🇿' },
  { name: 'Jamaica', continent: 'North America', iso3: 'JAM', iso2: 'jm', flag: '🇯🇲' },
  { name: 'Cuba', continent: 'North America', iso3: 'CUB', iso2: 'cu', flag: '🇨🇺' },
  { name: 'Dominican Republic', continent: 'North America', iso3: 'DOM', iso2: 'do', flag: '🇩🇴' },
  
  // South America
  { name: 'Brazil', continent: 'South America', iso3: 'BRA', iso2: 'br', flag: '🇧🇷' },
  { name: 'Argentina', continent: 'South America', iso3: 'ARG', iso2: 'ar', flag: '🇦🇷' },
  { name: 'Chile', continent: 'South America', iso3: 'CHL', iso2: 'cl', flag: '🇨🇱' },
  { name: 'Peru', continent: 'South America', iso3: 'PER', iso2: 'pe', flag: '🇵🇪' },
  { name: 'Colombia', continent: 'South America', iso3: 'COL', iso2: 'co', flag: '🇨🇴' },
  { name: 'Uruguay', continent: 'South America', iso3: 'URY', iso2: 'uy', flag: '🇺🇾' },
  { name: 'Paraguay', continent: 'South America', iso3: 'PRY', iso2: 'py', flag: '🇵🇾' },
  { name: 'Bolivia', continent: 'South America', iso3: 'BOL', iso2: 'bo', flag: '🇧🇴' },
  { name: 'Ecuador', continent: 'South America', iso3: 'ECU', iso2: 'ec', flag: '🇪🇨' },
  { name: 'Venezuela', continent: 'South America', iso3: 'VEN', iso2: 've', flag: '🇻🇪' },
  
  // Oceania
  { name: 'Australia', continent: 'Oceania', iso3: 'AUS', iso2: 'au', flag: '🇦🇺' },
  { name: 'New Zealand', continent: 'Oceania', iso3: 'NZL', iso2: 'nz', flag: '🇳🇿' },
  { name: 'Fiji', continent: 'Oceania', iso3: 'FJI', iso2: 'fj', flag: '🇫🇯' },
  { name: 'Papua New Guinea', continent: 'Oceania', iso3: 'PNG', iso2: 'pg', flag: '🇵🇬' },
  { name: 'Samoa', continent: 'Oceania', iso3: 'WSM', iso2: 'ws', flag: '🇼🇸' },
  { name: 'Tonga', continent: 'Oceania', iso3: 'TON', iso2: 'to', flag: '🇹🇴' },
  { name: 'Vanuatu', continent: 'Oceania', iso3: 'VUT', iso2: 'vu', flag: '🇻🇺' },
  { name: 'Palau', continent: 'Oceania', iso3: 'PLW', iso2: 'pw', flag: '🇵🇼' },
  { name: 'Micronesia', continent: 'Oceania', iso3: 'FSM', iso2: 'fm', flag: '🇫🇲' },
  { name: 'Kiribati', continent: 'Oceania', iso3: 'KIR', iso2: 'ki', flag: '🇰🇮' }
];

/**
 * Interactive Travel Map Component
 */
export default function TravelMap() {
  const [wishlist, setWishlist] = useState(new Set());
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedContinent, setSelectedContinent] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

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

  // Filter countries based on continent and search
  const filteredCountries = countriesData.filter(country => {
    const matchesContinent = selectedContinent === 'All' || country.continent === selectedContinent;
    const matchesSearch = country.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesContinent && matchesSearch;
  });

  // Get unique continents
  const continents = ['All', ...new Set(countriesData.map(country => country.continent))];

  // Handle country click
  const handleCountryClick = (country) => {
    setSelectedCountry(country);
  };

  // Toggle country in wishlist
  const toggleWishlist = (countryIso3) => {
    setWishlist(prev => {
      const newWishlist = new Set(prev);
      if (newWishlist.has(countryIso3)) {
        newWishlist.delete(countryIso3);
        console.log(`Removed ${countryIso3} from wishlist`);
      } else {
        newWishlist.add(countryIso3);
        console.log(`Added ${countryIso3} to wishlist`);
      }
      return newWishlist;
    });
  };

  // Clear all countries from wishlist
  const clearWishlist = () => {
    setWishlist(new Set());
    localStorage.removeItem('travel_wishlist_iso');
  };

  // Calculate statistics
  const totalCountries = countriesData.length;
  const selectedCount = wishlist.size;
  const progress = totalCountries > 0 ? (selectedCount / totalCountries) * 100 : 0;

  return (
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

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900 p-6 rounded-2xl border border-gray-800"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Continent Filter */}
            <div className="flex flex-wrap gap-2">
              {continents.map((continent) => (
                <PhysicsButton
                  key={continent}
                  onClick={() => setSelectedContinent(continent)}
                  variant={selectedContinent === continent ? 'primary' : 'secondary'}
                  size="sm"
                  className="hover:shadow-blue-500/25 hover:shadow-lg transition-all duration-300"
                >
                  {continent}
                </PhysicsButton>
              ))}
            </div>

            {/* Search */}
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Search countries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-50 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
              />
              <PhysicsButton
                onClick={clearWishlist}
                icon={RotateCcw}
                variant="danger"
                size="sm"
                className="hover:shadow-red-500/25 hover:shadow-lg transition-all duration-300"
              >
                Clear All
              </PhysicsButton>
            </div>
          </div>
        </motion.div>

        {/* Countries Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          {filteredCountries.map((country, index) => {
            const isInWishlist = wishlist.has(country.iso3);
            
            return (
              <motion.div
                key={country.iso3}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
                className={`
                  relative p-4 rounded-xl border transition-all duration-300 cursor-pointer
                  ${isInWishlist 
                    ? 'bg-red-500/20 border-red-500/50 hover:border-red-500 hover:shadow-red-500/25 hover:shadow-lg' 
                    : 'bg-gray-800 border-gray-700 hover:border-blue-500 hover:shadow-blue-500/25 hover:shadow-lg'
                  }
                `}
                onClick={() => handleCountryClick(country)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{country.flag}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(country.iso3);
                    }}
                    className={`
                      p-1 rounded-full transition-colors
                      ${isInWishlist 
                        ? 'text-red-500 hover:bg-red-500/20' 
                        : 'text-gray-400 hover:bg-gray-700 hover:text-red-500'
                      }
                    `}
                  >
                    <Heart size={16} className={isInWishlist ? 'fill-current' : ''} />
                  </button>
                </div>
                
                <h3 className="font-semibold text-gray-50 mb-1">{country.name}</h3>
                <p className="text-sm text-gray-400">{country.continent}</p>
                
                {isInWishlist && (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {/* Empty State */}
        {filteredCountries.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Globe className="mx-auto text-gray-500 mb-4" size={48} />
            <h3 className="text-lg font-semibold text-gray-50 mb-2">No countries found</h3>
            <p className="text-gray-400">Try adjusting your search or filter criteria</p>
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
                  <span className="text-4xl mr-3">{selectedCountry.flag}</span>
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
                  onClick={() => {
                    toggleWishlist(selectedCountry.iso3);
                    setSelectedCountry(null);
                  }}
                  icon={Heart}
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
  );
}