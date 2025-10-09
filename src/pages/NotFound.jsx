import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';
import PhysicsButton from '../components/PhysicsButton';

export default function NotFound() {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center px-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-2xl mx-auto text-center">
        {/* 404 Animation */}
        <motion.div
          variants={itemVariants}
          className="mb-8"
        >
          <motion.div
            className="text-9xl font-bold text-gray-800 mb-4"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            404
          </motion.div>
        </motion.div>

        {/* Error Message */}
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-4xl font-bold text-gray-50 mb-4">
            Page Not Found
          </h1>
          <p className="text-xl text-gray-400 mb-2">
            Oops! The page you're looking for doesn't exist.
          </p>
          <p className="text-gray-500">
            It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <PhysicsButton
            onClick={() => navigate('/')}
            icon={Home}
            variant="primary"
            size="lg"
          >
            Go Home
          </PhysicsButton>
          
          <PhysicsButton
            onClick={() => navigate(-1)}
            icon={ArrowLeft}
            variant="secondary"
            size="lg"
          >
            Go Back
          </PhysicsButton>
        </motion.div>

        {/* Quick Links */}
        <motion.div variants={itemVariants} className="mt-12">
          <h3 className="text-lg font-semibold text-gray-50 mb-4">
            Quick Links
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { path: '/routine', label: 'Routine' },
              { path: '/water', label: 'Water' },
              { path: '/finance', label: 'Finance' },
              { path: '/journal', label: 'Journal' },
              { path: '/travel', label: 'Travel' },
              { path: '/gamestats', label: 'Game Stats' },
              { path: '/settings', label: 'Settings' }
            ].map((link) => (
              <PhysicsButton
                key={link.path}
                onClick={() => navigate(link.path)}
                variant="ghost"
                size="sm"
                className="text-sm"
              >
                {link.label}
              </PhysicsButton>
            ))}
          </div>
        </motion.div>

        {/* Search Suggestion */}
        <motion.div
          variants={itemVariants}
          className="mt-8 p-6 bg-gray-900 rounded-xl border border-gray-800"
        >
          <div className="flex items-center justify-center mb-2">
            <Search className="text-blue-500 mr-2" size={20} />
            <span className="text-gray-50 font-medium">Looking for something?</span>
          </div>
          <p className="text-gray-400 text-sm">
            Use <kbd className="px-2 py-1 bg-gray-800 rounded text-xs">Cmd+K</kbd> or <kbd className="px-2 py-1 bg-gray-800 rounded text-xs">Ctrl+K</kbd> to open the command palette and quickly navigate to any page.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
