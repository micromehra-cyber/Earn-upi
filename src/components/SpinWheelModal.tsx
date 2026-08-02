import React, { useState } from 'react';
import { soundFx } from '../utils/audio';
import { formatCoins, formatINR } from '../utils/upi';
import confetti from 'canvas-confetti';
import { RotateCw, Sparkles, X, Trophy } from 'lucide-react';

interface SpinWheelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSpinWin: (coins: number) => void;
  spinsLeft: number;
}

const SEGMENTS = [
  { coins: 100, label: '100 Coins', color: '#10B981' }, // Emerald
  { coins: 250, label: '250 Coins', color: '#3B82F6' }, // Blue
  { coins: 50, label: '50 Coins', color: '#6366F1' },   // Indigo
  { coins: 500, label: '500 Coins', color: '#8B5CF6' }, // Purple
  { coins: 200, label: '200 Coins', color: '#EC4899' }, // Pink
  { coins: 1000, label: '1,000 Coins', color: '#F59E0B' },// Amber
  { coins: 150, label: '150 Coins', color: '#14B8A6' }, // Teal
  { coins: 1500, label: '1,500 Coins', color: '#EF4444' } // Red Jackpot
];

export const SpinWheelModal: React.FC<SpinWheelModalProps> = ({
  isOpen,
  onClose,
  onSpinWin,
  spinsLeft,
}) => {
  if (!isOpen) return null;

  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wonAmount, setWonAmount] = useState<number | null>(null);

  const handleSpin = () => {
    if (isSpinning || spinsLeft <= 0) return;

    setIsSpinning(true);
    setWonAmount(null);
    soundFx.playClick();

    // Randomize winner segment index (0 to 7)
    const winningIndex = Math.floor(Math.random() * SEGMENTS.length);
    const segmentAngle = 360 / SEGMENTS.length;
    // Calculate total degrees (5 full spins + slice offset)
    const extraDegree = 360 - (winningIndex * segmentAngle + segmentAngle / 2);
    const totalRotation = rotation + 1800 + extraDegree;

    setRotation(totalRotation);

    // Audio tick simulation during spin
    let tickCount = 0;
    const tickInterval = setInterval(() => {
      soundFx.playSpinTick();
      tickCount++;
      if (tickCount > 25) clearInterval(tickInterval);
    }, 120);

    setTimeout(() => {
      clearInterval(tickInterval);
      setIsSpinning(false);
      const wonCoins = SEGMENTS[winningIndex].coins;
      setWonAmount(wonCoins);
      soundFx.playCoinChime();
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
      onSpinWin(wonCoins);
    }, 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-white space-y-5 text-center">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
            <Trophy className="w-5 h-5 text-amber-400" />
            <span>Lucky Spin & Win UPI Coins</span>
          </div>
          <button
            onClick={onClose}
            disabled={isSpinning}
            className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors disabled:opacity-30"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Spin Wheel Canvas Graphics */}
        <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
          {/* Wheel Pointer */}
          <div className="absolute -top-3 z-20 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-amber-400 drop-shadow-md" />

          {/* Wheel Disc */}
          <div
            className="w-full h-full rounded-full border-4 border-slate-800 shadow-2xl overflow-hidden relative transition-all duration-[3500ms] ease-out"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              {SEGMENTS.map((seg, idx) => {
                const angle = 360 / SEGMENTS.length;
                const startAngle = idx * angle;
                const endAngle = (idx + 1) * angle;
                const x1 = 50 + 50 * Math.cos((Math.PI * startAngle) / 180);
                const y1 = 50 + 50 * Math.sin((Math.PI * startAngle) / 180);
                const x2 = 50 + 50 * Math.cos((Math.PI * endAngle) / 180);
                const y2 = 50 + 50 * Math.sin((Math.PI * endAngle) / 180);
                const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`;

                const midAngle = startAngle + angle / 2;
                const textX = 50 + 32 * Math.cos((Math.PI * midAngle) / 180);
                const textY = 50 + 32 * Math.sin((Math.PI * midAngle) / 180);

                return (
                  <g key={idx}>
                    <path d={pathData} fill={seg.color} className="opacity-90 hover:opacity-100 transition-opacity" />
                    <text
                      x={textX}
                      y={textY}
                      fill="#ffffff"
                      fontSize="5"
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${midAngle + 90}, ${textX}, ${textY})`}
                    >
                      {seg.coins}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Center Hub */}
          <div className="absolute w-12 h-12 rounded-full bg-slate-900 border-2 border-amber-400 shadow-lg flex items-center justify-center font-bold text-amber-400 text-xs">
            <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
          </div>
        </div>

        {/* Won Message */}
        {wonAmount && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 p-3 rounded-xl text-xs font-bold animate-bounce-once">
            🎉 You Won +{formatCoins(wonAmount)} Coins ({formatINR(wonAmount / 100)})!
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={handleSpin}
          disabled={isSpinning || spinsLeft <= 0}
          className="w-full bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-sm py-3 px-4 rounded-xl shadow-lg transition-transform active:scale-95 disabled:opacity-50 flex items-center justify-center space-x-2"
        >
          <RotateCw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
          <span>
            {isSpinning
              ? 'Spinning Wheel...'
              : spinsLeft > 0
              ? `Spin Wheel (${spinsLeft} Left Today)`
              : 'No Spins Left Today'}
          </span>
        </button>
      </div>
    </div>
  );
};
