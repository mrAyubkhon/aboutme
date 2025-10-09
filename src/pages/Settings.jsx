import React from 'react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Settings as SettingsIcon, 
  Trash2, 
  Download,
  Upload,
  User,
  Wrench,
  Activity
} from 'lucide-react';
import { useWater } from '../hooks/useWater';
import { useFinance } from '../hooks/useFinance';
import { useSport } from '../context/SportContext';
import Card from '../components/Card';
import PhysicsButton from '../components/PhysicsButton';

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
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.3 }
  }
};

export default function Settings() {
  const navigate = useNavigate();
  const { waterData, setGoal } = useWater();
  const { financeData, setDailyLimit } = useFinance();
  const { state: sportState, getToday, getWater } = useSport();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showExportData, setShowExportData] = useState(false);
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  // Enhanced diagnostics function
  const runQuickDiagnostics = () => {
    const today = getToday();
    const todayWater = getWater(today);
    
    const diagnostics = {
      localStorage: {
        habits: !!localStorage.getItem('ayubi_habits'),
        water: !!localStorage.getItem('ayubi_water'),
        finances: !!localStorage.getItem('ayubi_finances'),
        journal: !!localStorage.getItem('ayubi_journal'),
        settings: !!localStorage.getItem('ayubi_settings'),
        travel: !!localStorage.getItem('ayubi_travel_wishlist'),
        sport: !!localStorage.getItem('SPORT_STATE_V1'),
        travelMap: !!localStorage.getItem('travel_wishlist_iso')
      },
      sportContext: {
        waterGoal: sportState?.goals?.waterMlPerDay || 0,
        kcalGoal: sportState?.goals?.kcalPerDay || 0,
        todayWater: todayWater,
        waterEntries: Object.keys(sportState?.water || {}).length,
        foodEntries: sportState?.foods?.length || 0,
        workoutEntries: sportState?.workouts?.length || 0
      },
      browser: {
        userAgent: navigator.userAgent,
        language: navigator.language,
        online: navigator.onLine,
        cookiesEnabled: navigator.cookieEnabled
      },
      performance: {
        memory: performance.memory ? `${Math.round(performance.memory.usedJSHeapSize / 1024 / 1024)}MB` : 'N/A',
        timing: performance.timing ? `${performance.timing.loadEventEnd - performance.timing.navigationStart}ms` : 'N/A'
      },
      environment: {
        nodeEnv: import.meta.env.MODE,
        apiUrl: import.meta.env.VITE_API_URL || 'Not configured',
        steamApi: !!import.meta.env.VITE_STEAM_API_KEY,
        faceitApi: !!import.meta.env.VITE_FACEIT_API_KEY
      }
    };

    console.log('🔍 Quick Diagnostics:', diagnostics);
    setShowDiagnostics(true);
    
    return diagnostics;
  };

  const handleExportData = () => {
    const data = {
      habits: JSON.parse(localStorage.getItem('ayubi_habits') || '[]'),
      water: JSON.parse(localStorage.getItem('ayubi_water') || '{}'),
      finances: JSON.parse(localStorage.getItem('ayubi_finances') || '{}'),
      journal: JSON.parse(localStorage.getItem('ayubi_journal') || '[]'),
      settings: JSON.parse(localStorage.getItem('ayubi_settings') || '{}'),
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ayubi-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        
        if (data.habits) localStorage.setItem('ayubi_habits', JSON.stringify(data.habits));
        if (data.water) localStorage.setItem('ayubi_water', JSON.stringify(data.water));
        if (data.finances) localStorage.setItem('ayubi_finances', JSON.stringify(data.finances));
        if (data.journal) localStorage.setItem('ayubi_journal', JSON.stringify(data.journal));
        if (data.settings) localStorage.setItem('ayubi_settings', JSON.stringify(data.settings));
        
        alert('Data imported successfully! Please refresh the page.');
        window.location.reload();
      } catch (error) {
        alert('Error importing data. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetAllData = () => {
    if (window.confirm('Are you sure you want to delete ALL data? This action cannot be undone.')) {
      localStorage.clear();
      alert('All data has been deleted. The page will refresh.');
      window.location.reload();
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
          <h1 className="text-3xl font-bold text-gray-50 mb-2">Settings</h1>
          <p className="text-gray-300">Manage your app preferences and data</p>
        </motion.div>

        {/* App Info */}
        <motion.div variants={itemVariants} className="mb-8">
          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center border border-blue-500/30">
                <User className="text-blue-400" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-50">Ayubi aka System</h3>
                <p className="text-gray-400">Personal Dashboard v1.0</p>
                <p className="text-sm text-gray-500">Dark minimal theme • English only</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Goals Settings */}
        <motion.div variants={itemVariants} className="mb-8">
          <h2 className="text-xl font-semibold text-gray-50 mb-6">Goals & Limits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-50 mb-4">Water Goal</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Daily Water Goal (ml)
                  </label>
                  <input
                    type="number"
                    value={waterData.goal}
                    onChange={(e) => setGoal(Number(e.target.value))}
                    min="500"
                    max="10000"
                    step="250"
                    className="w-full px-3 py-2 border border-gray-800 rounded-xl bg-gray-800 text-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                </div>
                <p className="text-sm text-gray-400">
                  Current: {waterData.goal.toLocaleString()}ml per day
                </p>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-50 mb-4">Daily Spending Limit</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Daily Limit (UZS)
                  </label>
                  <input
                    type="number"
                    value={financeData.dailyLimit}
                    onChange={(e) => setDailyLimit(Number(e.target.value))}
                    min="0"
                    step="10000"
                    className="w-full px-3 py-2 border border-gray-800 rounded-xl bg-gray-800 text-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                </div>
                <p className="text-sm text-gray-400">
                  Current: {financeData.dailyLimit.toLocaleString()} UZS per day
                </p>
              </div>
            </Card>
          </div>
        </motion.div>

        {/* System Diagnostics */}
        <motion.div variants={itemVariants} className="mb-8">
          <h2 className="text-xl font-semibold text-gray-50 mb-6">System Diagnostics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-50 mb-4 flex items-center">
                <Activity className="mr-2 text-green-400" size={20} />
                Quick Diagnostics
              </h3>
              <p className="text-gray-400 mb-4">
                Run a quick system check to verify all components are working properly.
              </p>
              <PhysicsButton onClick={runQuickDiagnostics} className="w-full">
                <Activity size={18} className="mr-2" />
                Run Diagnostics
              </PhysicsButton>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-50 mb-4 flex items-center">
                <Wrench className="mr-2 text-blue-400" size={20} />
                Advanced Diagnostics
              </h3>
              <p className="text-gray-400 mb-4">
                Open the full diagnostics page for detailed system information.
              </p>
              <PhysicsButton 
                variant="secondary"
                onClick={() => navigate('/diagnostics')} 
                className="w-full"
              >
                <Wrench size={18} className="mr-2" />
                Open Diagnostics
              </PhysicsButton>
            </Card>
          </div>
        </motion.div>

        {/* Data Management */}
        <motion.div variants={itemVariants} className="mb-8">
          <h2 className="text-xl font-semibold text-gray-50 mb-6">Data Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-50 mb-4 flex items-center">
                <Download className="mr-2 text-green-400" size={20} />
                Export Data
              </h3>
              <p className="text-gray-400 mb-4">
                Download all your data as a JSON backup file.
              </p>
              <PhysicsButton onClick={handleExportData} className="w-full">
                <Download size={18} className="mr-2" />
                Export All Data
              </PhysicsButton>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-50 mb-4 flex items-center">
                <Upload className="mr-2 text-blue-400" size={20} />
                Import Data
              </h3>
              <p className="text-gray-400 mb-4">
                Restore data from a previous backup file.
              </p>
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="hidden"
                id="import-file"
              />
              <PhysicsButton 
                variant="secondary" 
                onClick={() => document.getElementById('import-file').click()}
                className="w-full"
              >
                <Upload size={18} className="mr-2" />
                Import Data
              </PhysicsButton>
            </Card>
          </div>
        </motion.div>

        {/* Danger Zone */}
        <motion.div variants={itemVariants}>
          <h2 className="text-xl font-semibold text-gray-50 mb-6">Danger Zone</h2>
          <Card className="p-6 border-red-500/20">
            <h3 className="text-lg font-semibold text-red-400 mb-4 flex items-center">
              <Trash2 className="mr-2" size={20} />
              Reset All Data
            </h3>
            <p className="text-gray-400 mb-4">
              This will permanently delete all your habits, water tracking, finances, and journal entries. This action cannot be undone.
            </p>
            <PhysicsButton
              variant="danger"
              onClick={() => setShowResetConfirm(!showResetConfirm)}
            >
              <Trash2 size={18} className="mr-2" />
              Reset All Data
            </PhysicsButton>
            
            {showResetConfirm && (
              <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                <p className="text-red-400 mb-4 font-medium">
                  ⚠️ Are you absolutely sure? This will delete ALL your data permanently.
                </p>
                <div className="flex space-x-3">
                  <PhysicsButton
                    variant="danger"
                    onClick={handleResetAllData}
                  >
                    Yes, Delete Everything
                  </PhysicsButton>
                  <PhysicsButton
                    variant="secondary"
                    onClick={() => setShowResetConfirm(false)}
                  >
                    Cancel
                  </PhysicsButton>
                </div>
              </div>
            )}
          </Card>
        </motion.div>
      </div>

      {/* Diagnostics Modal */}
      {showDiagnostics && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowDiagnostics(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-50 flex items-center gap-2">
                <Wrench className="text-blue-400" />
                System Diagnostics
              </h3>
              <PhysicsButton
                onClick={() => setShowDiagnostics(false)}
                icon={X}
                variant="ghost"
                size="sm"
              />
            </div>

            <div className="space-y-6">
              {/* LocalStorage Status */}
              <div>
                <h4 className="text-lg font-semibold text-gray-50 mb-3">LocalStorage Status</h4>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries({
                    'Habits': localStorage.getItem('ayubi_habits'),
                    'Water': localStorage.getItem('ayubi_water'),
                    'Finances': localStorage.getItem('ayubi_finances'),
                    'Journal': localStorage.getItem('ayubi_journal'),
                    'Sport': localStorage.getItem('SPORT_STATE_V1'),
                    'Travel Map': localStorage.getItem('travel_wishlist_iso')
                  }).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                      <span className="text-gray-300">{key}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        value ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {value ? '✓ Stored' : '✗ Missing'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sport Context Status */}
              <div>
                <h4 className="text-lg font-semibold text-gray-50 mb-3">Sport Context Status</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                    <span className="text-gray-300">Water Goal</span>
                    <span className="text-blue-400 font-mono">{sportState?.goals?.waterMlPerDay || 0}ml</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                    <span className="text-gray-300">Calorie Goal</span>
                    <span className="text-blue-400 font-mono">{sportState?.goals?.kcalPerDay || 0}kcal</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                    <span className="text-gray-300">Today's Water</span>
                    <span className="text-blue-400 font-mono">{getWater(getToday())}ml</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                    <span className="text-gray-300">Water Entries</span>
                    <span className="text-blue-400 font-mono">{Object.keys(sportState?.water || {}).length}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                    <span className="text-gray-300">Food Entries</span>
                    <span className="text-blue-400 font-mono">{sportState?.foods?.length || 0}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                    <span className="text-gray-300">Workout Entries</span>
                    <span className="text-blue-400 font-mono">{sportState?.workouts?.length || 0}</span>
                  </div>
                </div>
              </div>

              {/* Browser Info */}
              <div>
                <h4 className="text-lg font-semibold text-gray-50 mb-3">Browser Information</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                    <span className="text-gray-300">Status</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      navigator.onLine ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {navigator.onLine ? 'Online' : 'Offline'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                    <span className="text-gray-300">Language</span>
                    <span className="text-gray-400">{navigator.language}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                    <span className="text-gray-300">Platform</span>
                    <span className="text-gray-400">{navigator.platform}</span>
                  </div>
                </div>
              </div>

              {/* Environment Info */}
              <div>
                <h4 className="text-lg font-semibold text-gray-50 mb-3">Environment</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                    <span className="text-gray-300">Mode</span>
                    <span className="text-gray-400">{import.meta.env.MODE}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                    <span className="text-gray-300">API URL</span>
                    <span className="text-gray-400">{import.meta.env.VITE_API_URL || 'Not configured'}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                    <span className="text-gray-300">Steam API</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      import.meta.env.VITE_STEAM_API_KEY ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {import.meta.env.VITE_STEAM_API_KEY ? 'Configured' : 'Missing'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                    <span className="text-gray-300">Faceit API</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      import.meta.env.VITE_FACEIT_API_KEY ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {import.meta.env.VITE_FACEIT_API_KEY ? 'Configured' : 'Missing'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <PhysicsButton
                onClick={() => setShowDiagnostics(false)}
                variant="primary"
              >
                Close
              </PhysicsButton>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}