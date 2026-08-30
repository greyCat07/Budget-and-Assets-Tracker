import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  TrendingUp,
  TrendingDown,
  PlusCircle,
  RefreshCw,
  CalendarDays,
  FileSpreadsheet,
  Cloud,
  Sparkles,
  ChevronRight,
  Landmark,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Eye,
  EyeOff,
  Flame,
  CreditCard,
  Layers,
  DollarSign
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

interface DashboardViewProps {
  onOpenAddTx: () => void;
  onOpenBankSync: () => void;
  onOpenAddBill: () => void;
  onOpenAdvisorChat: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenAddTx,
  onOpenBankSync,
  onOpenAddBill,
  onOpenAdvisorChat,
}) => {
  const {
    netWorth,
    totalLiquidCash,
    totalInvestments,
    totalCrypto,
    totalFixedAssets,
    totalLiabilities,
    monthlyIncome,
    monthlyExpenses,
    monthlySavings,
    savingsRate,
    currentPeriodInfo,
    marketQuotes,
    aiInsights,
    accounts,
    scheduledBills,
    transactions,
    syncBankAccounts,
    syncState,
    formatCurrency,
    setActiveTab,
    toggleBillPaid,
    exportMonthlyCsv,
  } = useFinance();

  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncAll = async () => {
    setIsSyncing(true);
    await syncBankAccounts();
    setIsSyncing(false);
  };

  const upcomingBills = scheduledBills.filter((b) => !b.isPaid).slice(0, 4);
  const recentTxs = transactions.slice(0, 6);

  return (
    <div id="dashboard-view-container" className="space-y-5 pb-12">
      {/* Top Banner / Welcome Header on Desktop */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-100 tracking-tight">
            Financial Cockpit
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Active Cycle: <span className="text-emerald-400 font-semibold">{currentPeriodInfo.periodLabel}</span> • {currentPeriodInfo.daysRemaining} days left
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            id="btn-desktop-sync"
            onClick={handleSyncAll}
            disabled={isSyncing}
            className="px-3 py-1.5 rounded-xl bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700/60 text-xs font-semibold text-neutral-200 flex items-center gap-1.5 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-emerald-400' : 'text-neutral-400'}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Accounts'}</span>
          </button>
          <button
            id="btn-desktop-add-tx"
            onClick={onOpenAddTx}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-xs font-bold text-neutral-950 flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {/* Top Grid: Net Worth + Semi-Monthly Budget Pacing */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Net Worth Card (7 cols on lg) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-7 relative overflow-hidden rounded-3xl bg-gradient-to-br from-neutral-900/90 via-neutral-900/70 to-neutral-850/90 border border-neutral-800/80 p-5 sm:p-6 shadow-xl flex flex-col justify-between"
        >
          {/* Ambient blur accents */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Total Net Worth
              </span>
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+6.4% this month</span>
              </div>
            </div>

            <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-neutral-100 font-mono tracking-tight my-2">
              {formatCurrency(netWorth, true)}
            </div>
          </div>

          {/* Asset Sub-Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5 pt-4 border-t border-neutral-800/80">
            <div className="bg-neutral-800/40 rounded-2xl p-2.5 border border-neutral-700/40">
              <span className="text-[11px] text-neutral-400 block font-medium">Liquid Cash</span>
              <span className="text-xs sm:text-sm font-bold text-emerald-400 font-mono">
                {formatCurrency(totalLiquidCash, true)}
              </span>
            </div>
            <div className="bg-neutral-800/40 rounded-2xl p-2.5 border border-neutral-700/40">
              <span className="text-[11px] text-neutral-400 block font-medium">Investments</span>
              <span className="text-xs sm:text-sm font-bold text-cyan-400 font-mono">
                {formatCurrency(totalInvestments, true)}
              </span>
            </div>
            <div className="bg-neutral-800/40 rounded-2xl p-2.5 border border-neutral-700/40">
              <span className="text-[11px] text-neutral-400 block font-medium">Crypto Assets</span>
              <span className="text-xs sm:text-sm font-bold text-amber-400 font-mono">
                {formatCurrency(totalCrypto, true)}
              </span>
            </div>
            <div className="bg-neutral-800/40 rounded-2xl p-2.5 border border-neutral-700/40">
              <span className="text-[11px] text-neutral-400 block font-medium">Total Debt</span>
              <span className="text-xs sm:text-sm font-bold text-rose-400 font-mono">
                -{formatCurrency(totalLiabilities, true)}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Semi-Monthly Budget Pacing Banner (5 cols on lg) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="lg:col-span-5 rounded-3xl bg-neutral-900/90 border border-neutral-800/80 p-5 sm:p-6 shadow-xl flex flex-col justify-between relative overflow-hidden"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-neutral-100 block">
                    Semi-Monthly Budget Pacing
                  </span>
                  <span className="text-[11px] text-neutral-400">
                    Cycle {currentPeriodInfo.period} ({currentPeriodInfo.periodLabel})
                  </span>
                </div>
              </div>
              <button
                id="btn-view-semi-monthly-budget"
                onClick={() => setActiveTab('budget')}
                className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5 font-semibold"
              >
                Audits <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Safe Daily Spend Metric */}
            <div className="p-3 rounded-2xl bg-neutral-850/60 border border-neutral-800/60 flex items-center justify-between mb-3">
              <div>
                <span className="text-[11px] text-neutral-400 block">Safe Daily Spend</span>
                <span className="text-lg sm:text-xl font-extrabold text-emerald-400 font-mono">
                  {formatCurrency(currentPeriodInfo.safeDailySpend)}
                  <span className="text-xs text-neutral-400 font-normal"> / day</span>
                </span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-neutral-400 block">Days Left</span>
                <span className="text-base font-bold text-neutral-200 font-mono">
                  {currentPeriodInfo.daysRemaining} of {currentPeriodInfo.daysTotal}d
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-neutral-400">
                  Spent: <strong className="text-neutral-200 font-mono">{formatCurrency(currentPeriodInfo.totalSpent)}</strong>
                </span>
                <span className="text-neutral-400">
                  Limit: <strong className="text-neutral-200 font-mono">{formatCurrency(currentPeriodInfo.totalAllocated)}</strong>
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-neutral-800 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    currentPeriodInfo.burnRatePercent > 90
                      ? 'bg-rose-500'
                      : currentPeriodInfo.burnRatePercent > 70
                      ? 'bg-amber-400'
                      : 'bg-emerald-400'
                  }`}
                  style={{ width: `${Math.min(100, currentPeriodInfo.burnRatePercent)}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-neutral-400 pt-0.5">
                <span>
                  Remaining: <strong className="text-emerald-400 font-mono">{formatCurrency(currentPeriodInfo.remainingBudget)}</strong>
                </span>
                <span>
                  Rollover Buffer: <strong className="text-emerald-400 font-mono">+{formatCurrency(currentPeriodInfo.rolloverAmount)}</strong>
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Action Shortcuts Toolbar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          id="btn-quick-add-expense"
          onClick={onOpenAddTx}
          className="flex items-center gap-3 p-3 rounded-2xl bg-neutral-900/80 hover:bg-neutral-850 border border-neutral-800/80 hover:border-neutral-700 transition-all active:scale-95 group text-left shadow-sm"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <PlusCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-neutral-100 block">Add Expense</span>
            <span className="text-[10px] text-neutral-400">Manual entry & tags</span>
          </div>
        </button>

        <button
          id="btn-quick-bank-sync"
          onClick={onOpenBankSync}
          className="flex items-center gap-3 p-3 rounded-2xl bg-neutral-900/80 hover:bg-neutral-850 border border-neutral-800/80 hover:border-neutral-700 transition-all active:scale-95 group text-left shadow-sm"
        >
          <div className="w-10 h-10 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-neutral-100 block">Bank Sync</span>
            <span className="text-[10px] text-neutral-400">7 institutions ready</span>
          </div>
        </button>

        <button
          id="btn-quick-schedule-bill"
          onClick={onOpenAddBill}
          className="flex items-center gap-3 p-3 rounded-2xl bg-neutral-900/80 hover:bg-neutral-850 border border-neutral-800/80 hover:border-neutral-700 transition-all active:scale-95 group text-left shadow-sm"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <CalendarDays className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-neutral-100 block">Plan Bill</span>
            <span className="text-[10px] text-neutral-400">Schedule due dates</span>
          </div>
        </button>

        <button
          id="btn-quick-export-csv"
          onClick={exportMonthlyCsv}
          className="flex items-center gap-3 p-3 rounded-2xl bg-neutral-900/80 hover:bg-neutral-850 border border-neutral-800/80 hover:border-neutral-700 transition-all active:scale-95 group text-left shadow-sm"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-neutral-100 block">Export CSV</span>
            <span className="text-[10px] text-neutral-400">Tax & monthly audits</span>
          </div>
        </button>
      </div>

      {/* Real-time Stocks & Crypto Live Ticker Strip */}
      <div className="rounded-3xl bg-neutral-900/80 border border-neutral-800/80 p-4 shadow-md">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-300">
              Live Equities & Crypto Watchlist
            </span>
          </div>
          <button
            onClick={() => setActiveTab('assets')}
            className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold"
          >
            Portfolio View <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
          {[...marketQuotes.stocks.slice(0, 3), ...marketQuotes.cryptos.slice(0, 2)].map((q) => {
            const isPos = q.changePercent >= 0;
            return (
              <div
                key={q.symbol}
                className="p-3 rounded-2xl bg-neutral-850/60 border border-neutral-800/70 hover:border-neutral-700 transition-colors flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-100">{q.symbol}</span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center ${
                      isPos
                        ? 'bg-emerald-500/15 text-emerald-400'
                        : 'bg-rose-500/15 text-rose-400'
                    }`}
                  >
                    {isPos ? '+' : ''}
                    {q.changePercent}%
                  </span>
                </div>
                <div className="mt-2">
                  <div className="text-sm font-mono font-bold text-neutral-100">
                    ${q.price.toLocaleString()}
                  </div>
                  <span className="text-[10px] text-neutral-400 truncate block mt-0.5">{q.name}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main 2-Column Split Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* LEFT COLUMN (7 cols on lg): Connected Accounts + Recent Transactions + AI Tip */}
        <div className="lg:col-span-7 space-y-5">
          {/* AI Financial Insight Banner */}
          <div className="rounded-3xl bg-gradient-to-br from-emerald-950/30 via-neutral-900/90 to-neutral-900/90 border border-emerald-500/25 p-4 sm:p-5 shadow-lg">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                    AI Financial Advisor
                  </span>
                  <h3 className="text-sm font-bold text-neutral-100 mt-0.5">
                    Daily Spending Behavior Pattern
                  </h3>
                </div>
              </div>
              <button
                id="btn-ask-ai-advisor"
                onClick={() => setActiveTab('insights')}
                className="px-3 py-1 rounded-xl bg-emerald-500 text-neutral-950 text-xs font-bold hover:bg-emerald-400 transition-all flex items-center gap-1 shadow-md shadow-emerald-500/20"
              >
                Ask Advisor
              </button>
            </div>

            <p className="text-xs text-neutral-300 mt-3 leading-relaxed">
              {aiInsights.dailyInsight}
            </p>

            {aiInsights.tips && aiInsights.tips[0] && (
              <div className="mt-3.5 p-3 rounded-2xl bg-neutral-850/80 border border-emerald-500/20 flex items-center justify-between">
                <div className="pr-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] uppercase font-bold text-emerald-400 px-1.5 py-0.2 rounded bg-emerald-500/15">
                      {aiInsights.tips[0].badge}
                    </span>
                    <span className="text-xs font-bold text-neutral-200">
                      {aiInsights.tips[0].title}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-0.5 line-clamp-1">
                    {aiInsights.tips[0].description}
                  </p>
                </div>
                <span className="text-xs font-bold text-emerald-400 shrink-0 font-mono">
                  {aiInsights.tips[0].impact}
                </span>
              </div>
            )}
          </div>

          {/* Connected Accounts */}
          <div className="rounded-3xl bg-neutral-900/80 border border-neutral-800/80 p-4 sm:p-5 shadow-md">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Landmark className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-neutral-100">Connected Accounts</h3>
              </div>
              <button
                id="btn-sync-all-accounts"
                onClick={handleSyncAll}
                disabled={isSyncing}
                className="text-xs text-neutral-400 hover:text-emerald-400 flex items-center gap-1 font-medium transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-emerald-400' : ''}`} />
                <span>{isSyncing ? 'Syncing...' : 'Sync All'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {accounts.map((acc) => (
                <div
                  key={acc.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-neutral-850/60 border border-neutral-800/70 hover:border-neutral-700 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs text-white"
                      style={{ backgroundColor: acc.color }}
                    >
                      {acc.institution.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-neutral-100 truncate max-w-[130px]">
                        {acc.name}
                      </div>
                      <div className="text-[10px] text-neutral-400">
                        {acc.accountNumberMask}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-xs font-mono font-bold ${
                        acc.balance < 0 ? 'text-rose-400' : 'text-neutral-100'
                      }`}
                    >
                      {formatCurrency(acc.balance, true)}
                    </div>
                    <span className="text-[9px] text-neutral-500 uppercase">
                      {acc.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Transactions Ledger */}
          <div className="rounded-3xl bg-neutral-900/80 border border-neutral-800/80 p-4 sm:p-5 shadow-md">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Wallet className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-neutral-100">Recent Transactions</h3>
              </div>
              <button
                onClick={() => setActiveTab('transactions')}
                className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5 font-semibold"
              >
                View Ledger <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2">
              {recentTxs.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-2.5 rounded-2xl bg-neutral-850/50 border border-neutral-800/60 hover:bg-neutral-850 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                        tx.type === 'income'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-neutral-800 text-neutral-300'
                      }`}
                    >
                      {tx.type === 'income' ? (
                        <ArrowDownLeft className="w-4 h-4" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-neutral-100">{tx.title}</div>
                      <div className="text-[10px] text-neutral-400 flex items-center gap-1.5">
                        <span>{tx.date}</span>
                        <span>•</span>
                        <span className="text-neutral-400">{tx.category}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-xs font-mono font-bold ${
                        tx.type === 'income' ? 'text-emerald-400' : 'text-neutral-200'
                      }`}
                    >
                      {tx.type === 'income' ? '+' : '-'}
                      {formatCurrency(tx.amount)}
                    </div>
                    <span className="text-[9px] text-neutral-500">{tx.source}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (5 cols on lg): Upcoming Bills + Cashflow Forecast + Monthly Savings Rate */}
        <div className="lg:col-span-5 space-y-5">
          {/* Monthly Cashflow Gauge */}
          <div className="rounded-3xl bg-neutral-900/80 border border-neutral-800/80 p-4 sm:p-5 shadow-md">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-neutral-100">Monthly Cashflow</h3>
              <span className="text-xs font-mono font-bold text-emerald-400">
                {savingsRate.toFixed(1)}% Saved
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 mb-3">
              <div className="p-3 rounded-2xl bg-neutral-850/60 border border-neutral-800/70">
                <span className="text-[11px] text-neutral-400 block font-medium">Income</span>
                <span className="text-sm font-bold text-emerald-400 font-mono">
                  +{formatCurrency(monthlyIncome)}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-neutral-850/60 border border-neutral-800/70">
                <span className="text-[11px] text-neutral-400 block font-medium">Expenses</span>
                <span className="text-sm font-bold text-rose-400 font-mono">
                  -{formatCurrency(monthlyExpenses)}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-emerald-300 block font-medium">Net Discretionary Savings</span>
                <span className="text-base font-extrabold text-emerald-400 font-mono">
                  +{formatCurrency(monthlySavings)}
                </span>
              </div>
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Upcoming Scheduled Bills */}
          <div className="rounded-3xl bg-neutral-900/80 border border-neutral-800/80 p-4 sm:p-5 shadow-md">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-bold text-neutral-100">Upcoming Bills</h3>
              </div>
              <button
                onClick={() => setActiveTab('calendar')}
                className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-0.5 font-semibold"
              >
                Calendar <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {upcomingBills.length === 0 ? (
              <div className="text-center py-6 text-xs text-neutral-400">
                All bills for this cycle are paid! 🎉
              </div>
            ) : (
              <div className="space-y-2.5">
                {upcomingBills.map((bill) => (
                  <div
                    key={bill.id}
                    className="flex items-center justify-between p-3 rounded-2xl bg-neutral-850/60 border border-neutral-800/70"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs font-bold">
                        {bill.dueDay}th
                      </div>
                      <div>
                        <div className="text-xs font-bold text-neutral-100">{bill.title}</div>
                        <span className="text-[10px] text-neutral-400">
                          {bill.category} • {bill.autoPay ? 'Auto-Pay' : 'Manual'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-bold font-mono text-neutral-200">
                        {formatCurrency(bill.amount)}
                      </span>
                      <button
                        onClick={() => toggleBillPaid(bill.id)}
                        className="px-2 py-1 rounded-lg bg-neutral-800 hover:bg-emerald-500/20 text-neutral-400 hover:text-emerald-400 text-[10px] font-semibold border border-neutral-700/60 transition-colors"
                      >
                        Pay
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
