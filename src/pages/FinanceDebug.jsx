import { useState } from 'react';
import { DollarSign, Plus, TrendingUp } from 'lucide-react';
import PhysicsButton from '../components/PhysicsButton';

/**
 * Debug version of Finance page
 */
export default function FinanceDebug() {
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <div className="min-h-screen bg-gray-950 pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-50 mb-2">Finance Helper</h1>
              <p className="text-gray-300">Track your income, expenses, and financial goals</p>
            </div>
            <PhysicsButton
              onClick={() => setShowAddForm(!showAddForm)}
              icon={Plus}
              variant="primary"
              className="flex items-center space-x-2"
            >
              Add Transaction
            </PhysicsButton>
          </div>
        </div>

        {/* Financial Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900 p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-50 flex items-center">
                <DollarSign className="mr-2 text-green-400" size={24} />
                Total Balance
              </h3>
              <span className="text-2xl font-bold text-green-400">$0.00</span>
            </div>
            <p className="text-sm text-gray-400">Current balance</p>
          </div>
          
          <div className="bg-gray-900 p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-50 flex items-center">
                <TrendingUp className="mr-2 text-blue-400" size={24} />
                Today's Income
              </h3>
              <span className="text-2xl font-bold text-blue-400">$0.00</span>
            </div>
            <p className="text-sm text-gray-400">0 transactions</p>
          </div>
          
          <div className="bg-gray-900 p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-50 flex items-center">
                <span className="mr-2 text-red-400">📉</span>
                Today's Expenses
              </h3>
              <span className="text-2xl font-bold text-red-400">$0.00</span>
            </div>
            <p className="text-sm text-gray-400">0 transactions</p>
          </div>
        </div>

        {/* Add Transaction Form */}
        {showAddForm && (
          <div className="bg-gray-900 p-6 rounded-xl mb-8">
            <h3 className="text-lg font-semibold text-gray-50 mb-4">Add Transaction</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Type
                </label>
                <select className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-50">
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  placeholder="Transaction description"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-50"
                />
              </div>
              <div className="md:col-span-2 flex space-x-2">
                <PhysicsButton
                  onClick={() => alert('Transaction added!')}
                  variant="primary"
                  className="flex-1"
                >
                  Add Transaction
                </PhysicsButton>
                <PhysicsButton
                  onClick={() => setShowAddForm(false)}
                  variant="secondary"
                  className="flex-1"
                >
                  Cancel
                </PhysicsButton>
              </div>
            </div>
          </div>
        )}

        {/* Recent Transactions */}
        <div className="bg-gray-900 p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-gray-50 mb-4">Recent Transactions</h3>
          <div className="text-center py-8">
            <div className="text-6xl mb-4">💰</div>
            <h3 className="text-lg font-semibold text-gray-50 mb-2">No transactions yet</h3>
            <p className="text-gray-400 mb-4">Start tracking your finances by adding your first transaction.</p>
            <PhysicsButton
              onClick={() => setShowAddForm(true)}
              icon={Plus}
              variant="primary"
              className="flex items-center space-x-2"
            >
              Add Your First Transaction
            </PhysicsButton>
          </div>
        </div>

        {/* Debug Info */}
        <div className="mt-8 p-4 bg-gray-800 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-50 mb-2">Debug Info</h3>
          <p className="text-gray-300">This is the debug version of the Finance page.</p>
          <p className="text-gray-300">If you see this, the basic components are working.</p>
        </div>
      </div>
    </div>
  );
}
