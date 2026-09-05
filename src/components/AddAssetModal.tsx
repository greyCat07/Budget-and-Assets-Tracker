import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  TrendingUp,
  X,
  DollarSign,
  Briefcase,
  Bitcoin,
  Building,
  Car
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { AssetCategory } from '../types';

interface AddAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddAssetModal: React.FC<AddAssetModalProps> = ({ isOpen, onClose }) => {
  const { addAsset, currencySymbol } = useFinance();

  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [category, setCategory] = useState<AssetCategory>('stock');
  const [currentValue, setCurrentValue] = useState('');
  const [costBasis, setCostBasis] = useState('');
  const [quantity, setQuantity] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(currentValue);
    const basis = parseFloat(costBasis) || val;
    if (!name.trim() || isNaN(val) || val < 0) return;

    addAsset({
      name: name.trim(),
      symbol: symbol.trim().toUpperCase() || undefined,
      category,
      currentValue: val,
      costBasis: basis,
      quantity: quantity ? parseFloat(quantity) : undefined,
      currency: 'USD',
    });

    setName('');
    setSymbol('');
    setCurrentValue('');
    setCostBasis('');
    setQuantity('');
    onClose();
  };

  return (
    <div
      id="add-asset-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/85 backdrop-blur-md p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-5 shadow-2xl relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-neutral-800 text-neutral-400 hover:text-neutral-200"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-neutral-100">Add Asset / Investment</h3>
            <p className="text-xs text-neutral-400">Track equity, crypto, real estate, or collectibles</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="text-xs font-semibold text-neutral-300 block mb-1">Asset Name</label>
            <input
              type="text"
              placeholder="e.g., Apple Inc, Ethereum Vault, Primary Residence"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 bg-neutral-800 border border-neutral-700 rounded-xl text-xs text-neutral-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as AssetCategory)}
                className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-xl text-xs text-neutral-100 focus:outline-none focus:border-emerald-500"
              >
                <option value="stock">Stock / ETF</option>
                <option value="crypto">Cryptocurrency</option>
                <option value="real_estate">Real Estate</option>
                <option value="vehicle">Vehicle</option>
                <option value="cash">Cash Account</option>
                <option value="custom">Custom Asset</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">Symbol / Ticker</label>
              <input
                type="text"
                placeholder="e.g., AAPL, ETH"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                className="w-full px-3.5 py-2 bg-neutral-800 border border-neutral-700 rounded-xl text-xs text-neutral-100 uppercase focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">Current Value ({currencySymbol})</label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                required
                value={currentValue}
                onChange={(e) => setCurrentValue(e.target.value)}
                className="w-full px-3.5 py-2 bg-neutral-800 border border-neutral-700 rounded-xl text-xs font-mono font-bold text-neutral-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">Cost Basis ({currencySymbol})</label>
              <input
                type="number"
                step="0.01"
                placeholder="Purchase cost"
                value={costBasis}
                onChange={(e) => setCostBasis(e.target.value)}
                className="w-full px-3.5 py-2 bg-neutral-800 border border-neutral-700 rounded-xl text-xs font-mono text-neutral-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-300 block mb-1">Quantity / Shares (Optional)</label>
            <input
              type="number"
              step="any"
              placeholder="e.g., 25, 0.45"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full px-3.5 py-2 bg-neutral-800 border border-neutral-700 rounded-xl text-xs text-neutral-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

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
              id="btn-submit-asset"
              className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all"
            >
              Add to Portfolio
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
