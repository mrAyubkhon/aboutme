/**
 * Dashboard Page
 * Protected page accessible only to authenticated users
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, LogOut, Shield, CheckCircle, Clock, Settings, Activity, BarChart3 } from 'lucide-react';
import { logout, getStoredUser, getCurrentUser } from '../services/authService';
import PhysicsButton from '../components/PhysicsButton';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastLoginTime, setLastLoginTime] = useState(null);

  useEffect(() => {
    // Get user from localStorage
    const storedUser = getStoredUser();
    setUser(storedUser);
    setLastLoginTime(new Date().toISOString());
    setLoading(false);

    // Optionally, verify with API
    const verifyUser = async () => {
      try {
        const response = await getCurrentUser();
        if (response.data?.user) {
          setUser(response.data.user);
        }
      } catch (error) {
        console.error('Failed to verify user:', error);
        // Token might be invalid, logout user
        handleLogout();
      }
    };

    if (storedUser) {
      verifyUser();
    }
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-gray-400 mt-2">Welcome to your protected dashboard</p>
          </div>
          <PhysicsButton
            onClick={handleLogout}
            variant="danger"
            icon={LogOut}
            className="flex items-center gap-2"
          >
            Logout
          </PhysicsButton>
        </motion.div>

        {/* Success Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8 p-6 bg-green-500/20 border border-green-500/50 rounded-xl"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-500/30 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-300">Authentication Successful</h3>
              <p className="text-green-400 text-sm">You are now logged in and can access protected content.</p>
            </div>
          </div>
        </motion.div>

        {/* User Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 p-8 mb-8"
        >
          <div className="flex items-start gap-6">
            <div className="p-4 bg-blue-500/20 rounded-full">
              <User className="w-12 h-12 text-blue-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-50 mb-2">User Information</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="text-lg text-gray-200 font-medium">{user?.email || 'Not available'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">User ID</p>
                  <p className="text-sm text-gray-300 font-mono">{user?.id || 'Not available'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Account Created</p>
                  <p className="text-sm text-gray-300">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Not available'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Last Login</p>
                  <p className="text-sm text-gray-300">
                    {lastLoginTime ? new Date(lastLoginTime).toLocaleString() : 'Just now'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Protected Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Security Status */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-green-400" />
              <h3 className="text-lg font-semibold text-gray-50">Security Status</h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-sm text-gray-300">JWT Token Active</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-sm text-gray-300">Session Protected</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-sm text-gray-300">Password Encrypted</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="w-6 h-6 text-blue-400" />
              <h3 className="text-lg font-semibold text-gray-50">Quick Actions</h3>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <PhysicsButton
                onClick={() => navigate('/')}
                variant="secondary"
                className="w-full flex items-center justify-center gap-2"
              >
                <BarChart3 className="w-4 h-4" />
                Go to Home
              </PhysicsButton>
              <PhysicsButton
                onClick={() => navigate('/routine')}
                variant="secondary"
                className="w-full flex items-center justify-center gap-2"
              >
                <Clock className="w-4 h-4" />
                My Routines
              </PhysicsButton>
              <PhysicsButton
                onClick={() => navigate('/game-stats')}
                variant="secondary"
                className="w-full flex items-center justify-center gap-2"
              >
                <BarChart3 className="w-4 h-4" />
                Game Statistics
              </PhysicsButton>
              <PhysicsButton
                onClick={() => navigate('/settings')}
                variant="secondary"
                className="w-full flex items-center justify-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Settings
              </PhysicsButton>
            </div>
          </div>
        </motion.div>

        {/* Info Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center"
        >
          <p className="text-gray-500 text-sm">
            This is a protected route. Only authenticated users can access this page.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
