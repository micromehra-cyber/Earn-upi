import React from 'react';
import { soundFx } from '../utils/audio';
import { formatCoins, formatINR } from '../utils/upi';
import confetti from 'canvas-confetti';
import { Flame, Check, Sparkles } from 'lucide-react';

interface DailyCheckinProps {
  streakDays: number;
  lastCheckInDate: string | null;
  onClaimDailyStreak: (bonusCoins: number) => void;
}

const STREAK_REWARDS = [
  { day: 1, coins: 50, rupees: 0.5 },
  { day: 2, coins: 100, rupees: 1.0 },
  { day: 3, coins: 150, rupees: 1.5 },
  { day: 4, coins: 250, rupees: 2.5 },
  { day: 5, coins: 400, rupees: 4.0 },
  { day: 6, coins: 600, rupees: 6.0 },
  { day: 7, coins: 1000, rupees: 10.0 }
];

export const DailyCheckin: React.FC<DailyCheckinProps> = ({
  streakDays,
  lastCheckInDate,
  onClaimDailyStreak,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const canCheckIn = lastCheckInDate !== todayStr;
  const currentStreakIndex = (streakDays - 1) % 7;
  const todayReward = STREAK_REWARDS[currentStreakIndex < 0 ? 0 : currentStreakIndex];

  const handleClaim = () => {
    if (!canCheckIn) return;
    soundFx.playCoinChime();
    confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
    onClaimDailyStreak(todayReward.coins);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
            <Flame className="w-5 h-5 fill-amber-400/30" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">Daily Login Streak</h3>
            <p className="text-xs text-slate-400">Log in 7 days continuously for ₹10 Bonus!</p>
          </div>
        </div>

        <button
          disabled={!canCheckIn}
          onClick={handleClaim}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow ${
            canCheckIn
              ? 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 active:scale-95'
              : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
          }`}
        >
          {canCheckIn ? `Claim Day ${streakDays + 1}` : 'Checked In Today'}
        </button>
      </div>

      {/* 7-Day Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
        {STREAK_REWARDS.map((item, idx) => {
          const isDone = idx < currentStreakIndex || (!canCheckIn && idx === currentStreakIndex);
          const isCurrent = canCheckIn && idx === currentStreakIndex;

          return (
            <div
              key={idx}
              className={`relative p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-between space-y-1 ${
                isDone
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : isCurrent
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 ring-2 ring-amber-400/30 animate-pulse'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400'
              }`}
            >
              <span className="text-[10px] uppercase font-bold text-slate-400">Day {item.day}</span>
              <span className="text-sm font-extrabold text-white">
                +{item.coins}
              </span>
              <span className="text-[9px] text-slate-400">{formatINR(item.rupees)}</span>

              {isDone && (
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-[10px] font-bold">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
