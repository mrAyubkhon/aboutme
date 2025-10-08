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
import { useWater } from '../hooks/useWater';
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
  const { habits = [], getCompletionRate = () => 0, getCompletedCount = () => 0, addHabit } = useHabits() || {};
  const { waterData = { current: 0, goal: 2500 }, getProgress = () => 0 } = useWater() || {};
  const { getTodayTotals = () => ({ income: 0, expenses: 0 }), getRemainingBudget = () => 0 } = useFinance() || {};

  // Get current time for dynamic greeting
  const { getRecentEntries = () => [] } = useJournal() || {};
  
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  
  const todayTotals = getTodayTotals();
  const habitCompletion = getCompletionRate();
  const waterProgress = getProgress();
  const remainingBudget = getRemainingBudget();
  const recentEntries = getRecentEntries(3);

  // Recalculate water progress when waterData changes
  const currentWaterProgress = waterData.goal > 0 ? Math.min((waterData.current / waterData.goal) * 100, 100) : 0;

  // Force re-render when water data changes
  const [, forceUpdate] = useState({});
  const triggerUpdate = () => forceUpdate({});
  
  // Listen for storage changes to update UI
  React.useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'ayubi_water') {
        triggerUpdate();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Handle adding habit from modal
  const handleAddHabit = (habitData) => {
    if (addHabit) {
      addHabit(habitData.name, habitData.description, habitData.icon, habitData.color, habitData.category);
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
            key={`water-${waterData.current}`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <StatCard
              title="Water Intake"
              value={`${Math.round(waterData.current / 1000 * 10) / 10}L`}
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

        {/* Enhanced Progress Overview */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <MagneticCard>
              <EnhancedProgressBar 
                value={getCompletedCount()}
                max={Math.max(habits.length, 1)}
                label="Daily Habits"
                variant="blue"
                size="lg"
                glow={true}
                animated={true}
              />
            </MagneticCard>
            
            <MagneticCard>
              <EnhancedProgressBar 
                value={waterData.current}
                max={waterData.goal}
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
          <h3 className="text-xl font-semibold text-gray-50 mb-6">Quick Actions</h3>
          <ErrorBoundary>
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
              icon={Droplets}
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
              icon={DollarSign}
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
              icon={BookOpen}
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