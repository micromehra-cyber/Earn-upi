import React from 'react';
import { UserWallet } from '../types';
import { formatINR, formatCoins, formatLakhs } from '../utils/upi';
import { soundFx } from '../utils/audio';
import { Wallet, Play, RotateCw, ArrowUpRight, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';

interface WalletSummaryCardProps {
  wallet: UserWallet;
  onOpenWithdraw: () => void;
  onScrollToAds: () => void;
  onOpenSpin: () => void;
}

export const WalletSummaryCard: React.FC<WalletSummaryCardProps> = ({
  wallet,
  onOpenWithdraw,
  onScrollToAds,
  onOpenSpin,
}) => {
  const dailyLimit = wallet.dailyWithdrawalLimit; // 1,00,000
  const withdrawn = wallet.withdrawnToday;
  const remainingLimit = Math.max(0, dailyLimit - withdrawn);
  const limitPercentage = Math.min(100, Math.round((withdrawn / dailyLimit) * 100));

  return (
    <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl overflow-hidden text-white">
      {/* Decorative Background Accents */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        {/* Left Column: Wallet Balance & Limits */}
        <div className="space-y-4 flex-1">
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            <Wallet className="w-4 h-4 text-emerald-400" />
            <span>Verified UPI Balance</span>
            <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/30">
              100 Coins = ₹1
            </span>
          </div>

          <div>
            <div className="flex items-baseline space-x-3">
              <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {formatINR(wallet.rupees)}
              </span>
              <span className="text-sm sm:text-base text-slate-400 font-medium">
                ({formatCoins(wallet.coins)} Coins)
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 inline" />
              <span>Direct Bank Deposit via BHIM UPI, PhonePe, GPay & Paytm</span>
            </p>
          </div>

          {/* Daily Withdrawal Limit Progress Bar */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-medium flex items-center space-x-1">
                <span>Daily Withdrawal Limit</span>
                <span className="text-amber-400 font-bold">(Min ₹1 – Max ₹1 Lakh)</span>
              </span>
              <span className="text-slate-400">
                {formatINR(withdrawn)} / {formatLakhs(dailyLimit)}
              </span>
            </div>

            {/* Bar */}
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
              <div 
                className="bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.max(2, limitPercentage)}%` }}
              />
            </div>

            <div className="flex justify-between items-center text-[11px] text-slate-400">
              <span className="flex items-center space-x-1">
                <AlertCircle className="w-3 h-3 text-emerald-400" />
                <span>Available limit today: <strong className="text-emerald-300">{formatINR(remainingLimit)}</strong></span>
              </span>
              <span className="text-slate-500">Resets in 24h</span>
            </div>
          </div>
        </div>

        {/* Right Column: Quick Actions */}
        <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 min-w-[220px]">
          <button
            onClick={() => {
              soundFx.playClick();
              onOpenWithdraw();
            }}
            className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-sm py-3 px-4 rounded-xl shadow-lg shadow-emerald-500/25 flex items-center justify-center space-x-2 transition-transform active:scale-[0.98] group"
          >
            <span>Withdraw Cash to UPI</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                soundFx.playClick();
                onScrollToAds();
              }}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-slate-200 text-xs font-semibold py-2.5 px-3 rounded-xl flex items-center justify-center space-x-1.5 transition-colors"
            >
              <Play className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
              <span>Watch Ads</span>
            </button>

            <button
              onClick={() => {
                soundFx.playClick();
                onOpenSpin();
              }}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-slate-200 text-xs font-semibold py-2.5 px-3 rounded-xl flex items-center justify-center space-x-1.5 transition-colors"
            >
              <RotateCw className="w-3.5 h-3.5 text-teal-400" />
              <span>Spin & Win</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
