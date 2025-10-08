import { motion } from 'framer-motion';
import { useState } from 'react';
import { Droplets, Settings, TrendingUp, Target, Zap } from 'lucide-react';
import { useWater } from '../hooks/useWater';
import Card from '../components/Card';
import WaterTracker from '../components/WaterTracker';
import PhysicsButton from '../components/PhysicsButton';
import EnhancedCard, { EnhancedStatCard } from '../components/EnhancedCard';
import EnhancedProgressBar, { CircularProgress } from '../components/EnhancedProgressBar';

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

export default function Water() {
  const { waterData, addWater, setGoal, getProgress, getRemaining } = useWater();
  
  const subtractWater = (amount) => {
    addWater(-amount);
  };

  // Simple water addition
  const handleAddWater = (amount) => {
    addWater(amount);
  };
  const [showSettings, setShowSettings] = useState(false);
  const [newGoal, setNewGoal] = useState(waterData.goal);

  const progress = getProgress();
  const remaining = getRemaining();

  const handleGoalUpdate = () => {
    setGoal(newGoal);
    setShowSettings(false);
  };

  const quickAddAmounts = [250, 500, 1000];

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
        </motion.div>

        {/* Enhanced Stats Grid */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <EnhancedStatCard
              title="Today's Progress"
              value={`${Math.round((waterData.current / waterData.goal) * 100)}%`}
              icon={<Droplets className="w-6 h-6" />}
              color="blue"
              trend={waterData.current > waterData.goal * 0.8 ? 'up' : 'neutral'}
              change={`${waterData.current}ml / ${waterData.goal}ml`}
            />
            
            <EnhancedStatCard
              title="Remaining"
              value={`${getRemaining()}ml`}
              icon={<Target className="w-6 h-6" />}
              color={getRemaining() > 500 ? 'yellow' : 'green'}
              trend={getRemaining() < 500 ? 'up' : 'neutral'}
              change={getRemaining() > 0 ? `${Math.ceil(getRemaining() / 250)} glasses` : 'Goal reached!'}
            />
            
            <EnhancedStatCard
              title="Streak"
              value="7 days"
              icon={<Zap className="w-6 h-6" />}
              color="purple"
              trend="up"
              change="Keep it up!"
            />
          </div>
        </motion.div>

        {/* Circular Progress */}
        <motion.div variants={itemVariants} className="mb-8">
          <EnhancedCard className="text-center" glow={true}>
            <div className="flex items-center justify-center space-x-8">
              <CircularProgress
                value={waterData.current}
                max={waterData.goal}
                size={150}
                variant="blue"
                label="Daily Goal"
                animated={true}
              />
              <div className="text-left">
                <h3 className="text-xl font-semibold text-gray-50 mb-2">Hydration Status</h3>
                <p className="text-gray-400 mb-4">
                  {waterData.current >= waterData.goal 
                    ? "🎉 Excellent! You've reached your daily goal!" 
                    : `Keep going! ${getRemaining()}ml more to reach your goal.`
                  }
                </p>
                <EnhancedProgressBar
                  value={waterData.current}
                  max={waterData.goal}
                  size="lg"
                  variant="blue"
                  glow={true}
                  animated={true}
                  label="Progress"
                />
              </div>
            </div>
          </EnhancedCard>
        </motion.div>

        {/* Main Water Tracker */}
        <motion.div variants={itemVariants} className="mb-8">
          <WaterTracker
            currentAmount={waterData.current}
            goal={waterData.goal}
            onAddWater={handleAddWater}
            onSubtractWater={subtractWater}
          />
        </motion.div>

        {/* Settings Panel */}
        {showSettings && (
          <motion.div
            variants={itemVariants}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8"
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-50 mb-4 flex items-center">
                <Settings className="mr-2 text-blue-400" size={20} />
                Water Goal Settings
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Daily Water Goal (ml)
                  </label>
                  <input
                    type="number"
                    value={newGoal}
                    onChange={(e) => setNewGoal(Number(e.target.value))}
                    min="500"
                    max="10000"
                    step="250"
                    className="w-full px-3 py-2 border border-gray-800 rounded-xl bg-gray-800 text-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Recommended: 2000-3000ml per day
                  </p>
                </div>
                <div className="flex space-x-3">
                  <PhysicsButton onClick={handleGoalUpdate}>
                    Update Goal
                  </PhysicsButton>
                  <PhysicsButton 
                    variant="secondary" 
                    onClick={() => setShowSettings(false)}
                  >
                    Cancel
                  </PhysicsButton>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Quick Add Buttons */}
        <motion.div variants={itemVariants} className="mb-8">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-50 mb-4">Quick Add</h3>
            <div className="grid grid-cols-3 gap-3">
              {quickAddAmounts.map((amount) => (
                <PhysicsButton
                  key={amount}
                  onClick={() => addWater(amount)}
                  variant="secondary"
                  className="flex items-center justify-center space-x-2"
                >
                  <Droplets size={16} />
                  <span>+{amount}ml</span>
                </PhysicsButton>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Daily Stats */}
        <motion.div variants={itemVariants}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-3 border border-blue-500/30">
                <Droplets className="text-blue-400" size={24} />
              </div>
              <h4 className="text-lg font-semibold text-gray-50 mb-1">
                {Math.round(waterData.current / 1000 * 10) / 10}L
              </h4>
              <p className="text-sm text-gray-400">Consumed Today</p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-3 border border-green-500/30">
                <span className="text-green-400 text-xl">🎯</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-50 mb-1">
                {Math.round(progress)}%
              </h4>
              <p className="text-sm text-gray-400">Goal Progress</p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mx-auto mb-3 border border-orange-500/30">
                <span className="text-orange-400 text-xl">💧</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-50 mb-1">
                {remaining}ml
              </h4>
              <p className="text-sm text-gray-400">Remaining</p>
            </Card>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}