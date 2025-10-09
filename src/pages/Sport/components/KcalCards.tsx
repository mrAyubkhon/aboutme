import React from 'react';
import { motion } from 'framer-motion';
import { Utensils, Flame, TrendingUp } from 'lucide-react';
import { useSport } from '../../../context/SportContext';

interface KcalCardsProps {
  date: string;
}

const KcalCards: React.FC<KcalCardsProps> = ({ date }) => {
  const { totalKcal, totalBurned, netKcal } = useSport();
  
  const intake = totalKcal(date);
  const burned = totalBurned(date);
  const net = netKcal(date);

  const cards = [
    {
      title: 'Kcal Intake',
      value: intake,
      icon: Utensils,
      color: 'green',
      bgColor: 'bg-green-500/20',
      textColor: 'text-green-400',
      iconColor: 'text-green-400'
    },
    {
      title: 'Kcal Burned',
      value: burned,
      icon: Flame,
      color: 'red',
      bgColor: 'bg-red-500/20',
      textColor: 'text-red-400',
      iconColor: 'text-red-400'
    },
    {
      title: 'Net Kcal',
      value: net,
      icon: TrendingUp,
      color: net >= 0 ? 'blue' : 'orange',
      bgColor: net >= 0 ? 'bg-blue-500/20' : 'bg-orange-500/20',
      textColor: net >= 0 ? 'text-blue-400' : 'text-orange-400',
      iconColor: net >= 0 ? 'text-blue-400' : 'text-orange-400'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((card, index) => {
        const IconComponent = card.icon;
        
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-gray-900 p-4 rounded-xl border border-gray-800 hover:border-${card.color}-500/50 transition-all duration-300 hover:shadow-${card.color}-500/25 hover:shadow-lg`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <IconComponent className={card.iconColor} size={20} />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-300">{card.title}</h4>
                <p className="text-xs text-gray-500">Today</p>
              </div>
            </div>
            
            <div className={`text-2xl font-bold ${card.textColor}`}>
              {card.value}
            </div>
            
            {card.title === 'Net Kcal' && (
              <div className="mt-2">
                <div className={`text-xs ${net >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {net >= 0 ? 'Calorie Surplus' : 'Calorie Deficit'}
                </div>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

export default KcalCards;
