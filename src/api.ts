import axios from 'axios';
import { Transaction, Budget, SavingsGoal } from './types';

const API_BASE_URL = import.meta.env.PROD ? '/api' : 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Set auth token helper
export const setAuthToken = (token: string | null) => {
    if (token) {
        api.defaults.headers.common['x-auth-token'] = token;
        localStorage.setItem('auth_token', token);
    } else {
        delete api.defaults.headers.common['x-auth-token'];
        localStorage.removeItem('auth_token');
    }
};

// Initialize the auth token from localStorage if it exists
const token = localStorage.getItem('auth_token');
if (token) {
    setAuthToken(token);
}


// Auth
export const register = (userData: any) => api.post('/auth/register', userData);
export const login = (userData: any) => api.post('/auth/login', userData);
export const getProfile = () => api.get('/auth/me');



// Transactions

export const getTransactions = () => api.get<Transaction[]>('/transactions');

export const addTransaction = (tx: Omit<Transaction, 'id' | 'userId'>) => api.post<Transaction>('/transactions', tx);

export const updateTransaction = (id: string, tx: Partial<Transaction>) => api.put<Transaction>(`/transactions/${id}`, tx);

export const deleteTransaction = (id: string) => api.delete(`/transactions/${id}`);



// Budgets

export const getBudgets = () => api.get<Budget[]>('/budgets');

export const saveBudget = (budget: Partial<Budget>) => api.post<Budget>('/budgets', budget);

export const deleteBudget = (id: string) => api.delete(`/budgets/${id}`);



// Savings Goals

export const getGoals = () => api.get<SavingsGoal[]>('/goals');

export const saveGoal = (goal: Partial<SavingsGoal>) => api.post<SavingsGoal>('/goals', goal);

export const deleteGoal = (id: string) => api.delete(`/goals/${id}`);

