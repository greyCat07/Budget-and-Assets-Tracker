import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Landmark,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  RefreshCw,
  X,
  AlertCircle,
  Building,
  Key
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

interface BankSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BankSyncModal: React.FC<BankSyncModalProps> = ({ isOpen, onClose }) => {
  const { syncBankAccounts } = useFinance();
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [step, setStep] = useState<'select' | 'auth' | 'syncing' | 'success'>('select');
  const [username, setUsername] = useState('alex.morgan');
  const [password, setPassword] = useState('••••••••••••');

  const institutions = [
    { id: 'chase', name: 'Chase Bank', logo: '🏛️', color: '#117ACA' },
    { id: 'bofa', name: 'Bank of America', logo: '🏦', color: '#E31837' },
    { id: 'fidelity', name: 'Fidelity Investments', logo: '📈', color: '#3A7D44' },
    { id: 'coinbase', name: 'Coinbase Exchange', logo: '🪙', color: '#0052FF' },
    { id: 'wells', name: 'Wells Fargo', logo: '🐎', color: '#D71E28' },
    { id: 'capitalone', name: 'Capital One', logo: '💳', color: '#004879' },
    { id: 'ally', name: 'Ally Financial', logo: '💜', color: '#6A2A82' },
    { id: 'vanguard', name: 'Vanguard', logo: '⛵', color: '#971B2F' },
  ];

  const handleStartAuth = (bankName: string) => {
    setSelectedBank(bankName);
    setStep('auth');
  };

  const handleConnect = async () => {
    setStep('syncing');
    await syncBankAccounts();
    setStep('success');
  };

  const handleDone = () => {
    setStep('select');
    setSelectedBank(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      id="bank-sync-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/85 backdrop-blur-md p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl relative"
      >
        <button
          onClick={handleDone}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-neutral-800 text-neutral-400 hover:text-neutral-200"
        >
          <X className="w-4 h-4" />
        </button>

        {step === 'select' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Landmark className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-neutral-100">Connect Financial Account</h3>
                <p className="text-xs text-neutral-400">
                  End-to-end 256-bit encrypted Open Banking protocol
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 max-h-72 overflow-y-auto py-1">
              {institutions.map((inst) => (
                <button
                  key={inst.id}
                  id={`bank-select-${inst.id}`}
                  onClick={() => handleStartAuth(inst.name)}
                  className="p-3 rounded-2xl bg-neutral-850 hover:bg-neutral-800 border border-neutral-800 hover:border-emerald-500/40 flex items-center gap-2.5 transition-all text-left group"
                >
                  <span className="text-lg">{inst.logo}</span>
                  <div>
                    <span className="text-xs font-bold text-neutral-200 group-hover:text-emerald-400 transition-colors block">
                      {inst.name}
                    </span>
                    <span className="text-[10px] text-neutral-500">Instant Sync</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="p-3 rounded-2xl bg-neutral-850 border border-neutral-800 flex items-center gap-2 text-[11px] text-neutral-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>We never store raw banking credentials. Read-only tokenized sync.</span>
            </div>
          </div>
        )}

        {step === 'auth' && (
          <div className="space-y-4">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-2">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-neutral-100">
                Authenticate with {selectedBank}
              </h3>
              <p className="text-xs text-neutral-400">Enter your credentials to link accounts</p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">User ID / Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3.5 py-2 bg-neutral-800 border border-neutral-700 rounded-xl text-xs text-neutral-100 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2 bg-neutral-800 border border-neutral-700 rounded-xl text-xs text-neutral-100 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setStep('select')}
                className="flex-1 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-neutral-300"
              >
                Back
              </button>
              <button
                id="btn-confirm-bank-auth"
                onClick={handleConnect}
                className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all"
              >
                Authorize & Link
              </button>
            </div>
          </div>
        )}

        {step === 'syncing' && (
          <div className="py-8 text-center space-y-4">
            <RefreshCw className="w-10 h-10 text-emerald-400 animate-spin mx-auto" />
            <div>
              <h3 className="text-base font-bold text-neutral-100">Fetching Transactions & Balances</h3>
              <p className="text-xs text-neutral-400 mt-1">
                Syncing with {selectedBank} secure API...
              </p>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="py-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-100">Account Linked & Synced!</h3>
              <p className="text-xs text-neutral-400 mt-1">
                Your balances and latest 3 cleared transactions were synced successfully into your ledger.
              </p>
            </div>
            <button
              id="btn-bank-sync-done"
              onClick={handleDone}
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all"
            >
              Back to Dashboard
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
