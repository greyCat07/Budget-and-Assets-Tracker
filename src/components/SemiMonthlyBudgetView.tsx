import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  PieChart,
  Flame,
  Calendar,
  Layers,
  Edit3,
  Check,
  Plus,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  FileSpreadsheet,
  Zap,
  ShoppingBag,
  Home,
  UtensilsCrossed,
  Car,
  Gamepad2,
  HeartPulse,
  ShoppingBasket,
  Repeat
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { CategoryBudget } from '../types';

export const SemiMonthlyBudgetView: React.FC = () => {
  const {
    categoryBudgets,
    currentPeriodInfo,
    period1Spending,
    period2Spending,
    updateCategoryBudget,
    formatCurrency,
    exportSemiMonthlyBudgetCsv,
  } = useFinance();

  const [selectedCycle, setSelectedCycle] = useState<1 | 2 | 'all'>(currentPeriodInfo.period);
  const [editingCategory, setEditingCategory] = useState<CategoryBudget | null>(null);
  const [editP1, setEditP1] = useState<number>(0);
  const [editP2, setEditP2] = useState<number>(0);

  const getCategoryIcon = (name: string) => {
    switch (name) {
      case 'Housing & Rent':
        return Home;
      case 'Groceries & Food':
        return ShoppingBag;
      case 'Dining & Takeout':
        return UtensilsCrossed;
      case 'Transportation':
        return Car;
      case 'Utilities & Bills':
        return Zap;
      case 'Entertainment & Fun':
        return Gamepad2;
      case 'Health & Wellness':
        return HeartPulse;
      case 'Shopping & Retail':
        return ShoppingBasket;
      case 'Subscriptions & SaaS':
        return Repeat;
      default:
        return Layers;
    }
  };

  const handleStartEdit = (b: CategoryBudget) => {
    setEditingCategory(b);
    setEditP1(b.period1Limit);
    setEditP2(b.period2Limit);
  };

  const handleSaveEdit = () => {
    if (editingCategory) {
      updateCategoryBudget(editingCategory.category, editP1, editP2);
      setEditingCategory(null);
    }
  };

  // Calculate totals for selected cycle
  const currentP1Allocated = categoryBudgets.reduce((sum, b) => sum + b.period1Limit, 0);
  const currentP2Allocated = categoryBudgets.reduce((sum, b) => sum + b.period2Limit, 0);
  const currentP1Spent = (Object.values(period1Spending) as number[]).reduce<number>((sum, v) => sum + (Number(v) || 0), 0);
  const currentP2Spent = (Object.values(period2Spending) as number[]).reduce<number>((sum, v) => sum + (Number(v) || 0), 0);

  const activeAllocated: number =
    selectedCycle === 1
      ? currentP1Allocated
      : selectedCycle === 2
      ? currentP2Allocated
      : currentP1Allocated + currentP2Allocated;

  const activeSpent: number =
    selectedCycle === 1
      ? currentP1Spent
      : selectedCycle === 2
      ? currentP2Spent
      : currentP1Spent + currentP2Spent;

  const activeRemaining = activeAllocated - activeSpent;
  const activeBurnRate = activeAllocated > 0 ? (activeSpent / activeAllocated) * 100 : 0;

  return (
    <div id="semi-monthly-budget-view" className="space-y-5 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-100 tracking-tight flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <PieChart className="w-5 h-5" />
            </div>
            Semi-Monthly Budget Engine
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Dual-cycle allocation optimized for 1st–15th and 16th–End-of-Month payroll periods
          </p>
        </div>
        <button
          id="btn-export-budget-csv"
          onClick={exportSemiMonthlyBudgetCsv}
          className="px-3.5 py-2 rounded-xl bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700/60 text-xs font-semibold text-neutral-200 flex items-center gap-1.5 transition-all shadow-sm self-start sm:self-auto"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
          <span>Export Audit CSV</span>
        </button>
      </div>

      {/* Cycle Selector Tabs */}
      <div className="flex p-1 bg-neutral-900/90 border border-neutral-800/80 rounded-2xl max-w-xl">
        <button
          id="tab-cycle-p1"
          onClick={() => setSelectedCycle(1)}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
            selectedCycle === 1
              ? 'bg-emerald-500 text-neutral-950 shadow-md shadow-emerald-500/20'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          Period 1 (1st – 15th)
        </button>
        <button
          id="tab-cycle-p2"
          onClick={() => setSelectedCycle(2)}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
            selectedCycle === 2
              ? 'bg-emerald-500 text-neutral-950 shadow-md shadow-emerald-500/20'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          Period 2 (16th – End)
        </button>
        <button
          id="tab-cycle-all"
          onClick={() => setSelectedCycle('all')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
            selectedCycle === 'all'
              ? 'bg-emerald-500 text-neutral-950 shadow-md shadow-emerald-500/20'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          Combined Month
        </button>
      </div>

      {/* Main 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column (5 cols on lg): Cycle Summary KPI Card + Pacing Info */}
        <div className="lg:col-span-5 space-y-5">
          {/* Active Period Summary Card */}
          <div className="rounded-3xl bg-neutral-900/90 border border-neutral-800/80 p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                {selectedCycle === 1
                  ? 'Period 1 Overview (1st–15th)'
                  : selectedCycle === 2
                  ? 'Period 2 Overview (16th–End)'
                  : 'Full Month Consolidated'}
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  activeBurnRate > 90
                    ? 'bg-rose-500/15 text-rose-400'
                    : 'bg-emerald-500/15 text-emerald-400'
                }`}
              >
                {activeBurnRate.toFixed(1)}% Used
              </span>
            </div>

            {/* Spent vs Allocated Big Display */}
            <div>
              <span className="text-[11px] text-neutral-400 block font-medium">Total Spent</span>
              <div className="text-3xl sm:text-4xl font-black text-neutral-100 font-mono tracking-tight my-1">
                {formatCurrency(activeSpent)}
                <span className="text-sm font-normal text-neutral-400">
                  {' '}
                  / {formatCurrency(activeAllocated)}
                </span>
              </div>
            </div>

            {/* Burn rate progress bar */}
            <div className="w-full h-3 rounded-full bg-neutral-800 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  activeBurnRate > 90
                    ? 'bg-rose-500'
                    : activeBurnRate > 70
                    ? 'bg-amber-400'
                    : 'bg-emerald-400'
                }`}
                style={{ width: `${Math.min(100, activeBurnRate)}%` }}
              />
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-neutral-800/80">
              <div className="p-3 rounded-2xl bg-neutral-850/60 border border-neutral-800/60">
                <span className="text-[11px] text-neutral-400 block">Remaining Balance</span>
                <span
                  className={`text-sm font-bold font-mono ${
                    activeRemaining < 0 ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                >
                  {formatCurrency(activeRemaining)}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-neutral-850/60 border border-neutral-800/60">
                <span className="text-[11px] text-neutral-400 block">Safe Daily Allowance</span>
                <span className="text-sm font-bold text-cyan-400 font-mono">
                  {formatCurrency(currentPeriodInfo.safeDailySpend)}/day
                </span>
              </div>
            </div>

            {/* Rollover & Strategy Info */}
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-neutral-300 space-y-1">
              <div className="flex items-center justify-between text-emerald-400 font-semibold">
                <span>Cycle Rollover Buffer</span>
                <span className="font-mono">+{formatCurrency(currentPeriodInfo.rolloverAmount)}</span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Unspent funds from Period 1 automatically roll over to cushion Period 2 discretionary spending.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column (7 cols on lg): Category Budget Limits */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-bold text-neutral-100">
              Category Allocation Limits
            </h3>
            <span className="text-xs text-neutral-400">
              Click edit to rebalance P1 vs P2
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {categoryBudgets.map((b) => {
              const Icon = getCategoryIcon(b.category);
              const limit =
                selectedCycle === 1
                  ? b.period1Limit
                  : selectedCycle === 2
                  ? b.period2Limit
                  : b.period1Limit + b.period2Limit;

              const p1Val = Number(period1Spending[b.category]) || 0;
              const p2Val = Number(period2Spending[b.category]) || 0;
              const spent =
                selectedCycle === 1
                  ? p1Val
                  : selectedCycle === 2
                  ? p2Val
                  : p1Val + p2Val;

              const rem = limit - spent;
              const pct = limit > 0 ? (spent / limit) * 100 : 0;
              const isOver = rem < 0;

              return (
                <div
                  key={b.category}
                  className="p-3.5 rounded-2xl bg-neutral-900/80 border border-neutral-800/80 hover:border-neutral-700/80 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center text-white"
                          style={{ backgroundColor: b.color }}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-neutral-100 block">
                            {b.category}
                          </span>
                          <span className="text-[10px] text-neutral-400">
                            P1: ${b.period1Limit} • P2: ${b.period2Limit}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleStartEdit(b)}
                        className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-neutral-200 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Progress details */}
                    <div className="mt-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-neutral-400 font-mono">
                          {formatCurrency(spent)}
                        </span>
                        <span className="text-neutral-300 font-mono font-semibold">
                          {formatCurrency(limit)}
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            isOver
                              ? 'bg-rose-500'
                              : pct > 80
                              ? 'bg-amber-400'
                              : 'bg-emerald-400'
                          }`}
                          style={{ width: `${Math.min(100, pct)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-neutral-800/60 flex items-center justify-between text-[11px]">
                    <span className="text-neutral-400">Remaining</span>
                    <span
                      className={`font-mono font-bold ${
                        isOver ? 'text-rose-400' : 'text-emerald-400'
                      }`}
                    >
                      {formatCurrency(rem)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Category Budget Edit Modal */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/80 backdrop-blur-md p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-5 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-neutral-100">
                Edit {editingCategory.category} Budget
              </h3>
              <button
                onClick={() => setEditingCategory(null)}
                className="text-xs text-neutral-400 hover:text-neutral-200"
              >
                Cancel
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  Period 1 Limit (1st – 15th)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-neutral-400 text-sm">$</span>
                  <input
                    type="number"
                    value={editP1}
                    onChange={(e) => setEditP1(Number(e.target.value))}
                    className="w-full pl-7 pr-3 py-2 bg-neutral-800 border border-neutral-700 rounded-xl text-neutral-100 text-sm font-mono focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  Period 2 Limit (16th – End of Month)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-neutral-400 text-sm">$</span>
                  <input
                    type="number"
                    value={editP2}
                    onChange={(e) => setEditP2(Number(e.target.value))}
                    className="w-full pl-7 pr-3 py-2 bg-neutral-800 border border-neutral-700 rounded-xl text-neutral-100 text-sm font-mono focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-neutral-850 border border-neutral-800 text-xs text-neutral-400 flex justify-between">
                <span>Total Monthly Allocation</span>
                <span className="text-emerald-400 font-bold font-mono">
                  ${editP1 + editP2}
                </span>
              </div>
            </div>

            <button
              onClick={handleSaveEdit}
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-sm transition-all"
            >
              Save Budget Limits
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};
