import React, { useMemo } from 'react';
import { Transaction, CATEGORY_COLORS, CurrencyCode, formatValue } from '../types';
import { getLocalPrediction } from '../intelligence';

interface PredictionsProps {
  transactions: Transaction[];
  baseCurrency: CurrencyCode;
}

const Predictions: React.FC<PredictionsProps> = ({ transactions, baseCurrency }) => {
  const prediction = useMemo(() => getLocalPrediction(transactions, baseCurrency), [transactions, baseCurrency]);

  // Changed threshold from 5 to 3
  if (transactions.length < 3) {
    return (
      <div className="bg-white dark:bg-slate-900 p-12 rounded-[40px] border border-slate-100 dark:border-slate-800 text-center shadow-sm">
        <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">Insufficient Ledger History</h3>
        <p className="text-slate-400 text-xs font-medium max-w-sm mx-auto uppercase tracking-wide">
          Local Intelligence Engine requires at least 3 transactions to build an initial behavioral model. 
          Currently tracking: {transactions.length}/3
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-900 dark:bg-brand-600 p-12 rounded-[40px] text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <h3 className="text-white/40 font-black uppercase tracking-widest text-[10px] mb-12">Predictive Expenditure Index (Local Model)</h3>
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-7xl font-black tracking-tighter mono-num">
                {prediction ? formatValue(prediction.predictedTotal, baseCurrency) : '---'}
              </span>
              <span className="text-white/40 font-bold text-sm uppercase">Next 30D</span>
            </div>
            <div className="flex items-center gap-10 mb-12">
               <div>
                 <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Floor Estimate</p>
                 <span className="text-2xl font-bold mono-num">{prediction ? formatValue(prediction.lowEstimate, baseCurrency) : '---'}</span>
               </div>
               <div>
                 <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Peak Estimate</p>
                 <span className="text-2xl font-bold mono-num">{prediction ? formatValue(prediction.highEstimate, baseCurrency) : '---'}</span>
               </div>
            </div>
            <p className="text-white/80 text-lg font-medium leading-relaxed max-w-xl">
              {prediction?.explanation}
            </p>
          </div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 -mr-20 -mt-20 rounded-full blur-[100px]"></div>
        </div>

        <div className="bg-white dark:bg-slate-900/60 p-10 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm overflow-y-auto max-h-[500px]">
          <h3 className="text-xs font-black uppercase tracking-widest mb-8 text-slate-400">Sector Velocity Impact</h3>
          <div className="space-y-6">
            {prediction && (Object.entries(prediction.categoryBreakdown) as [string, number][]).filter(([_, val]) => val > 0).map(([cat, val], i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-wide">
                   <span className="text-slate-400">{cat}</span>
                   <span className="text-slate-900 dark:text-white mono-num">{formatValue(val, baseCurrency)}</span>
                </div>
                <div className="h-1 bg-slate-50 dark:bg-slate-950 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-1000" 
                    style={{ width: `${(val / (prediction.predictedTotal || 1)) * 100}%`, backgroundColor: CATEGORY_COLORS[cat] }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Predictions;