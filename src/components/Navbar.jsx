import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { 
  Home, 
  Calendar, 
  Droplets, 
  DollarSign, 
  BookOpen, 
  Settings,
  Gamepad2,
  Wrench,
  Menu,
  X
} from 'lucide-react';
import { NAV_ITEMS, APP_NAME } from '../data/constants';
import ModernLogo from './ModernLogo';
import PhysicsButton from './PhysicsButton';

/**
 * Navigation bar component with responsive mobile menu
 */
export default function Navbar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Check if a navigation item is active
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  // Get page title for better UX
  const getPageTitle = (path) => {
    const titles = {
      '/': 'Dashboard',
      '/routine': 'Habits',
      '/water': 'Water Tracker', 
      '/finance': 'Finance',
      '/journal': 'Journal',
      '/gamestats': 'Game Stats',
      '/diagnostics': 'Diagnostics',
      '/settings': 'Settings'
    };
    return titles[path] || 'Ayubi System';
  };

  // Get icon component by name
  const getIcon = (iconName) => {
    const icons = {
      Home, Calendar, Droplets, DollarSign, BookOpen, Settings, Gamepad2, Wrench
    };
    return icons[iconName] || Home;
  };

  return (
    <motion.nav 
      className="fixed top-0 left-0 right-0 z-50 bg-gray-950/90 backdrop-blur-md border-b border-gray-800"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ 
        type: "spring",
        stiffness: 300,
        damping: 25,
        mass: 1,
        duration: 0.5
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Link to="/" className="hover:scale-105 transition-transform duration-200">
              <ModernLogo size="md" animated={true} />
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {NAV_ITEMS.map((item) => {
              const Icon = getIcon(item.icon);
              return (
                <motion.div
                  key={item.path}
                  whileHover={{ 
                    scale: 1.05,
                    y: -1,
                    rotateX: -1
                  }}
                  whileTap={{ 
                    scale: 0.95,
                    y: 0
                  }}
                  transition={{ 
                    type: "spring",
                    stiffness: 400,
                    damping: 20,
                    mass: 0.8
                  }}
                >
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive(item.path)
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2">
            <PhysicsButton
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              icon={isMobileMenuOpen ? X : Menu}
              variant="ghost"
              size="sm"
              className="md:hidden"
            />
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div
          className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}
          initial={{ opacity: 0, height: 0 }}
          animate={isMobileMenuOpen ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {NAV_ITEMS.map((item) => {
              const Icon = getIcon(item.icon);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
}