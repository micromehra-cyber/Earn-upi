import React, { useState } from 'react';
import { Transaction } from '../types';
import { formatINR, formatCoins } from '../utils/upi';
import { soundFx } from '../utils/audio';
import { ArrowUpRight, ArrowDownLeft, FileText, CheckCircle2, Clock, Filter, Search } from 'lucide-react';

interface TransactionHistoryProps {
  transactions: Transaction[];
  onViewReceipt: (txn: Transaction) => void;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions,
  onViewReceipt,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'WITHDRAWALS' | 'EARNINGS'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = transactions.filter((t) => {
    if (filter === 'WITHDRAWALS' && t.type !== 'upi_withdrawal') return false;
    if (filter === 'EARNINGS' && t.type === 'upi_withdrawal') return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        t.title.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q) ||
        (t.utrNumber && t.utrNumber.toLowerCase().includes(q)) ||
        (t.upiId && t.upiId.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4 text-white">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <h3 className="font-extrabold text-base text-white">Transaction Ledger</h3>
          <p className="text-xs text-slate-400">Track all ad rewards & instant UPI withdrawals with UTR IDs</p>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          {(['ALL', 'WITHDRAWALS', 'EARNINGS'] as const).map((f) => (
            <button
              key={f}
              onClick={() => {
                soundFx.playClick();
                setFilter(f);
              }}
              className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                filter === f
                  ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {f === 'ALL' ? 'All' : f === 'WITHDRAWALS' ? 'UPI Payouts' : 'Ad Earnings'}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
        <input
          type="text"
          placeholder="Search by Txn ID, UTR Number, or UPI ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 focus:border-slate-700 text-slate-200 text-xs pl-9 pr-3 py-2 rounded-xl outline-none"
        />
      </div>

      {/* List */}
      <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
        {filtered.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500">
            No transaction records matching your query.
          </div>
        ) : (
          filtered.map((t) => {
            const isWithdrawal = t.type === 'upi_withdrawal';

            return (
              <div
                key={t.id}
                className="bg-slate-950/70 border border-slate-800 hover:border-slate-700 rounded-xl p-3.5 flex items-center justify-between gap-3 transition-colors"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-xs ${
                      isWithdrawal
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    }`}
                  >
                    {isWithdrawal ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                  </div>

                  <div className="min-w-0">
                    <div className="font-bold text-xs text-slate-200 truncate">{t.title}</div>
                    <div className="text-[10px] text-slate-400 flex items-center space-x-1.5 mt-0.5">
                      <span>{t.timestamp}</span>
                      <span>•</span>
                      <span className="font-mono text-slate-300">{t.id}</span>
                      {t.utrNumber && (
                        <>
                          <span>•</span>
                          <span className="text-amber-400/90 font-mono">UTR: {t.utrNumber}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Amount & Receipt Trigger */}
                <div className="text-right flex-shrink-0">
                  <div
                    className={`font-black text-xs sm:text-sm ${
                      isWithdrawal ? 'text-amber-300' : 'text-emerald-400'
                    }`}
                  >
                    {isWithdrawal ? '-' : '+'}{formatINR(t.rupees)}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5 flex items-center justify-end space-x-1">
                    <span>({formatCoins(t.coins)} Coins)</span>
                    {isWithdrawal && (
                      <button
                        onClick={() => {
                          soundFx.playClick();
                          onViewReceipt(t);
                        }}
                        className="text-emerald-400 hover:underline text-[10px] ml-1 font-semibold flex items-center space-x-0.5"
                      >
                        <FileText className="w-3 h-3" />
                        <span>Receipt</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
