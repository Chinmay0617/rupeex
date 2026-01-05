
import React from 'react';
import Logo from './Logo';
import { CurrencyCode } from '../types';

type Tab = 'dashboard' | 'transactions' | 'predictions' | 'budgets' | 'reports' | 'advisor';

interface SidebarProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  baseCurrency: CurrencyCode;
  setBaseCurrency: (c: CurrencyCode) => void;
  userContext: { name: string; email: string };
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeTab, setActiveTab, isDarkMode, toggleDarkMode, baseCurrency, setBaseCurrency, userContext, onLogout
}) => {
  const menuItems: { id: Tab; label: string; icon: React.ReactElement }[] = [
    { id: 'dashboard', label: 'Command', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg> },
    { id: 'transactions', label: 'Ledger', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg> },
    { id: 'budgets', label: 'Vaults', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg> },
    { id: 'predictions', label: 'Forecast', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg> },
    { id: 'advisor', label: 'Advisor', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg> },
    { id: 'reports', label: 'Audits', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg> },
  ];

  const currencies: CurrencyCode[] = ['USD', 'INR', 'EUR', 'GBP', 'JPY'];

  return (
    <aside className="w-80 bg-slate-50 dark:bg-space-950 border-r border-slate-200 dark:border-slate-800/60 hidden lg:flex flex-col h-full transition-all">
      <div className="p-10 flex-1 flex flex-col overflow-y-auto custom-scrollbar">
        <Logo className="mb-14" size="md" />

        <div className="mb-6 ml-4">
          <span className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400">Navigation Node</span>
        </div>

        <nav className="space-y-2 mb-14">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-5 px-6 py-5 rounded-2xl text-[13px] font-black transition-all duration-300 ${activeTab === item.id
                  ? 'sidebar-item-active'
                  : 'text-slate-500 hover:text-brand-600 hover:bg-white dark:hover:bg-slate-900/40'
                }`}
            >
              <span className={activeTab === item.id ? 'text-brand-500' : 'text-slate-400 group-hover:text-brand-500 transition-colors'}>{item.icon}</span>
              <span className="tracking-[0.1em] uppercase">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto bg-white dark:bg-slate-900/40 p-5 rounded-[1.5rem] border border-slate-100 dark:border-slate-800/50 shadow-sm">
          <div className="flex justify-between items-center mb-4 px-1">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Base Currency</span>
            <div className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse"></div>
          </div>

          <div className="flex flex-wrap gap-2">
            {currencies.map(curr => (
              <button
                key={curr}
                onClick={() => setBaseCurrency(curr)}
                className={`flex-1 min-w-[3.5rem] py-2 rounded-xl text-[10px] font-black transition-all border ${baseCurrency === curr
                    ? 'bg-brand-500 text-white border-brand-500 shadow-md transform scale-105'
                    : 'bg-slate-50 dark:bg-slate-950/30 text-slate-500 border-slate-100 dark:border-slate-800 hover:border-brand-300 dark:hover:border-brand-700 hover:text-brand-600'
                  }`}
              >
                {curr}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-10 space-y-4">
        <div className="flex items-center gap-4 p-5 bg-white dark:bg-slate-900/40 rounded-[2rem] border border-slate-100 dark:border-slate-800/50 shadow-sm">
          <div className="w-12 h-12 neo-gradient rounded-2xl flex items-center justify-center text-white text-sm font-black shadow-xl">
            {userContext.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 truncate leading-none mb-2">OPERATOR</span>
            <span className="text-sm font-black truncate text-slate-900 dark:text-white">{userContext.name}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={toggleDarkMode}
            className="flex-1 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-brand-600 transition-all flex justify-center items-center shadow-sm hover:scale-105"
            title="Toggle Protocol Theme"
          >
            {isDarkMode ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            )}
          </button>
          <button
            onClick={onLogout}
            className="flex-1 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-rose-600 transition-all flex justify-center items-center shadow-sm hover:scale-105"
            title="De-authorize Session"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
