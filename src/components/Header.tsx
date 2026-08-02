import React from 'react';
import { UserWallet } from '../types';
import { formatINR, formatCoins } from '../utils/upi';
import { soundFx } from '../utils/audio';
import { Volume2, VolumeX, Flame, PlusCircle, HelpCircle, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  wallet: UserWallet;
  onOpenWithdraw: () => void;
  onOpenFAQ: () => void;
  onAddTestCoins: (amount: number) => void;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  wallet,
  onOpenWithdraw,
  onOpenFAQ,
  onAddTestCoins,
  soundEnabled,
  setSoundEnabled,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white px-4 py-3 shadow-lg">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand Logo & Name */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-amber-400 flex items-center justify-center font-bold text-slate-950 text-xl shadow-md shadow-emerald-500/20 ring-1 ring-white/20">
            ₹
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-extrabold text-lg sm:text-xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-200 to-amber-300">
                EarnUPI
              </h1>
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center space-x-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>NPCI Approved UPI</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Watch Ads • Earn Coins • Instant UPI Withdrawal</p>
          </div>
        </div>

        {/* Right Section: Streak, Coins, Rupees, Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Streak Badge */}
          <div className="hidden sm:flex items-center space-x-1 bg-amber-500/10 border border-amber-500/20 text-amber-300 px-2.5 py-1 rounded-lg text-xs font-semibold">
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400/30 animate-pulse" />
            <span>{wallet.streakDays} Day Streak</span>
          </div>

          {/* Quick Balance Pill */}
          <div 
            onClick={onOpenWithdraw}
            className="flex items-center space-x-2 bg-slate-800/90 hover:bg-slate-800 border border-emerald-500/40 hover:border-emerald-400 text-slate-100 px-3 py-1.5 rounded-xl cursor-pointer transition-all duration-200 shadow-sm group"
          >
            <div className="text-right">
              <div className="text-xs font-medium text-emerald-400 group-hover:text-emerald-300 transition-colors">
                {formatINR(wallet.rupees)}
              </div>
              <div className="text-[10px] text-slate-400">
                {formatCoins(wallet.coins)} Coins
              </div>
            </div>
            <button 
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs px-2.5 py-1 rounded-lg shadow transition-transform active:scale-95 flex items-center space-x-1"
            >
              <span>Withdraw</span>
            </button>
          </div>

          {/* Demo Booster Button (To easily test ₹1 - ₹1,00,000 withdrawal limits) */}
          <div className="relative group">
            <button
              onClick={() => {
                soundFx.playCoinChime();
                onAddTestCoins(100000); // Adds ₹1000 (100,000 coins)
              }}
              title="Add Demo Coins for Testing UPI Payouts"
              className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-300 hover:text-amber-200 p-2 rounded-xl text-xs flex items-center space-x-1 transition-colors"
            >
              <PlusCircle className="w-4 h-4 text-amber-400" />
              <span className="hidden md:inline font-medium text-[11px]">+₹1,000 Demo</span>
            </button>
          </div>

          {/* Audio Toggle */}
          <button
            onClick={() => {
              const next = !soundEnabled;
              setSoundEnabled(next);
              soundFx.soundEnabled = next;
              if (next) soundFx.playClick();
            }}
            title={soundEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
            className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-xl transition-colors"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* FAQ / Help */}
          <button
            onClick={() => {
              soundFx.playClick();
              onOpenFAQ();
            }}
            title="UPI & Earnings FAQ"
            className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-xl transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-slate-300" />
          </button>
        </div>
      </div>
    </header>
  );
};
