import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MapPin, Globe } from 'lucide-react';
import countriesData from './countriesWithoutAfrica.json';

/**
 * Travel Wishlist Component for AyubiWorld
 * Displays countries from all continents except Africa
 */
export default function TravelWishlist() {
  const [selectedContinent, setSelectedContinent] = useState('All');
  const [wishlist, setWishlist] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);

  // Country flag emoji mapping
  const countryFlags = {
    // Asia
    'Japan': '🇯🇵', 'South Korea': '🇰🇷', 'China': '🇨🇳', 'India': '🇮🇳', 'Thailand': '🇹🇭',
    'Vietnam': '🇻🇳', 'Indonesia': '🇮🇩', 'Singapore': '🇸🇬', 'Philippines': '🇵🇭', 'Malaysia': '🇲🇾',
    'Nepal': '🇳🇵', 'Pakistan': '🇵🇰', 'Sri Lanka': '🇱🇰', 'Cambodia': '🇰🇭', 'Bangladesh': '🇧🇩',
    'Laos': '🇱🇦', 'Mongolia': '🇲🇳', 'Uzbekistan': '🇺🇿', 'Kazakhstan': '🇰🇿', 'Turkmenistan': '🇹🇲',
    'Kyrgyzstan': '🇰🇬', 'Tajikistan': '🇹🇯', 'Georgia': '🇬🇪', 'Armenia': '🇦🇲', 'Azerbaijan': '🇦🇿',
    'Turkey': '🇹🇷', 'Saudi Arabia': '🇸🇦', 'UAE': '🇦🇪', 'Qatar': '🇶🇦', 'Kuwait': '🇰🇼',
    'Bahrain': '🇧🇭', 'Oman': '🇴🇲', 'Jordan': '🇯🇴', 'Israel': '🇮🇱', 'Lebanon': '🇱🇧',
    'Iran': '🇮🇷', 'Iraq': '🇮🇶', 'Syria': '🇸🇾', 'Yemen': '🇾🇪',

    // Europe
    'France': '🇫🇷', 'Germany': '🇩🇪', 'Italy': '🇮🇹', 'Spain': '🇪🇸', 'Portugal': '🇵🇹',
    'Switzerland': '🇨🇭', 'Austria': '🇦🇹', 'Netherlands': '🇳🇱', 'Belgium': '🇧🇪', 'Luxembourg': '🇱🇺',
    'Poland': '🇵🇱', 'Czech Republic': '🇨🇿', 'Slovakia': '🇸🇰', 'Hungary': '🇭🇺', 'Croatia': '🇭🇷',
    'Slovenia': '🇸🇮', 'Serbia': '🇷🇸', 'Montenegro': '🇲🇪', 'Bosnia and Herzegovina': '🇧🇦', 'Albania': '🇦🇱',
    'North Macedonia': '🇲🇰', 'Greece': '🇬🇷', 'Norway': '🇳🇴', 'Sweden': '🇸🇪', 'Finland': '🇫🇮',
    'Denmark': '🇩🇰', 'Iceland': '🇮🇸', 'Ireland': '🇮🇪', 'United Kingdom': '🇬🇧', 'Estonia': '🇪🇪',
    'Latvia': '🇱🇻', 'Lithuania': '🇱🇹', 'Ukraine': '🇺🇦', 'Belarus': '🇧🇾', 'Moldova': '🇲🇩',
    'Romania': '🇷🇴', 'Bulgaria': '🇧🇬',

    // North America
    'United States': '🇺🇸', 'Canada': '🇨🇦', 'Mexico': '🇲🇽', 'Costa Rica': '🇨🇷', 'Panama': '🇵🇦',
    'Guatemala': '🇬🇹', 'Belize': '🇧🇿', 'Honduras': '🇭🇳', 'El Salvador': '🇸🇻', 'Nicaragua': '🇳🇮',

    // South America
    'Brazil': '🇧🇷', 'Argentina': '🇦🇷', 'Chile': '🇨🇱', 'Peru': '🇵🇪', 'Colombia': '🇨🇴',
    'Uruguay': '🇺🇾', 'Paraguay': '🇵🇾', 'Bolivia': '🇧🇴', 'Ecuador': '🇪🇨', 'Venezuela': '🇻🇪',

    // Oceania
    'Australia': '🇦🇺', 'New Zealand': '🇳🇿', 'Fiji': '🇫🇯', 'Papua New Guinea': '🇵🇬', 'Samoa': '🇼🇸',
    'Tonga': '🇹🇴', 'Vanuatu': '🇻🇺', 'Micronesia': '🇫🇲', 'Palau': '🇵🇼', 'Kiribati': '🇰🇮'
  };

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('ayubi_travel_wishlist');
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('ayubi_travel_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Filter countries based on selected continent
  useEffect(() => {
    if (selectedContinent === 'All') {
      const allCountries = Object.entries(countriesData).flatMap(([continent, countries]) =>
        countries.map(country => ({ name: country, continent }))
      );
      setFilteredCountries(allCountries);
    } else {
      const countries = countriesData[selectedContinent] || [];
      setFilteredCountries(countries.map(country => ({ name: country, continent: selectedContinent })));
    }
  }, [selectedContinent]);

  // Toggle country in wishlist
  const toggleWishlist = (country) => {
    setWishlist(prev => {
      const isInWishlist = prev.some(item => item.name === country.name && item.continent === country.continent);
      if (isInWishlist) {
        return prev.filter(item => !(item.name === country.name && item.continent === country.continent));
      } else {
        return [...prev, country];
      }
    });
  };

  // Check if country is in wishlist
  const isInWishlist = (country) => {
    return wishlist.some(item => item.name === country.name && item.continent === country.continent);
  };

  // Get continent color
  const getContinentColor = (continent) => {
    const colors = {
      'Asia': 'text-yellow-400',
      'Europe': 'text-blue-400',
      'North America': 'text-green-400',
      'South America': 'text-red-400',
      'Oceania': 'text-purple-400'
    };
    return colors[continent] || 'text-gray-400';
  };

  const continents = ['All', 'Asia', 'Europe', 'North America', 'South America', 'Oceania'];

  return (
    <motion.div
      className="min-h-screen bg-slate-900 text-gray-100 pt-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-4xl font-bold text-gray-50 mb-4 flex items-center justify-center space-x-3">
            <Globe className="w-10 h-10 text-sky-400" />
            <span>Travel Wishlist</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Explore the world - All continents except Africa 🌍
          </p>
        </motion.div>

        {/* Continent Filters */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {continents.map((continent) => (
            <motion.button
              key={continent}
              onClick={() => setSelectedContinent(continent)}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                selectedContinent === continent
                  ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25'
                  : 'bg-slate-800 text-gray-300 hover:bg-slate-700 hover:text-white'
              }`}
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
            >
              {continent}
            </motion.button>
          ))}
        </motion.div>

        {/* Countries Grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <AnimatePresence>
            {filteredCountries.map((country, index) => (
              <motion.div
                key={`${country.name}-${country.continent}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.02 }}
                className="relative"
              >
                <motion.div
                  className={`bg-slate-800 rounded-xl p-4 border-2 transition-all duration-200 cursor-pointer ${
                    isInWishlist(country)
                      ? 'border-sky-500 shadow-lg shadow-sky-500/25'
                      : 'border-slate-700 hover:border-slate-600'
                  }`}
                  whileHover={{ 
                    scale: 1.05, 
                    y: -5,
                    boxShadow: isInWishlist(country) 
                      ? '0 10px 25px rgba(56, 189, 248, 0.3)' 
                      : '0 10px 25px rgba(0, 0, 0, 0.3)'
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleWishlist(country)}
                >
                  {/* Heart Button */}
                  <motion.button
                    className={`absolute top-2 right-2 p-1 rounded-full transition-colors duration-200 ${
                      isInWishlist(country) 
                        ? 'text-red-500 bg-red-500/10' 
                        : 'text-gray-400 hover:text-red-400 hover:bg-red-500/10'
                    }`}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.8 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(country);
                    }}
                  >
                    <Heart 
                      className={`w-4 h-4 ${
                        isInWishlist(country) ? 'fill-current' : ''
                      }`} 
                    />
                  </motion.button>

                  {/* Country Flag */}
                  <div className="text-4xl mb-3 text-center">
                    {countryFlags[country.name] || '🏳️'}
                  </div>

                  {/* Country Name */}
                  <h3 className="text-lg font-semibold text-gray-50 text-center mb-2">
                    {country.name}
                  </h3>

                  {/* Continent */}
                  <div className="flex items-center justify-center space-x-1">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className={`text-sm font-medium ${getContinentColor(country.continent)}`}>
                      {country.continent}
                    </span>
                  </div>

                  {/* Added to Wishlist Badge */}
                  <AnimatePresence>
                    {isInWishlist(country) && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        className="absolute -top-2 -right-2 bg-sky-500 text-white text-xs px-2 py-1 rounded-full font-medium"
                      >
                        ✅ Added
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* My Wishlist Section */}
        {wishlist.length > 0 && (
          <motion.div
            className="bg-slate-800 rounded-xl p-6 border border-slate-700"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-gray-50 mb-4 flex items-center space-x-2">
              <Heart className="w-6 h-6 text-red-500 fill-current" />
              <span>My Wishlist ({wishlist.length} countries)</span>
            </h2>
            
            <div className="flex flex-wrap gap-2">
              {wishlist.map((country, index) => (
                <motion.div
                  key={`${country.name}-${country.continent}-${index}`}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center space-x-2 bg-slate-700 px-3 py-2 rounded-lg"
                >
                  <span className="text-lg">{countryFlags[country.name] || '🏳️'}</span>
                  <span className="text-gray-50 font-medium">{country.name}</span>
                  <span className={`text-xs ${getContinentColor(country.continent)}`}>
                    {country.continent}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
