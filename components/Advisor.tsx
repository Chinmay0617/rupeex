
import React, { useState, useRef, useEffect } from 'react';
import { Transaction, AdvisorMessage, CurrencyCode, CURRENCY_SYMBOLS } from '../types';
import { askAdvisor } from '../geminiService';

interface AdvisorProps {
  transactions: Transaction[];
  baseCurrency: CurrencyCode;
}

const Advisor: React.FC<AdvisorProps> = ({ transactions, baseCurrency }) => {
  const [messages, setMessages] = useState<AdvisorMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const symbol = CURRENCY_SYMBOLS[baseCurrency];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg: AdvisorMessage = { role: 'user', content: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await askAdvisor(input, transactions, messages);
      setMessages(prev => [...prev, { role: 'assistant', content: response, timestamp: Date.now() }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "RupeeX AI node is momentarily busy. Please try again.", timestamp: Date.now() }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto h-[82vh] flex flex-col bg-white dark:bg-slate-900/40 overflow-hidden rounded-[3.5rem] border border-indigo-50 dark:border-slate-800/40 rx-premium-shadow transition-all relative">
      <div className="px-12 py-10 border-b border-indigo-50 dark:border-slate-800/40 flex items-center justify-between bg-white dark:bg-slate-900/60 relative z-10">
         <div className="flex items-center gap-6">
           <div className="w-12 h-12 rx-accent-gradient rounded-[1.2rem] flex items-center justify-center text-white font-black text-xl shadow-2xl shadow-indigo-500/20">X</div>
           <div className="flex flex-col">
             <span className="text-xl font-black tracking-tighter text-space-950 dark:text-white leading-none mb-2">Advisor Intelligence</span>
             <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] opacity-80">Autonomous Wealth Node</span>
           </div>
         </div>
         <div className="flex items-center gap-4 bg-indigo-50/50 dark:bg-slate-800/50 px-6 py-3 rounded-2xl border border-indigo-100/30 dark:border-slate-800/40">
           <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
           <span className="text-[10px] font-black text-indigo-400 dark:text-slate-400 uppercase tracking-widest">Protocol Secured</span>
         </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-12 space-y-12 custom-scrollbar relative">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto py-20">
            <div className="w-24 h-24 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-[3rem] mb-10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 relative">
               <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20"><path d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zm-4 0H9v2h2V9z" /></svg>
               <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-cyan-400 rounded-full border-4 border-white dark:border-slate-900 flex items-center justify-center text-[10px] font-bold text-white shadow-lg">AI</div>
            </div>
            <p className="text-[11px] font-black uppercase tracking-[0.5em] text-space-950 dark:text-white mb-6">Neural Finance Terminal</p>
            <p className="text-lg font-medium leading-relaxed text-indigo-300 dark:text-slate-500">Query your portfolio velocity, tactical expense optimization, or strategic forecasting.</p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-5 duration-500`}>
            <div className={`max-w-[80%] px-10 py-7 text-[16px] leading-relaxed relative group shadow-sm ${
              m.role === 'user' 
                ? 'rx-accent-gradient text-white rounded-[2.5rem] rounded-tr-none font-bold shadow-2xl shadow-indigo-500/20' 
                : 'bg-indigo-50/50 dark:bg-slate-800/80 text-space-950 dark:text-slate-200 rounded-[2.5rem] rounded-tl-none border border-indigo-100/50 dark:border-slate-800/60 font-medium'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start animate-in fade-in">
            <div className="bg-indigo-50/30 dark:bg-slate-800/40 px-8 py-5 rounded-[2rem] flex gap-3 items-center border border-indigo-100/20 dark:border-slate-800/40">
               <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
               <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-150"></div>
               <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-300"></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-10 bg-white dark:bg-slate-900/60 border-t border-indigo-50 dark:border-slate-800/40 relative z-10">
        <div className="relative flex items-center group max-w-5xl mx-auto">
          <input 
            type="text" 
            className="w-full bg-indigo-50/50 dark:bg-slate-950/50 border border-indigo-100/50 dark:border-slate-800 rounded-[2.5rem] pl-10 pr-24 py-7 text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm dark:shadow-none placeholder:text-indigo-200 dark:text-white"
            placeholder="Audit history or request strategic guidance..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="absolute right-3.5 p-5 rx-accent-gradient text-white rounded-[1.8rem] hover:scale-105 transition-all disabled:opacity-20 shadow-2xl rx-glow-indigo"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Advisor;
