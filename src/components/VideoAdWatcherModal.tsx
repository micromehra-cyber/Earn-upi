import React, { useState, useEffect } from 'react';
import { VideoAd } from '../types';
import { soundFx } from '../utils/audio';
import { formatCoins, formatINR } from '../utils/upi';
import confetti from 'canvas-confetti';
import { Play, Pause, Volume2, VolumeX, X, CheckCircle2, ShieldCheck, Star, ExternalLink, Sparkles } from 'lucide-react';

interface VideoAdWatcherModalProps {
  ad: VideoAd | null;
  onClose: () => void;
  onClaimReward: (ad: VideoAd) => void;
}

export const VideoAdWatcherModal: React.FC<VideoAdWatcherModalProps> = ({
  ad,
  onClose,
  onClaimReward,
}) => {
  if (!ad) return null;

  const [timeLeft, setTimeLeft] = useState(ad.durationSeconds);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    setTimeLeft(ad.durationSeconds);
    setIsPlaying(true);
    setIsCompleted(false);
  }, [ad]);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsPlaying(false);
            setIsCompleted(true);
            soundFx.playCoinChime();
            confetti({
              particleCount: 60,
              spread: 60,
              origin: { y: 0.6 }
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, timeLeft]);

  const progressPercent = Math.min(
    100,
    Math.round(((ad.durationSeconds - timeLeft) / ad.durationSeconds) * 100)
  );

  const handleClaim = () => {
    soundFx.playCoinChime();
    onClaimReward(ad);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl text-white flex flex-col">
        {/* Ad Video Simulation Frame */}
        <div className={`relative h-64 sm:h-72 bg-gradient-to-br ${ad.videoBgColor} flex flex-col justify-between p-4 overflow-hidden border-b border-slate-800`}>
          {/* Background Brand Image with Soft Blend */}
          <img
            src={ad.bannerImage}
            alt={ad.title}
            className="absolute inset-0 w-full h-full object-cover opacity-25 mix-blend-overlay pointer-events-none"
          />

          {/* Top Bar inside Video Frame */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center space-x-2 bg-slate-950/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
              <span className="text-xl">{ad.sponsorLogo}</span>
              <span className="text-xs font-bold text-white">{ad.sponsorName}</span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-mono">
                Ad #{ad.id}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-1.5 bg-slate-950/60 hover:bg-slate-950/80 rounded-full text-slate-300 transition-colors"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
              </button>

              {/* Close Button disabled until timer completes to prevent ad skip fraud */}
              {isCompleted ? (
                <button
                  onClick={onClose}
                  className="p-1.5 bg-slate-950/80 hover:bg-slate-900 rounded-full text-slate-300 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <div className="text-[10px] bg-slate-950/80 border border-slate-700 text-slate-400 px-2 py-1 rounded-full font-medium">
                  Watch to Earn
                </div>
              )}
            </div>
          </div>

          {/* Center Content: Animated Playing State or Completed Badge */}
          <div className="relative z-10 flex flex-col items-center justify-center my-auto text-center p-2">
            {!isCompleted ? (
              <div className="space-y-2">
                <div className="w-16 h-16 rounded-full bg-slate-950/60 backdrop-blur-md border border-emerald-500/40 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                  <span className="text-2xl font-black text-emerald-400 font-mono">
                    {timeLeft}s
                  </span>
                </div>
                <p className="text-xs text-slate-200 max-w-xs font-medium">
                  {ad.adText}
                </p>
              </div>
            ) : (
              <div className="space-y-2 animate-bounce-once">
                <div className="w-16 h-16 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-lg font-bold text-white">Ad Complete!</h3>
                <p className="text-xs text-emerald-300 font-medium">
                  You earned +{formatCoins(ad.rewardCoins)} Coins ({formatINR(ad.rewardRupees)})
                </p>
              </div>
            )}
          </div>

          {/* Bottom Bar Controls inside Video Frame */}
          <div className="relative z-10 space-y-2">
            {/* Video Progress Bar */}
            <div className="w-full bg-slate-950/80 h-2 rounded-full overflow-hidden border border-white/10">
              <div
                className="bg-gradient-to-r from-emerald-500 to-amber-400 h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-300">
              <button
                disabled={isCompleted}
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center space-x-1 hover:text-white disabled:opacity-50"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
                <span className="text-[11px]">{isPlaying ? 'Pause' : 'Play Ad'}</span>
              </button>

              <div className="flex items-center space-x-1 text-[11px] text-amber-300 font-medium">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Reward: +{formatCoins(ad.rewardCoins)} Coins ({formatINR(ad.rewardRupees)})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer / Claim Reward Section */}
        <div className="p-4 bg-slate-900 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center space-x-1">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="text-slate-200 font-semibold">{ad.rating} Rating</span>
              <span>• {ad.totalViews} Views</span>
            </div>
            <a
              href={ad.ctaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:underline flex items-center space-x-1 text-[11px]"
            >
              <span>{ad.ctaText}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {isCompleted ? (
            <button
              onClick={handleClaim}
              className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-sm py-3 px-4 rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2 transition-transform active:scale-95"
            >
              <span>Collect {formatCoins(ad.rewardCoins)} Coins & Add to UPI Wallet</span>
            </button>
          ) : (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-center text-xs text-slate-400 flex items-center justify-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Please finish watching video ({timeLeft}s left) to claim payout reward</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
