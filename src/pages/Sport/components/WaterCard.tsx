import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Droplets, Plus } from 'lucide-react';
import { CircularProgress } from '../../../components/EnhancedProgressBar';
import PhysicsButton from '../../../components/PhysicsButton';
import { useSport } from '../../../context/SportContext';

interface WaterCardProps {
  date: string;
}

const WaterCard: React.FC<WaterCardProps> = ({ date }) => {
  const { getWater, addWater, progressWater, state } = useSport();
  const [customAmount, setCustomAmount] = useState('');
  
  const water = getWater(date);
  const progress = progressWater(date);
  const goal = state.goals.waterMlPerDay;

  const handleAddWater = (amount: number) => {
    addWater(date, amount);
  };

  const handleCustomAdd = () => {
    const amount = parseInt(customAmount);
    if (!isNaN(amount) && amount > 0) {
      handleAddWater(amount);
      setCustomAmount('');
    }
  };

  const quickButtons = [
    { label: '+250ml', amount: 250, color: 'blue' },
    { label: '+500ml', amount: 500, color: 'green' },
    { label: '+1000ml', amount: 1000, color: 'purple' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-blue-500/50 transition-all duration-300 hover:shadow-blue-500/25 hover:shadow-lg"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <Droplets className="text-blue-400" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-50">Water Intake</h3>
            <p className="text-sm text-gray-400">{water}ml / {goal}ml</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-400">
            {Math.round(progress * 100)}%
          </div>
          <div className="text-xs text-gray-500">Goal Progress</div>
        </div>
      </div>

      {/* Circular Progress */}
      <div className="flex justify-center mb-6">
        <CircularProgress
          value={water}
          max={goal}
          size={120}
          variant="blue"
          animated={true}
          glow={true}
        />
      </div>

      {/* Quick Add Buttons */}
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-2">
          {quickButtons.map((button, index) => (
            <motion.div
              key={button.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <PhysicsButton
                onClick={() => handleAddWater(button.amount)}
                variant="secondary"
                size="sm"
                className={`w-full hover:shadow-${button.color}-500/25 hover:shadow-lg transition-all duration-300`}
              >
                {button.label}
              </PhysicsButton>
            </motion.div>
          ))}
        </div>

        {/* Custom Amount Input */}
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Custom ml"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-50 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
          />
          <PhysicsButton
            onClick={handleCustomAdd}
            icon={Plus}
            variant="primary"
            size="sm"
            className="hover:shadow-blue-500/25 hover:shadow-lg transition-all duration-300"
          >
            Add
          </PhysicsButton>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="w-full bg-gray-700 rounded-full h-2">
          <motion.div
            className="bg-blue-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progress * 100, 100)}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default WaterCard;
