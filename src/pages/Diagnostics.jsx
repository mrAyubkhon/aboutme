import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, RefreshCw, AlertTriangle } from 'lucide-react';
import PhysicsButton from '../components/PhysicsButton';
import apiService from '../services/api';
import gameStatsService from '../services/gameStatsService';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function Diagnostics() {
  const [tests, setTests] = useState({});
  const [loading, setLoading] = useState(false);

  const runDiagnostics = async () => {
    setLoading(true);
    const results = {};

    try {
      // Test 1: Frontend React
      results.react = {
        status: 'success',
        message: 'React is working correctly',
        details: 'Component rendered successfully'
      };
    } catch (error) {
      results.react = {
        status: 'error',
        message: 'React error',
        details: error.message
      };
    }

    try {
      // Test 2: Backend API
      const backendResponse = await apiService.healthCheck();
      results.backend = {
        status: 'success',
        message: 'Backend API is responding',
        details: `Status: ${backendResponse.status}`
      };
    } catch (error) {
      results.backend = {
        status: 'error',
        message: 'Backend API error',
        details: error.message
      };
    }

    try {
      // Test 3: Journal API
      const journalResponse = await apiService.getJournalEntries();
      results.journal = {
        status: 'success',
        message: 'Journal API is working',
        details: `Entries loaded: ${journalResponse.entries?.length || 0}`
      };
    } catch (error) {
      results.journal = {
        status: 'error',
        message: 'Journal API error',
        details: error.message
      };
    }

    try {
      // Test 4: LocalStorage
      const testData = { test: 'data', timestamp: Date.now() };
      localStorage.setItem('diagnostic_test', JSON.stringify(testData));
      const retrieved = JSON.parse(localStorage.getItem('diagnostic_test'));
      localStorage.removeItem('diagnostic_test');
      
      if (retrieved.test === testData.test) {
        results.localStorage = {
          status: 'success',
          message: 'LocalStorage is working',
          details: 'Data can be stored and retrieved'
        };
      } else {
        results.localStorage = {
          status: 'error',
          message: 'LocalStorage data mismatch',
          details: 'Retrieved data does not match stored data'
        };
      }
    } catch (error) {
      results.localStorage = {
        status: 'error',
        message: 'LocalStorage error',
        details: error.message
      };
    }

    try {
      // Test 5: Game Stats Service
      const mockData = gameStatsService.getMockSteamData();
      results.gameStats = {
        status: 'success',
        message: 'Game Stats Service is working',
        details: `Mock data loaded: ${mockData.steamid}`
      };
    } catch (error) {
      results.gameStats = {
        status: 'error',
        message: 'Game Stats Service error',
        details: error.message
      };
    }

    try {
      // Test 6: Environment Variables
      const hasSteamKey = !!import.meta.env.VITE_STEAM_API_KEY;
      const hasFaceitKey = !!import.meta.env.VITE_FACEIT_API_KEY;
      
      results.environment = {
        status: hasSteamKey && hasFaceitKey ? 'success' : 'warning',
        message: hasSteamKey && hasFaceitKey ? 'Environment variables configured' : 'Some environment variables missing',
        details: `Steam API: ${hasSteamKey ? 'Configured' : 'Missing'}, Faceit API: ${hasFaceitKey ? 'Configured' : 'Missing'}`
      };
    } catch (error) {
      results.environment = {
        status: 'error',
        message: 'Environment check error',
        details: error.message
      };
    }

    setTests(results);
    setLoading(false);
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      default:
        return <RefreshCw className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'border-green-500 bg-green-500/10';
      case 'error':
        return 'border-red-500 bg-red-500/10';
      case 'warning':
        return 'border-yellow-500 bg-yellow-500/10';
      default:
        return 'border-gray-500 bg-gray-500/10';
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gray-950 pt-16"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-50 mb-2">
                🔧 System Diagnostics
              </h1>
              <p className="text-gray-300">
                Check the health and functionality of all system components
              </p>
            </div>
            
            <PhysicsButton
              onClick={runDiagnostics}
              disabled={loading}
              variant="primary"
              className="flex items-center space-x-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Running...' : 'Run Tests'}</span>
            </PhysicsButton>
          </div>
        </motion.div>

        {/* Test Results */}
        <motion.div variants={itemVariants} className="space-y-4">
          {Object.entries(tests).map(([testName, result]) => (
            <div
              key={testName}
              className={`p-4 rounded-lg border ${getStatusColor(result.status)}`}
            >
              <div className="flex items-center space-x-3">
                {getStatusIcon(result.status)}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-50 capitalize">
                    {testName.replace(/([A-Z])/g, ' $1').trim()}
                  </h3>
                  <p className="text-gray-300">{result.message}</p>
                  <p className="text-sm text-gray-400 mt-1">{result.details}</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* System Information */}
        <motion.div variants={itemVariants} className="mt-8 bg-gray-900 rounded-lg p-6 border border-gray-800">
          <h3 className="text-lg font-semibold text-gray-50 mb-4">System Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Frontend URL:</span>
              <span className="text-gray-50 ml-2">http://localhost:3000</span>
            </div>
            <div>
              <span className="text-gray-400">Backend URL:</span>
              <span className="text-gray-50 ml-2">http://localhost:8000</span>
            </div>
            <div>
              <span className="text-gray-400">User Agent:</span>
              <span className="text-gray-50 ml-2">{navigator.userAgent.split(' ')[0]}</span>
            </div>
            <div>
              <span className="text-gray-400">Timestamp:</span>
              <span className="text-gray-50 ml-2">{new Date().toLocaleString()}</span>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants} className="mt-8 bg-gray-900 rounded-lg p-6 border border-gray-800">
          <h3 className="text-lg font-semibold text-gray-50 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <PhysicsButton
              onClick={() => window.location.href = '/journal'}
              variant="secondary"
              className="w-full"
            >
              Test Journal
            </PhysicsButton>
            <PhysicsButton
              onClick={() => window.location.href = '/gamestats'}
              variant="secondary"
              className="w-full"
            >
              Test Game Stats
            </PhysicsButton>
            <PhysicsButton
              onClick={() => window.open('http://localhost:8000/docs', '_blank')}
              variant="secondary"
              className="w-full"
            >
              Backend API Docs
            </PhysicsButton>
          </div>
        </motion.div>

        {/* Troubleshooting */}
        <motion.div variants={itemVariants} className="mt-8 bg-gray-900 rounded-lg p-6 border border-gray-800">
          <h3 className="text-lg font-semibold text-gray-50 mb-4">Troubleshooting</h3>
          <div className="space-y-3 text-sm text-gray-300">
            <p><strong>White Screen:</strong> If you see a white screen, try:</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Hard refresh the page (Ctrl+F5 or Cmd+Shift+R)</li>
              <li>Clear browser cache</li>
              <li>Check browser console for errors</li>
              <li>Verify both frontend and backend are running</li>
            </ul>
            
            <p className="mt-4"><strong>Backend Issues:</strong> If backend tests fail:</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Check if backend is running on port 8000</li>
              <li>Verify CORS configuration</li>
              <li>Check backend logs for errors</li>
            </ul>
            
            <p className="mt-4"><strong>API Issues:</strong> If API calls fail:</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Check network connectivity</li>
              <li>Verify API endpoints are correct</li>
              <li>Check for CORS errors in browser console</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
