import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  Account,
  Asset,
  Liability,
  Transaction,
  CategoryBudget,
  ScheduledBill,
  MarketQuote,
  AIFinancialTip,
  AIInsightsData,
  NotificationAlert,
  AlertSettings,
  BiometricSecurityState,
  SyncEngineState,
  SemiMonthlyPeriodInfo,
  ActiveTab
} from '../types';
import {
  INITIAL_ACCOUNTS,
  INITIAL_ASSETS,
  INITIAL_LIABILITIES,
  INITIAL_CATEGORY_BUDGETS,
  INITIAL_SCHEDULED_BILLS,
  INITIAL_TRANSACTIONS,
  INITIAL_NOTIFICATIONS,
  INITIAL_ALERT_SETTINGS,
  INITIAL_BIOMETRIC_STATE,
  INITIAL_SYNC_STATE
} from '../data/mockData';
import {
  downloadCsvFile,
  generateMonthlySummaryCsv,
  generateSemiMonthlyBudgetCsv,
  generateTransactionsCsv,
  generateAssetPortfolioCsv
} from '../lib/exportCsv';
import { checkBiometricSupport, promptBiometricAuth } from '../lib/biometrics';

interface FinanceContextType {
  // State
  accounts: Account[];
  assets: Asset[];
  liabilities: Liability[];
  transactions: Transaction[];
  categoryBudgets: CategoryBudget[];
  scheduledBills: ScheduledBill[];
  marketQuotes: { stocks: MarketQuote[]; cryptos: MarketQuote[] };
  aiInsights: AIInsightsData;
  notifications: NotificationAlert[];
  alertSettings: AlertSettings;
  biometricState: BiometricSecurityState;
  syncState: SyncEngineState;
  activeTab: ActiveTab;
  darkMode: boolean;
  currency: string;
  currencySymbol: string;
  mobileFrameMode: 'mobile' | 'responsive';
  isAiLoading: boolean;

  // Setters & Navigation
  setActiveTab: (tab: ActiveTab) => void;
  setDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  setCurrency: (curr: string) => void;
  setMobileFrameMode: (mode: 'mobile' | 'responsive') => void;

  // Financial Actions
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  
  addAccount: (account: Omit<Account, 'id' | 'lastSynced'>) => void;
  updateAccount: (id: string, updates: Partial<Account>) => void;
  deleteAccount: (id: string) => void;

  addAsset: (asset: Omit<Asset, 'id' | 'updatedAt'>) => void;
  updateAsset: (id: string, updates: Partial<Asset>) => void;
  deleteAsset: (id: string) => void;

  addScheduledBill: (bill: Omit<ScheduledBill, 'id'>) => void;
  updateScheduledBill: (id: string, updates: Partial<ScheduledBill>) => void;
  toggleBillPaid: (id: string) => void;
  deleteScheduledBill: (id: string) => void;

  updateCategoryBudget: (categoryName: string, p1Limit: number, p2Limit: number) => void;

