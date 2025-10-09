import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus } from 'lucide-react';
import PhysicsButton from '../../../components/PhysicsButton';
import { useSport } from '../../../context/SportContext';

interface WorkoutFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
}

const WorkoutFormModal: React.FC<WorkoutFormModalProps> = ({ isOpen, onClose, selectedDate }) => {
  const { addWorkout } = useSport();
  const [formData, setFormData] = useState({
    name: '',
    durationMin: '',
    kcalBurned: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.durationMin || !formData.kcalBurned) {
      return;
    }

    const workoutEntry = {
      date: selectedDate,
      name: formData.name,
      durationMin: parseInt(formData.durationMin),
      kcalBurned: parseInt(formData.kcalBurned)
    };

    addWorkout(workoutEntry);
    
    // Reset form
    setFormData({
      name: '',
      durationMin: '',
      kcalBurned: ''
    });
    
    onClose();
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Common workout templates
  const workoutTemplates = [
    { name: 'Running (6 mph)', duration: 30, kcal: 300 },
    { name: 'Cycling (moderate)', duration: 45, kcal: 400 },
    { name: 'Weight Training', duration: 60, kcal: 250 },
    { name: 'Swimming', duration: 30, kcal: 350 },
    { name: 'HIIT Workout', duration: 20, kcal: 200 },
    { name: 'Yoga', duration: 45, kcal: 150 }
  ];

  const applyTemplate = (template: typeof workoutTemplates[0]) => {
    setFormData({
      name: template.name,
      durationMin: template.duration.toString(),
      kcalBurned: template.kcal.toString()
    });
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
              <h3 className="text-xl font-bold text-gray-50">Add Workout</h3>
              <PhysicsButton
                onClick={onClose}
                icon={X}
                variant="ghost"
                size="sm"
              />
            </div>

            {/* Quick Templates */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-300 mb-2">Quick Templates</h4>
              <div className="grid grid-cols-2 gap-2">
                {workoutTemplates.map((template, index) => (
                  <motion.button
                    key={template.name}
                    onClick={() => applyTemplate(template)}
                    className="p-2 text-xs bg-gray-800 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-700 hover:border-blue-500 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {template.name}
                  </motion.button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Workout Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="e.g., Morning Jog"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-50 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Duration (min) *
                  </label>
                  <input
                    type="number"
                    value={formData.durationMin}
                    onChange={(e) => handleChange('durationMin', e.target.value)}
                    placeholder="30"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-50 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Calories Burned *
                  </label>
                  <input
                    type="number"
                    value={formData.kcalBurned}
                    onChange={(e) => handleChange('kcalBurned', e.target.value)}
                    placeholder="300"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-50 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                    required
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
                    className="hover:shadow-red-500/25 hover:shadow-lg transition-all duration-300"
                  >
                    Add Workout
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

export default WorkoutFormModal;
