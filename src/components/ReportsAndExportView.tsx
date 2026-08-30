import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  FileSpreadsheet,
  Download,
  Calendar,
  PieChart,
  TrendingUp,
  ArrowDownLeft,
  ArrowUpRight,
  Eye,
  CheckCircle2,
  Table,
  ReceiptText
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

export const ReportsAndExportView: React.FC = () => {
  const {
    monthlyIncome,
    monthlyExpenses,
    monthlySavings,
    savingsRate,
    netWorth,
    categoryBudgets,
    period1Spending,
    period2Spending,
    transactions,
    exportMonthlyCsv,
    exportSemiMonthlyBudgetCsv,
    exportTransactionsLedgerCsv,
    exportAssetsPortfolioCsv,
    formatCurrency,
  } = useFinance();

  const [activePreview, setActivePreview] = useState<'monthly' | 'budget' | 'transactions'>('monthly');

  // Compute all category spending for full month
  const categorySummary = categoryBudgets
    .map((b) => {
      const p1 = Number(period1Spending[b.category]) || 0;
      const p2 = Number(period2Spending[b.category]) || 0;
      const total = p1 + p2;
      const limit = b.period1Limit + b.period2Limit;
      const pct = monthlyExpenses > 0 ? (total / monthlyExpenses) * 100 : 0;
      return {
        category: b.category,
        color: b.color,
        spent: total,
        limit,
        pct,
      };
    })
    .sort((a, b) => b.spent - a.spent);

  const monthName = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div id="reports-and-export-view" className="space-y-5 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-100 tracking-tight flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            Financial Reports & CSV Export
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Export tax-ready CSV summaries, semi-monthly audits & transaction ledgers
          </p>
        </div>
      </div>

      {/* Monthly Summary KPI Banner */}
      <div className="rounded-3xl bg-neutral-900/90 border border-neutral-800/80 p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            {monthName} Financial Summary
          </span>
          <span className="text-xs font-mono font-bold text-emerald-400">
            Savings Rate: {savingsRate.toFixed(1)}%
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-neutral-850/60 border border-neutral-800/70">
            <span className="text-[11px] text-neutral-400 block font-medium">Total Inflows</span>
            <span className="text-sm sm:text-base font-extrabold text-emerald-400 font-mono mt-0.5 block">
              +{formatCurrency(monthlyIncome)}
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-neutral-850/60 border border-neutral-800/70">
            <span className="text-[11px] text-neutral-400 block font-medium">Total Outflows</span>
            <span className="text-sm sm:text-base font-extrabold text-rose-400 font-mono mt-0.5 block">
              -{formatCurrency(monthlyExpenses)}
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-neutral-850/60 border border-neutral-800/70">
            <span className="text-[11px] text-neutral-400 block font-medium">Net Discretionary</span>
            <span className="text-sm sm:text-base font-extrabold text-cyan-400 font-mono mt-0.5 block">
              +{formatCurrency(monthlySavings)}
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-neutral-850/60 border border-neutral-800/70">
            <span className="text-[11px] text-neutral-400 block font-medium">Net Worth</span>
            <span className="text-sm sm:text-base font-extrabold text-neutral-100 font-mono mt-0.5 block">
              {formatCurrency(netWorth, true)}
            </span>
          </div>
        </div>
      </div>

      {/* CSV Export Options (4 Grid Cards on Desktop) */}
      <div>
        <h3 className="text-sm font-bold text-neutral-100 mb-3">
          Instant CSV Downloads & Audits
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Export 1: Monthly Summary */}
          <div className="p-4 rounded-3xl bg-neutral-900/80 border border-neutral-800/80 flex flex-col justify-between space-y-3 hover:border-neutral-700 transition-all shadow-md">
            <div>
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center mb-2">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-neutral-100">Monthly Summary CSV</h4>
              <p className="text-[10px] text-neutral-400 mt-1">
                Tax-ready high-level breakdown of income, expenses, category spending & savings rate.
              </p>
            </div>
            <button
              id="btn-export-monthly-csv-card"
              onClick={exportMonthlyCsv}
              className="w-full py-2 px-3 rounded-xl bg-neutral-850 hover:bg-emerald-500 hover:text-neutral-950 text-neutral-200 border border-neutral-700/60 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CSV</span>
            </button>
          </div>

          {/* Export 2: Semi-Monthly Budget Audit */}
          <div className="p-4 rounded-3xl bg-neutral-900/80 border border-neutral-800/80 flex flex-col justify-between space-y-3 hover:border-neutral-700 transition-all shadow-md">
            <div>
              <div className="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center mb-2">
                <PieChart className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-neutral-100">Semi-Monthly Audit CSV</h4>
              <p className="text-[10px] text-neutral-400 mt-1">
                Period 1 vs Period 2 limits, actual expenditures, rollover variance & burn rates.
              </p>
            </div>
            <button
              id="btn-export-budget-csv-card"
              onClick={exportSemiMonthlyBudgetCsv}
              className="w-full py-2 px-3 rounded-xl bg-neutral-850 hover:bg-purple-500 hover:text-neutral-950 text-neutral-200 border border-neutral-700/60 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CSV</span>
            </button>
          </div>

          {/* Export 3: Complete Transactions Ledger */}
          <div className="p-4 rounded-3xl bg-neutral-900/80 border border-neutral-800/80 flex flex-col justify-between space-y-3 hover:border-neutral-700 transition-all shadow-md">
            <div>
              <div className="w-9 h-9 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center mb-2">
                <ReceiptText className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-neutral-100">Transaction Ledger CSV</h4>
              <p className="text-[10px] text-neutral-400 mt-1">
                Full chronological ledger with timestamps, merchants, tags, account IDs & amounts.
              </p>
            </div>
            <button
              id="btn-export-ledger-csv-card"
              onClick={exportTransactionsLedgerCsv}
              className="w-full py-2 px-3 rounded-xl bg-neutral-850 hover:bg-cyan-500 hover:text-neutral-950 text-neutral-200 border border-neutral-700/60 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CSV</span>
            </button>
          </div>

          {/* Export 4: Asset Portfolio Valuation */}
          <div className="p-4 rounded-3xl bg-neutral-900/80 border border-neutral-800/80 flex flex-col justify-between space-y-3 hover:border-neutral-700 transition-all shadow-md">
            <div>
              <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center mb-2">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-neutral-100">Asset & Debt CSV</h4>
              <p className="text-[10px] text-neutral-400 mt-1">
                Portfolio holdings, cost basis, unrealized gain/loss, equity and debt balances.
              </p>
            </div>
            <button
              id="btn-export-assets-csv-card"
              onClick={exportAssetsPortfolioCsv}
              className="w-full py-2 px-3 rounded-xl bg-neutral-850 hover:bg-amber-500 hover:text-neutral-950 text-neutral-200 border border-neutral-700/60 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Category Breakdown Preview */}
      <div className="rounded-3xl bg-neutral-900/90 border border-neutral-800/80 p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PieChart className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-neutral-100">
              Monthly Category Distribution Preview
            </h3>
          </div>
          <span className="text-xs text-neutral-400 font-mono">
            {categorySummary.length} categories active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {categorySummary.map((cat) => (
            <div
              key={cat.category}
              className="p-3.5 rounded-2xl bg-neutral-850/60 border border-neutral-800/70 space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="text-xs font-bold text-neutral-100">{cat.category}</span>
                </div>
                <span className="text-[11px] font-mono text-neutral-400">
                  {cat.pct.toFixed(1)}%
                </span>
              </div>

              <div className="flex justify-between text-xs">
                <span className="text-neutral-300 font-mono font-bold">
                  {formatCurrency(cat.spent)}
                </span>
                <span className="text-neutral-400 font-mono">
                  Limit: {formatCurrency(cat.limit)}
                </span>
              </div>

              <div className="w-full h-1.5 rounded-full bg-neutral-800 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: cat.color,
                    width: `${Math.min(100, (cat.spent / (cat.limit || 1)) * 100)}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
