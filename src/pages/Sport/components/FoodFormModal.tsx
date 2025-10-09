import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus } from 'lucide-react';
import PhysicsButton from '../../../components/PhysicsButton';
import { useSport } from '../../../context/SportContext';

interface FoodFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
}

const FoodFormModal: React.FC<FoodFormModalProps> = ({ isOpen, onClose, selectedDate }) => {
  const { addFood } = useSport();
  const [formData, setFormData] = useState({
    name: '',
    kcal: '',
    protein: '',
    carbs: '',
    fat: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.kcal) {
      return;
    }

    const foodEntry = {
      date: selectedDate,
      name: formData.name,
      kcal: parseInt(formData.kcal),
      protein: formData.protein ? parseFloat(formData.protein) : undefined,
      carbs: formData.carbs ? parseFloat(formData.carbs) : undefined,
      fat: formData.fat ? parseFloat(formData.fat) : undefined
    };

    addFood(foodEntry);
    
    // Reset form
    setFormData({
      name: '',
      kcal: '',
      protein: '',
      carbs: '',
      fat: ''
    });
    
    onClose();
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            className="relative bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-2xl max-w-md w-full"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-50">Add Food Entry</h3>
              <PhysicsButton
                onClick={onClose}
                icon={X}
                variant="ghost"
                size="sm"
              />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Food Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="e.g., Grilled Chicken Breast"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-50 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Calories *
                </label>
                <input
                  type="number"
                  value={formData.kcal}
                  onChange={(e) => handleChange('kcal', e.target.value)}
                  placeholder="e.g., 250"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-50 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Protein (g)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.protein}
                    onChange={(e) => handleChange('protein', e.target.value)}
                    placeholder="25.5"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-50 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Carbs (g)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.carbs}
                    onChange={(e) => handleChange('carbs', e.target.value)}
                    placeholder="12.0"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-50 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Fat (g)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.fat}
                    onChange={(e) => handleChange('fat', e.target.value)}
                    placeholder="8.2"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-50 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <div className="text-sm text-gray-400">
                  Date: {selectedDate}
                </div>
                <div className="flex gap-3">
                  <PhysicsButton
                    type="button"
                    onClick={onClose}
                    variant="ghost"
                  >
                    Cancel
                  </PhysicsButton>
                  <PhysicsButton
                    type="submit"
                    icon={Plus}
                    variant="primary"
                    className="hover:shadow-green-500/25 hover:shadow-lg transition-all duration-300"
                  >
                    Add Food
                  </PhysicsButton>
                </div>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FoodFormModal;
