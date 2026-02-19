
import React, { useState } from 'react';
import { login, register } from '../api';
import Logo from './Logo';

interface AuthPageProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  onLoginSuccess: (token: string) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ isDarkMode, toggleDarkMode, onLoginSuccess }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let res;
      if (mode === 'signin') {
        res = await login({ email, password });
      } else {
        res = await register({ email, password });
      }

      console.log("Auth Response:", res);

      const token = res.data.token;
      if (token) {
        onLoginSuccess(token);
      } else {
        setError("Server returned success but no token. Check console.");
      }

    } catch (err: any) {
      console.error("Auth Error:", err);

      if (!err.response) {
        setError("Network Error: Could not reach backend. Please check your internet connection.");
      } else {
        const status = err.response.status;
        const msg = err.response.data?.msg || err.response.statusText;
        setError(`Failed (${status}): ${msg}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] dark:bg-[#020617] transition-all duration-700 relative overflow-hidden">

      {/* Background Ambience & Noise */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-indigo-500/20 dark:bg-indigo-500/10 blur-[130px] rounded-full mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDuration: '10s' }} />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-sky-500/20 dark:bg-sky-500/10 blur-[130px] rounded-full mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDuration: '15s' }} />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>

      <div className="fixed top-6 right-6 z-50">
        <button
          onClick={toggleDarkMode}
          className="p-3 rounded-full text-slate-400 hover:text-indigo-500 transition-all bg-white/50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-800 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-sm"
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>
      </div>

      <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-12 lg:gap-24 p-6 z-10">

        <div className="hidden lg:block lg:w-1/2 text-left space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
          <div>
            <Logo size="lg" className="mb-8" />
            <h1 className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter leading-[1.1] mb-6">
              Wealth <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-500">Intelligence</span> <br />
              Platform.
            </h1>
            <p className="text-xl text-slate-500 dark:text-slate-400 font-medium max-w-lg leading-relaxed">
              Join the autonomous financial network. Real-time analytics, predictive modeling, and absolute control.
            </p>
          </div>
        </div>

        <div className="w-full max-w-[480px] relative">
          <div className="relative bg-white/70 dark:bg-[#0f172a]/70 rounded-[2rem] border border-white/50 dark:border-slate-700/50 shadow-2xl shadow-indigo-500/10 backdrop-blur-xl overflow-hidden p-6 sm:p-10 animate-in fade-in zoom-in-95 duration-500">

            <div className="lg:hidden flex justify-center mb-8">
              <Logo size="md" />
            </div>

            <div className="mb-6 text-center">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
                {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">
                {mode === 'signin'
                  ? 'Enter your credentials to access the node.'
                  : 'Initialize your financial identity.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl text-xs font-bold text-center animate-pulse">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-slate-500 dark:text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-1.5 ml-1">Email Address</label>
                <input
                  type="email"
                  required
                  className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-slate-500 dark:text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-1.5 ml-1">Password</label>
                <input
                  type="password"
                  required
                  className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold uppercase tracking-wider text-xs rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                {mode === 'signin' ? 'Access Terminal' : 'Initialize Node'}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 text-center">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {mode === 'signin' ? "Don't have an account?" : "Already have an account?"}
                <button
                  type="button"
                  onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(null); }}
                  className="ml-2 text-indigo-600 dark:text-indigo-400 font-bold hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                >
                  {mode === 'signin' ? 'Sign up' : 'Log in'}
                </button>
              </p>
            </div>

          </div>

          {/* Decorative Blobs */}
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full blur-2xl opacity-20 animate-bounce" style={{ animationDuration: '3s' }}></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-tr from-sky-500 to-teal-500 rounded-full blur-2xl opacity-20 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>

        </div>
      </div>
    </div>
  );
};

export default AuthPage;
