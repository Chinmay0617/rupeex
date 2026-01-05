
import React, { useState } from 'react';
import { Budget, SavingsGoal, CATEGORIES, Transaction, CATEGORY_COLORS, CurrencyCode, CURRENCY_SYMBOLS, convertAmount, formatValue } from '../types';

interface BudgetsProps {
  budgets: Budget[];
  goals: SavingsGoal[];
  transactions: Transaction[];
  userId: string;
  onSaveBudget: (budget: Budget) => void;
  onSaveGoal: (goal: SavingsGoal) => void;
  baseCurrency: CurrencyCode;
}

const Budgets: React.FC<BudgetsProps> = ({ budgets, goals, transactions, userId, onSaveBudget, onSaveGoal, baseCurrency }) => {
  const [tab, setTab] = useState<'budgets' | 'goals'>('budgets');
  
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [budgetLimit, setBudgetLimit] = useState('');

  const [goalName, setGoalName] = useState('');
  const [goalTarget, setGoalTarget] = useState('');

  const handleSaveBudget = () => {
    if (!budgetLimit) return;
    const existing = budgets.find(b => b.category === selectedCategory);
    onSaveBudget({
      id: existing?.id || `bud_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      category: selectedCategory,
      limit: parseFloat(budgetLimit),
      spent: 0,
      currency: baseCurrency
    });
    setBudgetLimit('');
  };

  const handleSaveGoal = () => {
    if (!goalName || !goalTarget) return;
    onSaveGoal({
      id: `goal_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      name: goalName,
      target: parseFloat(goalTarget),
      current: 0,
      currency: baseCurrency
    });
    setGoalName('');
    setGoalTarget('');
  };

  return (
    <div className="space-y-12 pb-24 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] flex w-fit gap-2 rx-premium-shadow">
        <button onClick={() => setTab('budgets')} className={`px-10 py-4 rounded-[1.8rem] text-[11px] font-black uppercase tracking-[0.25em] transition-all ${tab === 'budgets' ? 'bg-space-950 text-white dark:bg-indigo-600 shadow-xl' : 'text-slate-400 hover:text-indigo-500'}`}>Operational Caps</button>
        <button onClick={() => setTab('goals')} className={`px-10 py-4 rounded-[1.8rem] text-[11px] font-black uppercase tracking-[0.25em] transition-all ${tab === 'goals' ? 'bg-space-950 text-white dark:bg-indigo-600 shadow-xl' : 'text-slate-400 hover:text-indigo-500'}`}>Strategic Assets</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-900/60 p-12 rounded-[3.5rem] border border-slate-200/60 dark:border-slate-800/60 rx-premium-shadow">
            <h3 className="text-2xl font-black mb-10 text-space-950 dark:text-white tracking-tighter">
              {tab === 'budgets' ? 'Establish Guardrail' : 'Define Objective'}
            </h3>
            <div className="space-y-8">
              {tab === 'budgets' ? (
                <>
                  <div className="space-y-3">
                    <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 ml-2">Portfolio Sector</label>
                    <select className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-950/40 border-none rounded-2xl text-sm font-bold dark:text-white focus:ring-4 focus:ring-indigo-500/10 transition-all" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 ml-2">Ceiling Value ({CURRENCY_SYMBOLS[baseCurrency]})</label>
                    <input type="number" className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-950/40 border-none rounded-2xl text-sm font-bold dark:text-white focus:ring-4 focus:ring-indigo-500/10 transition-all" placeholder="0.00" value={budgetLimit} onChange={(e) => setBudgetLimit(e.target.value)} />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-3">
                    <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 ml-2">Objective Name</label>
                    <input type="text" className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-950/40 border-none rounded-2xl text-sm font-bold dark:text-white focus:ring-4 focus:ring-indigo-500/10 transition-all" placeholder="e.g. Real Estate Acquisition" value={goalName} onChange={(e) => setGoalName(e.target.value)} />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 ml-2">Target Liquidity ({CURRENCY_SYMBOLS[baseCurrency]})</label>
                    <input type="number" className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-950/40 border-none rounded-2xl text-sm font-bold dark:text-white focus:ring-4 focus:ring-indigo-500/10 transition-all" placeholder="0.00" value={goalTarget} onChange={(e) => setGoalTarget(e.target.value)} />
                  </div>
                </>
              )}
              <button onClick={tab === 'budgets' ? handleSaveBudget : handleSaveGoal} className="w-full py-6 rx-accent-gradient text-white rounded-2xl font-black uppercase tracking-[0.25em] transition-all active:scale-95 shadow-2xl rx-glow-indigo">
                {tab === 'budgets' ? 'Initialize Cap' : 'Launch Objective'}
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          {tab === 'budgets' ? (
            budgets.length === 0 ? (
               <div className="h-full flex items-center justify-center py-32 bg-slate-50 dark:bg-slate-900/20 rounded-[3.5rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
                  <p className="text-[11px] font-black uppercase tracking-[0.6em] text-slate-300">No active caps detected</p>
               </div>
            ) : budgets.map((b) => {
              const spentInBase = transactions
                .filter(t => t.category === b.category && t.type === 'EXPENSE')
                .reduce((acc, t) => acc + convertAmount(t.amount, t.currency, baseCurrency), 0);
              
              const limitInBase = convertAmount(b.limit, b.currency, baseCurrency);
              const percent = Math.min((spentInBase / limitInBase) * 100, 100);
              
              return (
                <div key={b.id} className="bg-white dark:bg-slate-900/40 p-12 rounded-[3.5rem] border border-slate-100 dark:border-slate-800/40 flex items-center gap-10 rx-premium-shadow group hover:translate-x-3 transition-all">
                  <div className="w-20 h-20 rounded-[1.8rem] flex items-center justify-center shrink-0 transition-all group-hover:scale-110 shadow-lg" style={{ backgroundColor: `${CATEGORY_COLORS[b.category]}15`, color: CATEGORY_COLORS[b.category] }}>
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                  <div className="flex-1 space-y-6">
                    <div className="flex justify-between items-end">
                       <span className="text-2xl font-black text-space-950 dark:text-white tracking-tighter">{b.category}</span>
                       <span className="text-[11px] font-black text-indigo-500 uppercase tracking-widest mono-num">{formatValue(spentInBase, baseCurrency)} / {formatValue(limitInBase, baseCurrency)}</span>
                    </div>
                    <div className="h-2.5 bg-slate-50 dark:bg-slate-950 rounded-full overflow-hidden">
                       <div className={`h-full rounded-full transition-all duration-1000 rx-accent-gradient`} style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            goals.length === 0 ? (
              <div className="h-full flex items-center justify-center py-32 bg-slate-50 dark:bg-slate-900/20 rounded-[3.5rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
                 <p className="text-[11px] font-black uppercase tracking-[0.6em] text-slate-300">Zero active objectives launched</p>
              </div>
           ) : goals.map((g) => {
              const currentInBase = convertAmount(g.current, g.currency, baseCurrency);
              const targetInBase = convertAmount(g.target, g.currency, baseCurrency);
              const percent = Math.min((currentInBase / targetInBase) * 100, 100);
              return (
                <div key={g.id} className="rx-accent-gradient p-12 rounded-[3.5rem] text-white shadow-2xl rx-glow-indigo flex items-center gap-12 hover:scale-[1.03] transition-all relative overflow-hidden group">
                  <div className="w-24 h-24 bg-white/20 backdrop-blur-xl rounded-[2.2rem] flex items-center justify-center shrink-0 border border-white/20 shadow-2xl transition-transform group-hover:rotate-12">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                  <div className="flex-1 space-y-6 relative z-10">
                    <div className="flex justify-between items-end">
                       <span className="text-3xl font-black tracking-tighter">{g.name}</span>
                       <span className="text-[11px] font-black text-indigo-100 uppercase tracking-[0.2em] mono-num">{formatValue(currentInBase, baseCurrency)} / {formatValue(targetInBase, baseCurrency)}</span>
                    </div>
                    <div className="h-4 bg-black/20 rounded-full overflow-hidden backdrop-blur-md shadow-inner">
                       <div className="h-full bg-white rounded-full transition-all duration-1000 shadow-[0_0_20px_rgba(255,255,255,0.6)]" style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none transition-opacity group-hover:opacity-10">
                     <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Budgets;
