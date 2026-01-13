
import React, { useState } from 'react';
import { AuthResponse } from '../types';
import { login, register, googleLogin } from '../api';
import Logo from './Logo';
import { useGoogleLogin } from '@react-oauth/google';

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

  const googleLoginAction = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      setError('');
      try {
        const res = await googleLogin(tokenResponse.access_token);
        onAuthSuccess(res.data);
      } catch (err: any) {
        setError(err.response?.data?.msg || err.message || 'Google Authentication Failed');
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      setError('Google Authentication Failed');
    },
    // Explicitly use implicit flow which doesn't require redirect URI validation on backend
    flow: 'implicit'
  });

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
    <div className="min-h-screen flex bg-space-50 dark:bg-space-950 transition-colors duration-700 relative overflow-hidden">

      {/* Left Sidebar - Branding & Aesthetics */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900 items-center justify-center p-12">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
          <div className="absolute -top-[20%] -left-[10%] w-[150%] h-[150%] animate-[spin_60s_linear_infinite] opacity-20 bg-[conic-gradient(from_0deg,transparent_0_340deg,white_360deg)] mix-blend-overlay blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600 rounded-full blur-[120px] opacity-40 animate-pulse"></div>
        </div>

        <div className="relative z-10 max-w-lg text-left">
          <div className="mb-12">
            <Logo size="lg" className="mb-8" showText={false} />
            <h1 className="text-6xl font-black text-white tracking-tighter mb-6 leading-tight">
              Financial <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Intelligence</span> <br />
              Redefined.
            </h1>
            <p className="text-slate-300 text-lg font-medium leading-relaxed mb-8">
              Gain absolute control over your capital streams. RupeeX leverages autonomous node architecture to provide real-time predictive analytics and seamless portfolio synchronization.
            </p>
            <div className="flex gap-4">
              <div className="px-6 py-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
                <div className="text-2xl font-bold text-white mb-1">99.9%</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Uptime</div>
              </div>
              <div className="px-6 py-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
                <div className="text-2xl font-bold text-white mb-1">256-bit</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Encryption</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        <div className="absolute top-8 right-8 z-50">
          <button
            onClick={toggleDarkMode}
            className="p-4 rounded-full text-slate-400 hover:text-indigo-500 transition-all bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>

        <div className="w-full max-w-md animate-in fade-in slide-in-from-right-8 duration-700">
          <div className="mb-12">
            <h2 className="text-4xl font-black text-space-950 dark:text-white tracking-tight mb-3">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-slate-500 font-medium">
              {isLogin ? 'Enter your credentials to access your node.' : 'Initialize a new portfolio node to get started.'}
            </p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-600 dark:text-red-400 text-sm font-bold flex items-center gap-3">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 ml-1">Email Address</label>
              <input
                required
                type="email"
                className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none rounded-2xl transition-all text-lg font-bold text-space-950 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-700"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 ml-1">Password</label>
              <input
                required
                type="password"
                className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none rounded-2xl transition-all text-lg font-bold text-space-950 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-700 font-mono"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <div className="pt-4 space-y-4">
              <button
                disabled={loading}
                className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="animate-spin h-6 w-6 border-4 border-white/20 border-t-white rounded-full mx-auto"></div>
                ) : (
                  <span>{isLogin ? 'Sign In' : 'Sign Up'}</span>
                )}
              </button>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
                <span className="flex-shrink-0 mx-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Or continue with</span>
                <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
              </div>

              <button
                type="button"
                onClick={() => googleLoginAction()}
                disabled={loading}
                className="w-full py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 text-slate-700 dark:text-slate-200 font-bold rounded-2xl transition-all flex items-center justify-center gap-3 group hover:shadow-md"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    className="text-[#4285F4] group-hover:fill-current"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    className="text-[#34A853] group-hover:fill-current"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    className="text-[#FBBC05] group-hover:fill-current"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    className="text-[#EA4335] group-hover:fill-current"
                  />
                </svg>
                <span>Google</span>
              </button>
            </div>
          </form>

          <div className="mt-12 text-center">
            <p className="text-slate-500 font-medium">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
