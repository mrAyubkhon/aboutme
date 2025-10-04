import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { 
  Plus, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  Filter,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useFinance } from '../hooks/useLocalStorage';
import Card, { StatCard } from '../components/Card';
import FinanceCard, { FinanceSummaryCard, BudgetProgressCard } from '../components/FinanceCard';

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
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3 }
  }
};

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'];

export default function Finance() {
  const { financeData, addTransaction, deleteTransaction, setDailyLimit, getTodayStats, getMonthlyStats } = useFinance();
  const [showAddForm, setShowAddForm] = useState(false);
  const [filter, setFilter] = useState('all'); // all, income, expense
  const [transactionForm, setTransactionForm] = useState({
    type: 'expense',
    amount: '',
    category: '',
    note: ''
  });

  const todayStats = getTodayStats();
  const monthlyStats = getMonthlyStats();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (transactionForm.amount && transactionForm.category) {
      addTransaction(
        transactionForm.type,
        parseFloat(transactionForm.amount),
        transactionForm.category,
        transactionForm.note
      );
      setTransactionForm({ type: 'expense', amount: '', category: '', note: '' });
      setShowAddForm(false);
    }
  };

  const filteredTransactions = todayStats.transactions.filter(transaction => {
    if (filter === 'all') return true;
    return transaction.type === filter;
  });

  // Chart data
  const weeklyData = [
    { day: 'Mon', income: 0, expense: 150 },
    { day: 'Tue', income: 0, expense: 200 },
    { day: 'Wed', income: 0, expense: 180 },
    { day: 'Thu', income: 0, expense: 250 },
    { day: 'Fri', income: 0, expense: 120 },
    { day: 'Sat', income: 0, expense: 300 },
    { day: 'Sun', income: 0, expense: todayStats.expenses }
  ];

  const categoryData = [
    { name: 'Food', value: 300, color: COLORS[0] },
    { name: 'Transport', value: 150, color: COLORS[1] },
    { name: 'Shopping', value: 200, color: COLORS[2] },
    { name: 'Entertainment', value: 100, color: COLORS[3] },
    { name: 'Other', value: 150, color: COLORS[4] }
  ];

  const categories = [
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Entertainment',
    'Health',
    'Education',
    'Utilities',
    'Other'
  ];

  return (
    <motion.div
      className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Finance Tracker
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your daily expenses and income
              </p>
            </div>
            
            <motion.button
              onClick={() => setShowAddForm(true)}
              className="flex items-center space-x-2 btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus size={16} />
              <span>Add Transaction</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Budget Alert */}
        {todayStats.isOverLimit && (
          <motion.div 
            variants={itemVariants}
            className="mb-6"
          >
            <Card className="p-4 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700">
              <div className="flex items-center space-x-3">
                <AlertTriangle size={20} className="text-red-600 dark:text-red-400" />
                <div>
                  <h3 className="font-semibold text-red-800 dark:text-red-200">
                    Budget Exceeded!
                  </h3>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    You've spent ${todayStats.expenses.toLocaleString()} today, which is over your daily limit of ${financeData.dailyLimit.toLocaleString()}.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Stats Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <FinanceSummaryCard
            title="Today's Expenses"
            amount={todayStats.expenses}
            type="expense"
          />
          
          <FinanceSummaryCard
            title="Today's Income"
            amount={todayStats.income}
            type="income"
          />
          
          <FinanceSummaryCard
            title="Remaining Budget"
            amount={todayStats.remaining}
            type="total"
          />
          
          <FinanceSummaryCard
            title="Monthly Net"
            amount={monthlyStats.net}
            type="total"
          />
        </motion.div>

        {/* Budget Progress */}
        <motion.div variants={itemVariants} className="mb-8">
          <BudgetProgressCard
            spent={todayStats.expenses}
            limit={financeData.dailyLimit}
          />
        </motion.div>

        {/* Charts */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Weekly Spending Chart */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
              Weekly Spending
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#f9fafb', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Category Breakdown */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
              Category Breakdown
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {categoryData.map((category, index) => (
                <div key={category.name} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {category.name}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div variants={itemVariants}>
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Recent Transactions
              </h3>
              
              <div className="flex items-center space-x-2">
                <Filter size={16} className="text-gray-500" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="all">All</option>
                  <option value="expense">Expenses</option>
                  <option value="income">Income</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-4">
              <AnimatePresence>
                {filteredTransactions.length === 0 ? (
                  <div className="text-center py-8">
                    <DollarSign size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                      No transactions found for today
                    </p>
                  </div>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <FinanceCard
                      key={transaction.id}
                      transaction={transaction}
                      onDelete={deleteTransaction}
                    />
                  ))
                )}
              </AnimatePresence>
            </div>
          </Card>
        </motion.div>

        {/* Add Transaction Modal */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddForm(false)}
            >
              <motion.div
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
                  Add Transaction
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Type
                    </label>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => setTransactionForm({...transactionForm, type: 'income'})}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                          transactionForm.type === 'income'
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <TrendingUp size={16} className="inline mr-2" />
                        Income
                      </button>
                      <button
                        type="button"
                        onClick={() => setTransactionForm({...transactionForm, type: 'expense'})}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                          transactionForm.type === 'expense'
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <TrendingDown size={16} className="inline mr-2" />
                        Expense
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Amount
                    </label>
                    <input
                      type="number"
                      value={transactionForm.amount}
                      onChange={(e) => setTransactionForm({...transactionForm, amount: e.target.value})}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      className="input"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category
                    </label>
                    <select
                      value={transactionForm.category}
                      onChange={(e) => setTransactionForm({...transactionForm, category: e.target.value})}
                      className="input"
                      required
                    >
                      <option value="">Select category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Note (optional)
                    </label>
                    <textarea
                      value={transactionForm.note}
                      onChange={(e) => setTransactionForm({...transactionForm, note: e.target.value})}
                      placeholder="Add a note..."
                      rows={3}
                      className="input resize-none"
                    />
                  </div>
                  
                  <div className="flex space-x-3 pt-4">
                    <motion.button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      className="flex-1 px-4 py-2 btn-primary"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Add Transaction
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
