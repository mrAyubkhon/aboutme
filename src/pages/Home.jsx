import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Droplets, 
  DollarSign, 
  Calendar, 
  BookOpen, 
  Plus,
  TrendingUp,
  Target,
  Zap
} from 'lucide-react';
import ModernLogo from '../components/ModernLogo';
import LiveClock from '../components/LiveClock';
import { useHabits } from '../hooks/useHabits';
import { useSport } from '../context/SportContext';
import { useFinance } from '../hooks/useFinance';
import { useJournal } from '../hooks/useJournal';
import Card, { StatCard, ActionCard } from '../components/Card';
import EnhancedProgressBar from '../components/EnhancedProgressBar';
import IntegrationsPanel from '../components/IntegrationsPanel';
import PhysicsButton from '../components/PhysicsButton';
import FloatingParticles from '../components/FloatingParticles';
import MagneticCard from '../components/MagneticCard';
import ErrorBoundary from '../components/ErrorBoundary';
import AddHabitModal from '../components/AddHabitModal';
// import TestLoadingButton from '../components/TestLoadingButton';

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

export default function Home() {
  const navigate = useNavigate();
  const { habits = [], getCompletionRate = () => 0, getCompletedCount = () => 0, addHabit, toggleHabit } = useHabits() || {};
  const { getWater, getToday, state, addWater } = useSport();
  
  // Ensure Sport context is ready
  if (!state || !state.goals) {
    return (
      <div className="min-h-screen bg-gray-950 pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }
  const { getTodayTotals = () => ({ income: 0, expenses: 0 }), getRemainingBudget = () => 0 } = useFinance() || {};

  // Get current time for dynamic greeting
  const { getRecentEntries = () => [] } = useJournal() || {};
  
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  
  const todayTotals = getTodayTotals();
  const habitCompletion = getCompletionRate() || 0;
  const today = getToday();
  const todayWater = getWater(today);
  const waterGoal = state.goals.waterMlPerDay;
  const waterProgress = waterGoal > 0 ? Math.min((todayWater / waterGoal) * 100, 100) : 0;
  const remainingBudget = getRemainingBudget() || 0;
  const recentEntries = getRecentEntries(3);

  // Use Sport context water data
  const currentWaterProgress = waterProgress;
  
  // Debug logging
  console.log('Home Debug:', {
    habits: habits.length,
    completedCount: getCompletedCount(),
    habitCompletion,
    todayWater,
    waterGoal,
    waterProgress,
    today,
    state
  });
  
  // Force habits to be created if none exist
  React.useEffect(() => {
    if (habits.length === 0 && addHabit) {
      console.log('Creating default habits from Home page');
      addHabit('Walk 10,000 Steps', 'Reach your daily step goal', '🚶', 'blue', 'fitness');
      addHabit('Morning Stretch', 'Start your day with gentle stretching', '🤸', 'green', 'health');
    }
  }, [habits.length, addHabit]);

  // Force re-render when data changes
  const [, forceUpdate] = useState({});
  const triggerUpdate = () => forceUpdate({});

  // Listen for storage changes to update UI
  React.useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'ayubi_habits' || e.key === 'SPORT_STATE_V1') {
        console.log('Storage change detected:', e.key);
        triggerUpdate();
      }
    };
    
    // Listen for custom events from other components
    const handleCustomUpdate = () => {
      console.log('Custom update event received');
      triggerUpdate();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('habitsUpdated', handleCustomUpdate);
    window.addEventListener('waterUpdated', handleCustomUpdate);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('habitsUpdated', handleCustomUpdate);
      window.removeEventListener('waterUpdated', handleCustomUpdate);
    };
  }, []);

  // Sport context handles all data updates automatically

  // Handle adding habit from modal
  const handleAddHabit = (habitData) => {
    console.log('Adding habit:', habitData);
    if (addHabit) {
      addHabit(habitData.name, habitData.description, habitData.icon, habitData.color, habitData.category);
      console.log('Habit added successfully');
    } else {
      console.error('addHabit function not available');
    }
    setShowQuickAdd(false);
  };

  // Dynamic greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 12) {
      return { text: "Good morning", emoji: "🌅" };
    } else if (hour >= 12 && hour < 17) {
      return { text: "Good afternoon", emoji: "☀️" };
    } else if (hour >= 17 && hour < 22) {
      return { text: "Good evening", emoji: "🌆" };
    } else {
      return { text: "Good night", emoji: "🌙" };
    }
  };

  const greeting = getGreeting();

  return (
    <motion.div
      className="min-h-screen bg-gray-950 pt-16 relative overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Floating particles background */}
      <FloatingParticles 
        count={15} 
        colors={['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']}
        className="opacity-20"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <ModernLogo 
                size="lg" 
                animated={true} 
                greeting={{
                  text: `${greeting.text}! ${greeting.emoji}`,
                  subtext: "Here's your daily overview"
                }}
              />
            </div>
            
            {/* Live Clock */}
            <div className="hidden md:block">
              <LiveClock />
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <motion.div
            key={`habits-${getCompletedCount()}`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <StatCard
              title="Habits Completed"
              value={`${getCompletedCount()}/${habits.length}`}
              subtitle={`${habitCompletion}% completion rate`}
              icon={Target}
              color="primary"
              trend={habitCompletion}
            />
          </motion.div>
          
          <motion.div
            key={`water-${todayWater}`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <StatCard
              title="Water Intake"
              value={`${Math.round(todayWater / 1000 * 10) / 10}L`}
              subtitle={`${Math.round(currentWaterProgress)}% of goal`}
              icon={Droplets}
              color="blue"
            />
          </motion.div>
          
          <StatCard
            title="Today's Spending"
            value={`${todayTotals.expenses.toLocaleString()} UZS`}
            subtitle={`${remainingBudget.toLocaleString()} UZS remaining`}
            icon={DollarSign}
            color={todayTotals.expenses > 0 ? "red" : "green"}
          />
          
          <StatCard
            title="Journal Entries"
            value={recentEntries.length}
            subtitle="Recent thoughts"
            icon={BookOpen}
            color="yellow"
          />
        </motion.div>


        {/* Quick Actions */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 rounded-2xl border border-gray-700 hover:border-blue-500/50 transition-all duration-300 hover:shadow-blue-500/25 hover:shadow-lg">
            <h3 className="text-lg font-semibold text-gray-50 mb-4 flex items-center gap-2">
              <Zap className="text-blue-400" size={20} />
              Quick Actions
              <div className="flex items-center gap-2 ml-auto text-sm text-gray-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>System Online</span>
              </div>
            </h3>
            <div className="flex gap-4 justify-center">
              <PhysicsButton
                onClick={() => {
                  if (habits.length > 0 && toggleHabit) {
                    toggleHabit(habits[0].id);
                  }
                }}
                variant="primary"
                className="hover:shadow-green-500/25 hover:shadow-lg transition-all duration-300"
              >
                Toggle Habit
              </PhysicsButton>
              <PhysicsButton
                onClick={() => {
                  if (addWater && getToday) {
                    addWater(getToday(), 250);
                  }
                }}
                variant="primary"
                className="hover:shadow-blue-500/25 hover:shadow-lg transition-all duration-300"
              >
                +250ml Water
              </PhysicsButton>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Progress Overview */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <MagneticCard>
              <EnhancedProgressBar 
                value={Math.max(getCompletedCount() || 0, 0)}
                max={Math.max(habits.length || 0, 1)}
                label="Daily Habits"
                variant="blue"
                size="lg"
                glow={true}
                animated={true}
              />
            </MagneticCard>
            
            <MagneticCard>
            <EnhancedProgressBar 
              value={Math.max(todayWater || 0, 0)}
              max={Math.max(waterGoal || 3000, 1)}
              label="Water Intake"
              variant="blue"
              size="lg"
              glow={true}
              animated={true}
            />
            </MagneticCard>
        </motion.div>

        {/* Smart Integrations */}
        <motion.div variants={itemVariants} className="mb-8">
          <IntegrationsPanel />
        </motion.div>

        {/* Test Loading Button - Disabled for now */}
        {/* <motion.div variants={itemVariants} className="mb-8">
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <h3 className="text-lg font-semibold text-gray-50 mb-4">Test New Features</h3>
            <TestLoadingButton />
          </div>
        </motion.div> */}

        {/* Quick Actions */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-50">Quick Actions</h3>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>System Online</span>
            </div>
          </div>
          <ErrorBoundary>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <PhysicsButton
              onClick={() => {
                console.log('Add Habit button clicked');
                setShowQuickAdd(true);
              }}
              icon={Plus}
              variant="primary"
              size="lg"
              className="h-24 flex flex-col items-center justify-center space-y-2 p-4 group hover:shadow-blue-500/25 hover:shadow-lg transition-all duration-300"
            >
              <div className="text-center">
                <div className="font-semibold text-base mb-1 group-hover:text-white transition-colors">Add Habit</div>
                <div className="text-xs opacity-75 leading-tight group-hover:opacity-100 transition-opacity">Track a new daily habit</div>
              </div>
            </PhysicsButton>
            
            <PhysicsButton
              onClick={() => navigate('/water')}
              icon={Droplets}
              variant="secondary"
              size="lg"
              className="h-24 flex flex-col items-center justify-center space-y-2 p-4 group hover:shadow-cyan-500/25 hover:shadow-lg transition-all duration-300"
            >
              <div className="text-center">
                <div className="font-semibold text-base mb-1 group-hover:text-white transition-colors">Log Water</div>
                <div className="text-xs opacity-75 leading-tight group-hover:opacity-100 transition-opacity">Record water intake</div>
              </div>
            </PhysicsButton>
            
            <PhysicsButton
              onClick={() => navigate('/finance')}
              icon={DollarSign}
              variant="success"
              size="lg"
              className="h-24 flex flex-col items-center justify-center space-y-2 p-4 group hover:shadow-green-500/25 hover:shadow-lg transition-all duration-300"
            >
              <div className="text-center">
                <div className="font-semibold text-base mb-1 group-hover:text-white transition-colors">Add Expense</div>
                <div className="text-xs opacity-75 leading-tight group-hover:opacity-100 transition-opacity">Track spending</div>
              </div>
            </PhysicsButton>
            
            <PhysicsButton
              onClick={() => navigate('/journal')}
              icon={BookOpen}
              variant="primary"
              size="lg"
              className="h-24 flex flex-col items-center justify-center space-y-2 p-4 group hover:shadow-purple-500/25 hover:shadow-lg transition-all duration-300"
            >
              <div className="text-center">
                <div className="font-semibold text-base mb-1 group-hover:text-white transition-colors">Write Journal</div>
                <div className="text-xs opacity-75 leading-tight group-hover:opacity-100 transition-opacity">Record thoughts</div>
              </div>
            </PhysicsButton>
            </div>
          </ErrorBoundary>
        </motion.div>

        {/* Recent Journal Entries */}
        {recentEntries.length > 0 && (
          <motion.div variants={itemVariants} className="mt-8">
            <h3 className="text-xl font-semibold text-gray-50 mb-6">Recent Thoughts</h3>
            <div className="space-y-4">
              {recentEntries.map((entry) => (
                <Card key={entry.id} className="p-4">
                  <h4 className="font-medium text-gray-50 mb-2">{entry.title}</h4>
                  <p className="text-gray-300 text-sm line-clamp-2">{entry.content}</p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex space-x-2">
                      {entry.tags.map((tag) => (
                        <span key={tag} className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(entry.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Add Habit Modal */}
      <AddHabitModal
        isOpen={showQuickAdd}
        onClose={() => setShowQuickAdd(false)}
        onAddHabit={handleAddHabit}
      />
    </motion.div>
  );
}