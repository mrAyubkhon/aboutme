import { motion } from 'framer-motion';
import { useState } from 'react';
import { DollarSign, Plus, TrendingUp, TrendingDown } from 'lucide-react';
import FormField from '../components/FormField';
import { RippleButton, ParticleSystem } from '../components/MicroInteractions';
import { useFinance } from '../hooks/useFinance';
import Card, { StatCard } from '../components/Card';
import FinanceItem from '../components/FinanceItem';
import PhysicsButton from '../components/PhysicsButton';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { 
      type: "spring",
      stiffness: 300,
      damping: 20,
      duration: 0.5
    }
  }
};

export default function Finance() {
  const { 
    financeData, 
    addEntry, 
    deleteEntry, 
    setDailyLimit, 
    getTodayTotals, 
    getRemainingBudget,
    categories 
  } = useFinance();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: 'Food & Dining',
    note: ''
  });

  const todayTotals = getTodayTotals();
  const remainingBudget = getRemainingBudget();
  const todayEntries = financeData.entries.filter(entry => {
    const today = new Date().toDateString();
    return new Date(entry.date).toDateString() === today;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Sound effect disabled
    const playSound = () => {
      return;
    };
    
    if (formData.amount && formData.category && Number(formData.amount) > 0) {
      addEntry(formData.type, Number(formData.amount), formData.category, formData.note);
      playSound(); // Play success sound
      setShowParticles(true); // Trigger particle effect
      setFormData({
        type: 'expense',
        amount: '',
        category: 'Food & Dining',
        note: ''
      });
      setShowAddForm(false);
      
      // Reset particle effect after animation
      setTimeout(() => setShowParticles(false), 2000);
    } else {
      // Show better validation message
      const errorMessage = !formData.amount ? 'Please enter an amount' :
                          Number(formData.amount) <= 0 ? 'Amount must be greater than 0' :
                          !formData.category ? 'Please select a category' :
                          'Please fill in all required fields';
      
      // Create a better error notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-20 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
      notification.textContent = errorMessage;
      document.body.appendChild(notification);
      
      // Animate in
      setTimeout(() => {
        notification.classList.remove('translate-x-full');
      }, 100);
      
      // Auto remove after 3 seconds
      setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 300);
      }, 3000);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-50 mb-2">Finance Tracker</h1>
              <p className="text-gray-300">Track your income and expenses</p>
            </div>
            <RippleButton
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 ease-out shadow-sm hover:shadow-md flex items-center space-x-2"
              onClick={() => setShowAddForm(!showAddForm)}
            >
              <Plus size={18} />
              <span>Add Entry</span>
            </RippleButton>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <StatCard
            title="Today's Income"
            value={`${todayTotals.income.toLocaleString()} UZS`}
            icon={TrendingUp}
            color="green"
          />
          
          <StatCard
            title="Today's Expenses"
            value={`${todayTotals.expenses.toLocaleString()} UZS`}
            icon={TrendingDown}
            color="red"
          />
          
          <StatCard
            title="Net Today"
            value={`${todayTotals.net.toLocaleString()} UZS`}
            icon={DollarSign}
            color={todayTotals.net >= 0 ? "green" : "red"}
          />
          
          <StatCard
            title="Remaining Budget"
            value={`${remainingBudget.toLocaleString()} UZS`}
            icon={DollarSign}
            color={remainingBudget > 0 ? "blue" : "red"}
          />
        </motion.div>

        {/* Add Entry Form */}
        {showAddForm && (
          <motion.div
            variants={itemVariants}
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
              duration: 0.6
            }}
            className="mb-8"
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-50 mb-4">Add New Entry</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => handleInputChange('type', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-800 rounded-xl bg-gray-800 text-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    >
                      <option value="income">Income</option>
                      <option value="expense">Expense</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Amount (UZS)
                    </label>
                    <input
                      type="number"
                      value={formData.amount}
                      onChange={(e) => handleInputChange('amount', e.target.value)}
                      placeholder="Enter amount..."
                      min="0"
                      step="1000"
                      className="w-full px-3 py-2 border border-gray-800 rounded-xl bg-gray-800 text-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-800 rounded-xl bg-gray-800 text-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Note (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.note}
                    onChange={(e) => handleInputChange('note', e.target.value)}
                    placeholder="Add a note..."
                    className="w-full px-3 py-2 border border-gray-800 rounded-xl bg-gray-800 text-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                </div>
                
                <div className="flex space-x-3">
                  <PhysicsButton type="submit">
                    Add Entry
                  </PhysicsButton>
                  <PhysicsButton 
                    type="button"
                    variant="secondary" 
                    onClick={() => setShowAddForm(false)}
                  >
                    Cancel
                  </PhysicsButton>
                </div>
              </form>
            </Card>
          </motion.div>
        )}

        {/* Today's Entries */}
        <motion.div variants={itemVariants}>
          <h3 className="text-xl font-semibold text-gray-50 mb-6">
            Today's Entries ({todayEntries.length})
          </h3>
          {todayEntries.length > 0 ? (
            <div className="space-y-3">
              {todayEntries.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: index * 0.1,
                    duration: 0.4,
                    ease: "easeOut"
                  }}
                >
                  <FinanceItem
                    entry={entry}
                    onDelete={deleteEntry}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <DollarSign className="mx-auto text-gray-500 mb-4" size={48} />
              <h3 className="text-lg font-semibold text-gray-50 mb-2">No entries today</h3>
              <p className="text-gray-400 mb-4">Start tracking your finances by adding your first entry.</p>
              <PhysicsButton onClick={() => setShowAddForm(true)}>
                <Plus size={18} className="mr-2" />
                Add Entry
              </PhysicsButton>
            </Card>
          )}
        </motion.div>
      </div>
      
      {/* Particle System for Success */}
      <ParticleSystem trigger={showParticles} particleCount={15} />
    </motion.div>
  );
}