import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  ReceiptText,
  Search,
  Filter,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Trash2,
  FileSpreadsheet,
  RefreshCw,
  Tag,
  CheckCircle2,
  Clock,
  PlusCircle
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { Transaction, CategoryName } from '../types';

interface TransactionsViewProps {
  onOpenAddTx: () => void;
  onOpenBankSync: () => void;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({
  onOpenAddTx,
  onOpenBankSync,
}) => {
  const {
    transactions,
    accounts,
    deleteTransaction,
    formatCurrency,
    exportTransactionsLedgerCsv,
  } = useFinance();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'expense' | 'income'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<'all' | 'p1' | 'p2'>('all');

  const accMap = useMemo(() => new Map(accounts.map((a) => [a.id, a.name])), [accounts]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    transactions.forEach((t) => set.add(t.category));
    return Array.from(set);
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // Type filter
      if (selectedType !== 'all' && tx.type !== selectedType) return false;

      // Category filter
      if (selectedCategory !== 'all' && tx.category !== selectedCategory) return false;

      // Semi-monthly period filter
      if (selectedPeriod !== 'all') {
        const day = new Date(tx.date).getDate();
        if (selectedPeriod === 'p1' && day > 15) return false;
        if (selectedPeriod === 'p2' && day <= 15) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = tx.title.toLowerCase().includes(q);
        const matchesMerchant = tx.merchant?.toLowerCase().includes(q);
        const matchesCategory = tx.category.toLowerCase().includes(q);
        const matchesTags = tx.tags?.some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesMerchant && !matchesCategory && !matchesTags) {
          return false;
        }
      }

      return true;
    });
  }, [transactions, selectedType, selectedCategory, selectedPeriod, searchQuery]);

  const totalIncome = filteredTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = filteredTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div id="transactions-ledger-view" className="space-y-5 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-100 tracking-tight flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ReceiptText className="w-5 h-5" />
            </div>
            Transactions Ledger
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Complete synchronized records, categorization & semi-monthly filtering
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            id="btn-export-transactions-csv"
            onClick={exportTransactionsLedgerCsv}
            className="px-3.5 py-2 rounded-xl bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700/60 text-xs font-semibold text-neutral-200 flex items-center gap-1.5 transition-all shadow-sm"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Export CSV</span>
          </button>
          <button
            id="btn-add-transaction"
            onClick={onOpenAddTx}
            className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Entry</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-2xl bg-neutral-900/80 border border-neutral-800/80 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-neutral-400 block font-medium">Filtered Ledger Volume</span>
            <span className="text-sm sm:text-base font-bold text-neutral-100 font-mono">
              {filteredTransactions.length} Transactions
            </span>
          </div>
          <div className="w-8 h-8 rounded-xl bg-neutral-800 flex items-center justify-center text-neutral-400">
            <ReceiptText className="w-4 h-4" />
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-neutral-900/80 border border-neutral-800/80 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-neutral-400 block font-medium">Total Inflows</span>
            <span className="text-sm sm:text-base font-bold text-emerald-400 font-mono">
              +{formatCurrency(totalIncome)}
            </span>
          </div>
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
            <ArrowDownLeft className="w-4 h-4" />
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-neutral-900/80 border border-neutral-800/80 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-neutral-400 block font-medium">Total Outflows</span>
            <span className="text-sm sm:text-base font-bold text-rose-400 font-mono">
              -{formatCurrency(totalExpense)}
            </span>
          </div>
          <div className="w-8 h-8 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-400">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Desktop Responsive Search & Filter Toolbar */}
      <div className="p-3.5 rounded-2xl bg-neutral-900/80 border border-neutral-800/80 space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
            <input
              id="input-tx-search"
              type="text"
              placeholder="Search by merchant, title, tags, category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-neutral-850 border border-neutral-700/80 rounded-xl text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Type Filter */}
          <div className="flex bg-neutral-850 p-1 rounded-xl border border-neutral-700/80 shrink-0">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                selectedType === 'all'
                  ? 'bg-emerald-500 text-neutral-950'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setSelectedType('expense')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                selectedType === 'expense'
                  ? 'bg-emerald-500 text-neutral-950'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Expenses
            </button>
            <button
              onClick={() => setSelectedType('income')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                selectedType === 'income'
                  ? 'bg-emerald-500 text-neutral-950'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Income
            </button>
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-neutral-850 border border-neutral-700/80 rounded-xl text-xs text-neutral-200 px-3 py-2 focus:outline-none focus:border-emerald-500 shrink-0"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Semi-Monthly Period Filter */}
          <div className="flex bg-neutral-850 p-1 rounded-xl border border-neutral-700/80 shrink-0">
            <button
              onClick={() => setSelectedPeriod('all')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                selectedPeriod === 'all'
                  ? 'bg-neutral-700 text-neutral-100'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              All Month
            </button>
            <button
              onClick={() => setSelectedPeriod('p1')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                selectedPeriod === 'p1'
                  ? 'bg-emerald-500 text-neutral-950'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              P1 (1-15)
            </button>
            <button
              onClick={() => setSelectedPeriod('p2')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                selectedPeriod === 'p2'
                  ? 'bg-emerald-500 text-neutral-950'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              P2 (16-End)
            </button>
          </div>
        </div>
      </div>

      {/* Transactions Table / List */}
      <div className="rounded-3xl bg-neutral-900/90 border border-neutral-800/80 overflow-hidden shadow-lg">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-16 text-neutral-400 space-y-2">
            <ReceiptText className="w-10 h-10 mx-auto text-neutral-600 mb-1" />
            <p className="text-sm font-semibold text-neutral-300">No matching transactions found</p>
            <p className="text-xs text-neutral-500">Try adjusting your filters or adding a new transaction.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-800/80 bg-neutral-850/40 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Transaction</th>
                  <th className="py-3.5 px-4 hidden md:table-cell">Category</th>
                  <th className="py-3.5 px-4 hidden lg:table-cell">Account</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Amount</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {filteredTransactions.map((tx) => {
                  const isIncome = tx.type === 'income';
                  const accountName = accMap.get(tx.accountId) || 'Vault';

                  return (
                    <tr
                      key={tx.id}
                      className="hover:bg-neutral-850/50 transition-colors text-xs text-neutral-300 group"
                    >
                      {/* Title & Icon */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                              isIncome
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-neutral-800 text-neutral-300'
                            }`}
                          >
                            {isIncome ? (
                              <ArrowDownLeft className="w-4 h-4" />
                            ) : (
                              <ArrowUpRight className="w-4 h-4" />
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-neutral-100 group-hover:text-white">
                              {tx.title}
                            </div>
                            <div className="text-[10px] text-neutral-500 flex items-center gap-1.5 md:hidden">
                              <span>{tx.category}</span>
                              <span>•</span>
                              <span>{accountName}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category Badge */}
                      <td className="py-3 px-4 hidden md:table-cell">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-neutral-800 border border-neutral-700/60 text-[11px] text-neutral-300">
                          {tx.category}
                        </span>
                      </td>

                      {/* Account */}
                      <td className="py-3 px-4 hidden lg:table-cell text-neutral-400 text-xs">
                        <span className="truncate block max-w-[140px]">{accountName}</span>
                      </td>

                      {/* Date */}
                      <td className="py-3 px-4 text-neutral-400 font-mono text-[11px]">
                        {tx.date}
                      </td>

                      {/* Amount */}
                      <td className="py-3 px-4 text-right font-mono font-bold">
                        <span
                          className={`${
                            isIncome ? 'text-emerald-400' : 'text-neutral-100'
                          }`}
                        >
                          {isIncome ? '+' : '-'}
                          {formatCurrency(tx.amount)}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => deleteTransaction(tx.id)}
                          className="p-1.5 rounded-lg text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Delete transaction"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
