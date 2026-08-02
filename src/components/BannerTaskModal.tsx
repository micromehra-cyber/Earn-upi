import React, { useState, useEffect } from 'react';
import { BannerTask } from '../types';
import { soundFx } from '../utils/audio';
import { formatCoins, formatINR } from '../utils/upi';
import confetti from 'canvas-confetti';
import { ExternalLink, CheckCircle2, ShieldCheck, X } from 'lucide-react';

interface BannerTaskModalProps {
  task: BannerTask | null;
  onClose: () => void;
  onClaimReward: (task: BannerTask) => void;
}

export const BannerTaskModal: React.FC<BannerTaskModalProps> = ({
  task,
  onClose,
  onClaimReward,
}) => {
  if (!task) return null;

  const [timeLeft, setTimeLeft] = useState(task.timerSeconds);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    setTimeLeft(task.timerSeconds);
    setIsCompleted(false);
  }, [task]);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsCompleted(true);
            soundFx.playCoinChime();
            confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timeLeft]);

  const handleClaim = () => {
    soundFx.playCoinChime();
    onClaimReward(task);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900/95 border border-white/10 rounded-3xl p-6 shadow-2xl text-white space-y-5 backdrop-blur-2xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${task.bgGradient} flex items-center justify-center text-xl shadow-md`}>
              {task.icon}
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">{task.title}</h3>
              <p className="text-xs text-indigo-200/70">Sponsor: {task.sponsor}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Inspection Task Timer & Preview */}
        <div className="bg-slate-950/80 border border-white/10 rounded-2xl p-5 text-center space-y-3">
          {!isCompleted ? (
            <>
              <div className="text-3xl font-black text-amber-300 font-mono">
                {timeLeft}s
              </div>
              <p className="text-xs text-slate-300 font-medium">
                Keep this inspection window open for {timeLeft} seconds to verify sponsor view.
              </p>
              <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-white/10 p-0.5">
                <div
                  className="bg-gradient-to-r from-violet-500 to-emerald-400 h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${((task.timerSeconds - timeLeft) / task.timerSeconds) * 100}%`,
                  }}
                />
              </div>
            </>
          ) : (
            <div className="space-y-2 animate-bounce">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h4 className="font-extrabold text-white text-base">Sponsor View Verified!</h4>
              <p className="text-xs text-emerald-300 font-bold">
                +{formatCoins(task.rewardCoins)} Coins ({formatINR(task.rewardRupees)}) ready to claim.
              </p>
            </div>
          )}
        </div>

        {/* Claim or Status */}
        {isCompleted ? (
          <button
            onClick={handleClaim}
            className="w-full bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-black text-sm py-3.5 px-4 rounded-2xl shadow-xl shadow-emerald-500/25 transition-transform active:scale-95"
          >
            Claim {formatCoins(task.rewardCoins)} Coins
          </button>
        ) : (
          <div className="flex items-center justify-center space-x-1.5 text-xs text-indigo-200/70 text-center font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-400 inline" />
            <span>Verifying sponsor interaction...</span>
          </div>
        )}
      </div>
    </div>
  );
};
