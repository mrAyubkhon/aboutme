import { motion } from 'framer-motion';
import { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  User, 
  Trash2, 
  Download,
  Upload
} from 'lucide-react';
import { useWater, useFinance } from '../hooks/useLocalStorage';
import Card from '../components/Card';

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
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3 }
  }
};

export default function Settings() {
  const { waterData, setGoal } = useWater();
  const { financeData, setDailyLimit } = useFinance();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showExportData, setShowExportData] = useState(false);

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
    a.download = `ayubi-aka-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowExportData(false);
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
      } catch (error) {
        alert('Error importing data. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <motion.div
      className="min-h-screen bg-dark-bg pt-16"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Customize your Ayubi aka experience
          </p>
        </motion.div>

        {/* Profile Settings */}
        <motion.div variants={itemVariants} className="mb-8">
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-xl flex items-center justify-center">
                <User size={20} className="text-primary-600 dark:text-primary-400" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Profile
              </h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={settings.name}
                  onChange={(e) => updateSetting('name', e.target.value)}
                  className="input"
                  placeholder="Enter your name"
                />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Appearance Settings */}
        <motion.div variants={itemVariants} className="mb-8">
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center">
                <Palette size={20} className="text-purple-600 dark:text-purple-400" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Appearance
              </h2>
            </div>
            
            <div className="space-y-6">
              {/* Theme Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Theme
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {themes.map((theme) => {
                    const Icon = theme.icon;
                    const isSelected = settings.theme === theme.code;
                    
                    return (
                      <motion.button
                        key={theme.code}
                        onClick={() => updateSetting('theme', theme.code)}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                          isSelected
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex flex-col items-center space-y-2">
                          <Icon size={20} className={
                            isSelected 
                              ? 'text-primary-600 dark:text-primary-400' 
                              : 'text-gray-500 dark:text-gray-400'
                          } />
                          <span className={`text-sm font-medium ${
                            isSelected 
                              ? 'text-primary-700 dark:text-primary-300' 
                              : 'text-gray-700 dark:text-gray-300'
                          }`}>
                            {theme.name}
                          </span>
                          {isSelected && (
                            <Check size={16} className="text-primary-600 dark:text-primary-400" />
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Language Settings */}
        <motion.div variants={itemVariants} className="mb-8">
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center">
                <Globe size={20} className="text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Language
              </h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Select Language
                </label>
                <div className="space-y-2">
                  {languages.map((lang) => (
                    <motion.button
                      key={lang.code}
                      onClick={() => updateSetting('language', lang.code)}
                      className={`w-full p-3 rounded-xl border-2 transition-all duration-200 ${
                        settings.language === lang.code
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{lang.flag}</span>
                        <span className={`font-medium ${
                          settings.language === lang.code
                            ? 'text-primary-700 dark:text-primary-300'
                            : 'text-gray-700 dark:text-gray-300'
                        }`}>
                          {lang.name}
                        </span>
                        {settings.language === lang.code && (
                          <Check size={16} className="text-primary-600 dark:text-primary-400 ml-auto" />
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Goals Settings */}
        <motion.div variants={itemVariants} className="mb-8">
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
                <SettingsIcon size={20} className="text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Goals & Limits
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Daily Water Goal (ml)
                </label>
                <input
                  type="number"
                  value={waterData.goal}
                  onChange={(e) => setGoal(parseInt(e.target.value) || 3000)}
                  min="500"
                  max="10000"
                  step="250"
                  className="input"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Daily Spending Limit ($)
                </label>
                <input
                  type="number"
                  value={financeData.dailyLimit}
                  onChange={(e) => setDailyLimit(parseInt(e.target.value) || 100000)}
                  min="1000"
                  step="1000"
                  className="input"
                />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Data Management */}
        <motion.div variants={itemVariants} className="mb-8">
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-xl flex items-center justify-center">
                <Download size={20} className="text-orange-600 dark:text-orange-400" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Data Management
              </h2>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.button
                  onClick={() => setShowExportData(true)}
                  className="flex items-center space-x-3 p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Download size={20} className="text-primary-600 dark:text-primary-400" />
                  <div className="text-left">
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      Export Data
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Download your data as JSON
                    </div>
                  </div>
                </motion.button>
                
                <label className="flex items-center space-x-3 p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors duration-200 cursor-pointer">
                  <Upload size={20} className="text-primary-600 dark:text-primary-400" />
                  <div className="text-left">
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      Import Data
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Upload JSON backup file
                    </div>
                  </div>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportData}
                    className="hidden"
                  />
                </label>
              </div>
              
              <motion.button
                onClick={() => setShowResetConfirm(true)}
                className="w-full flex items-center space-x-3 p-4 border border-red-200 dark:border-red-700 rounded-xl hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200 text-red-600 dark:text-red-400"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Trash2 size={20} />
                <div className="text-left">
                  <div className="font-medium">
                    Reset All Data
                  </div>
                  <div className="text-sm opacity-75">
                    Permanently delete all your data
                  </div>
                </div>
              </motion.button>
            </div>
          </Card>
        </motion.div>

        {/* About */}
        <motion.div variants={itemVariants}>
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              About Ayubi aka System
            </h2>
            <div className="space-y-3 text-gray-600 dark:text-gray-400">
              <p>
                A personal dashboard designed for discipline and balance. 
                Track your habits, manage finances, stay hydrated, and capture your thoughts.
              </p>
              <p className="text-sm">
                Designed for discipline and balance. © Ayubi aka
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Export Data Modal */}
        <motion.div
          className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 ${showExportData ? 'block' : 'hidden'}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: showExportData ? 1 : 0 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowExportData(false)}
        >
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Export Data
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              This will download all your data (habits, finances, journal entries, settings) as a JSON file.
            </p>
            <div className="flex space-x-3">
              <motion.button
                onClick={() => setShowExportData(false)}
                className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
              <motion.button
                onClick={handleExportData}
                className="flex-1 px-4 py-2 btn-primary"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Export
              </motion.button>
            </div>
          </motion.div>
        </motion.div>

        {/* Reset Confirmation Modal */}
        <motion.div
          className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 ${showResetConfirm ? 'block' : 'hidden'}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: showResetConfirm ? 1 : 0 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowResetConfirm(false)}
        >
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Reset All Data?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              This will permanently delete all your habits, finances, journal entries, and settings. 
              This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <motion.button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
              <motion.button
                onClick={resetAllData}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Reset All Data
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
