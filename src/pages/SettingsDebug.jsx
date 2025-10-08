import { useState } from 'react';
import { Settings, User, Bell, Palette, Database } from 'lucide-react';
import PhysicsButton from '../components/PhysicsButton';

/**
 * Debug version of Settings page
 */
export default function SettingsDebug() {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'data', label: 'Data', icon: Database },
  ];

  return (
    <div className="min-h-screen bg-gray-950 pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3">
            <Settings className="text-blue-400" size={32} />
            <div>
              <h1 className="text-3xl font-bold text-gray-50 mb-2">Settings</h1>
              <p className="text-gray-300">Manage your account preferences and app settings</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Settings Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 p-4 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-50 mb-4">Settings</h3>
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'text-gray-300 hover:bg-gray-800'
                      }`}
                    >
                      <Icon size={20} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3">
            <div className="bg-gray-900 p-6 rounded-xl">
              {activeTab === 'profile' && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-50 mb-6">Profile Settings</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Display Name
                      </label>
                      <input
                        type="text"
                        defaultValue="Ayubi"
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        defaultValue="ayubi@example.com"
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Timezone
                      </label>
                      <select className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-50">
                        <option value="UTC+5">UTC+5 (Tashkent)</option>
                        <option value="UTC+0">UTC+0 (London)</option>
                        <option value="UTC-5">UTC-5 (New York)</option>
                      </select>
                    </div>
                    <PhysicsButton
                      onClick={() => alert('Profile updated!')}
                      variant="primary"
                      className="w-full"
                    >
                      Save Changes
                    </PhysicsButton>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-50 mb-6">Notification Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-50">Habit Reminders</h4>
                        <p className="text-sm text-gray-400">Get reminded to complete your habits</p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-50">Water Reminders</h4>
                        <p className="text-sm text-gray-400">Remind me to drink water</p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-50">Daily Summary</h4>
                        <p className="text-sm text-gray-400">Receive daily progress summary</p>
                      </div>
                      <input type="checkbox" className="w-4 h-4 text-blue-600" />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'appearance' && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-50 mb-6">Appearance Settings</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Theme
                      </label>
                      <select className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-50">
                        <option value="dark">Dark Theme</option>
                        <option value="light">Light Theme</option>
                        <option value="auto">Auto (System)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Accent Color
                      </label>
                      <div className="flex space-x-2">
                        {['blue', 'green', 'purple', 'red', 'yellow'].map((color) => (
                          <button
                            key={color}
                            className={`w-8 h-8 rounded-full border-2 ${
                              color === 'blue' ? 'border-blue-400' : 'border-gray-600'
                            }`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Animations
                      </label>
                      <select className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-50">
                        <option value="full">Full Animations</option>
                        <option value="reduced">Reduced Motion</option>
                        <option value="none">No Animations</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'data' && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-50 mb-6">Data Management</h3>
                  <div className="space-y-6">
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-50 mb-2">Export Data</h4>
                      <p className="text-sm text-gray-400 mb-4">
                        Download all your data as a JSON file
                      </p>
                      <PhysicsButton
                        onClick={() => alert('Data exported!')}
                        variant="secondary"
                        className="w-full"
                      >
                        Export Data
                      </PhysicsButton>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-50 mb-2">Clear All Data</h4>
                      <p className="text-sm text-gray-400 mb-4">
                        This will permanently delete all your data
                      </p>
                      <PhysicsButton
                        onClick={() => alert('Data cleared!')}
                        variant="danger"
                        className="w-full"
                      >
                        Clear All Data
                      </PhysicsButton>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Debug Info */}
        <div className="mt-8 p-4 bg-gray-800 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-50 mb-2">Debug Info</h3>
          <p className="text-gray-300">This is the debug version of the Settings page.</p>
          <p className="text-gray-300">If you see this, the basic components are working.</p>
        </div>
      </div>
    </div>
  );
}
