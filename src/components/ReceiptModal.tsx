import React from 'react';
import { Transaction } from '../types';
import { formatINR, formatCoins, getBankNameFromVPA } from '../utils/upi';
import { soundFx } from '../utils/audio';
import { X, CheckCircle2, Printer, Share2, ShieldCheck, Building2 } from 'lucide-react';

interface ReceiptModalProps {
  transaction: Transaction | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  transaction,
  onClose,
}) => {
  if (!transaction) return null;

  const handlePrint = () => {
    soundFx.playClick();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900/95 border border-white/10 rounded-3xl shadow-2xl text-white overflow-hidden space-y-4 backdrop-blur-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-950/90 via-indigo-950/90 to-slate-900/90 p-5 border-b border-white/10 flex justify-between items-center">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-400 text-slate-950 font-black flex items-center justify-center shadow-md">
              ₹
            </div>
            <div>
              <h3 className="font-black text-sm text-white">Official NPCI UPI Receipt</h3>
              <p className="text-[10px] text-emerald-300 font-bold">Transaction Advice / UTR Audit</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Receipt Card */}
        <div id="printable-receipt" className="p-5 space-y-4 bg-slate-950/80 m-4 rounded-2xl border border-white/10">
          <div className="text-center space-y-1">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h4 className="font-black text-2xl text-white">{formatINR(transaction.rupees)}</h4>
            <p className="text-xs text-emerald-300 font-extrabold">Payment Successfully Transferred</p>
          </div>

          <div className="space-y-2 text-xs border-t border-b border-white/10 py-3">
            <div className="flex justify-between text-slate-400">
              <span>Transaction ID:</span>
              <span className="font-mono text-white font-bold">{transaction.id}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>NPCI Bank UTR No:</span>
              <span className="font-mono text-amber-300 font-black">{transaction.utrNumber || 'UTR40921820412'}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Paid To (UPI ID):</span>
              <span className="font-mono text-slate-200">{transaction.upiId}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Receiving Bank:</span>
              <span className="text-slate-300 font-bold">{getBankNameFromVPA(transaction.upiId || '')}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Coins Redeemed:</span>
              <span className="text-slate-300 font-medium">{formatCoins(transaction.coins)} Coins</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Date & Time:</span>
              <span className="text-slate-300 font-medium">{transaction.timestamp}</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
            <span className="flex items-center space-x-1 text-emerald-400 font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified NPCI Switch</span>
            </span>
            <span className="text-emerald-400 font-black">Status: SUCCESS</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="p-4 bg-slate-950/90 border-t border-white/10 flex gap-2">
          <button
            onClick={handlePrint}
            className="flex-1 bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs py-3 rounded-2xl border border-white/10 flex items-center justify-center space-x-1.5 transition-colors"
          >
            <Printer className="w-4 h-4 text-slate-300" />
            <span>Print Receipt</span>
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-black text-xs py-3 rounded-2xl shadow-lg shadow-emerald-500/20 transition-transform active:scale-95"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
