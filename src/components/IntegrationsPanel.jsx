import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { 
  Calendar, 
  Cloud, 
  Settings, 
  CheckCircle, 
  Clock,
  MapPin,
  Thermometer,
  Droplets,
  Zap,
  Link,
  ExternalLink,
  Wind,
  Eye,
  CheckCircle2,
  Edit3,
  Trash2,
  RefreshCw,
  Plus
} from 'lucide-react';
import { useIntegrations } from '../hooks/useIntegrations';
import PhysicsButton from './PhysicsButton';

/**
 * Integrations Panel - Shows calendar and weather integrations
 */
export default function IntegrationsPanel({ className = '' }) {
  const { calendar, weather, getSmartRecommendations } = useIntegrations();
  const [activeTab, setActiveTab] = useState('overview');
  const [showDetails, setShowDetails] = useState(false);

  const recommendations = getSmartRecommendations();

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Settings },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'weather', label: 'Weather', icon: Cloud }
  ];

  return (
    <motion.div
      className={`bg-gray-900 rounded-2xl border border-gray-800 p-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-50 flex items-center space-x-2">
            <Link className="text-blue-400" size={24} />
            <span>Smart Integrations</span>
          </h2>
          <p className="text-gray-400 text-sm">AI-powered recommendations</p>
        </div>
        
        <PhysicsButton
          onClick={() => setShowDetails(!showDetails)}
          icon={Settings}
          variant="ghost"
          size="sm"
        />
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-800 p-1 rounded-lg">
        {tabs.map((tab) => (
          <PhysicsButton
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            icon={tab.icon}
            variant={activeTab === tab.id ? 'primary' : 'ghost'}
            size="sm"
            className={activeTab === tab.id ? '' : 'text-gray-400'}
          >
            {tab.label}
          </PhysicsButton>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <OverviewTab recommendations={recommendations} />
          </motion.div>
        )}

        {activeTab === 'calendar' && (
          <motion.div
            key="calendar"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <CalendarTab calendar={calendar} />
          </motion.div>
        )}

        {activeTab === 'weather' && (
          <motion.div
            key="weather"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <WeatherTab weather={weather} recommendations={recommendations} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/**
 * Overview Tab - Shows smart recommendations
 */
function OverviewTab({ recommendations }) {
  return (
    <div className="space-y-4">
      {/* Weather-based Water Recommendation */}
      <motion.div
        className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center space-x-3 mb-2">
          <Droplets className="text-blue-400" size={20} />
          <h3 className="font-semibold text-gray-50">Smart Water Goal</h3>
        </div>
        <p className="text-gray-300 text-sm mb-2">
          Based on today's weather in {recommendations.weather}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-blue-400 font-bold">
            {recommendations.water.amount}ml recommended
          </span>
          <span className="text-xs text-gray-400">
            {recommendations.water.level} hydration
          </span>
        </div>
      </motion.div>

      {/* Habit Recommendations */}
      {recommendations.habits.length > 0 && (
        <motion.div
          className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center space-x-3 mb-3">
            <Zap className="text-green-400" size={20} />
            <h3 className="font-semibold text-gray-50">Today's Suggestions</h3>
          </div>
          <div className="space-y-2">
            {recommendations.habits.map((habit, index) => (
              <div key={index} className="flex items-center space-x-3 text-sm">
                <span className="text-2xl">{habit.icon}</span>
                <div>
                  <span className="text-gray-200 font-medium">{habit.suggestion}</span>
                  <p className="text-gray-400 text-xs">{habit.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Motivational Message */}
      <motion.div
        className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <p className="text-gray-200 font-medium">{recommendations.weather}</p>
      </motion.div>
    </div>
  );
}

/**
 * Calendar Tab - Shows calendar integration
 */
function CalendarTab({ calendar }) {
  return (
    <div className="space-y-4">
      {/* Connection Status */}
      <div className="flex items-center justify-between p-4 bg-gray-800 rounded-xl">
        <div className="flex items-center space-x-3">
          <Calendar className="text-blue-400" size={20} />
          <div>
            <h3 className="font-semibold text-gray-50">Calendar Sync</h3>
            <p className="text-sm text-gray-400">
              {calendar.isConnected ? 'Connected' : 'Not connected'}
            </p>
          </div>
        </div>
        <PhysicsButton
          onClick={calendar.connectCalendar}
          icon={calendar.isConnected ? CheckCircle : Calendar}
          variant={calendar.isConnected ? 'success' : 'primary'}
          size="sm"
        >
          {calendar.isConnected ? 'Connected' : 'Connect'}
        </PhysicsButton>
      </div>

      {/* Today's Schedule */}
      {calendar.isConnected && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-50">Today's Schedule</h3>
            <PhysicsButton
              onClick={calendar.refreshEvents}
              icon={RefreshCw}
              variant="ghost"
              size="sm"
            />
          </div>
          <div className="space-y-2">
            {calendar.events.map((event) => (
              <motion.div
                key={event.id}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  event.completed 
                    ? 'bg-green-500/10 border border-green-500/20' 
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
                whileHover={{ scale: 1.02 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center space-x-2">
                  {event.completed ? (
                    <CheckCircle2 className="text-green-400" size={16} />
                  ) : (
                    <Clock className="text-gray-400" size={16} />
                  )}
                </div>
                <div className="flex-1">
                  <span className={`font-medium ${
                    event.completed ? 'text-green-400 line-through' : 'text-gray-200'
                  }`}>
                    {event.title}
                  </span>
                  <p className="text-sm text-gray-400">{event.time} ({event.duration}min)</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    event.type === 'habit' ? 'bg-blue-500/20 text-blue-400' :
                    event.type === 'reminder' ? 'bg-yellow-500/20 text-yellow-400' :
                    event.type === 'break' ? 'bg-green-500/20 text-green-400' :
                    event.type === 'work' ? 'bg-purple-500/20 text-purple-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {event.type}
                  </span>
                  {!event.completed && (
                    <PhysicsButton
                      onClick={() => calendar.markEventCompleted(event.id)}
                      icon={CheckCircle2}
                      variant="success"
                      size="sm"
                    />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Quick Add Event */}
          <div className="mt-4 p-3 bg-gray-800 rounded-lg">
            <h4 className="text-sm font-medium text-gray-300 mb-2">Quick Add Event</h4>
            <PhysicsButton
              onClick={() => calendar.addCalendarReminder('Custom Reminder', '15:00', 'Personal reminder')}
              icon={Plus}
              variant="primary"
              size="sm"
              className="w-full"
            >
              Add Reminder
            </PhysicsButton>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Weather Tab - Shows weather information and recommendations
 */
function WeatherTab({ weather, recommendations }) {
  return (
    <div className="space-y-4">
      {/* Weather Info */}
      <div className="p-4 bg-gray-800 rounded-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <MapPin className="text-gray-400" size={16} />
            <span className="text-gray-300">{weather.location}</span>
          </div>
          <PhysicsButton
            onClick={() => weather.fetchWeatherData()}
            icon={ExternalLink}
            variant="ghost"
            size="sm"
            className="text-blue-400 hover:text-blue-300"
          >
            Refresh
          </PhysicsButton>
        </div>

        {weather.weather && (
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Thermometer className="text-orange-400" size={16} />
              <span className="text-gray-300">{weather.weather.temperature}°C</span>
            </div>
            <div className="flex items-center space-x-2">
              <Cloud className="text-blue-400" size={16} />
              <span className="text-gray-300 capitalize">{weather.weather.condition}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Droplets className="text-cyan-400" size={16} />
              <span className="text-gray-300">{weather.weather.humidity}%</span>
            </div>
            <div className="flex items-center space-x-2">
              <Wind className="text-gray-400" size={16} />
              <span className="text-gray-300">{weather.weather.windSpeed} m/s</span>
            </div>
          </div>
        )}
      </div>

      {/* Water Recommendation */}
      <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
        <div className="flex items-center space-x-3 mb-2">
          <Droplets className="text-blue-400" size={20} />
          <h3 className="font-semibold text-gray-50">Hydration Recommendation</h3>
        </div>
        <p className="text-gray-300 text-sm mb-3">{recommendations.water.message}</p>
        <div className="flex items-center justify-between">
          <span className="text-blue-400 font-bold text-lg">
            {recommendations.water.amount}ml
          </span>
          <span className={`text-xs px-2 py-1 rounded-full ${
            recommendations.water.level === 'high' ? 'bg-red-500/20 text-red-400' :
            recommendations.water.level === 'low' ? 'bg-blue-500/20 text-blue-400' :
            'bg-green-500/20 text-green-400'
          }`}>
            {recommendations.water.level} priority
          </span>
        </div>
      </div>
    </div>
  );
}
