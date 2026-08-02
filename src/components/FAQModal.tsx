import React from 'react';
import { X, ShieldCheck, HelpCircle, AlertCircle } from 'lucide-react';

interface FAQModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FAQModal: React.FC<FAQModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900/95 border border-white/10 rounded-3xl shadow-2xl text-white overflow-hidden space-y-4 max-h-[90vh] flex flex-col backdrop-blur-2xl">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-violet-950/90 via-indigo-950/90 to-slate-900/90 border-b border-white/10 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <HelpCircle className="w-5 h-5 text-emerald-400" />
            <h3 className="font-black text-base text-white">EarnUPI & Withdrawal FAQ</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* FAQ List */}
        <div className="p-5 space-y-4 overflow-y-auto text-xs text-slate-300">
          <div className="bg-slate-950/80 border border-white/10 p-4 rounded-2xl space-y-1">
            <h4 className="font-black text-white text-sm">1. What is the minimum and maximum daily withdrawal limit?</h4>
            <p className="text-slate-300 font-medium leading-relaxed">
              You can withdraw as low as <strong className="text-amber-300 font-bold">₹1 (100 Coins)</strong> up to a maximum of <strong className="text-emerald-300 font-bold">₹1,00,000 (1 Lakh) per day</strong> directly to your bank account via UPI.
            </p>
          </div>

          <div className="bg-slate-950/80 border border-white/10 p-4 rounded-2xl space-y-1">
            <h4 className="font-black text-white text-sm">2. What is the Coin to Rupee conversion rate?</h4>
            <p className="text-slate-300 font-medium leading-relaxed">
              The conversion rate is fixed at <strong className="text-white font-bold">100 Coins = ₹1 INR</strong>.
              For example:
              <br />• 100 Coins = ₹1
              <br />• 1,000 Coins = ₹10
              <br />• 100,000 Coins = ₹1,000
              <br />• 10,000,000 Coins = ₹1,00,000 (1 Lakh)
            </p>
          </div>

          <div className="bg-slate-950/80 border border-white/10 p-4 rounded-2xl space-y-1">
            <h4 className="font-black text-white text-sm">3. Which UPI handles and apps are supported?</h4>
            <p className="text-slate-300 font-medium leading-relaxed">
              We support all NPCI-compliant UPI handles including PhonePe (`@ybl`, `@ibl`), Google Pay (`@okicici`, `@oksbi`, `@okaxis`), Paytm (`@paytm`), BHIM UPI (`@upi`), and Amazon Pay (`@apl`).
            </p>
          </div>

          <div className="bg-slate-950/80 border border-white/10 p-4 rounded-2xl space-y-1">
            <h4 className="font-black text-white text-sm">4. How long does UPI payout processing take?</h4>
            <p className="text-slate-300 font-medium leading-relaxed">
              All payout requests are processed instantly via 24x7 IMPS / NPCI fast-payment switches. You will receive a unique 12-digit UTR reference number upon completion.
            </p>
          </div>

          <div className="bg-slate-950/80 border border-white/10 p-4 rounded-2xl space-y-1">
            <h4 className="font-black text-white text-sm">5. How do I earn more coins daily?</h4>
            <p className="text-slate-300 font-medium leading-relaxed">
              You can earn coins by:
              <br />• Watching 15s - 30s High-Paying Video Ads (+200 to +600 Coins)
              <br />• Inspecting Sponsored Banner Offers (+150 to +300 Coins)
              <br />• Daily Login Streaks (+50 to +1,000 Coins)
              <br />• Spinning the Lucky Wheel & Scratching Cards
              <br />• Inviting Friends (+5,000 Coins / ₹50 per friend)
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950/90 border-t border-white/10 text-center">
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-black text-xs py-3 px-8 rounded-2xl shadow-lg shadow-emerald-500/20 transition-transform active:scale-95"
          >
            Got It!
          </button>
        </div>
      </div>
    </div>
  );
};
