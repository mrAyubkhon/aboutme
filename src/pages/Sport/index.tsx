import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Droplets, 
  Utensils, 
  Flame, 
  Settings, 
  Plus,
  Trash2,
  Calendar,
  TrendingUp
} from 'lucide-react';
import { useSport } from '../../context/SportContext';
import PhysicsButton from '../../components/PhysicsButton';
import WeeklyCalendar from './components/WeeklyCalendar';
import WaterCard from './components/WaterCard';
import KcalCards from './components/KcalCards';
import FoodFormModal from './components/FoodFormModal';
import WorkoutFormModal from './components/WorkoutFormModal';
import Trends from './components/Trends';

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

const SportPage: React.FC = () => {
  const { 
    getToday, 
    getFoodsForDate, 
    getWorkoutsForDate, 
    deleteFood, 
    deleteWorkout,
    updateGoals,
    state 
  } = useSport();
  
  const [selectedDate, setSelectedDate] = useState(getToday());
  const [showFoodModal, setShowFoodModal] = useState(false);
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState(state.goals);

  const foods = getFoodsForDate(selectedDate);
  const workouts = getWorkoutsForDate(selectedDate);
  
  const handleSaveSettings = () => {
    updateGoals(settings);
    setShowSettings(false);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-50 mb-2 flex items-center gap-3">
                <TrendingUp className="text-blue-400" size={40} />
                Sport & Health
              </h1>
              <p className="text-gray-400 text-lg">
                Track your fitness journey and stay healthy
              </p>
              <p className="text-gray-500 text-sm mt-1">
                {formatDate(selectedDate)}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <PhysicsButton
                onClick={() => setShowFoodModal(true)}
                icon={Utensils}
                variant="primary"
                className="hover:shadow-green-500/25 hover:shadow-lg transition-all duration-300"
              >
                + Food
              </PhysicsButton>
              <PhysicsButton
                onClick={() => setShowWorkoutModal(true)}
                icon={Flame}
                variant="primary"
                className="hover:shadow-red-500/25 hover:shadow-lg transition-all duration-300"
              >
                + Workout
              </PhysicsButton>
              <PhysicsButton
                onClick={() => setShowSettings(true)}
                icon={Settings}
                variant="secondary"
                className="hover:shadow-blue-500/25 hover:shadow-lg transition-all duration-300"
              >
                Settings
              </PhysicsButton>
            </div>
          </div>
        </motion.div>

        {/* Today's Overview Cards */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <motion.div 
              className="lg:col-span-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <WaterCard date={selectedDate} />
            </motion.div>
            <motion.div 
              className="lg:col-span-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <KcalCards date={selectedDate} />
            </motion.div>
          </div>
        </motion.div>

        {/* Weekly Calendar */}
        <motion.div variants={itemVariants} className="mb-8">
          <WeeklyCalendar 
            selectedDate={selectedDate} 
            onChange={setSelectedDate} 
          />
        </motion.div>

        {/* Today's Log */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Foods Table */}
            <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-50 flex items-center gap-2">
                  <Utensils className="text-green-400" size={20} />
                  Foods Today
                </h3>
                <PhysicsButton
                  onClick={() => setShowFoodModal(true)}
                  icon={Plus}
                  variant="secondary"
                  size="sm"
                  className="hover:shadow-green-500/25 hover:shadow-lg transition-all duration-300"
                >
                  Add
                </PhysicsButton>
              </div>
              
              {foods.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Utensils className="mx-auto mb-2" size={32} />
                  <p>No foods logged today</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {foods.map((food) => (
                    <motion.div
                      key={food.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-3 bg-gray-800 rounded-lg"
                    >
                      <div>
                        <div className="font-medium text-gray-50">{food.name}</div>
                        <div className="text-sm text-gray-400">
                          {food.kcal} kcal
                          {food.protein && ` • ${food.protein}g protein`}
                        </div>
                      </div>
                      <PhysicsButton
                        onClick={() => deleteFood(food.id)}
                        icon={Trash2}
                        variant="ghost"
                        size="sm"
                        className="hover:bg-red-500/20 hover:text-red-400"
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Workouts Table */}
            <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-50 flex items-center gap-2">
                  <Flame className="text-red-400" size={20} />
                  Workouts Today
                </h3>
                <PhysicsButton
                  onClick={() => setShowWorkoutModal(true)}
                  icon={Plus}
                  variant="secondary"
                  size="sm"
                  className="hover:shadow-red-500/25 hover:shadow-lg transition-all duration-300"
                >
                  Add
                </PhysicsButton>
              </div>
              
              {workouts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Flame className="mx-auto mb-2" size={32} />
                  <p>No workouts logged today</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {workouts.map((workout) => (
                    <motion.div
                      key={workout.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-3 bg-gray-800 rounded-lg"
                    >
                      <div>
                        <div className="font-medium text-gray-50">{workout.name}</div>
                        <div className="text-sm text-gray-400">
                          {workout.durationMin} min • {workout.kcalBurned} kcal burned
                        </div>
                      </div>
                      <PhysicsButton
                        onClick={() => deleteWorkout(workout.id)}
                        icon={Trash2}
                        variant="ghost"
                        size="sm"
                        className="hover:bg-red-500/20 hover:text-red-400"
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Trends Charts */}
        <motion.div variants={itemVariants}>
          <Trends selectedDate={selectedDate} />
        </motion.div>

        {/* Settings Modal */}
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowSettings(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-2xl max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-50">Settings</h3>
                <PhysicsButton
                  onClick={() => setShowSettings(false)}
                  icon={Settings}
                  variant="ghost"
                  size="sm"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Daily Water Goal (ml)
                  </label>
                  <input
                    type="number"
                    value={settings.waterMlPerDay}
                    onChange={(e) => setSettings(prev => ({ ...prev, waterMlPerDay: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-50 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Daily Calorie Goal (kcal)
                  </label>
                  <input
                    type="number"
                    value={settings.kcalPerDay}
                    onChange={(e) => setSettings(prev => ({ ...prev, kcalPerDay: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-50 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <PhysicsButton
                    onClick={() => setShowSettings(false)}
                    variant="ghost"
                    className="flex-1"
                  >
                    Cancel
                  </PhysicsButton>
                  <PhysicsButton
                    onClick={handleSaveSettings}
                    variant="primary"
                    className="flex-1 hover:shadow-blue-500/25 hover:shadow-lg transition-all duration-300"
                  >
                    Save
                  </PhysicsButton>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Modals */}
      <FoodFormModal
        isOpen={showFoodModal}
        onClose={() => setShowFoodModal(false)}
        selectedDate={selectedDate}
      />

      <WorkoutFormModal
        isOpen={showWorkoutModal}
        onClose={() => setShowWorkoutModal(false)}
        selectedDate={selectedDate}
      />
    </motion.div>
  );
};

export default SportPage;
