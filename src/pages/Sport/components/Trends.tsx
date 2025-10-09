import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useSport } from '../../../context/SportContext';

interface TrendsProps {
  selectedDate: string;
}

const Trends: React.FC<TrendsProps> = ({ selectedDate }) => {
  const { getWater, totalKcal, totalBurned, getWeekDates } = useSport();

  // Get last 7 days data
  const weekDates = getWeekDates(selectedDate);
  const chartData = weekDates.map(date => {
    const water = getWater(date);
    const intake = totalKcal(date);
    const burned = totalBurned(date);
    const net = intake - burned;
    
    // Format date for display (e.g., "Mon 15")
    const dateObj = new Date(date);
    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNumber = dateObj.getDate();
    
    return {
      date: `${dayName} ${dayNumber}`,
      water,
      netKcal: net,
      intake,
      burned
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 p-3 rounded-lg border border-gray-700 shadow-lg">
          <p className="text-gray-300 font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value}
              {entry.dataKey === 'water' ? 'ml' : 'kcal'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900 p-6 rounded-2xl border border-gray-800"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-50">7-Day Trends</h3>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          <span>Live Data</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Water Trend - Line Chart */}
        <div>
          <h4 className="text-md font-medium text-gray-300 mb-4 flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            Water Intake (ml)
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="date" 
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="water" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#3B82F6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Net Kcal Trend - Bar Chart */}
        <div>
          <h4 className="text-md font-medium text-gray-300 mb-4 flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            Net Calories (kcal)
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="date" 
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="netKcal" 
                  fill={(entry: any) => entry.netKcal >= 0 ? '#10B981' : '#EF4444'}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400">
            {Math.round(chartData.reduce((sum, day) => sum + day.water, 0) / chartData.length)}
          </div>
          <div className="text-xs text-gray-500">Avg Water (ml)</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400">
            {Math.round(chartData.reduce((sum, day) => sum + day.intake, 0) / chartData.length)}
          </div>
          <div className="text-xs text-gray-500">Avg Intake (kcal)</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-400">
            {Math.round(chartData.reduce((sum, day) => sum + day.burned, 0) / chartData.length)}
          </div>
          <div className="text-xs text-gray-500">Avg Burned (kcal)</div>
        </div>
        <div className="text-center">
          <div className={`text-2xl font-bold ${chartData.reduce((sum, day) => sum + day.netKcal, 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {Math.round(chartData.reduce((sum, day) => sum + day.netKcal, 0) / chartData.length)}
          </div>
          <div className="text-xs text-gray-500">Avg Net (kcal)</div>
        </div>
      </div>
    </motion.div>
  );
};

export default Trends;
