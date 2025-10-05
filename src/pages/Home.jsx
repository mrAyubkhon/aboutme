import { motion } from 'framer-motion';
import { useState } from 'react';
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
import { useHabits, useWater, useFinance, useJournal } from '../hooks';
import Card, { StatCard, ActionCard } from '../components/Card';
import ProgressBar from '../components/ProgressBar';

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
  const { habits, getCompletionRate, getCompletedCount } = useHabits();
  const { waterData, getProgress } = useWater();
  const { getTodayTotals, getRemainingBudget } = useFinance();
  const { getRecentEntries } = useJournal();
  
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  
  const todayTotals = getTodayTotals();
  const habitCompletion = getCompletionRate();
  const waterProgress = getProgress();
  const remainingBudget = getRemainingBudget();
  const recentEntries = getRecentEntries(3);

  return (
    <motion.div
      className="min-h-screen bg-gray-950 pt-16"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-3xl font-bold text-gray-50 mb-2">
            Good morning, Ayubi aka 👋
          </h1>
          <p className="text-gray-300">
            Here's your daily overview
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <StatCard
            title="Habits Completed"
            value={`${getCompletedCount()}/${habits.length}`}
            subtitle={`${habitCompletion}% completion rate`}
            icon={Target}
            color="primary"
            trend={habitCompletion}
          />
          
          <StatCard
            title="Water Intake"
            value={`${Math.round(waterData.current / 1000 * 10) / 10}L`}
            subtitle={`${Math.round(waterProgress)}% of goal`}
            icon={Droplets}
            color="blue"
          />
          
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

        {/* Progress Overview */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-50 mb-4 flex items-center">
              <Calendar className="mr-2 text-blue-400" size={20} />
              Habit Progress
            </h3>
            <ProgressBar 
              progress={habitCompletion} 
              label="Daily Habits"
              className="mb-4"
            />
            <p className="text-sm text-gray-400">
              {getCompletedCount()} of {habits.length} habits completed today
            </p>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-50 mb-4 flex items-center">
              <Droplets className="mr-2 text-blue-400" size={20} />
              Water Progress
            </h3>
            <ProgressBar 
              progress={waterProgress} 
              label="Daily Goal"
              className="mb-4"
            />
            <p className="text-sm text-gray-400">
              {waterData.current}ml of {waterData.goal}ml consumed
            </p>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants}>
          <h3 className="text-xl font-semibold text-gray-50 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <ActionCard
              title="Add Habit"
              description="Track a new daily habit"
              icon={Plus}
              onClick={() => setShowQuickAdd(true)}
            />
            
            <ActionCard
              title="Log Water"
              description="Record water intake"
              icon={Droplets}
              onClick={() => window.location.href = '/water'}
            />
            
            <ActionCard
              title="Add Expense"
              description="Track spending"
              icon={DollarSign}
              onClick={() => window.location.href = '/finance'}
            />
            
            <ActionCard
              title="Write Journal"
              description="Record thoughts"
              icon={BookOpen}
              onClick={() => window.location.href = '/journal'}
            />
          </div>
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
    </motion.div>
  );
}