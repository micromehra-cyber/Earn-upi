import React, { useState } from 'react';
import { UserWallet, UPIGatewayType, Transaction } from '../types';
import { UPI_GATEWAYS, isValidUPI, generateUTRNumber, formatINR, formatCoins, getBankNameFromVPA } from '../utils/upi';
import { soundFx } from '../utils/audio';
import confetti from 'canvas-confetti';
import { X, ShieldCheck, AlertCircle, ArrowRight, CheckCircle2, Building2, Loader2, RefreshCw, KeyRound, Lock } from 'lucide-react';

interface UPIWithdrawModalProps {
  isOpen: boolean;
  wallet: UserWallet;
  onClose: () => void;
  onConfirmWithdrawal: (transaction: Transaction) => void;
}

const PRESET_AMOUNTS = [1, 5, 10, 50, 100, 500, 1000, 5000, 10000, 50000, 100000];

export const UPIWithdrawModal: React.FC<UPIWithdrawModalProps> = ({
  isOpen,
  wallet,
  onClose,
  onConfirmWithdrawal,
}) => {
  if (!isOpen) return null;

  const [selectedGateway, setSelectedGateway] = useState<UPIGatewayType>('phonepe');
  const [upiId, setUpiId] = useState('');
  const [amountInput, setAmountInput] = useState<string>('50');
  const [step, setStep] = useState<'FORM' | 'OTP' | 'PROCESSING' | 'SUCCESS'>('FORM');
  const [otp, setOtp] = useState('4920');
  const [errorMessage, setErrorMessage] = useState('');
  const [currentTxn, setCurrentTxn] = useState<Transaction | null>(null);

  const selectedGw = UPI_GATEWAYS.find((g) => g.id === selectedGateway) || UPI_GATEWAYS[0];
  const amount = parseFloat(amountInput) || 0;
  const coinsNeeded = amount * 100;
  const remainingDailyLimit = Math.max(0, wallet.dailyWithdrawalLimit - wallet.withdrawnToday);

  // Validation checks
  const isVPAValid = isValidUPI(upiId);
  const isAmountValid = amount >= wallet.minWithdrawal && amount <= wallet.dailyWithdrawalLimit;
  const isWithinDailyLimit = wallet.withdrawnToday + amount <= wallet.dailyWithdrawalLimit;
  const hasSufficientBalance = wallet.rupees >= amount;

  const handlePresetSelect = (val: number) => {
    soundFx.playClick();
    setAmountInput(val.toString());
    setErrorMessage('');
  };

  const handleGatewayChange = (gwId: UPIGatewayType) => {
    soundFx.playClick();
    setSelectedGateway(gwId);
    // Autofill placeholder handle hint if empty
    if (!upiId) {
      const gw = UPI_GATEWAYS.find((g) => g.id === gwId);
      if (gw && gw.recommendedSuffixes.length > 0) {
        setUpiId(`8976543210${gw.recommendedSuffixes[0]}`);
      }
    }
  };

  const handleInitiateForm = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!isVPAValid) {
      soundFx.playError();
      setErrorMessage('Please enter a valid Indian UPI ID (e.g. mobile@ybl or name@okicici)');
      return;
    }
    if (amount < wallet.minWithdrawal) {
      soundFx.playError();
      setErrorMessage(`Minimum daily withdrawal amount is ${formatINR(wallet.minWithdrawal)}`);
      return;
    }
    if (amount > wallet.dailyWithdrawalLimit) {
      soundFx.playError();
      setErrorMessage(`Maximum withdrawal limit per transaction/day is ${formatINR(wallet.dailyWithdrawalLimit)} (1 Lakh)`);
      return;
    }
    if (!isWithinDailyLimit) {
      soundFx.playError();
      setErrorMessage(`This payout exceeds your remaining daily limit of ${formatINR(remainingDailyLimit)}`);
      return;
    }
    if (!hasSufficientBalance) {
      soundFx.playError();
      setErrorMessage(`Insufficient wallet balance. You need ${formatCoins(coinsNeeded)} Coins (${formatINR(amount)}). Watch more ads!`);
      return;
    }

    soundFx.playClick();
    setStep('OTP');
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) {
      soundFx.playError();
      setErrorMessage('Enter 4-digit UPI security code (Use default 4920)');
      return;
    }

    soundFx.playClick();
    setStep('PROCESSING');

    const utr = generateUTRNumber();
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16);
    const bankName = getBankNameFromVPA(upiId);

    const newTxn: Transaction = {
      id: `TXN-${Math.floor(10000 + Math.random() * 90000)}`,
      type: 'upi_withdrawal',
      title: `UPI Payout (${selectedGw.name})`,
      coins: coinsNeeded,
      rupees: amount,
      timestamp: nowStr,
      status: 'SUCCESS',
      upiId: upiId.toLowerCase(),
      gateway: selectedGateway,
      utrNumber: utr,
      bankRef: bankName,
      note: `Daily withdrawal limit count updated (${formatINR(wallet.withdrawnToday + amount)}/₹1,00,000)`
    };

    // Simulate 2.5s bank processing
    setTimeout(() => {
      setCurrentTxn(newTxn);
      setStep('SUCCESS');
      soundFx.playUPITransferSuccess();
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 }
      });
      onConfirmWithdrawal(newTxn);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl text-white overflow-hidden my-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900/80 via-slate-900 to-slate-900 border-b border-slate-800 p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 font-black text-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              ₹
            </div>
            <div>
              <h2 className="font-extrabold text-base text-white">Instant UPI Cash Payout</h2>
              <p className="text-xs text-emerald-400 font-medium">
                Min ₹1 – Max ₹1,00,000 (1 Lakh) Daily Limit
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-5">
          {/* STEP 1: FORM */}
          {step === 'FORM' && (
            <form onSubmit={handleInitiateForm} className="space-y-4">
              {/* Daily Limit Status Banner */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 block">Available Balance</span>
                  <span className="font-extrabold text-emerald-400 text-sm">{formatINR(wallet.rupees)}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block">Today's Remaining Limit</span>
                  <span className="font-extrabold text-amber-300 text-sm">{formatINR(remainingDailyLimit)}</span>
                </div>
              </div>

              {/* Gateway Tabs */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-2">
                  Select Payment App / UPI Handle
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                  {UPI_GATEWAYS.map((gw) => (
                    <button
                      key={gw.id}
                      type="button"
                      onClick={() => handleGatewayChange(gw.id)}
                      className={`p-2.5 rounded-xl border text-center flex flex-col items-center space-y-1 transition-all ${
                        selectedGateway === gw.id
                          ? 'bg-emerald-500/10 border-emerald-500/60 text-emerald-300 ring-1 ring-emerald-500/30'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-lg">{gw.icon}</span>
                      <span className="text-[10px] font-bold truncate w-full">{gw.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* UPI ID Input */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-semibold text-slate-300">Enter VPA / UPI ID</label>
                  {isVPAValid && (
                    <span className="text-emerald-400 flex items-center space-x-1 text-[11px] font-medium">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Valid VPA</span>
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder={selectedGw.placeholder}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 text-white font-mono text-sm px-3.5 py-2.5 rounded-xl outline-none transition-colors"
                  />
                  {upiId && (
                    <div className="mt-1 text-[11px] text-slate-400 flex items-center space-x-1">
                      <Building2 className="w-3 h-3 text-emerald-400" />
                      <span>Bank Switch: {getBankNameFromVPA(upiId)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Amount Selection & Input */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 block">
                  Payout Amount in Rupees (₹)
                </label>

                <div className="flex items-center space-x-2">
                  <span className="text-xl font-bold text-emerald-400">₹</span>
                  <input
                    type="number"
                    min={wallet.minWithdrawal}
                    max={wallet.dailyWithdrawalLimit}
                    value={amountInput}
                    onChange={(e) => {
                      setAmountInput(e.target.value);
                      setErrorMessage('');
                    }}
                    placeholder="Enter amount (1 to 100000)"
                    className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 text-white font-extrabold text-lg px-3.5 py-2.5 rounded-xl outline-none transition-colors"
                  />
                </div>

                <div className="text-[11px] text-slate-400 flex justify-between">
                  <span>Coins Required: <strong className="text-amber-300">{formatCoins(coinsNeeded)} Coins</strong></span>
                  <span>Min: ₹1 | Max: ₹1,00,000</span>
                </div>

                {/* Quick Presets */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {PRESET_AMOUNTS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handlePresetSelect(preset)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                        amount === preset
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                      }`}
                    >
                      ₹{preset >= 100000 ? '1 Lakh' : preset >= 1000 ? `${preset / 1000}k` : preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Error Alert */}
              {errorMessage && (
                <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-3 rounded-xl text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm py-3 px-4 rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2 transition-transform active:scale-95"
              >
                <span>Initiate {formatINR(amount)} Transfer</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* STEP 2: SECURITY PIN / OTP */}
          {step === 'OTP' && (
            <form onSubmit={handleVerifyOTP} className="space-y-4 text-center">
              <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
                <Lock className="w-6 h-6" />
              </div>

              <div>
                <h3 className="font-bold text-white text-base">Authorize NPCI Security PIN</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Confirm instant transfer of <strong className="text-emerald-400">{formatINR(amount)}</strong> to <strong className="text-white font-mono">{upiId}</strong>
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
                <label className="text-xs text-slate-400 block">Default Demo Security Code (4920)</label>
                <input
                  type="password"
                  maxLength={4}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-36 text-center tracking-[1em] text-xl font-mono bg-slate-900 border border-emerald-500/50 text-emerald-400 py-2 rounded-xl outline-none mx-auto block"
                />
              </div>

              {errorMessage && (
                <div className="text-xs text-rose-400">{errorMessage}</div>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep('FORM')}
                  className="w-1/3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs py-3 rounded-xl transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="w-2/3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs py-3 rounded-xl shadow transition-transform active:scale-95"
                >
                  Confirm & Deposit Cash
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: BANK PROCESSING */}
          {step === 'PROCESSING' && (
            <div className="py-8 text-center space-y-4">
              <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                <Loader2 className="w-16 h-16 text-emerald-400 animate-spin" />
                <div className="absolute font-black text-xs text-white">NPCI</div>
              </div>

              <div className="space-y-1">
                <h3 className="font-bold text-white text-base">Processing Bank Transfer...</h3>
                <p className="text-xs text-slate-400">
                  Connecting to NPCI Unified Payment Switch for <strong className="text-emerald-400">{formatINR(amount)}</strong>
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-left space-y-1.5 text-xs text-slate-400 max-w-xs mx-auto">
                <div className="flex justify-between">
                  <span>Destination VPA:</span>
                  <span className="font-mono text-white">{upiId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Target Bank:</span>
                  <span className="text-emerald-300 font-medium">{getBankNameFromVPA(upiId)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="text-amber-400 font-semibold animate-pulse">Processing RTGS/IMPS...</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: TRANSFER SUCCESS */}
          {step === 'SUCCESS' && currentTxn && (
            <div className="text-center space-y-4 animate-scale-up">
              <div className="w-16 h-16 bg-emerald-500 text-slate-950 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/30">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-extrabold text-white">Transfer Successful!</h3>
                <p className="text-2xl font-black text-emerald-400">
                  {formatINR(currentTxn.rupees)} Deposited
                </p>
                <p className="text-xs text-slate-400">
                  Sent via {currentTxn.gateway?.toUpperCase()} to <span className="font-mono text-slate-200">{currentTxn.upiId}</span>
                </p>
              </div>

              {/* UTR Box */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2 text-xs text-left">
                <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                  <span className="text-slate-400">Bank UTR Ref No:</span>
                  <span className="font-mono font-bold text-amber-300">{currentTxn.utrNumber}</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Time: {currentTxn.timestamp}</span>
                  <span className="text-emerald-400 font-semibold">Status: SUCCESS</span>
                </div>
              </div>

              <button
                onClick={() => {
                  soundFx.playClick();
                  onClose();
                  setStep('FORM');
                }}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm py-3 rounded-xl shadow transition-transform active:scale-95"
              >
                Done & Return to Wallet
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
