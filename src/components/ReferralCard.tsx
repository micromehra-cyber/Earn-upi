import React, { useState } from 'react';
import { soundFx } from '../utils/audio';
import { Users, Copy, Check, Share2 } from 'lucide-react';

interface ReferralCardProps {
  referralCode: string;
  totalReferrals: number;
  onAddReferralReward: () => void;
}

export const ReferralCard: React.FC<ReferralCardProps> = ({
  referralCode,
  totalReferrals,
  onAddReferralReward,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    soundFx.playClick();
    navigator.clipboard.writeText(`Join EarnUPI app to earn daily cash by watching ads! Use my code: ${referralCode} to get ₹50 free bonus! Download: https://earnupi.app/invite/${referralCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    soundFx.playClick();
    const message = encodeURIComponent(
      `💸 *Earn Real Cash Daily via UPI!*\n\nI earn money daily by watching 15s ads on EarnUPI app. Minimum withdrawal is just ₹1 up to ₹1,00,000/day!\n\nUse my code *${referralCode}* for ₹50 joining bonus.\n\nLink: https://earnupi.app/invite/${referralCode}`
    );
    window.open(`https://api.whatsapp.com/send?text=${message}`, '_blank');
  };

  return (
    <div className="bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-900/50 rounded-2xl p-5 shadow-lg space-y-4 text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-indigo-500/20 text-indigo-300 rounded-xl border border-indigo-500/30">
            <Users className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">Refer & Earn ₹50 Per Friend</h3>
            <p className="text-xs text-indigo-200">Get ₹50 (5,000 Coins) for every friend who joins & completes 1 ad.</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-400">Total Referrals</div>
          <div className="text-lg font-bold text-amber-300">{totalReferrals} Friends</div>
        </div>
      </div>

      {/* Code & Share */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1 bg-slate-950 border border-indigo-900/40 rounded-xl px-3 py-2 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 block uppercase">Your Referral Code</span>
            <span className="font-mono text-sm font-black text-amber-300 tracking-wider">{referralCode}</span>
          </div>
          <button
            onClick={handleCopy}
            className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition-colors flex items-center space-x-1 text-xs"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-indigo-300" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        <button
          onClick={handleShareWhatsApp}
          className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl shadow flex items-center justify-center space-x-2 transition-transform active:scale-95"
        >
          <Share2 className="w-4 h-4 text-slate-950" />
          <span>Share on WhatsApp</span>
        </button>

        <button
          onClick={() => {
            soundFx.playCoinChime();
            onAddReferralReward();
          }}
          className="bg-slate-800 hover:bg-slate-700 border border-indigo-800 text-amber-300 text-xs px-3 py-2.5 rounded-xl transition-colors font-semibold"
          title="Simulate a friend joining using your code"
        >
          + Simulate Invite
        </button>
      </div>
    </div>
  );
};
