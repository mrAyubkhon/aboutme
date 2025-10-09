import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PhysicsButton from '../../../components/PhysicsButton';

interface WeeklyCalendarProps {
  selectedDate: string;
  onChange: (isoDate: string) => void;
}

const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({ selectedDate, onChange }) => {
  const getToday = () => new Date().toISOString().split('T')[0];
  const today = getToday();

  // Get week dates starting from Monday
  const getWeekDates = (date: string): string[] => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday
    const monday = new Date(d.setDate(diff));
    
    const week = [];
    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(monday);
      currentDay.setDate(monday.getDate() + i);
      week.push(currentDay.toISOString().split('T')[0]);
    }
    return week;
  };

  const weekDates = getWeekDates(selectedDate);
  
  // Navigate to previous/next week
  const navigateWeek = (direction: 'prev' | 'next') => {
    const currentDate = new Date(selectedDate);
    const daysToAdd = direction === 'next' ? 7 : -7;
    currentDate.setDate(currentDate.getDate() + daysToAdd);
    onChange(currentDate.toISOString().split('T')[0]);
  };

  const formatDayName = (date: string) => {
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const dayIndex = new Date(date).getDay();
    return dayNames[dayIndex === 0 ? 6 : dayIndex - 1]; // Adjust for Monday start
  };

  const formatDayNumber = (date: string) => {
    return new Date(date).getDate().toString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900 p-6 rounded-2xl border border-gray-800"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-50">Weekly Calendar</h3>
        <div className="flex items-center gap-2">
          <PhysicsButton
            onClick={() => navigateWeek('prev')}
            icon={ChevronLeft}
            variant="ghost"
            size="sm"
            className="hover:shadow-blue-500/25 hover:shadow-lg transition-all duration-300"
          />
          <PhysicsButton
            onClick={() => navigateWeek('next')}
            icon={ChevronRight}
            variant="ghost"
            size="sm"
            className="hover:shadow-blue-500/25 hover:shadow-lg transition-all duration-300"
          />
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {weekDates.map((date, index) => {
          const isToday = date === today;
          const isSelected = date === selectedDate;
          
          return (
            <motion.button
              key={date}
              onClick={() => onChange(date)}
              className={`
                p-3 rounded-xl text-center transition-all duration-200
                ${isSelected 
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25' 
                  : isToday
                    ? 'bg-gray-700 text-gray-100 border-2 border-blue-400'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="text-xs font-medium opacity-75">
                {formatDayName(date)}
              </div>
              <div className="text-lg font-bold">
                {formatDayNumber(date)}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Quick navigation */}
      <div className="flex items-center justify-center gap-2 mt-4">
        <PhysicsButton
          onClick={() => onChange(today)}
          variant="secondary"
          size="sm"
          className="hover:shadow-green-500/25 hover:shadow-lg transition-all duration-300"
        >
          Today
        </PhysicsButton>
      </div>
    </motion.div>
  );
};

export default WeeklyCalendar;
