import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  CalendarDays,
  X,
  DollarSign,
  Repeat,
  Zap,
  Bell
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { CategoryName } from '../types';

interface AddBillModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddBillModal: React.FC<AddBillModalProps> = ({ isOpen, onClose }) => {
  const { addScheduledBill, accounts, currencySymbol } = useFinance();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<CategoryName>('Utilities & Bills');
  const [dueDay, setDueDay] = useState(1);
  const [frequency, setFrequency] = useState<'monthly' | 'semi-monthly' | 'annual'>('monthly');
  const [autoPay, setAutoPay] = useState(true);
  const [reminderDaysBefore, setReminderDaysBefore] = useState(3);
  const [accountId, setAccountId] = useState(accounts[0]?.id || 'acc-1');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!title.trim() || isNaN(parsedAmount) || parsedAmount <= 0) return;

    const today = new Date();
    const targetDate = new Date(today.getFullYear(), today.getMonth(), Number(dueDay));
    if (targetDate < today) {
      targetDate.setMonth(targetDate.getMonth() + 1);
    }
    const nextDueDate = targetDate.toISOString().split('T')[0];

    addScheduledBill({
      title: title.trim(),
      amount: parsedAmount,
      category,
      dueDay: Number(dueDay),
      frequency,
      autoPay,
      reminderDaysBefore: Number(reminderDaysBefore),
      accountId,
      isPaid: false,
      nextDueDate,
    });

    setTitle('');
    setAmount('');
    onClose();
  };

  return (
    <div
      id="add-bill-modal-overlay"
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
          <div className="w-9 h-9 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
            <CalendarDays className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-neutral-100">Schedule Future Bill</h3>
            <p className="text-xs text-neutral-400">Plan recurring payments & auto-forecast cashflow</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="text-xs font-semibold text-neutral-300 block mb-1">Bill Name / Merchant</label>
            <input
              id="input-bill-title"
              type="text"
              placeholder="e.g., Electric Power Grid, Spotify Premium, Rent"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 bg-neutral-800 border border-neutral-700 rounded-xl text-xs text-neutral-100 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">Amount ({currencySymbol})</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-neutral-400 font-mono text-sm">{currencySymbol}</span>
                <input
                  id="input-bill-amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-neutral-800 border border-neutral-700 rounded-xl text-xs text-neutral-100 font-mono font-bold focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">Due Day of Month</label>
              <select
                id="select-bill-due-day"
                value={dueDay}
                onChange={(e) => setDueDay(Number(e.target.value))}
                className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-xl text-xs text-neutral-100 focus:outline-none focus:border-purple-500"
              >
                {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={d}>
                    Day {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryName)}
                className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-xl text-xs text-neutral-100 focus:outline-none focus:border-purple-500"
              >
                <option value="Housing & Rent">Housing & Rent</option>
                <option value="Utilities & Bills">Utilities & Bills</option>
                <option value="Subscriptions & SaaS">Subscriptions & SaaS</option>
                <option value="Transportation">Transportation</option>
                <option value="Health & Wellness">Health & Wellness</option>
                <option value="Entertainment & Fun">Entertainment & Fun</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">Debit Account</label>
              <select
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-xl text-xs text-neutral-100 focus:outline-none focus:border-purple-500"
              >
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">Frequency</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as any)}
                className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-xl text-xs text-neutral-100 focus:outline-none focus:border-purple-500"
              >
                <option value="monthly">Monthly</option>
                <option value="semi-monthly">Semi-Monthly</option>
                <option value="annual">Annual</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">Reminder Alert</label>
              <select
                value={reminderDaysBefore}
                onChange={(e) => setReminderDaysBefore(Number(e.target.value))}
                className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-xl text-xs text-neutral-100 focus:outline-none focus:border-purple-500"
              >
                <option value={1}>1 day before</option>
                <option value={2}>2 days before</option>
                <option value={3}>3 days before</option>
                <option value={7}>7 days before</option>
              </select>
            </div>
          </div>

          {/* AutoPay Toggle */}
          <div className="p-3 rounded-2xl bg-neutral-850 border border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <div>
                <span className="text-xs font-bold text-neutral-200 block">Automatic Debit (Auto-Pay)</span>
                <span className="text-[10px] text-neutral-400">Mark as automated scheduled transfer</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setAutoPay(!autoPay)}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                autoPay ? 'bg-cyan-500' : 'bg-neutral-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  autoPay ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
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
              id="btn-submit-scheduled-bill"
              className="flex-1 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-neutral-950 font-bold text-xs shadow-lg shadow-purple-500/20 transition-all"
            >
              Schedule Bill
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