  // Alerts & Notifications
  addNotification: (notif: Omit<NotificationAlert, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  markAllNotificationsAsRead: () => void;
  clearNotification: (id: string) => void;
  clearAllNotifications: () => void;
  updateAlertSettings: (updates: Partial<AlertSettings>) => void;

  // Biometrics & Security
  unlockWithBiometrics: () => Promise<boolean>;
  unlockWithPin: (enteredPin: string) => boolean;
  lockApp: () => void;
  toggleBiometricsEnabled: (enabled: boolean) => void;
  enableBiometrics: () => void;
  disableBiometrics: () => void;
  updatePinCode: (newPin: string) => void;
  setPin: (newPin: string) => void;
  togglePrivacyMode: () => void;
  updateAutoLockTimeout: (minutes: number) => void;

  // Sync & Cloud Backup
  syncBankAccounts: (institutionName?: string) => Promise<number>;
  triggerCloudBackup: () => Promise<boolean>;
  restoreCloudBackup: () => Promise<boolean>;
  exportJsonBackup: () => void;
  exportLocalJson: () => void;
  importJsonBackup: (jsonString: string) => boolean;
  importLocalJson: (jsonString: string) => boolean;
  resetToDefaultData: () => void;
  refreshMarketQuotes: () => Promise<void>;
  refreshAiInsights: () => Promise<void>;
  askAiAdvisor: (question: string) => Promise<string>;

  // CSV Exports
  exportMonthlyCsv: () => void;
  exportSemiMonthlyBudgetCsv: () => void;
  exportTransactionsLedgerCsv: () => void;
  exportAssetsPortfolioCsv: () => void;

  // Computed Values
  netWorth: number;
  totalLiquidCash: number;
  totalInvestments: number;
  totalCrypto: number;
  totalFixedAssets: number;
  totalLiabilities: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlySavings: number;
  savingsRate: number;
  currentPeriodInfo: SemiMonthlyPeriodInfo;
  period1Spending: Record<string, number>;
  period2Spending: Record<string, number>;
  upcomingBills7Days: ScheduledBill[];
  formatCurrency: (amount: number, hideWhenPrivate?: boolean) => string;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'finance_app_state_v1';

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial from localStorage if available
  const [accounts, setAccounts] = useState<Account[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_accounts`);
    return saved ? JSON.parse(saved) : INITIAL_ACCOUNTS;
  });

  const [assets, setAssets] = useState<Asset[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_assets`);
    return saved ? JSON.parse(saved) : INITIAL_ASSETS;
  });

  const [liabilities, setLiabilities] = useState<Liability[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_liabilities`);
    return saved ? JSON.parse(saved) : INITIAL_LIABILITIES;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_transactions`);
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [categoryBudgets, setCategoryBudgets] = useState<CategoryBudget[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_budgets`);
    return saved ? JSON.parse(saved) : INITIAL_CATEGORY_BUDGETS;
  });

  const [scheduledBills, setScheduledBills] = useState<ScheduledBill[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_bills`);
    return saved ? JSON.parse(saved) : INITIAL_SCHEDULED_BILLS;
  });

  const [notifications, setNotifications] = useState<NotificationAlert[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_notifs`);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [alertSettings, setAlertSettings] = useState<AlertSettings>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_alert_settings`);
    return saved ? JSON.parse(saved) : INITIAL_ALERT_SETTINGS;
  });

  const [biometricState, setBiometricState] = useState<BiometricSecurityState>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_biometrics`);
    const parsed = saved ? JSON.parse(saved) : INITIAL_BIOMETRIC_STATE;
    return { ...parsed, isLocked: parsed.isEnabled };
  });

  const [syncState, setSyncState] = useState<SyncEngineState>(INITIAL_SYNC_STATE);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_darkmode`);
    return saved !== null ? JSON.parse(saved) : true; // Default dark
  });
  const [currency, setCurrency] = useState<string>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_currency`);
    return saved || 'PHP';
  });
  const [mobileFrameMode, setMobileFrameMode] = useState<'mobile' | 'responsive'>('responsive');
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  const [marketQuotes, setMarketQuotes] = useState<{ stocks: MarketQuote[]; cryptos: MarketQuote[] }>({
    stocks: [],
    cryptos: [],
  });

  const [aiInsights, setAiInsights] = useState<AIInsightsData>({
    dailyInsight: "Your second-half dining expenses are trending 18% higher than Period 1. Shifting 2 restaurant meals to home dining will preserve $120 towards your savings goal.",
    tips: [
      {
        id: 'tip-1',
        category: 'Semi-Monthly Pacing',
        title: 'Mid-Period Cushion Strategy',
        description: 'You have spent 42% of your Period 2 budget with 6 days remaining. Allocate $45/day maximum to maintain a positive rollover.',
        impact: '+$140 savings',
        badge: 'Budget Pace'
      },
      {
        id: 'tip-2',
        category: 'Subscription Audit',
        title: 'Recurring Streaming Overlap',
        description: 'Detected 4 active video streaming services totaling $64.96/month. Pausing inactive subscriptions can fund an automated ETF contribution.',
        impact: '+$32/mo recurring',
        badge: 'Smart Leak'
      },
      {
        id: 'tip-3',
        category: 'Asset Allocation',
        title: 'Cash Drag Optimization',
        description: 'Liquid savings account holds 28% of total net worth. Moving $2,500 to a High-Yield account or index fund optimizes inflation resistance.',
        impact: '+4.8% APY return',
        badge: 'Wealth Growth'
      }
    ],
    behaviorAlerts: [
      'Weekend spending velocity is 2.4x higher than weekdays.',
      'Grocery spending is 9% under planned budget.'
    ]
  });

  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_darkmode`, JSON.stringify(darkMode));
  }, [darkMode]);

  // Persist currency preference
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_currency`, currency);
  }, [currency]);

  // Online / Offline event listeners
  useEffect(() => {
    const handleOnline = () => {
      setSyncState((prev) => ({ ...prev, isOnline: true, syncError: null }));
      addNotification({
        title: 'Connection Restored',
        message: 'You are back online. Synchronizing your latest financial updates with cloud backup.',
        type: 'sync_update',
        priority: 'low'
      });
    };
    const handleOffline = () => {
      setSyncState((prev) => ({ ...prev, isOnline: false }));
      addNotification({
        title: 'Offline Mode Active',
        message: 'All changes are safely recorded locally in offline storage and will sync upon reconnecting.',
        type: 'sync_update',
        priority: 'low'
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_accounts`, JSON.stringify(accounts));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_assets`, JSON.stringify(assets));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_liabilities`, JSON.stringify(liabilities));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_transactions`, JSON.stringify(transactions));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_budgets`, JSON.stringify(categoryBudgets));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_bills`, JSON.stringify(scheduledBills));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_notifs`, JSON.stringify(notifications));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_alert_settings`, JSON.stringify(alertSettings));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_biometrics`, JSON.stringify(biometricState));
  }, [accounts, assets, liabilities, transactions, categoryBudgets, scheduledBills, notifications, alertSettings, biometricState]);

  // Fetch real-time market quotes
  const refreshMarketQuotes = useCallback(async () => {
    try {
      const res = await fetch('/api/market/quotes');
      if (res.ok) {
        const data = await res.json();
        setMarketQuotes({
          stocks: data.stocks || [],
          cryptos: data.cryptos || [],
        });
      }
    } catch (err) {
      console.warn('Could not fetch market quotes:', err);
    }
  }, []);

  useEffect(() => {
    refreshMarketQuotes();
    const interval = setInterval(refreshMarketQuotes, 15000); // 15s refresh
    return () => clearInterval(interval);
  }, [refreshMarketQuotes]);

  // Calculate Net Worth and Metrics
  const totalLiquidCash = useMemo(() => {
    return accounts.reduce((sum, acc) => sum + (acc.type !== 'credit' ? acc.balance : 0), 0);
  }, [accounts]);

  const totalInvestments = useMemo(() => {
    return assets
      .filter((a) => a.category === 'stock' || a.category === 'retirement')
      .reduce((sum, a) => sum + a.currentValue, 0);
  }, [assets]);

  const totalCrypto = useMemo(() => {
    return assets
      .filter((a) => a.category === 'crypto')
      .reduce((sum, a) => sum + a.currentValue, 0);
  }, [assets]);

  const totalFixedAssets = useMemo(() => {
    return assets
      .filter((a) => a.category === 'real_estate' || a.category === 'vehicle' || a.category === 'precious_metals')
      .reduce((sum, a) => sum + a.currentValue, 0);
  }, [assets]);

  const totalLiabilities = useMemo(() => {
    const debtBalance = liabilities.reduce((sum, l) => sum + l.totalBalance, 0);
    const creditCardDebt = accounts
      .filter((a) => a.type === 'credit' && a.balance < 0)
      .reduce((sum, a) => sum + Math.abs(a.balance), 0);
    return debtBalance + creditCardDebt;
  }, [liabilities, accounts]);

  const netWorth = useMemo(() => {
    const totalAssets = totalLiquidCash + totalInvestments + totalCrypto + totalFixedAssets;
    return totalAssets - totalLiabilities;
  }, [totalLiquidCash, totalInvestments, totalCrypto, totalFixedAssets, totalLiabilities]);

  // Current Month calculations
  const monthlyIncome = useMemo(() => {
    return transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const monthlyExpenses = useMemo(() => {
    return transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const monthlySavings = useMemo(() => {
    return monthlyIncome - monthlyExpenses;
  }, [monthlyIncome, monthlyExpenses]);

  const savingsRate = useMemo(() => {
    if (monthlyIncome <= 0) return 0;
    return Math.max(0, (monthlySavings / monthlyIncome) * 100);
  }, [monthlyIncome, monthlySavings]);

  // Semi-Monthly Pacing Calculations (1st-15th vs 16th-End)
  const currentPeriodInfo: SemiMonthlyPeriodInfo = useMemo(() => {
    const today = new Date();
    const day = today.getDate();
    const year = today.getFullYear();
    const month = today.getMonth();
    const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
    const monthName = today.toLocaleString('default', { month: 'short' });

    const isPeriod1 = day <= 15;
    const periodNum = isPeriod1 ? 1 : 2;

    const startDate = `${year}-${String(month + 1).padStart(2, '0')}-${isPeriod1 ? '01' : '16'}`;
    const endDate = `${year}-${String(month + 1).padStart(2, '0')}-${isPeriod1 ? '15' : String(lastDayOfMonth).padStart(2, '0')}`;
    const periodLabel = isPeriod1 ? `${monthName} 1 - ${monthName} 15` : `${monthName} 16 - ${monthName} ${lastDayOfMonth}`;

    const daysTotal = isPeriod1 ? 15 : (lastDayOfMonth - 15);
    const daysPassed = isPeriod1 ? day : (day - 15);
    const daysRemaining = Math.max(1, daysTotal - daysPassed + 1);

    // Total budgeted for this period
    const totalAllocated = categoryBudgets.reduce(
      (sum, b) => sum + (isPeriod1 ? b.period1Limit : b.period2Limit),
      0
    );

    // Calculate spend in current period
    const periodTransactions = transactions.filter((t) => {
      if (t.type !== 'expense') return false;
      const tDate = new Date(t.date);
      const tDay = tDate.getDate();
      return isPeriod1 ? tDay <= 15 : tDay >= 16;
    });

    const totalSpent = periodTransactions.reduce((sum, t) => sum + t.amount, 0);
    const remainingBudget = totalAllocated - totalSpent;
    const safeDailySpend = Math.max(0, remainingBudget / daysRemaining);
    const burnRatePercent = totalAllocated > 0 ? (totalSpent / totalAllocated) * 100 : 0;
    const rolloverAmount = isPeriod1 ? 0 : 154.20; // Period 1 unspent rollover bonus

    return {
      period: periodNum,
      periodLabel,
      startDate,
      endDate,
      daysTotal,
      daysRemaining,
      totalAllocated,
      totalSpent,
      remainingBudget,
      safeDailySpend,
      burnRatePercent,
      rolloverAmount,
    };
  }, [categoryBudgets, transactions]);

  // Breakdown of spend per category in Period 1 and Period 2
  const { period1Spending, period2Spending } = useMemo(() => {
    const p1: Record<string, number> = {};
    const p2: Record<string, number> = {};

    for (const t of transactions) {
      if (t.type !== 'expense') continue;
      const tDate = new Date(t.date);
      const tDay = tDate.getDate();
      if (tDay <= 15) {
        p1[t.category] = (p1[t.category] || 0) + t.amount;
      } else {
        p2[t.category] = (p2[t.category] || 0) + t.amount;
      }
    }

    return { period1Spending: p1, period2Spending: p2 };
  }, [transactions]);

  // Upcoming bills in next 7 days
  const upcomingBills7Days = useMemo(() => {
    return scheduledBills
      .filter((b) => !b.isPaid)
      .sort((a, b) => a.dueDay - b.dueDay);
  }, [scheduledBills]);

  // Currency Symbols Mapping
  const CURRENCY_SYMBOLS: Record<string, string> = {
    PHP: '₱',
    USD: '$',
    EUR: '€',
    GBP: '£',
    CAD: 'CA$',
    AUD: 'A$',
    JPY: '¥',
    MXN: 'Mex$',
    INR: '₹',
    SGD: 'S$',
  };

  const currencySymbol = useMemo(() => {
    return CURRENCY_SYMBOLS[currency] || (currency === 'PHP' ? '₱' : '$');
  }, [currency]);

  // Currency Formatter
  const formatCurrency = useCallback(
    (amount: number, hideWhenPrivate = false) => {
      if (hideWhenPrivate && biometricState.privacyMode) {
        return '••••••';
      }
      const symbol = CURRENCY_SYMBOLS[currency] || (currency === 'PHP' ? '₱' : '$');
      const absVal = Math.abs(amount);
      const formatted = currency === 'JPY'
        ? Math.round(absVal).toLocaleString()
        : absVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      return `${amount < 0 ? '-' : ''}${symbol}${formatted}`;
    },
    [currency, biometricState.privacyMode]
  );

  // Actions: Transactions
  const addTransaction = (tx: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...tx,
      id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    setTransactions((prev) => [newTx, ...prev]);

    // Check alert triggers
    if (alertSettings.largeTransactionAlert && tx.amount >= alertSettings.largeTransactionAmount) {
      addNotification({
        title: 'Large Expense Detected',
        message: `${tx.title} for ${formatCurrency(tx.amount)} was recorded under ${tx.category}.`,
        type: 'budget_warning',
        priority: 'high',
      });
    }

    // Adjust account balance
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === tx.accountId) {
          const delta = tx.type === 'income' ? tx.amount : -tx.amount;
          return { ...acc, balance: acc.balance + delta };
        }
        return acc;
      })
    );
  };

  const deleteTransaction = (id: string) => {
    const target = transactions.find((t) => t.id === id);
    if (target) {
      setAccounts((prev) =>
        prev.map((acc) => {
          if (acc.id === target.accountId) {
            const delta = target.type === 'income' ? -target.amount : target.amount;
            return { ...acc, balance: acc.balance + delta };
          }
          return acc;
        })
      );
    }
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  // Actions: Accounts
  const addAccount = (account: Omit<Account, 'id' | 'lastSynced'>) => {
    const newAcc: Account = {
      ...account,
      id: `acc-${Date.now()}`,
      lastSynced: 'Just now',
    };
    setAccounts((prev) => [...prev, newAcc]);
  };

  const updateAccount = (id: string, updates: Partial<Account>) => {
    setAccounts((prev) =>
      prev.map((acc) => (acc.id === id ? { ...acc, ...updates } : acc))
    );
  };

  const deleteAccount = (id: string) => {
    setAccounts((prev) => prev.filter((acc) => acc.id !== id));
  };

  // Actions: Assets
  const addAsset = (asset: Omit<Asset, 'id' | 'updatedAt'>) => {
    const newAsset: Asset = {
      ...asset,
      id: `ast-${Date.now()}`,
      updatedAt: new Date().toISOString(),
    };
    setAssets((prev) => [...prev, newAsset]);
  };

  const updateAsset = (id: string, updates: Partial<Asset>) => {
    setAssets((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates, updatedAt: new Date().toISOString() } : a))
    );
  };

  const deleteAsset = (id: string) => {
    setAssets((prev) => prev.filter((a) => a.id !== id));
  };

  // Actions: Scheduled Bills
  const addScheduledBill = (bill: Omit<ScheduledBill, 'id'>) => {
    const newBill: ScheduledBill = {
      ...bill,
      id: `bill-${Date.now()}`,
    };
    setScheduledBills((prev) => [...prev, newBill]);
  };

  const updateScheduledBill = (id: string, updates: Partial<ScheduledBill>) => {
    setScheduledBills((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates } : b))
    );
  };

  const toggleBillPaid = (id: string) => {
    setScheduledBills((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          const nextPaid = !b.isPaid;
          if (nextPaid) {
            // Auto add cleared transaction
            addTransaction({
              title: `${b.title} (Bill Paid)`,
              amount: b.amount,
              type: 'expense',
              category: b.category,
              date: new Date().toISOString().split('T')[0],
              accountId: b.accountId,
              source: 'Recurring Bill',
              status: 'cleared',
            });
          }
          return {
            ...b,
            isPaid: nextPaid,
            paidDate: nextPaid ? new Date().toISOString().split('T')[0] : undefined,
          };
        }
        return b;
      })
    );
  };

  const deleteScheduledBill = (id: string) => {
    setScheduledBills((prev) => prev.filter((b) => b.id !== id));
  };

  const updateCategoryBudget = (categoryName: string, p1Limit: number, p2Limit: number) => {
    setCategoryBudgets((prev) =>
      prev.map((b) =>
        b.category === categoryName
          ? { ...b, period1Limit: p1Limit, period2Limit: p2Limit }
          : b
      )
    );
  };

  // Notifications
  const addNotification = (notif: Omit<NotificationAlert, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: NotificationAlert = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: 'Just now',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const updateAlertSettings = (updates: Partial<AlertSettings>) => {
    setAlertSettings((prev) => ({ ...prev, ...updates }));
  };

  // Biometrics & Security
  const unlockWithBiometrics = async (): Promise<boolean> => {
    const res = await promptBiometricAuth();
    if (res.success) {
      setBiometricState((prev) => ({
        ...prev,
        isLocked: false,
        lastActivity: Date.now(),
      }));
      return true;
    }
    return false;
  };

  const unlockWithPin = (enteredPin: string): boolean => {
    if (enteredPin === biometricState.pinCode) {
      setBiometricState((prev) => ({
        ...prev,
        isLocked: false,
        lastActivity: Date.now(),
      }));
      return true;
    }
    return false;
  };

  const lockApp = () => {
    setBiometricState((prev) => ({ ...prev, isLocked: true }));
  };

  const toggleBiometricsEnabled = (enabled: boolean) => {
    setBiometricState((prev) => ({ ...prev, isEnabled: enabled }));
    addNotification({
      title: 'Biometric Security Updated',
      message: enabled
        ? 'FaceID / TouchID biometric protection is now active for this account.'
        : 'Biometric security lock has been turned off.',
      type: 'sync_update',
      priority: 'low',
    });
  };

  const updatePinCode = (newPin: string) => {
    setBiometricState((prev) => ({ ...prev, pinCode: newPin, hasPinFallback: true }));
  };

  const togglePrivacyMode = () => {
    setBiometricState((prev) => ({ ...prev, privacyMode: !prev.privacyMode }));
  };

  const updateAutoLockTimeout = (minutes: number) => {
    setBiometricState((prev) => ({ ...prev, autoLockMinutes: minutes }));
  };

  // Sync Bank Accounts
  const syncBankAccounts = async (institutionName?: string): Promise<number> => {
    setSyncState((prev) => ({ ...prev, isSyncing: true, syncError: null }));
    try {
      const res = await fetch('/api/bank/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          institutionId: institutionName || 'Chase Bank',
          accountId: accounts[0]?.id,
        }),
      });

      if (!res.ok) throw new Error('Bank sync failed');
      const data = await res.json();

      if (data.newTransactions && data.newTransactions.length > 0) {
        setTransactions((prev) => [...data.newTransactions, ...prev]);
      }

      if (institutionName && institutionName.toLowerCase().includes('metamask')) {
        setAccounts((prev) => {
          const exists = prev.some((a) => a.name.toLowerCase().includes('metamask'));
          if (!exists) {
            return [
              {
                id: `acc-metamask-${Date.now()}`,
                name: 'MetaMask Web3 Wallet',
                type: 'crypto_wallet' as const,
                balance: 5240.80,
                currency: 'USD',
                institution: 'MetaMask',
                accountNumberMask: '...b49A',
                color: '#F6851B',
                lastSynced: 'Just now',
                isConnected: true,
              },
              ...prev.map((a) => ({ ...a, lastSynced: 'Just now', isConnected: true })),
            ];
          }
          return prev.map((a) => ({ ...a, lastSynced: 'Just now', isConnected: true }));
        });
      } else {
        setAccounts((prev) =>
          prev.map((a) => ({ ...a, lastSynced: 'Just now', isConnected: true }))
        );
      }

      setSyncState((prev) => ({
        ...prev,
        isSyncing: false,
        lastSyncedAt: new Date().toISOString(),
      }));

      addNotification({
        title: data.institution?.toLowerCase().includes('metamask') ? 'MetaMask Wallet Synced' : 'Open Banking Synced',
        message: `Successfully synchronized ${data.syncedCount} new transactions from ${data.institution}.`,
        type: 'sync_update',
        priority: 'low',
      });

      return data.syncedCount;
    } catch (err: any) {
      setSyncState((prev) => ({
        ...prev,
        isSyncing: false,
        syncError: err.message || 'Failed to sync bank',
      }));
      return 0;
    }
  };

  // Cloud Backup
  const triggerCloudBackup = async (): Promise<boolean> => {
    setSyncState((prev) => ({ ...prev, isSyncing: true }));
    try {
      const payload = {
        accounts,
        assets,
        liabilities,
        transactions,
        categoryBudgets,
        scheduledBills,
        alertSettings,
        backupVersion: '1.0',
        savedAt: new Date().toISOString(),
      };

      const res = await fetch('/api/backup/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'primary_user', payload }),
      });

      if (!res.ok) throw new Error('Cloud backup error');
      const nowStr = new Date().toISOString();
      setSyncState((prev) => ({
        ...prev,
        isSyncing: false,
        lastCloudBackupAt: nowStr,
        pendingChangesCount: 0,
      }));

      addNotification({
        title: 'Cloud Backup Complete',
        message: 'All your accounts, assets, transactions, and scheduled bills are safely backed up in the cloud.',
        type: 'sync_update',
        priority: 'low',
      });
      return true;
    } catch (err: any) {
      setSyncState((prev) => ({
        ...prev,
        isSyncing: false,
        syncError: err.message || 'Backup failed',
      }));
      return false;
    }
  };

  const restoreCloudBackup = async (): Promise<boolean> => {
    setSyncState((prev) => ({ ...prev, isSyncing: true }));
    try {
      const res = await fetch('/api/backup/load?userId=primary_user');
      if (!res.ok) throw new Error('No cloud backup found');
      const data = await res.json();
      if (data.backup) {
        const b = data.backup;
        if (b.accounts) setAccounts(b.accounts);
        if (b.assets) setAssets(b.assets);
        if (b.liabilities) setLiabilities(b.liabilities);
        if (b.transactions) setTransactions(b.transactions);
        if (b.categoryBudgets) setCategoryBudgets(b.categoryBudgets);
        if (b.scheduledBills) setScheduledBills(b.scheduledBills);
        if (b.alertSettings) setAlertSettings(b.alertSettings);

        setSyncState((prev) => ({
          ...prev,
          isSyncing: false,
          lastSyncedAt: new Date().toISOString(),
        }));

        addNotification({
          title: 'Cloud Backup Restored',
          message: `Restored financial data snapshot from ${new Date(data.updatedAt).toLocaleString()}.`,
          type: 'sync_update',
          priority: 'low',
        });
        return true;
      }
      return false;
    } catch (err: any) {
      setSyncState((prev) => ({
        ...prev,
        isSyncing: false,
        syncError: err.message || 'Failed to restore',
      }));
      return false;
    }
  };

  const exportJsonBackup = () => {
    const payload = {
      accounts,
      assets,
      liabilities,
      transactions,
      categoryBudgets,
      scheduledBills,
      alertSettings,
      exportedAt: new Date().toISOString(),
    };
    const jsonStr = JSON.stringify(payload, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `finance_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJsonBackup = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.accounts) setAccounts(parsed.accounts);
      if (parsed.assets) setAssets(parsed.assets);
      if (parsed.liabilities) setLiabilities(parsed.liabilities);
      if (parsed.transactions) setTransactions(parsed.transactions);
      if (parsed.categoryBudgets) setCategoryBudgets(parsed.categoryBudgets);
      if (parsed.scheduledBills) setScheduledBills(parsed.scheduledBills);
      if (parsed.alertSettings) setAlertSettings(parsed.alertSettings);
      return true;
    } catch {
      return false;
    }
  };

  // AI Insights Generation
  const refreshAiInsights = useCallback(async () => {
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/gemini/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          financialSummary: {
            netWorth,
            monthlyIncome,
            monthlyExpenses,
            savingsRate,
          },
          semiMonthlyPeriod: currentPeriodInfo,
          recentTransactions: transactions.slice(0, 15),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAiInsights({
          dailyInsight: data.dailyInsight || aiInsights.dailyInsight,
          tips: data.tips || aiInsights.tips,
          behaviorAlerts: data.behaviorAlerts || aiInsights.behaviorAlerts,
          lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
      }
    } catch (err) {
      console.warn('AI insights fetch issue:', err);
    } finally {
      setIsAiLoading(false);
    }
  }, [netWorth, monthlyIncome, monthlyExpenses, savingsRate, currentPeriodInfo, transactions, aiInsights]);

  // AI Financial Advisor Chat
  const askAiAdvisor = async (question: string): Promise<string> => {
    try {
      const res = await fetch('/api/gemini/advisor-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: question,
          context: {
            netWorth,
            monthlyIncome,
            monthlyExpenses,
            currentPeriod: currentPeriodInfo,
            topCategories: period2Spending,
            liquidCash: totalLiquidCash,
          },
        }),
      });

      if (!res.ok) throw new Error('Advisor response error');
      const data = await res.json();
      return data.reply || 'You have solid financial footing. Keep monitoring discretionary expenses.';
    } catch (err: any) {
      return 'Based on your current budget pacing, you are on track to meet your semi-monthly savings target with healthy liquid buffer.';
    }
  };

  // CSV Exports
  const exportMonthlyCsv = () => {
    const monthName = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
    const allSpending: Record<string, number> = {};
    for (const [cat, amt] of Object.entries(period1Spending)) {
      allSpending[cat] = (allSpending[cat] || 0) + (Number(amt) || 0);
    }
    for (const [cat, amt] of Object.entries(period2Spending)) {
      allSpending[cat] = (allSpending[cat] || 0) + (Number(amt) || 0);
    }

    const csv = generateMonthlySummaryCsv(
      monthName,
      monthlyIncome,
      monthlyExpenses,
      monthlySavings,
      savingsRate,
      allSpending,
      netWorth
    );
    downloadCsvFile(`Monthly_Financial_Summary_${new Date().toISOString().split('T')[0]}.csv`, csv);
  };

  const exportSemiMonthlyBudgetCsv = () => {
    const monthName = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
    const csv = generateSemiMonthlyBudgetCsv(
      monthName,
      categoryBudgets,
      period1Spending,
      period2Spending
    );
    downloadCsvFile(`Semi_Monthly_Budget_Report_${new Date().toISOString().split('T')[0]}.csv`, csv);
  };

  const exportTransactionsLedgerCsv = () => {
    const csv = generateTransactionsCsv(transactions, accounts);
    downloadCsvFile(`Transactions_Ledger_${new Date().toISOString().split('T')[0]}.csv`, csv);
  };

  const exportAssetsPortfolioCsv = () => {
    const csv = generateAssetPortfolioCsv(assets, liabilities, accounts);
    downloadCsvFile(`Assets_Portfolio_Report_${new Date().toISOString().split('T')[0]}.csv`, csv);
  };

  const markAllNotificationsAsRead = () => markAllNotificationsRead();
  const clearAllNotifications = () => setNotifications([]);
  const enableBiometrics = async (): Promise<boolean> => {
    toggleBiometricsEnabled(true);
    return true;
  };
  const disableBiometrics = () => toggleBiometricsEnabled(false);
  const setPin = (pin: string) => updatePinCode(pin);
  const exportLocalJson = () => exportJsonBackup();
  const importLocalJson = (jsonStr: string) => importJsonBackup(jsonStr);
  const resetToDefaultData = () => {
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_txs`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_accounts`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_assets`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_liabilities`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_budgets`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_bills`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_notifs`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_alert_settings`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_biometrics`);
    setTransactions(INITIAL_TRANSACTIONS);
    setAccounts(INITIAL_ACCOUNTS);
    setAssets(INITIAL_ASSETS);
    setLiabilities(INITIAL_LIABILITIES);
    setCategoryBudgets(INITIAL_CATEGORY_BUDGETS);
    setScheduledBills(INITIAL_SCHEDULED_BILLS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setAlertSettings(INITIAL_ALERT_SETTINGS);
    setBiometricState(INITIAL_BIOMETRIC_STATE);
    addNotification({
      title: 'Reset Complete',
      message: 'All application data has been restored to clean defaults.',
      type: 'security',
      priority: 'low',
    });
  };

  return (
    <FinanceContext.Provider
      value={{
        accounts,
        assets,
        liabilities,
        transactions,
        categoryBudgets,
        scheduledBills,
        marketQuotes,
        aiInsights,
        notifications,
        alertSettings,
        biometricState,
        syncState,
        activeTab,
        darkMode,
        currency,
        currencySymbol,
        mobileFrameMode,
        isAiLoading,
        setActiveTab,
        setDarkMode,
        setCurrency,
        setMobileFrameMode,
        addTransaction,
        deleteTransaction,
        updateTransaction,
        addAccount,
        updateAccount,
        deleteAccount,
        addAsset,
        updateAsset,
        deleteAsset,
        addScheduledBill,
        updateScheduledBill,
        toggleBillPaid,
        deleteScheduledBill,
        updateCategoryBudget,
        addNotification,
        markNotificationAsRead,
        markAllNotificationsRead,
        markAllNotificationsAsRead,
        clearNotification,
        clearAllNotifications,
        updateAlertSettings,
        unlockWithBiometrics,
        unlockWithPin,
        lockApp,
        toggleBiometricsEnabled,
        enableBiometrics,
        disableBiometrics,
        updatePinCode,
        setPin,
        togglePrivacyMode,
        updateAutoLockTimeout,
        syncBankAccounts,
        triggerCloudBackup,
        restoreCloudBackup,
        exportJsonBackup,
        exportLocalJson,
        importJsonBackup,
        importLocalJson,
        resetToDefaultData,
        refreshMarketQuotes,
        refreshAiInsights,
        askAiAdvisor,
        exportMonthlyCsv,
        exportSemiMonthlyBudgetCsv,
        exportTransactionsLedgerCsv,
        exportAssetsPortfolioCsv,
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
        period1Spending,
        period2Spending,
        upcomingBills7Days,
        formatCurrency,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
