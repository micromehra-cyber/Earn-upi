import React, { useState } from 'react';
import { ScratchCardData } from '../types';
import { soundFx } from '../utils/audio';
import { formatCoins, formatINR } from '../utils/upi';
import confetti from 'canvas-confetti';
import { Sparkles, X, Gift } from 'lucide-react';

interface ScratchCardModalProps {
  card: ScratchCardData | null;
  onClose: () => void;
  onClaimScratch: (card: ScratchCardData) => void;
}

export const ScratchCardModal: React.FC<ScratchCardModalProps> = ({
  card,
  onClose,
  onClaimScratch,
}) => {
  if (!card) return null;

  const [scratched, setScratched] = useState(card.isScratched);

  const handleReveal = () => {
    if (scratched) return;
    setScratched(true);
    soundFx.playCoinChime();
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
    onClaimScratch(card);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-sm bg-slate-900/95 border border-white/10 rounded-3xl p-6 shadow-2xl text-white space-y-5 text-center backdrop-blur-2xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center space-x-2 text-emerald-300 font-extrabold text-sm">
            <Gift className="w-5 h-5 text-emerald-400" />
            <span>{card.title}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scratch Area */}
        <div 
          onClick={handleReveal}
          className="relative w-56 h-56 mx-auto rounded-3xl overflow-hidden cursor-pointer shadow-2xl border-2 border-white/20 hover:border-emerald-400 transition-all group"
        >
          {/* Revealed Prize Layer */}
          <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-4 space-y-2">
            <span className="text-4xl">{card.icon}</span>
            <div className="text-2xl font-black text-amber-300">
              +{formatCoins(card.rewardCoins)} Coins
            </div>
            <div className="text-xs text-emerald-300 font-bold bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/40 shadow-sm">
              Worth {formatINR(card.rewardRupees)} Instant UPI Cash
            </div>
          </div>

          {/* Unscratched Foil Layer */}
          {!scratched && (
            <div className={`absolute inset-0 bg-gradient-to-br ${card.themeColor} flex flex-col items-center justify-center p-4 space-y-2 text-slate-950 font-bold transition-opacity duration-300 group-hover:opacity-95 shadow-inner`}>
              <Sparkles className="w-10 h-10 animate-bounce text-slate-950" />
              <span className="text-sm font-black uppercase tracking-wider text-slate-950">
                Tap / Scratch to Reveal
              </span>
              <span className="text-[10px] bg-slate-950/30 px-2.5 py-0.5 rounded-full text-slate-950 font-extrabold">
                Sponsor Prize
              </span>
            </div>
          )}
        </div>

        {/* Footer Action */}
        {scratched ? (
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-black text-sm py-3.5 px-4 rounded-2xl shadow-xl shadow-emerald-500/25 transition-transform active:scale-95"
          >
            Collect & Return
          </button>
        ) : (
          <p className="text-xs text-indigo-200/70 font-semibold">
            Click or tap the card above to reveal your guaranteed reward!
          </p>
        )}
      </div>
    </div>
  );
};
