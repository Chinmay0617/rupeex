
import React, { useState, useEffect } from 'react';
import { User, Transaction, Budget, SavingsGoal, CurrencyCode } from './types';
import * as api from './api';
import Dashboard from './components/Dashboard';
import TransactionList from './components/TransactionList';
import AddTransaction from './components/AddTransaction';
import Predictions from './components/Predictions';
import Budgets from './components/Budgets';
import Reports from './components/Reports';
import Advisor from './components/Advisor';
import Sidebar from './components/Sidebar';
import AuthPage from './components/AuthPage';
import { useUser, useAuth } from '@clerk/clerk-react';

type Tab = 'dashboard' | 'transactions' | 'predictions' | 'budgets' | 'reports' | 'advisor';

const App: React.FC = () => {
  const { user: clerkUser, isLoaded, isSignedIn } = useUser();
  const { getToken, signOut } = useAuth();


  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('fintrack_theme') !== 'light');
  const [baseCurrency, setBaseCurrency] = useState<CurrencyCode>(() =>
    (currentUser?.baseCurrency as CurrencyCode) || 'USD'
  );

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(false);

  // Sync Clerk User with Mongo User
  useEffect(() => {
    const syncUser = async () => {
      if (isSignedIn && clerkUser) {
        try {
          const token = await getToken();
          api.setAuthToken(token);

          // Fetch Mongo User Profile (creates user in Mongo if needed via middleware logic, or explicit endpoint logic)
          // Note: The middleware creates/syncs the user on first request.
          const res = await api.getProfile();
          setCurrentUser(res.data.user);

        } catch (err: any) {
          console.error("Error syncing user:", err);
          setSyncError(err.response?.data?.msg || err.message || "Failed to sync user identity.");
        }
      } else {
        api.setAuthToken(null);
        setCurrentUser(null);
      }
    };

    if (isLoaded) {
      syncUser();
    }
  }, [isSignedIn, isLoaded, clerkUser, getToken]);

  useEffect(() => {
    if (currentUser) {
      // Only load data when we have the mongo user details
      loadData();
    }
  }, [currentUser, baseCurrency]); // trigger when currentUser is set

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem('fintrack_theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const loadData = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const [txResponse, budgetResponse, goalResponse] = await Promise.all([
        api.getTransactions(),
        api.getBudgets(),
        api.getGoals(),
      ]);
      setTransactions(txResponse.data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      setBudgets(budgetResponse.data);
      setGoals(goalResponse.data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTransaction = async (txData: Omit<Transaction, 'id' | 'userId'>) => {
    if (!currentUser) return;

    try {
      if (editingTransaction) {
        await api.updateTransaction(editingTransaction._id, txData);
      } else {
        await api.addTransaction(txData);
      }
      await loadData();
      setIsAddModalOpen(false);
      setEditingTransaction(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    if (!currentUser) return;
    try {
      await api.deleteTransaction(id);
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditTransaction = (tx: Transaction) => {
    setEditingTransaction(tx);
    setIsAddModalOpen(true);
  };

  const handleSaveBudget = async (budget: Budget) => {
    try {
      await api.saveBudget({ ...budget, currency: baseCurrency });
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveGoal = async (goal: SavingsGoal) => {
    try {
      await api.saveGoal({ ...goal, currency: baseCurrency });
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    signOut();
    setCurrentUser(null);
  };


  if (!isLoaded) {
    return <div className="min-h-screen flex items-center justify-center bg-space-950 text-white font-bold">Initializing Node...</div>;
  }

  if (!isSignedIn) {
    return (
      <AuthPage
        isDarkMode={isDarkMode}
        toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      />
    );
  }

  if (syncError) {
    return (
      <div className="min-h-screen flex flex-col gap-4 items-center justify-center bg-space-950 text-white p-8 text-center max-w-2xl mx-auto">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-black text-red-400">Identity Synchronization Failed</h2>
        <p className="text-slate-400 font-mono text-sm bg-slate-900 p-4 rounded-xl border border-slate-800 w-full overflow-hidden text-wrap break-all">
          {syncError}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-3 bg-brand-600 rounded-xl font-bold hover:bg-brand-500 transition-all"
        >
          Retry Connection
        </button>
        <p className="text-xs text-slate-600 mt-8">
          If this persists, verify "CLERK_SECRET_KEY" and "MONGO_URI" in production environment variables.
        </p>
      </div>
    )
  }

  if (!currentUser) {
    return <div className="min-h-screen flex items-center justify-center bg-space-950 text-white font-bold animate-pulse">Syncing Identity...</div>;
  }


  return (
    <div className="flex h-screen bg-space-50 dark:bg-space-950 transition-all duration-500 overflow-hidden">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDarkMode={isDarkMode}
        toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        baseCurrency={baseCurrency}
        setBaseCurrency={setBaseCurrency}
        userContext={{ name: currentUser.email.split('@')[0], email: currentUser.email }}
        onLogout={handleLogout}
      />

      <main className="flex-1 overflow-y-auto p-6 lg:p-12 custom-scrollbar relative">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 max-w-[1400px] mx-auto w-full gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
              {activeTab === 'dashboard' ? 'Operations' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h1>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-500">Autonomous Node active</span>
              <div className="w-1 h-1 bg-brand-500 rounded-full animate-ping"></div>
            </div>
          </div>
          <button
            onClick={() => {
              setEditingTransaction(null);
              setIsAddModalOpen(true);
            }}
            className="group px-8 py-4 neo-gradient text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.25em] flex items-center gap-4 transition-all hover:scale-[1.03] active:scale-95 shadow-xl premium-glow"
          >
            <svg className="h-4 w-4 transform group-hover:rotate-90 transition-transform duration-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Commit Entry
          </button>
        </header>

        <div className="max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000">
          {loading ? (
            <div className="flex flex-col justify-center items-center py-48 gap-8">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-500/10 border-t-brand-500"></div>
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 animate-pulse">Syncing Distributed Ledger...</p>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && <Dashboard transactions={transactions} budgets={budgets} isDarkMode={isDarkMode} baseCurrency={baseCurrency} />}
              {activeTab === 'transactions' && <TransactionList transactions={transactions} onDelete={handleDeleteTransaction} onEdit={handleEditTransaction} baseCurrency={baseCurrency} isDarkMode={isDarkMode} />}
              {activeTab === 'predictions' && <Predictions transactions={transactions} baseCurrency={baseCurrency} />}
              {activeTab === 'budgets' && <Budgets budgets={budgets} goals={goals} transactions={transactions} userId={currentUser.userId} onSaveBudget={handleSaveBudget} onSaveGoal={handleSaveGoal} baseCurrency={baseCurrency} />}
              {activeTab === 'reports' && <Reports transactions={transactions} baseCurrency={baseCurrency} />}
              {activeTab === 'advisor' && <Advisor transactions={transactions} baseCurrency={baseCurrency} />}
            </>
          )}
        </div>
      </main>

      {isAddModalOpen && (
        <AddTransaction
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingTransaction(null);
          }}
          onSave={handleSaveTransaction}
          editingTransaction={editingTransaction || undefined}
          history={transactions}
          baseCurrency={baseCurrency}
        />
      )}
    </div>
  );
};

export default App;
