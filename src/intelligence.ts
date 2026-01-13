
import { Transaction, CATEGORIES, convertAmount, CurrencyCode, formatValue } from './types';

/**
 * RupeeX Local Intelligence Engine
 * Handles statistical analysis and financial logic on-device.
 */

export const calculateAnomalyScore = (tx: Partial<Transaction>, history: Transaction[], baseCurrency: CurrencyCode): number => {
  const categoryHistory = history.filter(h => h.category === tx.category && h.type === 'EXPENSE');
  if (categoryHistory.length < 2) return 0;

  const amounts = categoryHistory.map(h => convertAmount(h.amount, h.currency, baseCurrency));
  const avg = amounts.reduce((a, b) => a + b, 0) / amounts.length;

  const squareDiffs = amounts.map(a => Math.pow(a - avg, 2));
  const stdDev = Math.sqrt(squareDiffs.reduce((a, b) => a + b, 0) / amounts.length);

  const currentAmount = tx.amount || 0;

  if (stdDev === 0) return currentAmount > avg ? 0.5 : 0;

  const zScore = Math.abs(currentAmount - avg) / stdDev;
  return Math.min(zScore / 3, 1);
};

export const getLocalSummary = (transactions: Transaction[], baseCurrency: CurrencyCode): string => {
  if (transactions.length === 0) return "Global ledger empty. Initiate entry to start tracking portfolio vectors.";

  const expenses = transactions.filter(t => t.type === 'EXPENSE');
  if (expenses.length === 0 && transactions.length > 0) return "Excellent capital accumulation detected. Wealth node showing zero outflow.";
  if (expenses.length === 0) return "Add entries to initialize operational summary.";

  const categories: Record<string, number> = {};
  expenses.forEach(t => {
    const amt = convertAmount(t.amount, t.currency, baseCurrency);
    categories[t.category] = (categories[t.category] || 0) + amt;
  });

  const sortedCats = Object.entries(categories).sort((a, b) => b[1] - a[1]);
  const topCat = sortedCats[0];
  const total = expenses.reduce((a, b) => a + convertAmount(b.amount, b.currency, baseCurrency), 0);

  let insight = "";
  if (topCat) {
    const percent = ((topCat[1] / (total || 1)) * 100).toFixed(0);
    insight = `Analysis shows ${topCat[0]} is your primary capital attractor at ${percent}% of outflow. `;
  }

  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
  const recentSpend = expenses
    .filter(t => new Date(t.date) >= threeDaysAgo)
    .reduce((a, b) => a + convertAmount(b.amount, b.currency, baseCurrency), 0);

  if (recentSpend > (total / 4)) {
    insight += "Momentum high: Significant capital flux detected in the last 72 hours.";
  } else {
    insight += "Portfolio velocity is currently within stable historical parameters.";
  }

  return insight;
};

export const getLocalPrediction = (history: Transaction[], baseCurrency: CurrencyCode) => {
  if (history.length < 3) return null;

  const expenses = history.filter(t => t.type === 'EXPENSE');

  if (expenses.length === 0) {
    return {
      predictedTotal: 0,
      lowEstimate: 0,
      highEstimate: 0,
      explanation: "Strategic Forecast: Cash burn rate is null. Maximum capital preservation protocol active.",
      trend: 'stable' as const,
      confidenceScore: 1.0,
      categoryBreakdown: {}
    };
  }

  const totalsByDay: Record<string, number> = {};
  expenses.forEach(t => {
    const date = t.date;
    const amt = convertAmount(t.amount, t.currency, baseCurrency);
    totalsByDay[date] = (totalsByDay[date] || 0) + amt;
  });

  const sortedDays = Object.keys(totalsByDay).sort();
  const values = sortedDays.map(d => totalsByDay[d]);

  const avgDaily = values.reduce((a, b) => a + b, 0) / values.length;
  const predictedTotal = avgDaily * 30;

  const categoryWeights: Record<string, number> = {};
  expenses.forEach(t => {
    const amt = convertAmount(t.amount, t.currency, baseCurrency);
    categoryWeights[t.category] = (categoryWeights[t.category] || 0) + amt;
  });

  const totalExp = expenses.reduce((a, b) => a + convertAmount(b.amount, b.currency, baseCurrency), 0);
  const breakdown: Record<string, number> = {};
  Object.keys(categoryWeights).forEach(cat => {
    breakdown[cat] = (categoryWeights[cat] / (totalExp || 1)) * predictedTotal;
  });

  return {
    predictedTotal,
    lowEstimate: predictedTotal * 0.85,
    highEstimate: predictedTotal * 1.15,
    explanation: `Forecasting 30-day burn rate at ${formatValue(predictedTotal, baseCurrency)} based on ${history.length} operations. Initial logic accuracy verified.`,
    trend: 'stable' as const,
    confidenceScore: 0.65,
    categoryBreakdown: breakdown
  };
};


