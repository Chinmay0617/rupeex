
import React, { useState } from 'react';
import { SignIn, SignUp } from '@clerk/clerk-react';
import { dark } from '@clerk/themes';
import Logo from './Logo';

interface AuthPageProps {
  onAuthSuccess?: (res: any) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ isDarkMode, toggleDarkMode }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  const commonAppearance = {
    baseTheme: isDarkMode ? dark : undefined,
    layout: {
      socialButtonsPlacement: 'bottom' as const,
      socialButtonsVariant: 'blockButton' as const
    },
    elements: {
      rootBox: "w-full",
      card: "shadow-none bg-transparent p-0",
      headerTitle: "hidden", // We use our own header
      headerSubtitle: "hidden", // We use our own subtitle
      socialButtonsBlockButton: "h-12 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all rounded-xl",
      socialButtonsBlockButtonText: "font-bold text-slate-600 dark:text-slate-300",
      dividerLine: "bg-slate-200 dark:bg-slate-800",
      dividerText: "text-slate-400 font-bold text-[10px] tracking-widest uppercase",
      formFieldInput: "h-12 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400",
      formFieldLabel: "text-slate-500 dark:text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-1.5",
      formButtonPrimary: "h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold uppercase tracking-wider text-xs rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98]",
      footer: "!hidden", // Force hide default footer
      footerAction: "!hidden",
      identityPreviewText: "text-slate-600 dark:text-slate-300 font-medium",
      identityPreviewEditButton: "text-indigo-600 dark:text-indigo-400 font-bold"
    },
    variables: {
      borderRadius: '0.75rem',
      fontSize: '15px',
      colorPrimary: '#4f46e5',
      fontFamily: '"Plus Jakarta Sans", sans-serif'
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

      {/* Main Container */}
      <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-12 lg:gap-24 p-6 z-10">

        {/* Brand Section */}
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

          <div className="flex items-center gap-6 pt-4">
            <div className="px-5 py-3 rounded-2xl bg-white/40 dark:bg-slate-800/40 backdrop-blur-md border border-slate-200 dark:border-slate-700/50 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-sm font-bold text-slate-600 dark:text-slate-300">System Operational</span>
            </div>
            <div className="px-5 py-3 rounded-2xl bg-white/40 dark:bg-slate-800/40 backdrop-blur-md border border-slate-200 dark:border-slate-700/50">
              <span className="text-sm font-bold text-slate-600 dark:text-slate-300">v2.4.0-stable</span>
            </div>
          </div>
        </div>

        {/* Login/Signup Card */}
        <div className="w-full max-w-[480px] relative">

          <div className="relative bg-white/70 dark:bg-[#0f172a]/70 rounded-[2rem] border border-white/50 dark:border-slate-700/50 shadow-2xl shadow-indigo-500/10 backdrop-blur-xl overflow-hidden p-6 sm:p-10 animate-in fade-in zoom-in-95 duration-500">

            {/* Mobile Logo */}
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

            {mode === 'signin' ? (
              <SignIn appearance={commonAppearance} />
            ) : (
              <SignUp appearance={commonAppearance} />
            )}

            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-center">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {mode === 'signin' ? "Don't have an account?" : "Already have an account?"}
                <button
                  onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                  className="ml-2 text-indigo-600 dark:text-indigo-400 font-bold hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                >
                  {mode === 'signin' ? 'Sign up' : 'Log in'}
                </button>
              </p>
            </div>

          </div>

          {/* Decorative elements around card */}
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full blur-2xl opacity-20 animate-bounce" style={{ animationDuration: '3s' }}></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-tr from-sky-500 to-teal-500 rounded-full blur-2xl opacity-20 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>

        </div>
      </div>

    </div>
  );
};

export default AuthPage;
