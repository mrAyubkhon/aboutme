/**
 * Welcome Page
 * Shown after successful authentication
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LogOut, User, Shield, CheckCircle, Star, Sparkles } from 'lucide-react';
import { logout, getStoredUser } from '../services/authService';
import PhysicsButton from '../components/PhysicsButton';

const WelcomePage = ({ onLogout, onContinue }) => {
  const [user, setUser] = useState(null);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const storedUser = getStoredUser();
    setUser(storedUser);
    
    // Show content after a short delay for dramatic effect
    setTimeout(() => {
      setShowContent(true);
    }, 1000);
  }, []);

  const handleLogout = () => {
    logout();
    onLogout();
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-50 overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="w-full max-w-4xl text-center"
        >
          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mb-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              className="inline-block p-6 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full mb-6"
            >
              <Sparkles className="w-16 h-16 text-blue-400" />
            </motion.div>
            
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
              Welcome
            </h1>
            
            <h2 className="text-4xl md:text-5xl font-bold text-gray-50 mb-2">
              Ayubi aka System
            </h2>
            
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              You have successfully authenticated! Your secure session is now active.
            </p>
          </motion.div>

          {/* User Info Card */}
          {showContent && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 p-8 mb-8 max-w-2xl mx-auto"
            >
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="p-3 bg-blue-500/20 rounded-full">
                  <User className="w-8 h-8 text-blue-400" />
                </div>
                <div className="text-left">
                  <h3 className="text-2xl font-bold text-gray-50">Authenticated User</h3>
                  <p className="text-gray-400">{user?.email || 'User'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center gap-2 p-3 bg-green-500/10 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-green-300 text-sm">Session Active</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-blue-500/10 rounded-lg">
                  <Shield className="w-5 h-5 text-blue-400" />
                  <span className="text-blue-300 text-sm">Secure Access</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-purple-500/10 rounded-lg">
                  <Star className="w-5 h-5 text-purple-400" />
                  <span className="text-purple-300 text-sm">Authorized</span>
                </div>
              </div>

              <div className="text-center">
                <p className="text-gray-400 text-sm mb-4">
                  Welcome to your personalized dashboard experience
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <PhysicsButton
                    onClick={onContinue}
                    variant="primary"
                    className="flex items-center justify-center gap-2"
                  >
                    <Star className="w-4 h-4" />
                    Continue to App
                  </PhysicsButton>
                  
                  <PhysicsButton
                    onClick={handleLogout}
                    variant="danger"
                    className="flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </PhysicsButton>
                </div>
              </div>
            </motion.div>
          )}

          {/* Floating Elements */}
          {showContent && (
            <>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 0.3, x: 0 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute top-20 left-10 text-blue-400/30"
              >
                <Sparkles className="w-8 h-8" />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 0.3, x: 0 }}
                transition={{ delay: 1.2, duration: 1 }}
                className="absolute top-32 right-16 text-purple-400/30"
              >
                <Star className="w-6 h-6" />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 0.3, y: 0 }}
                transition={{ delay: 1.4, duration: 1 }}
                className="absolute bottom-20 left-20 text-pink-400/30"
              >
                <Sparkles className="w-10 h-10" />
              </motion.div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default WelcomePage;
