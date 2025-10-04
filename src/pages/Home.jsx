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
import { useStats, useGreeting, useQuoteOfTheDay } from '../hooks/useStats';
import { useSettings } from '../hooks/useLocalStorage';
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
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3 }
  }
};

export default function Home() {
  const { settings } = useSettings();
  const stats = useStats();
  const greeting = useGreeting();
  const quote = useQuoteOfTheDay();
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  return (
    <motion.div
      className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {greeting}, {settings.name} 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Here's your daily overview
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <StatCard
            title="Water Today"
            value={`${Math.round(stats.water.current / 1000 * 10) / 10}L`}
            subtitle={`${Math.round(stats.water.progress)}% of goal`}
            icon={Droplets}
            color="blue"
          />
          
          <StatCard
            title="Daily Budget"
            value={`$${stats.finance.today.remaining.toLocaleString()}`}
            subtitle={stats.finance.today.isOverLimit ? "Over limit" : "Remaining"}
            icon={DollarSign}
            color={stats.finance.today.isOverLimit ? "red" : "green"}
          />
          
          <StatCard
            title="Habits Done"
            value={`${stats.habits.completed}/${stats.habits.total}`}
            subtitle={`${stats.habits.completionRate}% complete`}
            icon={Calendar}
            color="primary"
          />
          
          <StatCard
            title="Productivity"
            value={`${stats.overall.productivityScore}%`}
            subtitle="Overall score"
            icon={TrendingUp}
            color="yellow"
          />
        </motion.div>

        {/* Progress Overview */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Habits Progress */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Today's Habits
              </h3>
              <div className="flex items-center space-x-2">
                <Target size={16} className="text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {stats.habits.completionRate}%
                </span>
              </div>
            </div>
            
            <ProgressBar 
              progress={stats.habits.completionRate} 
              className="mb-4"
              showPercentage={false}
            />
            
            <div className="space-y-2">
              {stats.habits.total === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                  No habits set yet. Add some habits to get started!
                </p>
              ) : (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {stats.habits.completed} of {stats.habits.total} habits completed
                  {stats.habits.streak > 0 && (
                    <div className="mt-2 flex items-center space-x-1">
                      <Zap size={12} className="text-yellow-500" />
                      <span className="text-yellow-600 dark:text-yellow-400">
                        {stats.habits.streak} day streak!
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>

          {/* Water Progress */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Water Intake
              </h3>
              <div className="flex items-center space-x-2">
                <Droplets size={16} className="text-blue-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {Math.round(stats.water.progress)}%
                </span>
              </div>
            </div>
            
            <ProgressBar 
              progress={stats.water.progress} 
              color="blue"
              className="mb-4"
              showPercentage={false}
            />
            
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {Math.round(stats.water.current / 1000 * 10) / 10}L of {stats.water.goal / 1000}L
              {stats.water.progress >= 100 && (
                <div className="mt-2 flex items-center space-x-1">
                  <Zap size={12} className="text-green-500" />
                  <span className="text-green-600 dark:text-green-400">
                    Goal achieved! 🎉
                  </span>
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants} className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Quick Actions
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <ActionCard
              title="Add Expense"
              description="Track a new expense"
              icon={DollarSign}
              onClick={() => setShowQuickAdd('expense')}
            />
            
            <ActionCard
              title="Add Income"
              description="Record new income"
              icon={TrendingUp}
              onClick={() => setShowQuickAdd('income')}
            />
            
            <ActionCard
              title="Quick Note"
              description="Add a thought or idea"
              icon={BookOpen}
              onClick={() => setShowQuickAdd('note')}
            />
            
            <ActionCard
              title="Add Water"
              description="Track water intake"
              icon={Droplets}
              onClick={() => setShowQuickAdd('water')}
            />
          </div>
        </motion.div>

        {/* Recent Journal Entries */}
        {stats.journal.recentEntries.length > 0 && (
          <motion.div variants={itemVariants} className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Recent Thoughts
            </h3>
            
            <div className="space-y-4">
              {stats.journal.recentEntries.map((entry) => (
                <Card key={entry.id} className="p-4">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                    {entry.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {entry.content}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(entry.createdAt).toLocaleDateString()}
                    </span>
                    {entry.tag && (
                      <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                        {entry.tag}
                      </span>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {/* Motivational Message */}
        <motion.div variants={itemVariants} className="mb-8">
          <Card className="p-6 bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 border-primary-200 dark:border-primary-700">
            <div className="text-center">
              <p className="text-lg text-gray-900 dark:text-gray-100 mb-2">
                {stats.overall.motivationalMessage}
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Quote of the Day */}
        <motion.div variants={itemVariants}>
          <Card className="p-6">
            <div className="text-center">
              <blockquote className="text-lg italic text-gray-700 dark:text-gray-300 mb-2">
                "{quote.text}"
              </blockquote>
              <cite className="text-sm text-gray-500 dark:text-gray-400">
                — {quote.author}
              </cite>
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
