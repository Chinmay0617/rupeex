
export type TransactionType = 'INCOME' | 'EXPENSE';
export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP' | 'JPY' | 'AUD' | 'CAD' | 'CHF' | 'CNY' | 'SGD' | 'AED';

export interface User {
  userId: string;
  email: string;
  createdAt?: string;
  baseCurrency: CurrencyCode;
  googleId?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Transaction {
  id: string;
  userId: string;
  date: string;
  amount: number;
  currency: CurrencyCode;
  description: string;
  category: string;
  type: TransactionType;
  merchant?: string;
  source: 'MANUAL' | 'AI_NLP' | 'AI_SCAN';
  confidence?: number;
  isEdited: boolean;
  aiGenerated?: boolean;
  isRecurring?: boolean;
  anomalyScore?: number;
}

export interface Budget {
  id: string;
  userId: string;
  category: string;
  limit: number;
  spent: number;
  currency: CurrencyCode;
}

export interface SavingsGoal {
  id: string;
  userId: string;
  name: string;
  target: number;
  current: number;
  currency: CurrencyCode;
  deadline?: string;
}

export interface PredictionResult {
  predictedTotal: number;
  lowEstimate: number;
  highEstimate: number;
  explanation: string;
  trend: 'up' | 'down' | 'stable';
  confidenceScore: number;
  categoryBreakdown: Record<string, number>;
}

export interface AdvisorMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  AUD: 'A$',
  CAD: 'C$',
  CHF: 'Fr',
  CNY: '¥',
  SGD: 'S$',
  AED: 'dh'
};

export const MOCK_EXCHANGE_RATES: Record<CurrencyCode, number> = {
  USD: 1.0,
  INR: 83.5,
  EUR: 0.92,
  GBP: 0.78,
  JPY: 158.0,
  AUD: 1.52,
  CAD: 1.37,
  CHF: 0.91,
  CNY: 7.24,
  SGD: 1.35,
  AED: 3.67
};

export const convertAmount = (amount: number, from: CurrencyCode, to: CurrencyCode): number => {
  if (from === to) return amount;
  const inUSD = amount / MOCK_EXCHANGE_RATES[from];
  return inUSD * MOCK_EXCHANGE_RATES[to];
};

export const formatValue = (amount: number, currency: CurrencyCode): string => {
  const symbol = CURRENCY_SYMBOLS[currency];
  const formatter = new Intl.NumberFormat(undefined, {
    minimumFractionDigits: currency === 'JPY' ? 0 : 2,
    maximumFractionDigits: currency === 'JPY' ? 0 : 2
  });
  return `${symbol}${formatter.format(amount)}`;
};

export const CATEGORIES = [
  'Food & Dining',
  'Shopping',
  'Transport',
  'Utilities',
  'Rent',
  'Entertainment',
  'Salary',
  'Freelance',
  'Investments',
  'Health',
  'Education',
  'Misc'
];

export const CATEGORY_COLORS: Record<string, string> = {
  'Food & Dining': '#6366f1',
  'Shopping': '#8b5cf6',
  'Transport': '#06b6d4',
  'Utilities': '#10b981',
  'Rent': '#f59e0b',
  'Entertainment': '#ec4899',
  'Salary': '#2dd4bf',
  'Freelance': '#84cc16',
  'Investments': '#6366f1',
  'Health': '#ef4444',
  'Education': '#a855f7',
  'Misc': '#94a3b8'
};
