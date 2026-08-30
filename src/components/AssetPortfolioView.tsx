import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  TrendingUp,
  TrendingDown,
  Plus,
  Bitcoin,
  Building,
  Car,
  Briefcase,
  DollarSign,
  FileSpreadsheet,
  Trash2,
  Edit2,
  Percent,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  ShieldAlert,
  CreditCard
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { Asset, Liability } from '../types';

interface AssetPortfolioViewProps {
  onOpenAddAsset: () => void;
}

export const AssetPortfolioView: React.FC<AssetPortfolioViewProps> = ({ onOpenAddAsset }) => {
  const {
    netWorth,
    totalLiquidCash,
    totalInvestments,
    totalCrypto,
    totalFixedAssets,
    totalLiabilities,
    assets,
    liabilities,
    marketQuotes,
    deleteAsset,
    formatCurrency,
    exportAssetsPortfolioCsv,
  } = useFinance();

  const [marketFilter, setMarketFilter] = useState<'all' | 'stock' | 'crypto'>('all');

  const filteredQuotes = [...marketQuotes.stocks, ...marketQuotes.cryptos].filter((q) => {
    if (marketFilter === 'all') return true;
    return q.type === marketFilter || (marketFilter === 'stock' && q.type === 'etf');
  });

  const getAssetCategoryIcon = (category: string) => {
    switch (category) {
      case 'stock':
        return Briefcase;
      case 'crypto':
        return Bitcoin;
      case 'real_estate':
        return Building;
      case 'vehicle':
        return Car;
      default:
        return Layers;
    }
  };

  return (
    <div id="asset-portfolio-view" className="space-y-5 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-100 tracking-tight flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            Asset & Wealth Portfolio
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Real-time equity quotes, cryptocurrency feeds, real estate & debt liabilities
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={exportAssetsPortfolioCsv}
            className="px-3.5 py-2 rounded-xl bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700/60 text-xs font-semibold text-neutral-200 flex items-center gap-1.5 transition-all shadow-sm"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Export CSV</span>
          </button>
          <button
            id="btn-add-new-asset"
            onClick={onOpenAddAsset}
            className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-xs font-bold text-neutral-950 flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Asset</span>
          </button>
        </div>
      </div>

      {/* Top 4 Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-3xl bg-neutral-900/90 border border-neutral-800/80 shadow-md">
          <span className="text-[11px] text-neutral-400 block font-medium">Total Net Worth</span>
          <span className="text-lg sm:text-xl font-extrabold text-neutral-100 font-mono mt-1 block">
            {formatCurrency(netWorth, true)}
          </span>
          <span className="text-[10px] text-emerald-400 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +6.4% this month
          </span>
        </div>

        <div className="p-4 rounded-3xl bg-neutral-900/90 border border-neutral-800/80 shadow-md">
          <span className="text-[11px] text-neutral-400 block font-medium">Liquid Cash</span>
          <span className="text-lg sm:text-xl font-extrabold text-emerald-400 font-mono mt-1 block">
            {formatCurrency(totalLiquidCash, true)}
          </span>
          <span className="text-[10px] text-neutral-500 mt-1 block">Checking, savings & cash</span>
        </div>

        <div className="p-4 rounded-3xl bg-neutral-900/90 border border-neutral-800/80 shadow-md">
          <span className="text-[11px] text-neutral-400 block font-medium">Equities & Crypto</span>
          <span className="text-lg sm:text-xl font-extrabold text-cyan-400 font-mono mt-1 block">
            {formatCurrency(totalInvestments + totalCrypto, true)}
          </span>
          <span className="text-[10px] text-cyan-400/80 mt-1 block">Brokerage & crypto wallets</span>
        </div>

        <div className="p-4 rounded-3xl bg-neutral-900/90 border border-neutral-800/80 shadow-md">
          <span className="text-[11px] text-neutral-400 block font-medium">Total Liabilities</span>
          <span className="text-lg sm:text-xl font-extrabold text-rose-400 font-mono mt-1 block">
            -{formatCurrency(totalLiabilities, true)}
          </span>
          <span className="text-[10px] text-rose-400/80 mt-1 block">Mortgage & credit balances</span>
        </div>
      </div>

      {/* Main 2-Column Responsive Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column (5 cols on lg): Live Market Watchlist + Asset Allocation */}
        <div className="lg:col-span-5 space-y-5">
          {/* Market Watchlist Card */}
          <div className="rounded-3xl bg-neutral-900/90 border border-neutral-800/80 p-4 sm:p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <h3 className="text-sm font-bold text-neutral-100">Live Market Watchlist</h3>
              </div>

              {/* Filter Tabs */}
              <div className="flex bg-neutral-850 p-0.5 rounded-xl border border-neutral-700/70 text-[11px]">
                <button
                  onClick={() => setMarketFilter('all')}
                  className={`px-2 py-0.5 rounded-lg font-semibold transition-all ${
                    marketFilter === 'all'
                      ? 'bg-emerald-500 text-neutral-950'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setMarketFilter('stock')}
                  className={`px-2 py-0.5 rounded-lg font-semibold transition-all ${
                    marketFilter === 'stock'
                      ? 'bg-emerald-500 text-neutral-950'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  Stocks
                </button>
                <button
                  onClick={() => setMarketFilter('crypto')}
                  className={`px-2 py-0.5 rounded-lg font-semibold transition-all ${
                    marketFilter === 'crypto'
                      ? 'bg-emerald-500 text-neutral-950'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  Crypto
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {filteredQuotes.map((q) => {
                const isPos = q.changePercent >= 0;
                return (
                  <div
                    key={q.symbol}
                    className="flex items-center justify-between p-2.5 rounded-2xl bg-neutral-850/60 border border-neutral-800/70 hover:border-neutral-700 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-neutral-800 flex items-center justify-center text-xs font-bold text-neutral-200">
                        {q.symbol.slice(0, 3)}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-neutral-100 block">{q.symbol}</span>
                        <span className="text-[10px] text-neutral-400 truncate max-w-[120px] block">
                          {q.name}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-neutral-100">
                        ${q.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </div>
                      <span
                        className={`text-[10px] font-semibold ${
                          isPos ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {isPos ? '+' : ''}
                        {q.changePercent}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (7 cols on lg): Detailed Holdings & Liabilities */}
        <div className="lg:col-span-7 space-y-5">
          {/* Asset Holdings Card */}
          <div className="rounded-3xl bg-neutral-900/90 border border-neutral-800/80 p-4 sm:p-5 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-neutral-100">Asset Holdings</h3>
              <span className="text-xs text-neutral-400 font-mono">
                {assets.length} items logged
              </span>
            </div>

            <div className="space-y-2.5">
              {assets.map((asset) => {
                const Icon = getAssetCategoryIcon(asset.category);
                const gain = asset.currentValue - asset.costBasis;
                const gainPct =
                  asset.costBasis > 0 ? (gain / asset.costBasis) * 100 : 0;
                const isGainPos = gain >= 0;

                return (
                  <div
                    key={asset.id}
                    className="p-3.5 rounded-2xl bg-neutral-850/60 border border-neutral-800/70 hover:border-neutral-700 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-neutral-800 flex items-center justify-center text-emerald-400">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-neutral-100">
                              {asset.name}
                            </span>
                            {asset.symbol && (
                              <span className="text-[10px] uppercase font-bold text-neutral-400 font-mono px-1.5 py-0.2 rounded bg-neutral-800">
                                {asset.symbol}
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-neutral-400 mt-0.5">
                            Cost Basis: {formatCurrency(asset.costBasis)} •{' '}
                            <span
                              className={`font-semibold ${
                                isGainPos ? 'text-emerald-400' : 'text-rose-400'
                              }`}
                            >
                              {isGainPos ? '+' : ''}
                              {gainPct.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-sm font-bold font-mono text-neutral-100">
                            {formatCurrency(asset.currentValue, true)}
                          </div>
                          <span
                            className={`text-[10px] font-mono ${
                              isGainPos ? 'text-emerald-400' : 'text-rose-400'
                            }`}
                          >
                            {isGainPos ? '+' : ''}
                            {formatCurrency(gain)}
                          </span>
                        </div>
                        <button
                          onClick={() => deleteAsset(asset.id)}
                          className="p-1.5 rounded-lg text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Liabilities & Debt */}
          <div className="rounded-3xl bg-neutral-900/90 border border-neutral-800/80 p-4 sm:p-5 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <h3 className="text-sm font-bold text-neutral-100">Liabilities & Debts</h3>
              </div>
              <span className="text-xs text-rose-400 font-mono font-bold">
                Total: -{formatCurrency(totalLiabilities)}
              </span>
            </div>

            <div className="space-y-2.5">
              {liabilities.map((liab) => (
                <div
                  key={liab.id}
                  className="p-3.5 rounded-2xl bg-neutral-850/60 border border-neutral-800/70 flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-neutral-100">{liab.name}</div>
                    <div className="text-[10px] text-neutral-400 mt-0.5">
                      {liab.lender} • Interest: <strong className="text-amber-400 font-mono">{liab.interestRate}% APR</strong> • Min: ${liab.minimumMonthlyPayment}/mo
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold font-mono text-rose-400">
                      -{formatCurrency(liab.totalBalance)}
                    </div>
                    <span className="text-[10px] text-neutral-500">Due Day {liab.dueDate}th</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
