import { useState, useEffect } from 'react';
import { getWeatherData, getWeatherIcon, getWeatherDescription } from '../services/weatherService';

/**
 * Calendar Integration Hook
 * Manages calendar sync, habit scheduling, and reminders
 */
export function useCalendarIntegration() {
  const [isConnected, setIsConnected] = useState(false);
  const [events, setEvents] = useState([]);
  const [scheduledHabits, setScheduledHabits] = useState([]);

  // Generate realistic calendar events based on current time
  useEffect(() => {
    const generateTodayEvents = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const today = now.toISOString().split('T')[0];
      
      const events = [];
      
      // Morning routine (if it's still morning)
      if (currentHour < 12) {
        events.push({
          id: 1,
          title: "Morning Routine",
          time: "08:00",
          duration: 30,
          type: "habit",
          date: today,
          completed: currentHour >= 8
        });
      }
      
      // Water reminders throughout the day
      const waterTimes = ["10:00", "12:00", "14:00", "16:00", "18:00"];
      waterTimes.forEach((time, index) => {
        const hour = parseInt(time.split(':')[0]);
        if (hour > currentHour || (hour === currentHour && now.getMinutes() < 30)) {
          events.push({
            id: `water-${index + 1}`,
            title: "Water Break",
            time: time,
            duration: 5,
            type: "reminder",
            date: today,
            completed: false
          });
        }
      });
      
      // Lunch break
      if (currentHour < 13) {
        events.push({
          id: 3,
          title: "Lunch Break",
          time: "12:30",
          duration: 60,
          type: "break",
          date: today,
          completed: currentHour >= 12
        });
      }
      
      // Evening routine
      if (currentHour < 22) {
        events.push({
          id: 4,
          title: "Evening Reflection",
          time: "21:00",
          duration: 15,
          type: "habit",
          date: today,
          completed: false
        });
      }
      
      // Add some random events based on time
      if (currentHour >= 9 && currentHour < 17) {
        events.push({
          id: 5,
          title: "Work Session",
          time: "09:00",
          duration: 120,
          type: "work",
          date: today,
          completed: currentHour >= 11
        });
      }
      
      return events.sort((a, b) => a.time.localeCompare(b.time));
    };
    
    setEvents(generateTodayEvents());
  }, []);

  const connectCalendar = () => {
    setIsConnected(true);
    // In real implementation, this would connect to Google Calendar API
    console.log('Calendar connected');
  };

  const scheduleHabit = (habitId, time, frequency = 'daily') => {
    const newSchedule = {
      id: Date.now(),
      habitId,
      time,
      frequency,
      enabled: true
    };
    setScheduledHabits(prev => [...prev, newSchedule]);
  };

  const getTodaySchedule = () => {
    const today = new Date().toISOString().split('T')[0];
    return events.filter(event => event.date === today);
  };

  const addCalendarReminder = (title, time, description = '') => {
    const reminder = {
      id: Date.now(),
      title,
      time,
      description,
      date: new Date().toISOString().split('T')[0],
      type: 'reminder',
      duration: 15,
      completed: false
    };
    setEvents(prev => [...prev, reminder]);
  };

  const markEventCompleted = (eventId) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { ...event, completed: true }
        : event
    ));
  };

  const updateEventTime = (eventId, newTime) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { ...event, time: newTime }
        : event
    ));
  };

  const deleteEvent = (eventId) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
  };

  const refreshEvents = () => {
    // Regenerate events based on current time
    const now = new Date();
    const currentHour = now.getHours();
    const today = now.toISOString().split('T')[0];
    
    const newEvents = [];
    
    // Morning routine
    if (currentHour < 12) {
      newEvents.push({
        id: 1,
        title: "Morning Routine",
        time: "08:00",
        duration: 30,
        type: "habit",
        date: today,
        completed: currentHour >= 8
      });
    }
    
    // Water reminders
    const waterTimes = ["10:00", "12:00", "14:00", "16:00", "18:00"];
    waterTimes.forEach((time, index) => {
      const hour = parseInt(time.split(':')[0]);
      if (hour > currentHour || (hour === currentHour && now.getMinutes() < 30)) {
        newEvents.push({
          id: `water-${index + 1}`,
          title: "Water Break",
          time: time,
          duration: 5,
          type: "reminder",
          date: today,
          completed: false
        });
      }
    });
    
    // Other events...
    if (currentHour < 13) {
      newEvents.push({
        id: 3,
        title: "Lunch Break",
        time: "12:30",
        duration: 60,
        type: "break",
        date: today,
        completed: currentHour >= 12
      });
    }
    
    if (currentHour < 22) {
      newEvents.push({
        id: 4,
        title: "Evening Reflection",
        time: "21:00",
        duration: 15,
        type: "habit",
        date: today,
        completed: false
      });
    }
    
    setEvents(newEvents.sort((a, b) => a.time.localeCompare(b.time)));
  };

  return {
    isConnected,
    events,
    scheduledHabits,
    connectCalendar,
    scheduleHabit,
    getTodaySchedule,
    addCalendarReminder,
    markEventCompleted,
    updateEventTime,
    deleteEvent,
    refreshEvents
  };
}

