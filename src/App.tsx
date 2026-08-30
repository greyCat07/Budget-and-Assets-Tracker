import React, { useState } from 'react';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import { Navigation } from './components/Navigation';
import { DashboardView } from './components/DashboardView';
import { SemiMonthlyBudgetView } from './components/SemiMonthlyBudgetView';
import { BillCalendarView } from './components/BillCalendarView';
import { AssetPortfolioView } from './components/AssetPortfolioView';
import { TransactionsView } from './components/TransactionsView';
import { AIInsightsView } from './components/AIInsightsView';
import { ReportsAndExportView } from './components/ReportsAndExportView';
import { BiometricModal } from './components/BiometricModal';
import { BankSyncModal } from './components/BankSyncModal';
import { AddTransactionModal } from './components/AddTransactionModal';
import { AddBillModal } from './components/AddBillModal';
import { AddAssetModal } from './components/AddAssetModal';
import { SettingsAndBackupModal } from './components/SettingsAndBackupModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { Wifi, Battery, Signal } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { activeTab, mobileFrameMode, darkMode } = useFinance();

  const [isBankSyncOpen, setIsBankSyncOpen] = useState(false);
  const [isAddTxOpen, setIsAddTxOpen] = useState(false);
  const [isAddBillOpen, setIsAddBillOpen] = useState(false);
  const [isAddAssetOpen, setIsAddAssetOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        darkMode ? 'dark bg-[#0a0c10] text-neutral-100' : 'bg-slate-50 text-neutral-900'
      } flex flex-col items-center justify-start`}
    >
      {/* Navigation (Desktop Sidebar + Mobile Top/Bottom Bars) */}
      <Navigation
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAddTx={() => setIsAddTxOpen(true)}
        onOpenBankSync={() => setIsBankSyncOpen(true)}
      />

      {/* Main Content Area */}
      <div
        className={`w-full transition-all duration-300 ${
          mobileFrameMode === 'mobile'
            ? 'max-w-md my-0 sm:my-6 sm:border sm:border-neutral-800 sm:rounded-[40px] sm:shadow-2xl sm:overflow-hidden bg-neutral-950 min-h-[90vh]'
            : 'lg:pl-64 w-full min-h-screen'
        }`}
      >
        {/* Mobile Device Native Status Header (Only for Mobile Frame Mockup) */}
        {mobileFrameMode === 'mobile' && (
          <div className="bg-neutral-950 px-6 pt-3 pb-1 flex items-center justify-between text-[11px] font-semibold text-neutral-400 select-none">
            <span className="font-mono text-neutral-300">{currentTime}</span>
            {/* Dynamic Island Pill */}
            <div className="w-20 h-4 bg-neutral-900 rounded-full flex items-center justify-center gap-1 border border-neutral-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[8px] font-bold text-neutral-400 uppercase tracking-tighter">Vault</span>
            </div>
            <div className="flex items-center gap-1.5 text-neutral-300">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <Battery className="w-3.5 h-3.5" />
            </div>
          </div>
        )}

        {/* Dynamic View Container */}
        <main
          className={`${
            mobileFrameMode === 'mobile'
              ? 'p-3 sm:p-4 pb-28 min-h-[calc(100vh-100px)]'
              : 'max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 pb-24 lg:pb-12'
          }`}
        >
          {activeTab === 'dashboard' && (
            <DashboardView
              onOpenAddTx={() => setIsAddTxOpen(true)}
              onOpenBankSync={() => setIsBankSyncOpen(true)}
              onOpenAddBill={() => setIsAddBillOpen(true)}
              onOpenAdvisorChat={() => {}}
            />
          )}
          {activeTab === 'budget' && <SemiMonthlyBudgetView />}
          {activeTab === 'calendar' && (
            <BillCalendarView onOpenAddBill={() => setIsAddBillOpen(true)} />
          )}
          {activeTab === 'assets' && (
            <AssetPortfolioView onOpenAddAsset={() => setIsAddAssetOpen(true)} />
          )}
          {activeTab === 'transactions' && (
            <TransactionsView
              onOpenAddTx={() => setIsAddTxOpen(true)}
              onOpenBankSync={() => setIsBankSyncOpen(true)}
            />
          )}
          {activeTab === 'insights' && <AIInsightsView />}
          {activeTab === 'reports' && <ReportsAndExportView />}
        </main>
      </div>

      {/* Global Security & Feature Modals */}
      <BiometricModal />
      <BankSyncModal isOpen={isBankSyncOpen} onClose={() => setIsBankSyncOpen(false)} />
      <AddTransactionModal isOpen={isAddTxOpen} onClose={() => setIsAddTxOpen(false)} />
      <AddBillModal isOpen={isAddBillOpen} onClose={() => setIsAddBillOpen(false)} />
      <AddAssetModal isOpen={isAddAssetOpen} onClose={() => setIsAddAssetOpen(false)} />
      <SettingsAndBackupModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <FinanceProvider>
      <MainAppContent />
    </FinanceProvider>
  );
}
