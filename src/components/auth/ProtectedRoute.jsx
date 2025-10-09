/**
 * Protected Route Component
 * Redirects to login if user is not authenticated
 */

import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Loader2 } from 'lucide-react';
import { isAuthenticated, isTokenExpired, validateToken } from '../../services/authService';

const ProtectedRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!isAuthenticated()) {
          setIsValid(false);
          setIsLoading(false);
          return;
        }

        const token = localStorage.getItem('authToken');
        if (isTokenExpired(token)) {
          setIsValid(false);
          setIsLoading(false);
          return;
        }

        // Validate token with server
        const user = await validateToken();
        setIsValid(!!user);
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsValid(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
            <Shield className="w-8 h-8 text-blue-400 absolute top-2 left-1/2 transform -translate-x-1/2" />
          </div>
          <h3 className="text-lg font-semibold text-gray-50 mb-2">Verifying Access</h3>
          <p className="text-gray-400 text-sm">Checking authentication status...</p>
        </motion.div>
      </div>
    );
  }

  if (!isValid) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
