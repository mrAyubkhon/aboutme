import { useState } from 'react';
import { Plus } from 'lucide-react';
import PhysicsButton from '../components/PhysicsButton';

/**
 * Debug version of Routine page
 */
export default function RoutineDebug() {
  const [habits] = useState([]);

  return (
    <div className="min-h-screen bg-gray-950 pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-50 mb-2">Routine Tracker</h1>
              <p className="text-gray-300">Track your daily habits and build consistency</p>
            </div>
            <PhysicsButton
              onClick={() => alert('Add Habit clicked!')}
              icon={Plus}
              variant="primary"
              className="flex items-center space-x-2"
            >
              Add Habit
            </PhysicsButton>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="mb-8">
          <div className="bg-gray-900 p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-50 flex items-center">
                <span className="mr-2 text-blue-400">🎯</span>
                Daily Progress
              </h3>
              <span className="text-2xl font-bold text-blue-400">
                0/{habits.length}
              </span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-3 mb-4">
              <div className="bg-blue-500 h-3 rounded-full" style={{ width: '0%' }}></div>
            </div>
            <p className="text-sm text-gray-400">
              0% Complete - Ready to start your journey!
            </p>
          </div>
        </div>

        {/* Habits List */}
        <div>
          <h3 className="text-xl font-semibold text-gray-50 mb-6">
            Your Habits ({habits.length})
          </h3>
          
          <div className="bg-gray-900 p-8 text-center rounded-xl">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-lg font-semibold text-gray-50 mb-2">No habits yet</h3>
            <p className="text-gray-400 mb-4">Start building your daily routine by adding your first habit.</p>
            <PhysicsButton
              onClick={() => alert('Add Your First Habit clicked!')}
              icon={Plus}
              variant="primary"
              className="flex items-center space-x-2"
            >
              Add Your First Habit
            </PhysicsButton>
          </div>
        </div>

        {/* Debug Info */}
        <div className="mt-8 p-4 bg-gray-800 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-50 mb-2">Debug Info</h3>
          <p className="text-gray-300">This is the debug version of the Routine page.</p>
          <p className="text-gray-300">If you see this, the basic components are working.</p>
        </div>
      </div>
    </div>
  );
}
