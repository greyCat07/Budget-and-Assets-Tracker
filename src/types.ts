export type TransactionType = 'expense' | 'income' | 'transfer';

export type CategoryName =
  | 'Housing & Rent'
  | 'Groceries & Food'
  | 'Dining & Takeout'
  | 'Transportation'
  | 'Utilities & Bills'
  | 'Entertainment & Fun'
  | 'Health & Wellness'
  | 'Shopping & Retail'
  | 'Investments & Savings'
  | 'Subscriptions & SaaS'
  | 'Income & Salary'
  | 'Salary & Income'
  | 'Investments & Dividends'
  | 'Freelance & Side Gig'
  | 'Crypto & Stocks'
  | 'Miscellaneous';

export type AssetCategory =
  | 'cash'
  | 'stock'
  | 'crypto'
  | 'real_estate'
  | 'vehicle'
  | 'retirement'
  | 'precious_metals'
  | 'custom';

export interface Account {
  id: string;
  name: string;
  institution: string;
  type: 'checking' | 'savings' | 'credit' | 'brokerage' | 'crypto_wallet' | 'cash';
  balance: number;
  currency: string;
  accountNumberMask: string;
  lastSynced: string;
  isConnected: boolean;
  color: string;
}

export interface Asset {
  id: string;
  name: string;
  category: AssetCategory;
  symbol?: string;
  currentValue: number;
  costBasis: number;
  quantity?: number;
  currency: string;
  appreciationPercent?: number;
  notes?: string;
  updatedAt: string;
}

export interface Liability {
  id: string;
  name: string;
  category: 'mortgage' | 'auto_loan' | 'student_loan' | 'credit_card' | 'personal_loan';
  totalBalance: number;
  interestRate: number;
  minimumMonthlyPayment: number;
  dueDate: number; // Day of month (1-31)
  lender: string;
}

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: CategoryName;
  date: string; // YYYY-MM-DD
  accountId: string;
  merchant?: string;
  notes?: string;
  source: 'Bank Sync' | 'Manual' | 'Recurring Bill' | 'CSV Import' | string;
  status: 'cleared' | 'pending';
  tags?: string[];
}

export interface CategoryBudget {
  category: CategoryName;
  period1Limit: number; // 1st - 15th
  period2Limit: number; // 16th - End of month
  color: string;
  iconName: string;
}

export interface SemiMonthlyPeriodInfo {
  period: 1 | 2; // 1 = 1st-15th, 2 = 16th-End
  periodLabel: string; // e.g. "Aug 1 - Aug 15" or "Aug 16 - Aug 31"
  startDate: string;
  endDate: string;
  daysTotal: number;
  daysRemaining: number;
  totalAllocated: number;
  totalSpent: number;
  remainingBudget: number;
  safeDailySpend: number;
  burnRatePercent: number;
  rolloverAmount: number;
}

export interface ScheduledBill {
  id: string;
  title: string;
  amount: number;
  category: CategoryName;
  dueDay: number; // Day of month (1-31)
  nextDueDate: string; // ISO date YYYY-MM-DD
  frequency: 'monthly' | 'semi-monthly' | 'bi-weekly' | 'annual';
  autoPay: boolean;
  isPaid: boolean;
  paidDate?: string;
  accountId: string;
  merchantIcon?: string;
  reminderDaysBefore: number;
}

export interface MarketQuote {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  changePercent: number;
  marketCap: string;
  sparkline: number[];
  type: 'stock' | 'crypto' | 'etf';
}

export interface AIFinancialTip {
  id: string;
  category: string;
  title: string;
  description: string;
  impact: string;
  badge: string;
}

export interface AIInsightsData {
  dailyInsight: string;
  tips: AIFinancialTip[];
  behaviorAlerts: string[];
  lastUpdated?: string;
}

export interface NotificationAlert {
  id: string;
  title: string;
  message: string;
  type: 'budget_warning' | 'budget_overrun' | 'bill_reminder' | 'bill_due' | 'market_move' | 'sync_update' | 'spending_habit' | 'security';
  timestamp: string;
  read: boolean;
  priority?: 'high' | 'medium' | 'low';
}

export type AppNotification = NotificationAlert;

export interface AlertSettings {
  threshold80Alert?: boolean;
  threshold100Alert?: boolean;
  budgetThreshold80?: boolean;
  budgetOver100?: boolean;
  billDueReminders?: boolean;
  billReminderDays?: number;
  largeTxAlert?: boolean;
  largeTransactionAlert?: boolean;
  largeTransactionAmount?: number;
  marketVolatilityAlert?: boolean;
  cryptoMarketVolatility?: boolean;
  cycleResetReminder?: boolean;
  enablePushSimulation?: boolean;
  soundEnabled?: boolean;
}

export interface BiometricSecurityState {
  isEnabled: boolean;
  isBiometricAvailable: boolean;
  hasPinFallback: boolean;
  pinCode: string;
  isLocked: boolean;
  autoLockMinutes: number; // 0 = immediately, 1, 5, 15, -1 = disabled
  lastActivity: number;
  privacyMode: boolean; // Blurs balances
}

export interface SyncEngineState {
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncedAt: string;
  pendingChangesCount: number;
  lastCloudBackupAt: string | null;
  lastBackupTimestamp?: string | null;
  syncError: string | null;
}

export type ActiveTab =
  | 'dashboard'
  | 'budget'
  | 'calendar'
  | 'assets'
  | 'transactions'
  | 'insights'
  | 'reports';
