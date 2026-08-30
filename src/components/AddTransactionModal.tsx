import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  PlusCircle,
  X,
  DollarSign,
  Tag,
  Calendar,
  Layers,
  Landmark,
  FileText
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { CategoryName } from '../types';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES: CategoryName[] = [
  'Housing & Rent',
  'Groceries & Food',
  'Dining & Takeout',
  'Transportation',
  'Utilities & Bills',
  'Entertainment & Fun',
  'Health & Wellness',
  'Shopping & Retail',
  'Subscriptions & SaaS',
  'Salary & Income',
  'Investments & Dividends',
  'Freelance & Side Gig',
];

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { addTransaction, accounts, currencySymbol } = useFinance();

  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<CategoryName>('Groceries & Food');
  const [accountId, setAccountId] = useState(accounts[0]?.id || 'acc-1');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [tagInput, setTagInput] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!title.trim() || isNaN(parsedAmount) || parsedAmount <= 0) return;

    addTransaction({
      title: title.trim(),
      amount: parsedAmount,
      type,
      category,
      accountId,
      date,
      tags: tagInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      notes: notes.trim() || undefined,
      status: 'cleared',
      source: 'manual',
    });

    // Reset and close
    setTitle('');
    setAmount('');
    setTagInput('');
    setNotes('');
    onClose();
  };

  return (
    <div
      id="add-transaction-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/85 backdrop-blur-md p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-5 shadow-2xl relative max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-neutral-800 text-neutral-400 hover:text-neutral-200"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <PlusCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-neutral-100">Record Transaction</h3>
            <p className="text-xs text-neutral-400">Add an expense or income to your ledger</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Expense vs Income Toggle */}
          <div className="flex p-1 bg-neutral-800 rounded-2xl border border-neutral-700/60">
            <button
              type="button"
              id="type-toggle-expense"
              onClick={() => {
                setType('expense');
                if (category === 'Salary & Income' || category === 'Freelance & Side Gig') {
                  setCategory('Groceries & Food');
                }
              }}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                type === 'expense'
                  ? 'bg-rose-500 text-neutral-950 shadow-md shadow-rose-500/20'
                  : 'text-neutral-400'
              }`}
            >
              Expense (-)
            </button>
            <button
              type="button"
              id="type-toggle-income"
              onClick={() => {
                setType('income');
                setCategory('Salary & Income');
              }}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                type === 'income'
                  ? 'bg-emerald-500 text-neutral-950 shadow-md shadow-emerald-500/20'
                  : 'text-neutral-400'
              }`}
            >
              Income (+)
            </button>
          </div>

          {/* Amount */}
          <div>
            <label className="text-xs font-semibold text-neutral-300 block mb-1">Amount ({currencySymbol})</label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-neutral-400 font-mono text-base font-bold">{currencySymbol}</span>
              <input
                id="input-tx-amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-xl text-neutral-100 font-mono text-lg font-bold focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Merchant / Description */}
          <div>
            <label className="text-xs font-semibold text-neutral-300 block mb-1">Merchant / Title</label>
            <input
              id="input-tx-title"
              type="text"
              placeholder="e.g., Whole Foods, Shell Gas, Paycheck"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 bg-neutral-800 border border-neutral-700 rounded-xl text-xs text-neutral-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Category & Account */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">Category</label>
              <select
                id="select-tx-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryName)}
                className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-xl text-xs text-neutral-100 focus:outline-none focus:border-emerald-500"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">Account</label>
              <select
                id="select-tx-account"
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-xl text-xs text-neutral-100 focus:outline-none focus:border-emerald-500"
              >
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date & Tags */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">Date</label>
              <input
                id="input-tx-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-xl text-xs text-neutral-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">Tags (comma-separated)</label>
              <input
                type="text"
                placeholder="#food, #dinner"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-xl text-xs text-neutral-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-semibold text-neutral-300 block mb-1">Notes (Optional)</label>
            <input
              type="text"
              placeholder="Receipt details or memo..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 bg-neutral-800 border border-neutral-700 rounded-xl text-xs text-neutral-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-neutral-300 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="btn-submit-transaction"
              className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all"
            >
              Save Record
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
