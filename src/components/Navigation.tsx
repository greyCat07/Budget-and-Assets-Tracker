import React, { useState } from 'react';
import {
  LayoutDashboard,
  PieChart,
  CalendarDays,
  TrendingUp,
  ReceiptText,
  Sparkles,
  FileSpreadsheet,
  Bell,
  Lock,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Smartphone,
  Maximize2,
  CloudOff,
  Settings,
  Flame,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
  Building2,
  Download
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { ActiveTab } from '../types';

interface NavigationProps {
  onOpenNotifications: () => void;
  onOpenSettings: () => void;
  onOpenAddTx?: () => void;
  onOpenBankSync?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  onOpenNotifications,
  onOpenSettings,
  onOpenAddTx,
  onOpenBankSync,
}) => {
  const {
    activeTab,
    setActiveTab,
    darkMode,
    setDarkMode,
    biometricState,
    lockApp,
    togglePrivacyMode,
    notifications,
    syncState,
    mobileFrameMode,
    setMobileFrameMode,
    netWorth,
    currentPeriodInfo,
    formatCurrency,
    currencySymbol,
  } = useFinance();

  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  const desktopNavItems: {
    id: ActiveTab;
    label: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: 'dashboard', label: 'Dashboard', description: 'Overview & Key Metrics', icon: LayoutDashboard },
    { id: 'budget', label: 'Budgeting', description: 'Semi-Monthly Cycles', icon: PieChart },
    { id: 'calendar', label: 'Bills & Calendar', description: 'Due Dates & Forecast', icon: CalendarDays },
    { id: 'assets', label: 'Assets & Wealth', description: 'Equities, Crypto & Debts', icon: TrendingUp },
    { id: 'transactions', label: 'Transactions', description: 'Ledger & Search', icon: ReceiptText },
    { id: 'insights', label: 'AI Advisor', description: 'Behavior & Smart Tips', icon: Sparkles },
    { id: 'reports', label: 'Reports & CSV', description: 'Monthly Tax Audits', icon: FileSpreadsheet },
  ];

  // Mobile Bottom Tabs (5 cleanly spaced items)
  const mobileCoreTabs: {
    id: ActiveTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'budget', label: 'Budget', icon: PieChart },
    { id: 'calendar', label: 'Bills', icon: CalendarDays },
    { id: 'assets', label: 'Assets', icon: TrendingUp },
  ];

  const isMoreTabActive = ['transactions', 'insights', 'reports'].includes(activeTab);

  const handleSelectTab = (tabId: ActiveTab) => {
    setActiveTab(tabId);
    setIsMoreMenuOpen(false);
  };

  return (
    <>
      {/* ============================================================ */}
      {/* 1. DESKTOP SIDEBAR (Visible on lg+ when in responsive mode) */}
      {/* ============================================================ */}
      {mobileFrameMode === 'responsive' && (
        <aside
          id="desktop-sidebar-navigation"
          className="hidden lg:flex fixed top-0 left-0 bottom-0 w-64 flex-col justify-between bg-neutral-900/95 dark:bg-[#0e1117]/95 backdrop-blur-xl border-r border-neutral-800/80 p-4 z-40 select-none shadow-xl"
        >
          {/* Top Brand & Status */}
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800/70 px-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-neutral-950 font-black text-base shadow-lg shadow-emerald-500/20">
                  {currencySymbol}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-neutral-100 tracking-tight">
                      Vault Finance
                    </span>
                    <span className="text-[9px] uppercase font-extrabold px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                      Pro
                    </span>
                  </div>
                  <div className="text-[11px] text-neutral-400 flex items-center gap-1.5 mt-0.5">
                    {syncState.isOnline ? (
                      <span className="flex items-center gap-1 text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Live Cloud Sync
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-amber-400">
                        <CloudOff className="w-3 h-3" />
                        Offline Mode
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Balance Preview Card */}
            <div className="mt-4 p-3 rounded-2xl bg-neutral-850/60 dark:bg-neutral-900/60 border border-neutral-800/60">
              <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1">
                <span>Net Worth</span>
                <span className="text-[10px] text-emerald-400 font-medium">Safe {formatCurrency(Math.round(currentPeriodInfo.safeDailySpend))}/day</span>
              </div>
              <div className="text-base font-extrabold text-neutral-100 font-mono tracking-tight">
                {formatCurrency(netWorth, true)}
              </div>
              <div className="mt-2 pt-2 border-t border-neutral-800/60 flex items-center justify-between text-[10px] text-neutral-400">
                <span className="flex items-center gap-1">
                  <Flame className="w-3 h-3 text-amber-400" />
                  {currentPeriodInfo.periodLabel}
                </span>
                <span className="text-neutral-300 font-semibold">{currentPeriodInfo.daysRemaining}d left</span>
              </div>
            </div>

            {/* Main Navigation Links */}
            <nav className="mt-4 space-y-1">
              {desktopNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`sidebar-nav-${item.id}`}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-200 group ${
                      isActive
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                        : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center transition-colors ${
                          isActive
                            ? 'bg-emerald-500 text-neutral-950 shadow-md shadow-emerald-500/20'
                            : 'bg-neutral-800/80 text-neutral-400 group-hover:text-neutral-200'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-xs leading-none">{item.label}</div>
                        <div className="text-[10px] text-neutral-400 mt-0.5 leading-none group-hover:text-neutral-300">
                          {item.description}
                        </div>
                      </div>
                    </div>
                    {item.id === 'insights' && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Bottom Controls */}
          <div className="pt-3 border-t border-neutral-800/70 space-y-2">
            <div className="grid grid-cols-4 gap-1.5">
              {/* Privacy Mode Toggle */}
              <button
                id="sidebar-btn-privacy"
                onClick={togglePrivacyMode}
                title={biometricState.privacyMode ? 'Show Balances' : 'Hide Balances (Privacy)'}
                className={`p-2 rounded-xl border flex items-center justify-center transition-all ${
                  biometricState.privacyMode
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                    : 'bg-neutral-800/60 border-neutral-700/50 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
                }`}
              >
                {biometricState.privacyMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>

              {/* Notifications */}
              <button
                id="sidebar-btn-notifications"
                onClick={onOpenNotifications}
                title="Notification Alerts"
                className="relative p-2 rounded-xl bg-neutral-800/60 hover:bg-neutral-800 border border-neutral-700/50 text-neutral-400 hover:text-neutral-200 flex items-center justify-center transition-all"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-neutral-950 font-bold text-[9px] rounded-full flex items-center justify-center animate-bounce">
                    {unreadNotifsCount}
                  </span>
                )}
              </button>

              {/* Theme Switcher */}
              <button
                id="sidebar-btn-theme"
                onClick={() => setDarkMode(!darkMode)}
                title="Toggle Dark/Light Mode"
                className="p-2 rounded-xl bg-neutral-800/60 hover:bg-neutral-800 border border-neutral-700/50 text-neutral-400 hover:text-neutral-200 flex items-center justify-center transition-all"
              >
                {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Settings */}
              <button
                id="sidebar-btn-settings"
                onClick={onOpenSettings}
                title="Settings & Backup"
                className="p-2 rounded-xl bg-neutral-800/60 hover:bg-neutral-800 border border-neutral-700/50 text-neutral-400 hover:text-neutral-200 flex items-center justify-center transition-all"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile View Toggle & Lock App */}
            <div className="flex items-center gap-1.5 pt-1">
              <button
                id="sidebar-btn-frame-mode"
                onClick={() => setMobileFrameMode('mobile')}
                className="flex-1 py-1.5 px-2 rounded-xl bg-neutral-800/50 hover:bg-neutral-800 border border-neutral-700/50 text-[11px] font-medium text-neutral-300 flex items-center justify-center gap-1.5 transition-all"
              >
                <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                Mobile View
              </button>
              {biometricState.isEnabled && (
                <button
                  id="sidebar-btn-lock"
                  onClick={lockApp}
                  title="Lock Vault"
                  className="p-1.5 rounded-xl bg-neutral-800/50 hover:bg-neutral-800 border border-neutral-700/50 text-emerald-400 transition-all"
                >
                  <Lock className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </aside>
      )}

      {/* ============================================================ */}
      {/* 2. TOP HEADER (Mobile or Mobile Frame Mode) - ULTRA CLEAN */}
      {/* ============================================================ */}
      <header
        id="app-top-navbar"
        className={`sticky top-0 z-30 w-full bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800/60 px-3.5 py-2.5 ${
          mobileFrameMode === 'responsive' ? 'lg:hidden' : ''
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Logo & Clean Minimal Branding */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-sm text-neutral-950 font-black text-xs">
              {currencySymbol}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs text-neutral-100 tracking-tight">
                  Vault
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Minimalist 3-Action Group */}
          <div className="flex items-center gap-1">
            {/* Privacy Mode Toggle */}
            <button
              id="btn-toggle-privacy"
              onClick={togglePrivacyMode}
              title={biometricState.privacyMode ? 'Show Balances' : 'Hide Balances'}
              className={`p-1.5 rounded-xl transition-all ${
                biometricState.privacyMode
                  ? 'bg-amber-500/20 text-amber-300'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
              }`}
            >
              {biometricState.privacyMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>

            {/* Notifications Bell */}
            <button
              id="btn-notifications-drawer"
              onClick={onOpenNotifications}
              title="Notifications"
              className="relative p-1.5 rounded-xl text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60 transition-all"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifsCount > 0 && (
                <span className="absolute 0 top-0.5 right-0.5 w-2 h-2 bg-emerald-400 rounded-full ring-2 ring-neutral-950" />
              )}
            </button>

            {/* Quick Frame Switch or Settings Toggle */}
            <button
              id="btn-frame-mode"
              onClick={() =>
                setMobileFrameMode(mobileFrameMode === 'mobile' ? 'responsive' : 'mobile')
              }
              title={
                mobileFrameMode === 'mobile'
                  ? 'Switch to Wide Dashboard View'
                  : 'Switch to Mobile App View'
              }
              className="p-1.5 rounded-xl text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60 transition-all"
            >
              {mobileFrameMode === 'mobile' ? (
                <Maximize2 className="w-4 h-4 text-cyan-400" />
              ) : (
                <Smartphone className="w-4 h-4 text-cyan-400" />
              )}
            </button>

            {/* Settings & Backups */}
            <button
              id="btn-settings-modal"
              onClick={onOpenSettings}
              title="Settings & Cloud Backup"
              className="p-1.5 rounded-xl text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60 transition-all"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ============================================================ */}
      {/* 3. BOTTOM TAB BAR (Mobile screens or Mobile Frame Mode) - 5 TABS */}
      {/* ============================================================ */}
      <nav
        id="app-bottom-tabbar"
        className={`fixed bottom-0 left-0 right-0 z-30 bg-neutral-950/95 backdrop-blur-xl border-t border-neutral-800/70 px-2 py-1.5 ${
          mobileFrameMode === 'responsive' ? 'lg:hidden' : ''
        }`}
      >
        <div className="max-w-md mx-auto flex items-center justify-around">
          {mobileCoreTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`nav-tab-${tab.id}`}
                onClick={() => handleSelectTab(tab.id)}
                className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-150 ${
                  isActive
                    ? 'text-emerald-400 font-semibold'
                    : 'text-neutral-400 hover:text-neutral-300'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.2]' : 'stroke-[1.6]'}`} />
                <span className="text-[10px] mt-0.5 tracking-tight">{tab.label}</span>
                {isActive && (
                  <span className="absolute -bottom-1 w-3 h-0.5 rounded-full bg-emerald-400" />
                )}
              </button>
            );
          })}

          {/* 5th Tab: "More / Hub" */}
          <button
            id="nav-tab-more"
            onClick={() => setIsMoreMenuOpen(true)}
            className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-150 ${
              isMoreTabActive || isMoreMenuOpen
                ? 'text-emerald-400 font-semibold'
                : 'text-neutral-400 hover:text-neutral-300'
            }`}
          >
            <div className="relative">
              <Menu className={`w-5 h-5 ${isMoreTabActive ? 'stroke-[2.2]' : 'stroke-[1.6]'}`} />
              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">More</span>
            {isMoreTabActive && (
              <span className="absolute -bottom-1 w-3 h-0.5 rounded-full bg-emerald-400" />
            )}
          </button>
        </div>
      </nav>

      {/* ============================================================ */}
      {/* 4. SLEEK MOBILE "MORE" SHEET (Slide-up native sheet) */}
      {/* ============================================================ */}
      {isMoreMenuOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-fade-in select-none">
          <div
            className="w-full max-w-md bg-neutral-900 border-t border-neutral-800 rounded-t-[32px] p-5 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto"
          >
            {/* Sheet Handle & Close */}
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800/80">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold text-xs">
                  {currencySymbol}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-100">Vault Hub</h3>
                  <p className="text-[10px] text-neutral-400">Additional tools & reports</p>
                </div>
              </div>
              <button
                onClick={() => setIsMoreMenuOpen(false)}
                className="p-1.5 rounded-full bg-neutral-800 text-neutral-400 hover:text-neutral-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Navigation Items */}
            <div className="grid grid-cols-1 gap-2">
              <button
                id="more-nav-transactions"
                onClick={() => handleSelectTab('transactions')}
                className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                  activeTab === 'transactions'
                    ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                    : 'bg-neutral-850/70 border-neutral-800/70 text-neutral-200 hover:bg-neutral-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-neutral-800 flex items-center justify-center text-cyan-400">
                    <ReceiptText className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold">Transactions Ledger</div>
                    <div className="text-[10px] text-neutral-400">Search, filters & receipts</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-500" />
              </button>

              <button
                id="more-nav-insights"
                onClick={() => handleSelectTab('insights')}
                className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                  activeTab === 'insights'
                    ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                    : 'bg-neutral-850/70 border-neutral-800/70 text-neutral-200 hover:bg-neutral-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-neutral-800 flex items-center justify-center text-purple-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold flex items-center gap-1.5">
                      AI Financial Advisor
                      <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-purple-500/20 text-purple-300">Smart</span>
                    </div>
                    <div className="text-[10px] text-neutral-400">Behavior habits & tips</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-500" />
              </button>

              <button
                id="more-nav-reports"
                onClick={() => handleSelectTab('reports')}
                className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                  activeTab === 'reports'
                    ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                    : 'bg-neutral-850/70 border-neutral-800/70 text-neutral-200 hover:bg-neutral-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-neutral-800 flex items-center justify-center text-amber-400">
                    <FileSpreadsheet className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold">Reports & CSV Export</div>
                    <div className="text-[10px] text-neutral-400">Monthly tax & cycle summaries</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-500" />
              </button>
            </div>

            {/* Quick Actions Strip */}
            <div className="pt-2 border-t border-neutral-800/80">
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => {
                    setIsMoreMenuOpen(false);
                    onOpenBankSync?.();
                  }}
                  className="p-2.5 rounded-2xl bg-neutral-850 border border-neutral-800 hover:bg-neutral-800 text-center flex flex-col items-center gap-1"
                >
                  <Building2 className="w-4 h-4 text-cyan-400" />
                  <span className="text-[10px] font-medium text-neutral-300">Bank Sync</span>
                </button>

                <button
                  onClick={() => {
                    setIsMoreMenuOpen(false);
                    onOpenSettings();
                  }}
                  className="p-2.5 rounded-2xl bg-neutral-850 border border-neutral-800 hover:bg-neutral-800 text-center flex flex-col items-center gap-1"
                >
                  <Settings className="w-4 h-4 text-neutral-400" />
                  <span className="text-[10px] font-medium text-neutral-300">Settings</span>
                </button>

                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2.5 rounded-2xl bg-neutral-850 border border-neutral-800 hover:bg-neutral-800 text-center flex flex-col items-center gap-1"
                >
                  {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-neutral-400" />}
                  <span className="text-[10px] font-medium text-neutral-300">Theme</span>
                </button>
              </div>
            </div>

            {/* Vault Security Status */}
            {biometricState.isEnabled && (
              <div className="flex items-center justify-between p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
                <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                  <ShieldCheck className="w-4 h-4" /> Biometric Guard Active
                </span>
                <button
                  onClick={() => {
                    setIsMoreMenuOpen(false);
                    lockApp();
                  }}
                  className="text-neutral-300 hover:text-white font-semibold underline text-[11px]"
                >
                  Lock Now
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

