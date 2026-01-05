
import React, { useMemo } from 'react';
import { Transaction, CATEGORY_COLORS, CurrencyCode, convertAmount, formatValue } from '../types';

interface ReportsProps {
  transactions: Transaction[];
  baseCurrency: CurrencyCode;
}

const Reports: React.FC<ReportsProps> = ({ transactions, baseCurrency }) => {
  const analysis = useMemo(() => {
    const expensesOnly = transactions.filter(t => t.type === 'EXPENSE');
    const totalExpenses = expensesOnly.reduce((acc, t) => acc + convertAmount(t.amount, t.currency, baseCurrency), 0);
    
    const categoryStats = Object.entries(
      expensesOnly.reduce((acc, t) => {
        const converted = convertAmount(t.amount, t.currency, baseCurrency);
        acc[t.category] = (acc[t.category] || 0) + converted;
        return acc;
      }, {} as Record<string, number>)
    ).map(([name, val]: [string, number]) => ({
      name,
      val,
      percent: (val / (totalExpenses || 1)) * 100
    })).sort((a, b) => b.val - a.val);

    return { totalExpenses, categoryStats };
  }, [transactions, baseCurrency]);

  return (
    <div className="space-y-12 pb-24">
      <div className="bg-white dark:bg-slate-900/60 p-12 md:p-16 rounded-[4rem] border border-slate-200/50 dark:border-slate-800/40 rx-premium-shadow">
        <div className="flex justify-between items-center mb-16">
          <h3 className="text-3xl font-black tracking-tighter text-space-950 dark:text-white">Portfolio Velocity Audit</h3>
          <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Total Outflow:</span>
             <span className="ml-4 text-sm font-black text-indigo-500 mono-num">{formatValue(analysis.totalExpenses, baseCurrency)}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-20">
          <div className="space-y-10">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] mb-12">Sector Allocation Dynamics</p>
            <div className="space-y-10">
              {analysis.categoryStats.slice(0, 6).map((stat, i) => (
                <div key={i} className="space-y-4">
                  <div className="flex justify-between items-end mb-1">
                    <span className="text-sm font-black text-space-950 dark:text-slate-300 tracking-tight">{stat.name}</span>
                    <span className="text-sm font-black text-indigo-500 mono-num">{formatValue(stat.val, baseCurrency)} <span className="text-[10px] text-slate-400 opacity-50 font-medium ml-2">({stat.percent.toFixed(1)}%)</span></span>
                  </div>
                  <div className="h-2 bg-slate-50 dark:bg-slate-950 rounded-full overflow-hidden relative">
                    <div 
                      className="h-full rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(99,102,241,0.3)]" 
                      style={{ width: `${stat.percent}%`, backgroundColor: CATEGORY_COLORS[stat.name] }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-16 bg-slate-50 dark:bg-slate-800/20 rounded-[4rem] border border-slate-200/50 dark:border-slate-800/40 flex flex-col justify-center relative overflow-hidden group">
            <div className="w-16 h-16 rx-accent-gradient rounded-[1.8rem] mb-10 flex items-center justify-center text-white shadow-2xl rx-glow-indigo transition-transform group-hover:scale-110">
               <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] mb-6 text-indigo-500">Autonomous Intelligence Feed</h4>
            <p className="text-2xl font-bold text-space-950 dark:text-slate-50 leading-snug italic tracking-tight">
              "System analysis indicates your dominant expenditure block is <span className="text-indigo-500">{analysis.categoryStats[0]?.name || 'N/A'}</span>, comprising {analysis.categoryStats[0]?.percent.toFixed(1) || 0}% of net portfolio velocity. Predictive logic recommends sector reallocation."
            </p>
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
