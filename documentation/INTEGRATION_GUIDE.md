# 🔗 Frontend-Backend Integration Guide

## 📋 Overview

This guide explains how to integrate the React frontend with the FastAPI backend for the Ayubi aka System personal dashboard.

## 🛠️ Prerequisites

- Backend running on http://localhost:8000
- Frontend running on http://localhost:3000
- Both applications properly configured

## 🔧 Backend Configuration

### 1. Start the Backend

```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 2. Verify Backend is Running

Visit http://localhost:8000/docs to see the API documentation.

## 🔧 Frontend Configuration

### 1. Install Additional Dependencies

```bash
cd src
npm install axios  # If not already installed
```

### 2. Environment Variables

Create `.env.local` in the frontend root:

```env
VITE_API_URL=http://localhost:8000/api/v1
VITE_APP_NAME=Ayubi aka System
```

### 3. Update Package.json Scripts

Add backend integration scripts:

```json
{
  "scripts": {
    "dev": "vite",
    "dev:full": "concurrently \"npm run dev:backend\" \"npm run dev\"",
    "dev:backend": "cd ../backend && uvicorn main:app --reload --host 0.0.0.0 --port 8000",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

## 🔐 Authentication Integration

### 1. Create Auth Context

Create `src/context/AuthContext.jsx`:

```jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../config/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const userData = await authAPI.getCurrentUser();
      if (userData) {
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const result = await authAPI.login(username, password);
      if (result) {
        setUser(result.user);
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false, error: 'Login failed' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      const result = await authAPI.register(userData);
      if (result) {
        setUser(result.user);
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false, error: 'Registration failed' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
```

### 2. Create Login Component

Create `src/components/LoginModal.jsx`:

```jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Lock, Mail, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PhysicsButton from './PhysicsButton';

const LoginModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    full_name: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let result;
      if (isLogin) {
        result = await login(formData.username, formData.password);
      } else {
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          return;
        }
        result = await register({
          username: formData.username,
          email: formData.email,
          full_name: formData.full_name,
          password: formData.password
        });
      }

      if (result.success) {
        onClose();
        setFormData({
          username: '',
          email: '',
          full_name: '',
          password: '',
          confirmPassword: ''
        });
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-gray-900 rounded-xl p-6 w-full max-w-md border border-gray-800"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-50">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-50 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 mb-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-50 focus:border-blue-500 focus:outline-none"
                      placeholder="Enter your full name"
                      required={!isLogin}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-50 focus:border-blue-500 focus:outline-none"
                      placeholder="Enter your email"
                      required={!isLogin}
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-50 focus:border-blue-500 focus:outline-none"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-50 focus:border-blue-500 focus:outline-none"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-50 focus:border-blue-500 focus:outline-none"
                    placeholder="Confirm your password"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <PhysicsButton
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Loading...' : (isLogin ? 'Sign In' : 'Sign Up')}
            </PhysicsButton>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-400 hover:text-blue-300 transition-colors text-sm"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LoginModal;
```

## 📊 Data Integration

### 1. Update useHabits Hook

Update `src/hooks/useHabits.js`:

```javascript
import { useState, useEffect } from 'react';
import { habitsAPI } from '../config/api';

export function useHabits() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = async () => {
    try {
      setLoading(true);
      const data = await habitsAPI.getHabits();
      setHabits(data || []);
    } catch (err) {
      setError(err.message);
      console.error('Failed to load habits:', err);
    } finally {
      setLoading(false);
    }
  };

  const addHabit = async (habitData) => {
    try {
      const newHabit = await habitsAPI.createHabit(habitData);
      if (newHabit) {
        setHabits(prev => [...prev, newHabit]);
        return { success: true, habit: newHabit };
      }
      return { success: false, error: 'Failed to create habit' };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateHabit = async (id, habitData) => {
    try {
      const updatedHabit = await habitsAPI.updateHabit(id, habitData);
      if (updatedHabit) {
        setHabits(prev => prev.map(habit => 
          habit.id === id ? updatedHabit : habit
        ));
        return { success: true, habit: updatedHabit };
      }
      return { success: false, error: 'Failed to update habit' };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteHabit = async (id) => {
    try {
      const success = await habitsAPI.deleteHabit(id);
      if (success) {
        setHabits(prev => prev.filter(habit => habit.id !== id));
        return { success: true };
      }
      return { success: false, error: 'Failed to delete habit' };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const completeHabit = async (id, date = new Date().toISOString().split('T')[0]) => {
    try {
      const completion = await habitsAPI.completeHabit(id, { completion_date: date });
      if (completion) {
        await loadHabits(); // Reload to get updated stats
        return { success: true };
      }
      return { success: false, error: 'Failed to complete habit' };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const getCompletionRate = () => {
    if (habits.length === 0) return 0;
    const completed = habits.filter(habit => habit.completed).length;
    return Math.round((completed / habits.length) * 100);
  };

  const getCompletedCount = () => {
    return habits.filter(habit => habit.completed).length;
  };

  return {
    habits,
    loading,
    error,
    addHabit,
    updateHabit,
    deleteHabit,
    completeHabit,
    getCompletionRate,
    getCompletedCount,
    refreshHabits: loadHabits
  };
}
```

### 2. Update useWater Hook

Update `src/hooks/useWater.js`:

```javascript
import { useState, useEffect } from 'react';
import { waterAPI } from '../config/api';

export function useWater() {
  const [waterData, setWaterData] = useState({
    current: 0,
    goal: 2500,
    entries: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadWaterData();
  }, []);

  const loadWaterData = async () => {
    try {
      setLoading(true);
      const [stats, goal] = await Promise.all([
        waterAPI.getTodayStats(),
        waterAPI.getWaterGoal()
      ]);
      
      if (stats) {
        setWaterData(prev => ({
          ...prev,
          current: stats.today_total,
          goal: goal?.daily_goal || 2500
        }));
      }
    } catch (err) {
      setError(err.message);
      console.error('Failed to load water data:', err);
    } finally {
      setLoading(false);
    }
  };

  const addWater = async (amount, drinkType = 'water', temperature = 'room') => {
    try {
      const entry = await waterAPI.addWaterEntry({
        amount,
        drink_type: drinkType,
        temperature
      });
      
      if (entry) {
        setWaterData(prev => ({
          ...prev,
          current: prev.current + amount,
          entries: [entry, ...prev.entries]
        }));
        return { success: true };
      }
      return { success: false, error: 'Failed to add water entry' };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const setGoal = async (goal) => {
    try {
      const updatedGoal = await waterAPI.updateWaterGoal({ daily_goal: goal });
      if (updatedGoal) {
        setWaterData(prev => ({
          ...prev,
          goal: updatedGoal.daily_goal
        }));
        return { success: true };
      }
      return { success: false, error: 'Failed to update goal' };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const getProgress = () => {
    return Math.round((waterData.current / waterData.goal) * 100);
  };

  const getRemaining = () => {
    return Math.max(0, waterData.goal - waterData.current);
  };

  return {
    waterData,
    loading,
    error,
    addWater,
    setGoal,
    getProgress,
    getRemaining,
    refreshWaterData: loadWaterData
  };
}
```

## 🔄 Data Synchronization

### 1. Create Sync Hook

Create `src/hooks/useDataSync.js`:

```javascript
import { useState, useEffect } from 'react';
import { dataAPI, authAPI } from '../config/api';

export function useDataSync() {
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(null);

  const syncData = async () => {
    if (!authAPI.getCurrentUser()) return;
    
    setSyncing(true);
    try {
      // Export current data
      const exportData = await dataAPI.exportUserData();
      
      // Save to localStorage as backup
      localStorage.setItem('ayubi_backup_data', JSON.stringify(exportData));
      localStorage.setItem('ayubi_last_sync', Date.now().toString());
      
      setLastSync(new Date());
      return { success: true };
    } catch (error) {
      console.error('Sync failed:', error);
      return { success: false, error: error.message };
    } finally {
      setSyncing(false);
    }
  };

  const restoreFromBackup = async () => {
    const backupData = localStorage.getItem('ayubi_backup_data');
    if (!backupData) return { success: false, error: 'No backup data found' };

    try {
      const result = await dataAPI.importUserData(JSON.parse(backupData));
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Auto-sync every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      syncData();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return {
    syncing,
    lastSync,
    syncData,
    restoreFromBackup
  };
}
```

## 🎯 Testing Integration

### 1. Test Authentication

```javascript
// Test login
const testLogin = async () => {
  const result = await authAPI.login('testuser', 'testpassword');
  console.log('Login result:', result);
};

// Test protected endpoint
const testProtected = async () => {
  const habits = await habitsAPI.getHabits();
  console.log('Habits:', habits);
};
```

### 2. Test Data Operations

```javascript
// Test habit creation
const testCreateHabit = async () => {
  const habit = await habitsAPI.createHabit({
    title: 'Test Habit',
    description: 'Test description',
    icon: '🎯',
    color: 'blue'
  });
  console.log('Created habit:', habit);
};

// Test water entry
const testAddWater = async () => {
  const result = await waterAPI.addWaterEntry({
    amount: 250,
    drink_type: 'water',
    temperature: 'room'
  });
  console.log('Added water:', result);
};
```

## 🚀 Deployment Integration

### 1. Environment Configuration

**Development:**
```env
VITE_API_URL=http://localhost:8000/api/v1
```

**Production:**
```env
VITE_API_URL=https://your-backend-domain.com/api/v1
```

### 2. Build Configuration

Update `vite.config.js`:

```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
});
```

## 🔧 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check backend `ALLOWED_ORIGINS` configuration
   - Verify frontend URL is included

2. **Authentication Issues**
   - Check JWT token in localStorage
   - Verify token expiration
   - Check backend SECRET_KEY

3. **API Connection Issues**
   - Verify backend is running
   - Check API URL configuration
   - Test endpoints in Swagger UI

4. **Data Sync Issues**
   - Check network connectivity
   - Verify user authentication
   - Check backend logs

### Debug Tools

1. **Network Tab**: Monitor API requests
2. **Console**: Check for JavaScript errors
3. **Local Storage**: Verify token storage
4. **Backend Logs**: Check server-side errors

## 🎉 Success Checklist

- ✅ Backend running on http://localhost:8000
- ✅ Frontend running on http://localhost:3000
- ✅ Authentication working
- ✅ API calls successful
- ✅ Data syncing properly
- ✅ Error handling implemented
- ✅ Loading states working
- ✅ Offline fallback ready

Your Ayubi aka System is now fully integrated with a powerful backend! 🚀