/**
 * Weather Context Hook
 * Provides weather-based recommendations for habits and water intake
 */
export function useWeatherIntegration() {
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load real weather data
  useEffect(() => {
    fetchWeatherData('Tashkent');
  }, []);

  const getWaterRecommendation = () => {
    if (!weather) return { amount: 2500, message: 'Stay hydrated!' };
    
    const { temperature, condition, humidity } = weather;
    let baseAmount = 2500; // Base 2.5L
    
    // Temperature adjustments
    if (temperature > 30) baseAmount += 500;
    if (temperature > 35) baseAmount += 300;
    
    // Condition adjustments
    if (condition === 'sunny') baseAmount += 200;
    if (condition === 'hot') baseAmount += 400;
    if (condition === 'rainy') baseAmount -= 200;
    
    // Humidity adjustments
    if (humidity > 80) baseAmount -= 300;
    if (humidity < 40) baseAmount += 400;

    const messages = {
      high: `It's hot today! Drink ${baseAmount}ml to stay cool.`,
      normal: `Perfect day! Aim for ${baseAmount}ml of water.`,
      low: `Cool weather today. ${baseAmount}ml should be enough.`
    };

    let level = 'normal';
    if (baseAmount > 3000) level = 'high';
    if (baseAmount < 2200) level = 'low';

    return {
      amount: Math.max(1500, Math.min(4000, baseAmount)),
      message: messages[level],
      level
    };
  };

  const getHabitRecommendations = () => {
    if (!weather) return [];

    const { condition, temperature } = weather;
    const recommendations = [];

    // Outdoor activities based on weather
    if (condition === 'sunny' && temperature > 20) {
      recommendations.push({
        type: 'outdoor',
        suggestion: 'Morning walk',
        icon: '🚶‍♂️',
        reason: 'Perfect weather for outdoor activities!'
      });
    }

    if (condition === 'rainy') {
      recommendations.push({
        type: 'indoor',
        suggestion: 'Reading',
        icon: '📚',
        reason: 'Great weather for indoor activities!'
      });
    }

    if (temperature > 30) {
      recommendations.push({
        type: 'hydration',
        suggestion: 'Extra water breaks',
        icon: '💧',
        reason: 'Hot weather requires extra hydration!'
      });
    }

    return recommendations;
  };

  const getMotivationalMessage = () => {
    if (!weather) return 'Have a great day!';

    const { condition, temperature } = weather;
    
    const messages = {
      sunny: ['☀️ Beautiful sunny day! Time to shine!', '🌟 Perfect weather for productivity!'],
      rainy: ['🌧️ Rainy days are perfect for reflection', '💧 Fresh start after the rain!'],
      cloudy: ['☁️ Great weather for focused work', '🌤️ Balanced day ahead!'],
      hot: ['🔥 Hot day! Stay cool and hydrated', '☀️ Perfect for early morning activities!']
    };

    const conditionMessages = messages[condition] || messages.cloudy;
    return conditionMessages[Math.floor(Math.random() * conditionMessages.length)];
  };

  const fetchWeatherData = async (city = 'Tashkent') => {
    setIsLoading(true);
    try {
      const weatherData = await getWeatherData(city);
      setWeather(weatherData);
      setLocation(weatherData.location);
    } catch (error) {
      console.error('Failed to fetch weather:', error);
      // Set default data on error
      setWeather({
        temperature: 22,
        condition: 'sunny',
        humidity: 65,
        location: city,
        source: 'error-fallback'
      });
      setLocation(city);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    weather,
    location,
    isLoading,
    getWaterRecommendation,
    getHabitRecommendations,
    getMotivationalMessage,
    fetchWeatherData
  };
}

/**
 * Combined Integration Hook
 */
export function useIntegrations() {
  const calendar = useCalendarIntegration();
  const weather = useWeatherIntegration();

  const getSmartRecommendations = () => {
    const waterRec = weather.getWaterRecommendation();
    const habitRec = weather.getHabitRecommendations();
    const todaySchedule = calendar.getTodaySchedule();

    return {
      water: waterRec,
      habits: habitRec,
      schedule: todaySchedule,
      weather: weather.getMotivationalMessage()
    };
  };

  return {
    calendar,
    weather,
    getSmartRecommendations
  };
}
