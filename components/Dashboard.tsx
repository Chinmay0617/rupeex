
import React, { useMemo } from 'react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Transaction, Budget, CurrencyCode, convertAmount, formatValue } from '../types';
import { getLocalSummary } from '../intelligence';

interface DashboardProps {
  transactions: Transaction[];
  budgets: Budget[];
  isDarkMode: boolean;
  baseCurrency: CurrencyCode;
}

const Dashboard: React.FC<DashboardProps> = ({ transactions, budgets, isDarkMode, baseCurrency }) => {
  const stats = useMemo(() => {
    const income = transactions
      .filter(t => t.type === 'INCOME')
      .reduce((acc, t) => acc + convertAmount(t.amount, t.currency, baseCurrency), 0);

    const expense = transactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((acc, t) => acc + convertAmount(t.amount, t.currency, baseCurrency), 0);

    return { income, expense, balance: income - expense };
  }, [transactions, baseCurrency]);

  const summary = useMemo(() => getLocalSummary(transactions, baseCurrency), [transactions, baseCurrency]);

  // Real utilization calculation: Sum of all category spent vs Sum of all category limits
  const utilizationMetrics = useMemo(() => {
    if (budgets.length === 0) return 0;

    const totalLimit = budgets.reduce((acc, b) => acc + convertAmount(b.limit, b.currency, baseCurrency), 0);
    const totalSpent = budgets.reduce((acc, b) => {
      const spentInCategory = transactions
        .filter(t => t.category === b.category && t.type === 'EXPENSE')
        .reduce((sum, t) => sum + convertAmount(t.amount, t.currency, baseCurrency), 0);
      return acc + spentInCategory;
    }, 0);

    return totalLimit > 0 ? Math.min((totalSpent / totalLimit) * 100, 100) : 0;
  }, [budgets, transactions, baseCurrency]);

  const monthlyTrend = useMemo(() => {
    const trendMap: Record<string, { income: number; expense: number }> = {};
    // Sort transactions by date first to ensure the graph flows correctly
    const sortedTransactions = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    sortedTransactions.forEach(t => {
      const dateKey = new Date(t.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      const converted = convertAmount(t.amount, t.currency, baseCurrency);
      if (!trendMap[dateKey]) trendMap[dateKey] = { income: 0, expense: 0 };
      if (t.type === 'INCOME') trendMap[dateKey].income += converted;
      else trendMap[dateKey].expense += converted;
    });
    return Object.entries(trendMap).map(([date, values]) => ({ date, ...values })).slice(-15);
  }, [transactions, baseCurrency]);

  return (
    <div className="space-y-10 pb-20">
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <div className="xl:col-span-3 glass-card rounded-6xl p-10 lg:p-14 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-12 relative z-10">
            <div className="flex-1 space-y-10">
              <div className="space-y-2">
                <span className="text-[11px] font-black uppercase tracking-[0.4em] text-brand-600 dark:text-brand-400">Net Portfolio Value</span>
                <h2 className="text-6xl lg:text-8xl font-black tracking-tighter text-slate-900 dark:text-white leading-none mono-num">
                  {formatValue(stats.balance, baseCurrency)}
                </h2>
              </div>

              <div className="flex flex-wrap gap-14">
                <div className="space-y-2">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Inflow History</p>
                  <p className="text-3xl font-black text-emerald-500 mono-num">+{formatValue(stats.income, baseCurrency)}</p>
                </div>
                <div className="w-px h-16 bg-slate-100 dark:bg-slate-800 self-center hidden sm:block"></div>
                <div className="space-y-2">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Capital Outflow</p>
                  <p className="text-3xl font-black text-slate-900 dark:text-white mono-num">-{formatValue(stats.expense, baseCurrency)}</p>
                </div>
              </div>

              <div className="p-8 bg-slate-50 dark:bg-slate-900/40 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/50 shadow-inner">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-2 h-2 bg-brand-500 rounded-full animate-pulse"></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">AI Logic Engine v2.0</span>
                </div>
                <p className="text-sm lg:text-base font-semibold leading-relaxed text-slate-700 dark:text-slate-300">
                  "{summary}"
                </p>
              </div>
            </div>

            <div className="w-full lg:w-[450px] h-[360px] bg-slate-50 dark:bg-brand-500/[0.03] rounded-[3rem] p-8 border border-slate-100 dark:border-brand-500/10 relative overflow-hidden self-end">
              <div className="mb-6 flex justify-between items-center">
                <span className="text-[11px] font-black text-brand-600 uppercase tracking-widest">Velocity Metrics</span>
                <div className="px-3 py-1 bg-white dark:bg-slate-800 rounded-lg text-[9px] font-black text-slate-400 border border-slate-100 dark:border-slate-700">LIVE FEED</div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={monthlyTrend}>
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 9, fontWeight: 700, fill: '#94a3b8' }}
                    dy={10}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.15)', fontSize: '11px', fontWeight: 'bold' }}
                    formatter={(val: number) => [formatValue(val, baseCurrency), 'Value']}
                  />
                  <Area
                    type="monotone"
                    dataKey="expense"
                    stroke="#6366F1"
                    strokeWidth={4}
                    fill="url(#chartGrad)"
                    animationDuration={1500}
                    dot={{ r: 4, fill: '#6366F1', strokeWidth: 2, stroke: isDarkMode ? '#111827' : '#fff' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <div className="glass-card rounded-[3rem] p-10 flex-1 flex flex-col justify-between border-l-[8px] border-l-brand-500 stat-card-hover group">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">Portfolio Caps</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">Strategic Limits Active</h3>
            </div>
            <div className="mt-8 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Overall Utilization</span>
                <span className={`text-2xl font-black mono-num ${utilizationMetrics > 90 ? 'text-rose-500' : 'text-brand-600'}`}>
                  {utilizationMetrics.toFixed(0)}%
                </span>
              </div>
              <div className="h-3.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                <div
                  className={`h-full transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(99,102,241,0.3)] ${utilizationMetrics > 90 ? 'bg-rose-500' : 'rx-accent-gradient'}`}
                  style={{ width: `${Math.max(utilizationMetrics, 2)}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="rx-accent-gradient rounded-[3rem] p-10 flex-1 flex flex-col justify-between text-white premium-glow transition-all hover:scale-[1.02] cursor-pointer group">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60 mb-2">Infrastructure</p>
                <h3 className="text-2xl font-black tracking-tight leading-tight">Neural Node Status</h3>
              </div>
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-2xl transition-transform group-hover:rotate-12">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
            </div>
            <p className="text-xs font-semibold opacity-90 leading-relaxed mt-6">All financial logic processing on local neural vectors. Sync Latency: 0.04ms.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {budgets.slice(0, 4).map((b) => {
          const spent = transactions
            .filter(t => t.category === b.category && t.type === 'EXPENSE')
            .reduce((acc, t) => acc + convertAmount(t.amount, t.currency, baseCurrency), 0);

          const limit = convertAmount(b.limit, b.currency, baseCurrency);
          const percent = Math.min((spent / (limit || 1)) * 100, 100);

          return (
            <div key={b.id} className="glass-card p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800/40 stat-card-hover group">
              <div className="flex justify-between items-center mb-8">
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{b.category}</p>
                <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black border ${percent > 90 ? 'bg-rose-500/10 text-rose-600 border-rose-500/20' : 'bg-brand-500/10 text-brand-600 border-brand-500/20'}`}>
                  {Math.round(percent)}%
                </div>
              </div>
              <p className="text-3xl font-black text-slate-900 dark:text-white mb-6 mono-num tracking-tighter">
                {formatValue(spent, baseCurrency)}
              </p>
              <div className="h-2.5 bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                <div
                  className={`h-full transition-all duration-1000 ease-out ${percent > 90 ? 'bg-rose-500' : 'rx-accent-gradient'}`}
                  style={{ width: `${Math.max(percent, 2)}%` }}
                />
              </div>
              <div className="mt-5 flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">
                <span>Sector Spend</span>
                <span className="opacity-60">Limit: {formatValue(limit, baseCurrency)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
