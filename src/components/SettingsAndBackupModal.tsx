import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Settings,
  X,
  Fingerprint,
  ShieldCheck,
  Bell,
  Cloud,
  Download,
  Upload,
  RefreshCw,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Smartphone,
  CheckCircle2,
  KeyRound,
  RotateCcw,
  Check
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

interface SettingsAndBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsAndBackupModal: React.FC<SettingsAndBackupModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    biometricState,
    enableBiometrics,
    disableBiometrics,
    setPin,
    togglePrivacyMode,
    alertSettings,
    updateAlertSettings,
    syncState,
    triggerCloudBackup,
    restoreCloudBackup,
    exportLocalJson,
    importLocalJson,
    resetToDefaultData,
    currency,
    setCurrency,
    darkMode,
    setDarkMode,
    mobileFrameMode,
    setMobileFrameMode,
  } = useFinance();

  const [newPin, setNewPin] = useState('');
  const [pinSuccess, setPinSuccess] = useState(false);
  const [backupLoading, setBackupLoading] = useState(false);
  const [restoreLoading, setRestoreLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  if (!isOpen) return null;

  const handleToggleBiometrics = async () => {
    if (biometricState.isEnabled) {
      disableBiometrics();
      setFeedbackMsg('Biometric authentication disabled.');
    } else {
      const ok = await enableBiometrics();
      if (ok) {
        setFeedbackMsg('Biometric authentication enabled!');
      } else {
        setFeedbackMsg('Biometrics configured with PIN security.');
      }
    }
  };

  const handleUpdatePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length === 4) {
      setPin(newPin);
      setPinSuccess(true);
      setNewPin('');
      setTimeout(() => setPinSuccess(false), 2500);
    }
  };

  const handleCloudBackup = async () => {
    setBackupLoading(true);
    await triggerCloudBackup();
    setBackupLoading(false);
    setFeedbackMsg('Cloud backup synchronized successfully!');
    setTimeout(() => setFeedbackMsg(''), 3000);
  };

  const handleCloudRestore = async () => {
    setRestoreLoading(true);
    const ok = await restoreCloudBackup();
    setRestoreLoading(false);
    if (ok) {
      setFeedbackMsg('Data successfully restored from cloud backup!');
    } else {
      setFeedbackMsg('No cloud backup found on server.');
    }
    setTimeout(() => setFeedbackMsg(''), 3000);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const ok = importLocalJson(content);
        if (ok) {
          setFeedbackMsg('JSON snapshot imported successfully!');
        } else {
          setFeedbackMsg('Failed to parse JSON snapshot file.');
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div
      id="settings-and-backup-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/85 backdrop-blur-md p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-5"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-neutral-800 text-neutral-400 hover:text-neutral-200"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-neutral-100">Settings & Security</h3>
            <p className="text-xs text-neutral-400">
              Biometrics, notification thresholds & seamless cloud backup
            </p>
          </div>
        </div>

        {feedbackMsg && (
          <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-400 font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* 1. Biometric Security & Vault */}
        <div className="p-4 rounded-2xl bg-neutral-850 border border-neutral-800 space-y-3">
          <div className="flex items-center gap-2">
            <Fingerprint className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-200">
              Biometric Security & Vault
            </h4>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div>
              <span className="text-xs font-semibold text-neutral-100 block">
                Face ID / Touch ID Lock
              </span>
              <span className="text-[11px] text-neutral-400">
                Require biometric authentication on app launch
              </span>
            </div>
            <button
              id="btn-toggle-biometrics"
              onClick={handleToggleBiometrics}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                biometricState.isEnabled ? 'bg-emerald-500' : 'bg-neutral-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  biometricState.isEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
            <div>
              <span className="text-xs font-semibold text-neutral-100 block">Privacy Mode</span>
              <span className="text-[11px] text-neutral-400">Mask balances in public places</span>
            </div>
            <button
              id="btn-privacy-toggle"
              onClick={togglePrivacyMode}
              className={`p-1.5 rounded-xl border ${
                biometricState.privacyMode
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                  : 'bg-neutral-800 text-neutral-400 border-neutral-700'
              }`}
            >
              {biometricState.privacyMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Change PIN */}
          <form onSubmit={handleUpdatePin} className="pt-2 border-t border-neutral-800 flex gap-2 items-center">
            <div className="flex-1">
              <label className="text-[11px] text-neutral-400 block mb-1">Set 4-Digit Security PIN</label>
              <input
                type="password"
                maxLength={4}
                placeholder="New 4-digit PIN"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                className="w-full px-3 py-1.5 bg-neutral-800 border border-neutral-700 rounded-xl text-xs font-mono text-neutral-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <button
              type="submit"
              disabled={newPin.length !== 4}
              className="mt-4 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-neutral-950 font-bold text-xs transition-all"
            >
              {pinSuccess ? 'Saved ✓' : 'Update PIN'}
            </button>
          </form>
        </div>

        {/* 2. Customizable Budget Notification Alerts */}
        <div className="p-4 rounded-2xl bg-neutral-850 border border-neutral-800 space-y-3">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-200">
              Customizable Notification Alerts
            </h4>
          </div>

          <div className="space-y-2.5 text-xs">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-neutral-300">80% Semi-Monthly Threshold Warning</span>
              <input
                type="checkbox"
                checked={alertSettings.threshold80Alert}
                onChange={(e) => updateAlertSettings({ threshold80Alert: e.target.checked })}
                className="rounded text-emerald-500 focus:ring-emerald-500 w-4 h-4 bg-neutral-800 border-neutral-700"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-neutral-300">100% Budget Overrun Alert</span>
              <input
                type="checkbox"
                checked={alertSettings.threshold100Alert}
                onChange={(e) => updateAlertSettings({ threshold100Alert: e.target.checked })}
                className="rounded text-emerald-500 focus:ring-emerald-500 w-4 h-4 bg-neutral-800 border-neutral-700"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-neutral-300">Scheduled Bill Due Reminders</span>
              <input
                type="checkbox"
                checked={alertSettings.billDueReminders}
                onChange={(e) => updateAlertSettings({ billDueReminders: e.target.checked })}
                className="rounded text-emerald-500 focus:ring-emerald-500 w-4 h-4 bg-neutral-800 border-neutral-700"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-neutral-300">Large Transaction Flag (&gt; $100)</span>
              <input
                type="checkbox"
                checked={alertSettings.largeTxAlert}
                onChange={(e) => updateAlertSettings({ largeTxAlert: e.target.checked })}
                className="rounded text-emerald-500 focus:ring-emerald-500 w-4 h-4 bg-neutral-800 border-neutral-700"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-neutral-300">Market Volatility Moves (&gt; 3% swing)</span>
              <input
                type="checkbox"
                checked={alertSettings.marketVolatilityAlert}
                onChange={(e) => updateAlertSettings({ marketVolatilityAlert: e.target.checked })}
                className="rounded text-emerald-500 focus:ring-emerald-500 w-4 h-4 bg-neutral-800 border-neutral-700"
              />
            </label>
          </div>
        </div>

        {/* 3. Offline Sync & Cloud Backups */}
        <div className="p-4 rounded-2xl bg-neutral-850 border border-neutral-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cloud className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-200">
                Cloud Backup & Offline Sync
              </h4>
            </div>
            <span className="text-[10px] text-neutral-400 font-mono">
              Last: {syncState.lastBackupTimestamp || 'Not synced'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              id="btn-cloud-backup"
              onClick={handleCloudBackup}
              disabled={backupLoading}
              className="py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-500/20"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${backupLoading ? 'animate-spin' : ''}`} />
              Backup to Cloud
            </button>
            <button
              id="btn-cloud-restore"
              onClick={handleCloudRestore}
              disabled={restoreLoading}
              className="py-2 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-750 text-neutral-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-neutral-700 transition-all"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${restoreLoading ? 'animate-spin' : ''}`} />
              Restore Cloud Data
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-800">
            <button
              onClick={exportLocalJson}
              className="py-2 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-750 text-neutral-300 font-semibold text-xs flex items-center justify-center gap-1.5 border border-neutral-700"
            >
              <Download className="w-3.5 h-3.5" />
              Export JSON File
            </button>
            <label className="py-2 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-750 text-neutral-300 font-semibold text-xs flex items-center justify-center gap-1.5 border border-neutral-700 cursor-pointer text-center">
              <Upload className="w-3.5 h-3.5" />
              <span>Import JSON File</span>
              <input type="file" accept=".json" onChange={handleFileImport} className="hidden" />
            </label>
          </div>
        </div>

        {/* 4. Display Preferences */}
        <div className="p-4 rounded-2xl bg-neutral-850 border border-neutral-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-200">Default Currency</span>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="px-2.5 py-1 bg-neutral-800 border border-neutral-700 rounded-xl text-xs text-neutral-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="PHP">PHP (₱ - Philippine Peso)</option>
              <option value="USD">USD ($ - US Dollar)</option>
              <option value="EUR">EUR (€ - Euro)</option>
              <option value="GBP">GBP (£ - British Pound)</option>
              <option value="CAD">CAD (CA$ - Canadian Dollar)</option>
              <option value="AUD">AUD (A$ - Australian Dollar)</option>
              <option value="JPY">JPY (¥ - Japanese Yen)</option>
              <option value="MXN">MXN (Mex$ - Mexican Peso)</option>
              <option value="INR">INR (₹ - Indian Rupee)</option>
              <option value="SGD">SGD (S$ - Singapore Dollar)</option>
            </select>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
            <span className="text-xs font-semibold text-neutral-200">Color Theme</span>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-3 py-1 bg-neutral-800 border border-neutral-700 rounded-xl text-xs text-neutral-200 flex items-center gap-1.5"
            >
              {darkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
              <span>{darkMode ? 'Dark Mode' : 'Light Mode'}</span>
            </button>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
            <div>
              <span className="text-xs font-semibold text-neutral-200 block">Layout Framing</span>
              <span className="text-[10px] text-neutral-400">Mobile device canvas frame</span>
            </div>
            <button
              onClick={() =>
                setMobileFrameMode(mobileFrameMode === 'mobile' ? 'responsive' : 'mobile')
              }
              className="px-3 py-1 bg-neutral-800 border border-neutral-700 rounded-xl text-xs text-neutral-200 flex items-center gap-1.5"
            >
              <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
              <span>{mobileFrameMode === 'mobile' ? 'Mobile App Frame' : 'Full Width'}</span>
            </button>
          </div>
        </div>

        {/* Reset Database */}
        <div className="pt-2 text-center">
          <button
            onClick={() => {
              if (confirm('Reset all financial records back to seed data?')) {
                resetToDefaultData();
                setFeedbackMsg('Application reset to factory defaults.');
              }
            }}
            className="text-[11px] text-rose-400 hover:text-rose-300 font-medium underline underline-offset-4"
          >
            Reset Sandbox State to Defaults
          </button>
        </div>
      </motion.div>
    </div>
  );
};
