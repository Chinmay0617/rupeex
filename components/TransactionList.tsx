
import React, { useState, useMemo } from 'react';
import { Transaction, CATEGORY_COLORS, CATEGORIES, CurrencyCode, convertAmount, formatValue } from '../types';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  onEdit: (transaction: Transaction) => void;
  baseCurrency: CurrencyCode;
  isDarkMode: boolean;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, onDelete, onEdit, baseCurrency, isDarkMode }) => {
  const [filter, setFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const filtered = useMemo(() => {
    return transactions.filter(t => {
      const matchesSearch = t.description.toLowerCase().includes(filter.toLowerCase());
      const matchesCategory = categoryFilter === 'ALL' || t.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [transactions, filter, categoryFilter]);

  return (
    <div className="space-y-10 max-w-[1400px] mx-auto pb-20">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-6 bg-white dark:bg-slate-900/30 p-4 rounded-[2.5rem] glass-card border-none shadow-xl">
        <div className="flex-1 relative group">
           <svg className="absolute left-7 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-brand-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
           <input 
            type="text" 
            placeholder="Search Global Ledger..."
            className="w-full bg-slate-50 dark:bg-slate-950/40 border-none rounded-2xl pl-16 pr-8 py-5 text-sm font-bold focus:ring-4 focus:ring-brand-500/10 placeholder:text-slate-400 dark:text-white transition-all"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        <div className="h-10 w-px bg-slate-100 dark:bg-slate-800 hidden lg:block"></div>
        <div className="relative group">
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="appearance-none bg-slate-50 dark:bg-slate-950/40 border-none rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] px-10 py-5 focus:ring-4 focus:ring-brand-500/10 text-slate-600 dark:text-slate-400 cursor-pointer hover:bg-white dark:hover:bg-slate-900 transition-all min-w-[200px]"
          >
            <option value="ALL">All Sectors</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <svg className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
        </div>
      </div>

      <div className="glass-card rounded-[3.5rem] overflow-hidden border-none shadow-2xl">
        {filtered.length === 0 ? (
          <div className="py-40 text-center space-y-6">
             <div className="w-24 h-24 bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] mx-auto flex items-center justify-center border border-slate-100 dark:border-slate-800">
               <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
             </div>
             <p className="text-[12px] font-black uppercase tracking-[0.5em] text-slate-400">Ledger Entry Null</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50 dark:divide-slate-800/50">
            {filtered.map((t) => {
              const convertedValue = convertAmount(t.amount, t.currency, baseCurrency);
              return (
                <div key={t.id} className="group flex items-center justify-between px-10 py-8 hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-all duration-300">
                  <div className="flex items-center gap-8">
                    <div 
                      className="w-16 h-16 rounded-[1.8rem] flex items-center justify-center shrink-0 border border-white dark:border-slate-800 shadow-sm relative overflow-hidden"
                      style={{ backgroundColor: isDarkMode ? `${CATEGORY_COLORS[t.category]}15` : '#FFFFFF' }}
                    >
                      <div className="absolute inset-0 opacity-5" style={{ backgroundColor: CATEGORY_COLORS[t.category] }}></div>
                      <div className="w-4 h-4 rounded-full shadow-lg z-10" style={{ backgroundColor: CATEGORY_COLORS[t.category] }}></div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-xl font-black text-slate-900 dark:text-white leading-none group-hover:text-brand-600 transition-colors tracking-tight">{t.description}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.date}</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                        <span className="text-[10px] font-black text-brand-600 dark:text-brand-400 uppercase tracking-[0.15em]">{t.category}</span>
                        {t.source !== 'MANUAL' && (
                          <div className="flex items-center gap-1.5 bg-brand-500/10 px-3 py-1 rounded-full border border-brand-500/10">
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse"></div>
                            <span className="text-[9px] font-black text-brand-600 dark:text-brand-400 uppercase tracking-widest">AI Audit</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-10">
                    <div className="text-right">
                      <span className={`text-3xl font-black tracking-tighter mono-num ${t.type === 'INCOME' ? 'text-emerald-500' : 'text-slate-900 dark:text-white'}`}>
                        {t.type === 'INCOME' ? '+' : '-' }{formatValue(convertedValue, baseCurrency)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <button 
                        onClick={() => onEdit(t)}
                        className="p-4 text-slate-500 hover:text-brand-600 transition-all bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-slate-100 dark:border-slate-700 hover:scale-110"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      </button>
                      <button 
                        onClick={() => onDelete(t.id)}
                        className="p-4 text-slate-400 hover:text-rose-600 transition-all bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-slate-100 dark:border-slate-700 hover:scale-110"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionList;
