import React, { useState } from 'react';
import { BudgetCategory, Transaction } from '../types';
import { PlusCircle, MinusCircle } from 'lucide-react';

interface TransactionFormProps {
  categories: BudgetCategory[];
  onAddTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
  onClose: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ categories, onAddTransaction, onClose }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [isExpense, setIsExpense] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description || !categoryId) return;

    onAddTransaction({
      amount: parseFloat(amount),
      description,
      categoryId,
      isExpense
    });
    onClose();
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-6 text-slate-800 flex items-center gap-2">
        {isExpense ? <MinusCircle className="text-red-500" /> : <PlusCircle className="text-green-500" />}
        {isExpense ? 'Log Expense' : 'Add Funds'}
      </h2>
      
      <div className="flex gap-2 mb-6 bg-slate-100 p-1 rounded-lg">
        <button
          onClick={() => setIsExpense(true)}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
            isExpense ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Expense
        </button>
        <button
          onClick={() => setIsExpense(false)}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
            !isExpense ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Income
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Amount</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-8 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all text-lg font-semibold text-slate-800 placeholder-slate-300"
              placeholder="0.00"
              autoFocus
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all text-slate-800"
            placeholder="e.g., Grocery Shopping"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Budget Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all text-slate-800"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name} ({cat.type})
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-3 mt-8">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-slate-100 text-slate-600 rounded-lg font-medium hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-500 transition-colors shadow-lg shadow-brand-500/30"
          >
            Save Transaction
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;
