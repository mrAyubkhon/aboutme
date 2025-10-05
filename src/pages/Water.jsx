import { motion } from 'framer-motion';
import { useWater } from '../hooks/useLocalStorage';
import WaterTracker from '../components/WaterTracker';
import Card, { StatCard } from '../components/Card';
import { Droplets, Target, TrendingUp, Calendar } from 'lucide-react';

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

export default function Water() {
  const { waterData, addWater, setGoal, getProgress } = useWater();
  
  const progress = getProgress();
  const remaining = waterData.goal - waterData.current;
  const isGoalAchieved = progress >= 100;

  // Mock weekly data for demonstration
  const weeklyData = [
    { day: 'Mon', amount: 2800 },
    { day: 'Tue', amount: 3200 },
    { day: 'Wed', amount: 2500 },
    { day: 'Thu', amount: 3000 },
    { day: 'Fri', amount: 2800 },
    { day: 'Sat', amount: 2200 },
    { day: 'Sun', amount: waterData.current }
  ];

  const weeklyAverage = Math.round(
    weeklyData.reduce((sum, day) => sum + day.amount, 0) / weeklyData.length
  );

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
            Water Tracker
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Stay hydrated and track your daily water intake
          </p>
        </motion.div>

        {/* Main Water Tracker */}
        <motion.div variants={itemVariants} className="mb-8">
          <WaterTracker
            waterData={waterData}
            onAddWater={addWater}
            onSetGoal={setGoal}
          />
        </motion.div>

        {/* Stats Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Today's Intake"
            value={`${Math.round(waterData.current / 1000 * 10) / 10}L`}
            subtitle={`${Math.round(progress)}% of goal`}
            icon={Droplets}
            color="blue"
          />
          
          <StatCard
            title="Daily Goal"
            value={`${waterData.goal / 1000}L`}
            subtitle="Recommended amount"
            icon={Target}
            color="primary"
          />
          
          <StatCard
            title="Weekly Average"
            value={`${Math.round(weeklyAverage / 1000 * 10) / 10}L`}
            subtitle="Last 7 days"
            icon={TrendingUp}
            color="green"
          />
        </motion.div>

        {/* Weekly Overview */}
        <motion.div variants={itemVariants} className="mb-8">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
              Weekly Overview
            </h3>
            
            <div className="space-y-4">
              {weeklyData.map((day, index) => {
                const dayProgress = Math.min((day.amount / waterData.goal) * 100, 100);
                const isToday = index === weeklyData.length - 1;
                
                return (
                  <div key={day.day} className="flex items-center space-x-4">
                    <div className="w-12 text-sm font-medium text-gray-600 dark:text-gray-400">
                      {day.day}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-900 dark:text-gray-100">
                          {Math.round(day.amount / 1000 * 10) / 10}L
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {Math.round(dayProgress)}%
                        </span>
                      </div>
                      
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isToday 
                              ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
                              : dayProgress >= 100 
                                ? 'bg-gradient-to-r from-green-500 to-green-600'
                                : 'bg-gradient-to-r from-gray-400 to-gray-500'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${dayProgress}%` }}
                          transition={{ duration: 0.8, delay: index * 0.1 }}
                        />
                      </div>
                    </div>
                    
                    {isToday && (
                      <div className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full">
                        Today
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>

        {/* Hydration Tips */}
        <motion.div variants={itemVariants}>
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Hydration Tips
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">1</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Start your day with a glass of water to kickstart your metabolism
                  </p>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">2</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Keep a water bottle nearby throughout the day for easy access
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">3</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Set reminders every 2-3 hours to drink water
                  </p>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">4</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Eat water-rich foods like fruits and vegetables
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Achievement Badge */}
        {isGoalAchieved && (
          <motion.div 
            variants={itemVariants}
            className="fixed bottom-6 right-6 z-40"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.5, type: "spring" }}
          >
            <div className="bg-green-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center space-x-2">
              <span>🎉</span>
              <span className="font-medium">Goal Achieved!</span>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
