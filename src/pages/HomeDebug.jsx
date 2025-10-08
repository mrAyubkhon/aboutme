import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import ModernLogo from '../components/ModernLogo';
import PhysicsButton from '../components/PhysicsButton';

/**
 * Debug version of Home page
 */
export default function HomeDebug() {
  const navigate = useNavigate();
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  return (
    <div className="min-h-screen bg-gray-950 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <ModernLogo size="lg" animated={true} />
              <div>
                <h1 className="text-3xl font-bold text-gray-50 mb-2">
                  Good morning! 👋
                </h1>
                <p className="text-gray-300">Welcome to your personal dashboard</p>
              </div>
            </div>
          </div>
        </div>

        {/* Simple Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900 p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-50 mb-2">Habits</h3>
            <p className="text-3xl font-bold text-blue-400">0/0</p>
            <p className="text-sm text-gray-400">0% Complete</p>
          </div>
          
          <div className="bg-gray-900 p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-50 mb-2">Water</h3>
            <p className="text-3xl font-bold text-blue-400">0/2500</p>
            <p className="text-sm text-gray-400">0% Complete</p>
          </div>
          
          <div className="bg-gray-900 p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-50 mb-2">Finance</h3>
            <p className="text-3xl font-bold text-green-400">$0</p>
            <p className="text-sm text-gray-400">Today's balance</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-xl font-semibold text-gray-50 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <PhysicsButton
              onClick={() => setShowQuickAdd(true)}
              icon={Plus}
              variant="primary"
              size="lg"
              className="h-24 flex flex-col items-center justify-center space-y-2 p-4"
            >
              <div className="text-center">
                <div className="font-semibold text-base mb-1">Add Habit</div>
                <div className="text-xs opacity-75 leading-tight">Track a new daily habit</div>
              </div>
            </PhysicsButton>
            
            <PhysicsButton
              onClick={() => navigate('/water')}
              icon={() => '💧'}
              variant="secondary"
              size="lg"
              className="h-24 flex flex-col items-center justify-center space-y-2 p-4"
            >
              <div className="text-center">
                <div className="font-semibold text-base mb-1">Log Water</div>
                <div className="text-xs opacity-75 leading-tight">Record water intake</div>
              </div>
            </PhysicsButton>
            
            <PhysicsButton
              onClick={() => navigate('/finance')}
              icon={() => '💰'}
              variant="success"
              size="lg"
              className="h-24 flex flex-col items-center justify-center space-y-2 p-4"
            >
              <div className="text-center">
                <div className="font-semibold text-base mb-1">Add Expense</div>
                <div className="text-xs opacity-75 leading-tight">Track spending</div>
              </div>
            </PhysicsButton>
            
            <PhysicsButton
              onClick={() => navigate('/journal')}
              icon={() => '📝'}
              variant="primary"
              size="lg"
              className="h-24 flex flex-col items-center justify-center space-y-2 p-4"
            >
              <div className="text-center">
                <div className="font-semibold text-base mb-1">Write Journal</div>
                <div className="text-xs opacity-75 leading-tight">Record thoughts</div>
              </div>
            </PhysicsButton>
          </div>
        </div>

        {/* Debug Info */}
        <div className="mt-8 p-4 bg-gray-800 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-50 mb-2">Debug Info</h3>
          <p className="text-gray-300">This is the debug version of the Home page.</p>
          <p className="text-gray-300">If you see this, the basic components are working.</p>
        </div>
      </div>
    </div>
  );
}
