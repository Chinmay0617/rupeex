
import React, { useState } from 'react';
import { AuthResponse } from '../types';
import { login, register } from '../api';
import Logo from './Logo';

interface AuthPageProps {
  onAuthSuccess: (res: AuthResponse) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess, isDarkMode, toggleDarkMode }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = isLogin 
        ? await login(email, password) 
        : await register(email, password);
      onAuthSuccess(res.data);
    } catch (err: any) {
      setError(err.response?.data?.msg || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-space-50 dark:bg-space-950 transition-colors duration-700 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-10 dark:opacity-20">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-indigo-500 rounded-full blur-[160px]"></div>
      </div>

      <div className="absolute top-12 right-12 z-50">
        <button 
          onClick={toggleDarkMode}
          className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-indigo-500 transition-all bg-white dark:bg-slate-900 shadow-xl"
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>
      </div>

      <div className="w-full max-w-[540px] relative z-10 animate-in fade-in zoom-in-95 duration-1000">
        <div className="flex flex-col items-center mb-20">
          <Logo size="lg" className="mb-12" showText={false} />
          <h1 className="text-7xl font-black tracking-tighter text-space-950 dark:text-white mb-4">
            Rupee<span className="text-indigo-500">X</span>
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.7em] text-slate-400">
            Professional Portfolio Node
          </p>
        </div>

        <div className="mb-16">
          <h2 className="text-5xl font-black text-space-950 dark:text-white tracking-tighter mb-6 leading-none">
            {isLogin ? 'Access Portal' : 'Initialize Identity'}
          </h2>
          <p className="text-slate-500 text-xl font-medium tracking-tight">
            {isLogin ? 'Synchronize with your financial command center.' : 'Register a new professional asset identity.'}
          </p>
        </div>

        {error && (
          <div className="mb-10 p-6 bg-red-50 dark:bg-red-500/10 border-l-4 border-red-500 text-red-500 text-xs font-black uppercase tracking-widest animate-pulse">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-2">Identity Vector</label>
            <input 
              required
              type="email"
              className="w-full px-8 py-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none rounded-[1.8rem] transition-all text-xl font-bold text-space-950 dark:text-white placeholder:text-slate-200 dark:placeholder:text-slate-800"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="operator@nexus.com"
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-2">Access Key</label>
            <input 
              required
              type="password"
              className="w-full px-8 py-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none rounded-[1.8rem] transition-all text-xl font-bold text-space-950 dark:text-white placeholder:text-slate-200 dark:placeholder:text-slate-800"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <div className="pt-8">
            <button 
              disabled={loading}
              className="w-full py-6 rx-accent-gradient text-white font-black uppercase tracking-[0.4em] rounded-[1.8rem] transition-all shadow-2xl rx-glow-indigo active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? (
                <div className="animate-spin h-7 w-7 border-4 border-white/20 border-t-white rounded-full mx-auto"></div>
              ) : (
                <span>{isLogin ? 'Authenticate' : 'Initialize Node'}</span>
              )}
            </button>
          </div>
        </form>

        <div className="mt-20 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm font-black text-slate-400 hover:text-indigo-500 transition-colors border-b-2 border-transparent hover:border-indigo-500 pb-2 uppercase tracking-[0.2em]"
          >
            {isLogin ? "Request New Node Access" : 'Returning Operator Authenticate'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
