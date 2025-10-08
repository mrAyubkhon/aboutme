import { useState } from 'react';
import { Droplets, Settings } from 'lucide-react';
import PhysicsButton from '../components/PhysicsButton';

/**
 * Debug version of Water page
 */
export default function WaterDebug() {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="min-h-screen bg-gray-950 pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-50 mb-2">Water Tracker</h1>
              <p className="text-gray-300">Stay hydrated and track your daily water intake</p>
            </div>
            <PhysicsButton
              variant="secondary"
              onClick={() => setShowSettings(!showSettings)}
              icon={Settings}
              className="flex items-center space-x-2"
            >
              Settings
            </PhysicsButton>
          </div>
        </div>

        {/* Water Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-900 p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-50 flex items-center">
                <Droplets className="mr-2 text-blue-400" size={24} />
                Today's Intake
              </h3>
              <span className="text-2xl font-bold text-blue-400">0ml</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-3 mb-4">
              <div className="bg-blue-500 h-3 rounded-full" style={{ width: '0%' }}></div>
            </div>
            <p className="text-sm text-gray-400">0% of daily goal (2500ml)</p>
          </div>
          
          <div className="bg-gray-900 p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-50 mb-4 flex items-center">
              <Droplets className="mr-2 text-green-400" size={24} />
              Quick Add
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <PhysicsButton
                onClick={() => alert('250ml added!')}
                variant="primary"
                size="sm"
                className="w-full"
              >
                250ml
              </PhysicsButton>
              <PhysicsButton
                onClick={() => alert('500ml added!')}
                variant="primary"
                size="sm"
                className="w-full"
              >
                500ml
              </PhysicsButton>
              <PhysicsButton
                onClick={() => alert('750ml added!')}
                variant="secondary"
                size="sm"
                className="w-full"
              >
                750ml
              </PhysicsButton>
              <PhysicsButton
                onClick={() => alert('1000ml added!')}
                variant="secondary"
                size="sm"
                className="w-full"
              >
                1000ml
              </PhysicsButton>
            </div>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="bg-gray-900 p-6 rounded-xl mb-8">
            <h3 className="text-lg font-semibold text-gray-50 mb-4">Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Daily Goal (ml)
                </label>
                <input
                  type="number"
                  defaultValue="2500"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-50"
                />
              </div>
              <PhysicsButton
                onClick={() => setShowSettings(false)}
                variant="primary"
                className="w-full"
              >
                Save Settings
              </PhysicsButton>
            </div>
          </div>
        )}

        {/* Debug Info */}
        <div className="mt-8 p-4 bg-gray-800 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-50 mb-2">Debug Info</h3>
          <p className="text-gray-300">This is the debug version of the Water page.</p>
          <p className="text-gray-300">If you see this, the basic components are working.</p>
        </div>
      </div>
    </div>
  );
}
