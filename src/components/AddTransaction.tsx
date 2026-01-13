import React, { useState, useRef, useEffect } from 'react';
import { Transaction, TransactionType, CATEGORIES, CurrencyCode, CURRENCY_SYMBOLS } from '../types';
import { parseNaturalLanguageTransaction, scanReceipt } from '../geminiService';
import { calculateAnomalyScore } from '../intelligence';

interface AddTransactionProps {
  onClose: () => void;
  onSave: (tx: Omit<Transaction, 'id' | 'userId'>) => void;
  editingTransaction?: Transaction;
  history: Transaction[];
  baseCurrency: CurrencyCode;
}

const AddTransaction: React.FC<AddTransactionProps> = ({ onClose, onSave, editingTransaction, history, baseCurrency }) => {
  const [tab, setTab] = useState<'manual' | 'scan' | 'nlp'>('manual');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('EXPENSE');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isRecurring, setIsRecurring] = useState(false);
  const [confidence, setConfidence] = useState<number | undefined>();
  const [aiGenerated, setAiGenerated] = useState(false);
  const [aiSource, setAiSource] = useState<'AI_NLP' | 'AI_SCAN' | null>(null);

  const [nlpText, setNlpText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const symbol = CURRENCY_SYMBOLS[baseCurrency];

  useEffect(() => {
    if (editingTransaction) {
      setDescription(editingTransaction.description);
      setAmount(editingTransaction.amount.toString());
      setType(editingTransaction.type);
      setCategory(editingTransaction.category);
      setDate(editingTransaction.date);
      setIsRecurring(editingTransaction.isRecurring || false);
      setAiGenerated(editingTransaction.aiGenerated || false);
      setConfidence(editingTransaction.confidence);
      setAiSource(editingTransaction.source === 'MANUAL' ? null : (editingTransaction.source as any));
      setTab('manual');
    } else {
      resetForm();
    }
  }, [editingTransaction]);

  const resetForm = () => {
    setDescription('');
    setAmount('');
    setType('EXPENSE');
    setCategory(CATEGORIES[0]);
    setDate(new Date().toISOString().split('T')[0]);
    setIsRecurring(false);
    setAiGenerated(false);
    setAiSource(null);
    setConfidence(undefined);
  };

  const processFile = (file: File) => {
    if (!file || !file.type.startsWith('image/')) {
      setError('Invalid file format. Please upload a clear image asset.');
      return;
    }

    setLoading(true);
    setError(null);
    const reader = new FileReader();

    reader.onloadend = async () => {
      try {
        const result = await scanReceipt(reader.result as string, file.type);
        setDescription(result.merchant || 'Asset Entry (Scanned)');
        setAmount(result.amount?.toString() || '');
        setCategory(result.category && CATEGORIES.includes(result.category) ? result.category : CATEGORIES[0]);
        setConfidence(result.confidence || 0.85);
        setAiGenerated(true);
        setAiSource('AI_SCAN');
        if (result.date && /^\d{4}-\d{2}-\d{2}$/.test(result.date)) setDate(result.date);
        setTab('manual');
      } catch (err: any) {
        setError(err.message || `Vision analysis failed. Please ensure the document is flat and well-lit.`);
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleManualSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) return;

    setLoading(true);
    const numericAmount = parseFloat(amount);

    // Using local intelligence for anomaly score instead of API
    const anomalyScore = calculateAnomalyScore({ amount: numericAmount, category, description }, history, baseCurrency);

    onSave({
      description,
      amount: numericAmount,
      type,
      category,
      date,
      currency: baseCurrency,
      source: aiGenerated && aiSource ? aiSource : 'MANUAL',
      confidence,
      isEdited: !!editingTransaction || aiGenerated,
      aiGenerated,
      isRecurring,
      anomalyScore
    });
    setLoading(false);
  };

  const handleNlpProcess = async () => {
    if (!nlpText) return;
    setLoading(true);
    setError(null);
    try {
      const result = await parseNaturalLanguageTransaction(nlpText);
      setDescription(result.description || '');
      setAmount(result.amount?.toString() || '');
      setType(result.type as TransactionType || 'EXPENSE');
      setCategory(result.category && CATEGORIES.includes(result.category) ? result.category : CATEGORIES[0]);
      setConfidence(result.confidence);
      setAiGenerated(true);
      setAiSource('AI_NLP');
      setTab('manual');
    } catch (err) {
      setError('NLP Node failed to parse. Reverting to manual entry.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => setIsDragging(false);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div className="fixed inset-0 bg-space-950/80 backdrop-blur-xl flex items-center justify-center p-8 z-[100] animate-in fade-in duration-500">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 transition-all relative">
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 dark:border-slate-800/60 bg-white dark:bg-slate-900/60">
          <div>
            <h2 className="text-2xl font-black tracking-tighter text-space-950 dark:text-white leading-none mb-2">
              {editingTransaction ? 'Modify Asset Entry' : 'Commit Asset Entry'}
            </h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol Version 5.0.0 (Local IQ)</p>
          </div>
          <button onClick={onClose} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-all text-slate-300">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {!editingTransaction && (
          <div className="p-1.5 bg-slate-50 dark:bg-slate-950/60 mx-8 mt-6 rounded-2xl flex gap-1.5 border border-slate-200/50 dark:border-slate-800/40 shadow-inner">
            {(['manual', 'nlp', 'scan'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-3 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${tab === t ? 'bg-white dark:bg-brand-500 text-slate-950 dark:text-white shadow-xl' : 'text-slate-400 hover:text-brand-500'
                  }`}
              >
                {t === 'nlp' ? 'Smart Text' : t === 'scan' ? 'OCR Vision' : 'Manual'}
              </button>
            ))}
          </div>
        )}

        <div className="p-8">
          {error && <div className="mb-8 p-6 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-900/30 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-3xl leading-relaxed">{error}</div>}

          {tab === 'manual' && (
            <form onSubmit={handleManualSave} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-2">Description</label>
                  <input
                    required
                    className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-950/40 border-none rounded-2xl text-sm font-bold focus:ring-4 focus:ring-brand-500/10 dark:text-white transition-all"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="e.g. Asset Acquisition: Starbucks"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-2">Value ({symbol})</label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-950/40 border-none rounded-2xl text-sm font-bold focus:ring-4 focus:ring-brand-500/10 dark:text-white transition-all mono-num"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-2">Flux Direction</label>
                  <select
                    className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-950/40 border-none rounded-2xl text-sm font-bold focus:ring-4 focus:ring-brand-500/10 dark:text-white transition-all"
                    value={type}
                    onChange={e => setType(e.target.value as TransactionType)}
                  >
                    <option value="EXPENSE">Outflow (Expense)</option>
                    <option value="INCOME">Inflow (Income)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-2">Sector (Category)</label>
                  <select
                    className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-950/40 border-none rounded-2xl text-sm font-bold focus:ring-4 focus:ring-brand-500/10 dark:text-white transition-all"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-2">Time Vector (Date)</label>
                  <input
                    type="date"
                    required
                    className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-950/40 border-none rounded-2xl text-sm font-bold focus:ring-4 focus:ring-brand-500/10 dark:text-white transition-all"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center gap-5 p-4 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-100 dark:border-slate-800/40">
                <input
                  type="checkbox"
                  checked={isRecurring}
                  onChange={e => setIsRecurring(e.target.checked)}
                  className="w-5 h-5 rounded-lg border-none text-brand-500 focus:ring-brand-500/20"
                />
                <span className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Mark as Recurring Subscription Node</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 neo-gradient text-white rounded-2xl text-sm font-bold uppercase tracking-widest shadow-lg hover:shadow-xl hover:shadow-brand-500/20 transition-all flex items-center justify-center gap-3 active:scale-95"
              >
                {loading ? <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" /> : editingTransaction ? 'Update Entry' : 'Commit Transaction'}
              </button>
            </form>
          )}

          {tab === 'nlp' && !editingTransaction && (
            <div className="space-y-8">
              <textarea
                className="w-full h-40 p-6 bg-slate-50 dark:bg-slate-950/40 border-none rounded-3xl text-sm font-bold focus:ring-4 focus:ring-brand-500/10 resize-none dark:text-white placeholder:text-slate-300 transition-all"
                placeholder={`e.g. Spent ${symbol}1,200 at Terminal 3 for fuel...`}
                value={nlpText}
                onChange={e => setNlpText(e.target.value)}
              />
              <button
                onClick={handleNlpProcess}
                disabled={loading || !nlpText}
                className="w-full py-4 neo-gradient disabled:opacity-30 text-white rounded-2xl text-sm font-bold uppercase tracking-widest transition-all flex items-center justify-center active:scale-95 shadow-lg hover:shadow-xl hover:shadow-brand-500/20"
              >
                {loading ? <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" /> : 'Run Neural Extraction'}
              </button>
            </div>
          )}

          {tab === 'scan' && !editingTransaction && (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              className={`h-60 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center gap-6 cursor-pointer group transition-all duration-300 ${isDragging
                ? 'border-brand-500 bg-brand-500/5 scale-[1.02] shadow-2xl'
                : 'border-slate-200 dark:border-slate-800 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800/20'
                }`}
            >
              <div className={`p-6 rounded-[2rem] transition-all duration-500 shadow-xl ${isDragging ? 'bg-brand-500 text-white scale-125' : 'bg-slate-50 dark:bg-slate-800 text-brand-500 group-hover:scale-110'
                }`}>
                {loading ? (
                  <div className="w-10 h-10 border-4 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </div>
              <div className="text-center px-8">
                <p className={`text-xs font-black uppercase tracking-[0.4em] mb-2 ${isDragging ? 'text-brand-500' : 'text-slate-400'}`}>
                  {loading ? 'Analyzing Asset' : (isDragging ? 'Release to Scan' : 'Audit Documentation Upload')}
                </p>
                <p className="text-[10px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-widest leading-relaxed">
                  {loading ? 'Scanning image via Gemini 3 Pro...' : 'Drag & Drop or Click to select image'}
                </p>
              </div>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddTransaction;