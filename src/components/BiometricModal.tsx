import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Fingerprint, Lock, ShieldCheck, KeyRound, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

export const BiometricModal: React.FC = () => {
  const { biometricState, unlockWithBiometrics, unlockWithPin } = useFinance();
  const [pinInput, setPinInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [authMode, setAuthMode] = useState<'biometric' | 'pin'>('biometric');

  // Trigger biometric prompt when locked
  useEffect(() => {
    if (biometricState.isLocked && biometricState.isEnabled) {
      handleBiometricScan();
    }
  }, [biometricState.isLocked, biometricState.isEnabled]);

  const handleBiometricScan = async () => {
    setIsScanning(true);
    setErrorMsg('');
    try {
      const success = await unlockWithBiometrics();
      if (!success) {
        setErrorMsg('Biometric verification failed. Please enter your PIN.');
        setAuthMode('pin');
      }
    } catch {
      setErrorMsg('Biometric sensor unavailable. Please use PIN.');
      setAuthMode('pin');
    } finally {
      setIsScanning(false);
    }
  };

  const handlePinKey = (digit: string) => {
    if (pinInput.length < 4) {
      const next = pinInput + digit;
      setPinInput(next);
      setErrorMsg('');

      if (next.length === 4) {
        const success = unlockWithPin(next);
        if (!success) {
          setErrorMsg('Incorrect PIN. Please try again.');
          setPinInput('');
        } else {
          setPinInput('');
        }
      }
    }
  };

  const handleBackspace = () => {
    setPinInput((prev) => prev.slice(0, -1));
    setErrorMsg('');
  };

  if (!biometricState.isLocked) return null;

  return (
    <div
      id="biometric-security-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/95 backdrop-blur-xl p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-3xl p-6 text-center shadow-2xl"
      >
        {/* App Lock Brand */}
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
          {authMode === 'biometric' ? (
            <Fingerprint className="w-8 h-8 animate-pulse" />
          ) : (
            <KeyRound className="w-8 h-8 text-emerald-400" />
          )}
        </div>

        <h2 className="text-xl font-bold text-neutral-100 tracking-tight">
          Personal Finance Vault
        </h2>
        <p className="text-xs text-neutral-400 mt-1 mb-6">
          {authMode === 'biometric'
            ? 'Touch ID / Face ID Biometric Security'
            : 'Enter 4-Digit Security PIN'}
        </p>

        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-1.5 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 py-2 px-3 rounded-xl mb-4"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </motion.div>
        )}

        {authMode === 'biometric' ? (
          <div className="flex flex-col items-center py-4 space-y-6">
            <button
              id="btn-trigger-scan"
              onClick={handleBiometricScan}
              disabled={isScanning}
              className="relative group p-6 rounded-full bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700 transition-all active:scale-95"
            >
              <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping opacity-75" />
              <Fingerprint className="w-12 h-12 text-emerald-400 group-hover:scale-110 transition-transform" />
            </button>

            <span className="text-xs text-neutral-300 font-medium">
              {isScanning ? 'Verifying biometrics...' : 'Tap sensor or Face ID to unlock'}
            </span>

            <button
              id="btn-switch-to-pin"
              onClick={() => setAuthMode('pin')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium underline underline-offset-4"
            >
              Use 4-digit PIN fallback
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* PIN Dots */}
            <div className="flex justify-center gap-4 my-2">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${
                    pinInput.length > i
                      ? 'bg-emerald-400 scale-110 shadow-lg shadow-emerald-500/50'
                      : 'bg-neutral-700 border border-neutral-600'
                  }`}
                />
              ))}
            </div>

            {/* Keypad */}
            <div className="grid grid-cols-3 gap-3 max-w-[240px] mx-auto">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                <button
                  key={num}
                  id={`pin-key-${num}`}
                  onClick={() => handlePinKey(num)}
                  className="h-12 rounded-2xl bg-neutral-800/70 hover:bg-neutral-700 text-lg font-semibold text-neutral-100 active:scale-90 transition-all border border-neutral-700/60"
                >
                  {num}
                </button>
              ))}
              <button
                id="btn-switch-to-bio"
                onClick={() => setAuthMode('biometric')}
                className="h-12 rounded-2xl bg-neutral-800/40 hover:bg-neutral-800 text-neutral-400 flex items-center justify-center text-xs"
              >
                <Fingerprint className="w-5 h-5" />
              </button>
              <button
                id="pin-key-0"
                onClick={() => handlePinKey('0')}
                className="h-12 rounded-2xl bg-neutral-800/70 hover:bg-neutral-700 text-lg font-semibold text-neutral-100 active:scale-90 transition-all border border-neutral-700/60"
              >
                0
              </button>
              <button
                id="pin-key-backspace"
                onClick={handleBackspace}
                className="h-12 rounded-2xl bg-neutral-800/40 hover:bg-neutral-800 text-neutral-400 flex items-center justify-center text-xs font-medium"
              >
                Del
              </button>
            </div>

            <p className="text-[11px] text-neutral-500">Default Sandbox PIN is <span className="font-mono text-neutral-300">1234</span></p>
          </div>
        )}
      </motion.div>
    </div>
  );
};
