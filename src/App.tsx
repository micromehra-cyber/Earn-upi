import React, { useState, useRef } from 'react';
import { UserWallet, VideoAd, BannerTask, ScratchCardData, Transaction } from './types';
import { VIDEO_ADS, BANNER_TASKS, INITIAL_SCRATCH_CARDS, INITIAL_TRANSACTIONS } from './data/mockAds';
import { Header } from './components/Header';
import { WalletSummaryCard } from './components/WalletSummaryCard';
import { VideoAdWatcherModal } from './components/VideoAdWatcherModal';
import { BannerTaskModal } from './components/BannerTaskModal';
import { SpinWheelModal } from './components/SpinWheelModal';
import { ScratchCardModal } from './components/ScratchCardModal';
import { DailyCheckin } from './components/DailyCheckin';
import { ReferralCard } from './components/ReferralCard';
import { UPIWithdrawModal } from './components/UPIWithdrawModal';
import { TransactionHistory } from './components/TransactionHistory';
import { ReceiptModal } from './components/ReceiptModal';
import { FAQModal } from './components/FAQModal';
import { soundFx } from './utils/audio';
import { formatCoins, formatINR } from './utils/upi';
import { Play, RotateCw, Gift, Sparkles, CheckCircle2, Tv, Zap, ShieldCheck } from 'lucide-react';

export default function App() {
  // Wallet State
  const [wallet, setWallet] = useState<UserWallet>({
    coins: 25000,               // Default 25,000 Coins = ₹250
    rupees: 250.0,
    totalEarnedRupees: 750.0,
    withdrawnToday: 500.0,       // ₹500 withdrawn today
    dailyWithdrawalLimit: 100000,// ₹1,00,000 (1 Lakh)
    minWithdrawal: 1.0,         // ₹1 Min
    streakDays: 4,
    lastCheckInDate: null,
    adsWatchedToday: 6,
    maxDailyAds: 25,
    referralCode: 'EARN9942',
    totalReferrals: 3,
  });

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [scratchCards, setScratchCards] = useState<ScratchCardData[]>(INITIAL_SCRATCH_CARDS);
  const [spinsLeft, setSpinsLeft] = useState(5);

  // Category filter state for Video Ads
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredVideoAds =
    selectedCategory === 'all'
      ? VIDEO_ADS
      : VIDEO_ADS.filter((ad) => ad.category === selectedCategory);

  // Active Modals State
  const [activeVideoAd, setActiveVideoAd] = useState<VideoAd | null>(null);
  const [activeBannerTask, setActiveBannerTask] = useState<BannerTask | null>(null);
  const [activeScratchCard, setActiveScratchCard] = useState<ScratchCardData | null>(null);
  const [isSpinModalOpen, setIsSpinModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isFAQModalOpen, setIsFAQModalOpen] = useState(false);
  const [selectedReceiptTxn, setSelectedReceiptTxn] = useState<Transaction | null>(null);

  // Notification Banner State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const adsSectionRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  // Handler: Add Demo Coins for Testing
  const handleAddTestCoins = (addCoins: number) => {
    setWallet((prev) => {
      const newCoins = prev.coins + addCoins;
      const newRupees = parseFloat((newCoins / 100).toFixed(2));
      return {
        ...prev,
        coins: newCoins,
        rupees: newRupees,
        totalEarnedRupees: prev.totalEarnedRupees + addCoins / 100,
      };
    });
    showToast(` Added +${formatCoins(addCoins)} Demo Coins (+${formatINR(addCoins / 100)}) to Wallet!`);
  };

  // Handler: Claim Video Ad Reward
  const handleClaimVideoAd = (ad: VideoAd) => {
    const coinsEarned = ad.rewardCoins;
    const rupeesEarned = ad.rewardRupees;
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16);

    setWallet((prev) => {
      const newCoins = prev.coins + coinsEarned;
      const newRupees = parseFloat((newCoins / 100).toFixed(2));
      return {
        ...prev,
        coins: newCoins,
        rupees: newRupees,
        totalEarnedRupees: prev.totalEarnedRupees + rupeesEarned,
        adsWatchedToday: prev.adsWatchedToday + 1,
      };
    });

    const newTxn: Transaction = {
      id: `TXN-${Math.floor(10000 + Math.random() * 90000)}`,
      type: 'ad_reward',
      title: `Watched ${ad.sponsorName} Video Ad`,
      coins: coinsEarned,
      rupees: rupeesEarned,
      timestamp: nowStr,
      status: 'SUCCESS',
    };

    setTransactions((prev) => [newTxn, ...prev]);
    showToast(` Rewarded +${formatCoins(coinsEarned)} Coins (${formatINR(rupeesEarned)}) from ${ad.sponsorName} Ad!`);
  };

  // Handler: Claim Banner Task Reward
  const handleClaimBannerTask = (task: BannerTask) => {
    const coinsEarned = task.rewardCoins;
    const rupeesEarned = task.rewardRupees;
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16);

    setWallet((prev) => {
      const newCoins = prev.coins + coinsEarned;
      return {
        ...prev,
        coins: newCoins,
        rupees: parseFloat((newCoins / 100).toFixed(2)),
        totalEarnedRupees: prev.totalEarnedRupees + rupeesEarned,
      };
    });

    const newTxn: Transaction = {
      id: `TXN-${Math.floor(10000 + Math.random() * 90000)}`,
      type: 'banner_reward',
      title: `Inspected ${task.sponsor} Sponsor Deal`,
      coins: coinsEarned,
      rupees: rupeesEarned,
      timestamp: nowStr,
      status: 'SUCCESS',
    };

    setTransactions((prev) => [newTxn, ...prev]);
    showToast(` Task Complete! +${formatCoins(coinsEarned)} Coins (${formatINR(rupeesEarned)}) added.`);
  };

  // Handler: Spin Wheel Win
  const handleSpinWin = (coinsWon: number) => {
    const rupeesWon = coinsWon / 100;
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16);

    setSpinsLeft((prev) => Math.max(0, prev - 1));
    setWallet((prev) => {
      const newCoins = prev.coins + coinsWon;
      return {
        ...prev,
        coins: newCoins,
        rupees: parseFloat((newCoins / 100).toFixed(2)),
        totalEarnedRupees: prev.totalEarnedRupees + rupeesWon,
      };
    });

    const newTxn: Transaction = {
      id: `TXN-${Math.floor(10000 + Math.random() * 90000)}`,
      type: 'spin_reward',
      title: 'Lucky Wheel Spin Reward',
      coins: coinsWon,
      rupees: rupeesWon,
      timestamp: nowStr,
      status: 'SUCCESS',
    };

    setTransactions((prev) => [newTxn, ...prev]);
    showToast(` Spin Winner! +${formatCoins(coinsWon)} Coins (${formatINR(rupeesWon)}) added.`);
  };

  // Handler: Scratch Card Win
  const handleClaimScratchCard = (card: ScratchCardData) => {
    setScratchCards((prev) =>
      prev.map((c) => (c.id === card.id ? { ...c, isScratched: true } : c))
    );

    const coinsEarned = card.rewardCoins;
    const rupeesEarned = card.rewardRupees;
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16);

    setWallet((prev) => {
      const newCoins = prev.coins + coinsEarned;
      return {
        ...prev,
        coins: newCoins,
        rupees: parseFloat((newCoins / 100).toFixed(2)),
        totalEarnedRupees: prev.totalEarnedRupees + rupeesEarned,
      };
    });

    const newTxn: Transaction = {
      id: `TXN-${Math.floor(10000 + Math.random() * 90000)}`,
      type: 'scratch_reward',
      title: `Scratched ${card.title}`,
      coins: coinsEarned,
      rupees: rupeesEarned,
      timestamp: nowStr,
      status: 'SUCCESS',
    };

    setTransactions((prev) => [newTxn, ...prev]);
    showToast(` Scratch Card Reward! +${formatCoins(coinsEarned)} Coins (${formatINR(rupeesEarned)})`);
  };

  // Handler: Daily Check-in Streak
  const handleClaimDailyStreak = (bonusCoins: number) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16);

    setWallet((prev) => {
      const newCoins = prev.coins + bonusCoins;
      return {
        ...prev,
        coins: newCoins,
        rupees: parseFloat((newCoins / 100).toFixed(2)),
        totalEarnedRupees: prev.totalEarnedRupees + bonusCoins / 100,
        streakDays: prev.streakDays + 1,
        lastCheckInDate: todayStr,
      };
    });

    const newTxn: Transaction = {
      id: `TXN-${Math.floor(10000 + Math.random() * 90000)}`,
      type: 'streak_reward',
      title: 'Daily Check-in Streak Bonus',
      coins: bonusCoins,
      rupees: bonusCoins / 100,
      timestamp: nowStr,
      status: 'SUCCESS',
    };

    setTransactions((prev) => [newTxn, ...prev]);
    showToast(` Daily Streak Bonus +${formatCoins(bonusCoins)} Coins (${formatINR(bonusCoins / 100)}) claimed!`);
  };

  // Handler: Referral Bonus Simulation
  const handleAddReferralReward = () => {
    const bonusCoins = 5000; // ₹50
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16);

    setWallet((prev) => {
      const newCoins = prev.coins + bonusCoins;
      return {
        ...prev,
        coins: newCoins,
        rupees: parseFloat((newCoins / 100).toFixed(2)),
        totalEarnedRupees: prev.totalEarnedRupees + 50,
        totalReferrals: prev.totalReferrals + 1,
      };
    });

    const newTxn: Transaction = {
      id: `TXN-${Math.floor(10000 + Math.random() * 90000)}`,
      type: 'referral_reward',
      title: 'Friend Joined Referral Bonus (Code EARN9942)',
      coins: bonusCoins,
      rupees: 50.0,
      timestamp: nowStr,
      status: 'SUCCESS',
    };

    setTransactions((prev) => [newTxn, ...prev]);
    showToast(` Friend Joined! +${formatCoins(bonusCoins)} Coins (₹50) Referral Bonus Added!`);
  };

  // Handler: Confirm UPI Withdrawal
  const handleConfirmWithdrawal = (txn: Transaction) => {
    const coinsDeducted = txn.coins;
    const rupeesWithdrawn = txn.rupees;

    setWallet((prev) => {
      const newCoins = Math.max(0, prev.coins - coinsDeducted);
      const newRupees = parseFloat((newCoins / 100).toFixed(2));
      return {
        ...prev,
        coins: newCoins,
        rupees: newRupees,
        withdrawnToday: prev.withdrawnToday + rupeesWithdrawn,
      };
    });

    setTransactions((prev) => [txn, ...prev]);
    showToast(` UPI Deposit Successful! ${formatINR(rupeesWithdrawn)} sent to ${txn.upiId}`);
  };

  const scrollToAds = () => {
    if (adsSectionRef.current) {
      adsSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950 flex flex-col">
      {/* Top Header Navigation */}
      <Header
        wallet={wallet}
        onOpenWithdraw={() => setIsWithdrawModalOpen(true)}
        onOpenFAQ={() => setIsFAQModalOpen(true)}
        onAddTestCoins={handleAddTestCoins}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-slate-950 px-4 py-2.5 rounded-full font-extrabold text-xs shadow-2xl flex items-center space-x-2 border border-emerald-300 animate-bounce-once">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 space-y-6">
        {/* Wallet Balance & Daily Limit Card */}
        <WalletSummaryCard
          wallet={wallet}
          onOpenWithdraw={() => setIsWithdrawModalOpen(true)}
          onScrollToAds={scrollToAds}
          onOpenSpin={() => setIsSpinModalOpen(true)}
        />

        {/* Earning Sources Grid: Video Ads */}
        <div ref={adsSectionRef} className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                <Tv className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-extrabold text-base text-white flex items-center gap-2">
                  <span>Watch High-Paying Rewarded Video Ads</span>
                  <span className="bg-amber-500/20 text-amber-400 text-[10px] font-black px-2 py-0.5 rounded-full border border-amber-500/30 uppercase tracking-wider">
                    Lunch Special Live
                  </span>
                </h2>
                <p className="text-xs text-slate-400">Watch 15s–30s brand videos to earn coins instantly (Min ₹1 to Max ₹1 Lakh UPI Payout)</p>
              </div>
            </div>

            <span className="text-xs text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full font-mono self-start sm:self-auto">
              Ads Watched Today: <strong className="text-emerald-400">{wallet.adsWatchedToday}/{wallet.maxDailyAds}</strong>
            </span>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none text-xs">
            <button
              onClick={() => {
                soundFx.playClick();
                setSelectedCategory('all');
              }}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              🌟 All Featured Ads
            </button>
            <button
              onClick={() => {
                soundFx.playClick();
                setSelectedCategory('food');
              }}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap flex items-center space-x-1.5 ${
                selectedCategory === 'food'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow-md shadow-orange-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <span>🍱</span>
              <span>Lunch & Food Deals (50% OFF)</span>
              <span className="ml-1 bg-amber-950/80 text-amber-300 text-[10px] px-1.5 py-0.2 rounded-full font-black">
                2X Bonus
              </span>
            </button>
            <button
              onClick={() => {
                soundFx.playClick();
                setSelectedCategory('shopping');
              }}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
                selectedCategory === 'shopping'
                  ? 'bg-purple-500 text-white shadow-md shadow-purple-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              🛍️ E-Commerce & Shopping
            </button>
            <button
              onClick={() => {
                soundFx.playClick();
                setSelectedCategory('fintech');
              }}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
                selectedCategory === 'fintech'
                  ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              📈 Finance & UPI Offers
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVideoAds.map((ad) => (
              <div
                key={ad.id}
                onClick={() => {
                  soundFx.playClick();
                  setActiveVideoAd(ad);
                }}
                className="group relative bg-slate-900 border border-slate-800 hover:border-emerald-500/60 rounded-2xl p-4 cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10 flex flex-col justify-between space-y-3 overflow-hidden"
              >
                {/* Background Image Banner */}
                <div className="relative h-32 rounded-xl overflow-hidden bg-slate-950">
                  <img
                    src={ad.bannerImage}
                    alt={ad.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-2.5 left-2.5 flex items-center space-x-1.5 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-[10px] font-bold text-white">
                    <span>{ad.sponsorLogo}</span>
                    <span>{ad.sponsorName}</span>
                  </div>

                  <div className="absolute top-2.5 right-2.5 bg-amber-500/90 text-slate-950 font-black text-[11px] px-2 py-0.5 rounded-full shadow">
                    +{formatCoins(ad.rewardCoins)} Coins ({formatINR(ad.rewardRupees)})
                  </div>

                  {/* Play Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div>
                  <h3 className="font-bold text-sm text-slate-100 group-hover:text-emerald-300 transition-colors line-clamp-1">
                    {ad.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {ad.adText}
                  </p>
                </div>

                {/* Footer Action */}
                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/80 text-slate-400">
                  <span>Duration: <strong className="text-slate-200">{ad.durationSeconds}s Video</strong></span>
                  <span className="text-emerald-400 font-bold group-hover:translate-x-0.5 transition-transform">
                    Watch Ad & Earn →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sponsor Banner Click Tasks & Extra Modules */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Quick Banner Tasks */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <div>
                <h3 className="font-extrabold text-sm text-white">Quick Sponsor View Tasks</h3>
                <p className="text-xs text-slate-400">Visit sponsor page for 10s–15s to earn instant coins</p>
              </div>
            </div>

            <div className="space-y-2.5">
              {BANNER_TASKS.map((task) => (
                <div
                  key={task.id}
                  onClick={() => {
                    soundFx.playClick();
                    setActiveBannerTask(task);
                  }}
                  className="bg-slate-950/80 border border-slate-800 hover:border-amber-500/40 rounded-xl p-3 flex items-center justify-between gap-3 cursor-pointer transition-all group"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${task.bgGradient} flex items-center justify-center text-lg shadow-sm`}>
                      {task.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-200 group-hover:text-amber-300 transition-colors">{task.title}</h4>
                      <p className="text-[10px] text-slate-400">{task.description}</p>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className="text-xs font-black text-amber-400">+{formatCoins(task.rewardCoins)} Coins</div>
                    <div className="text-[10px] text-emerald-400 font-semibold">{formatINR(task.rewardRupees)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Scratch & Win Cards */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center space-x-2">
              <Gift className="w-5 h-5 text-indigo-400" />
              <div>
                <h3 className="font-extrabold text-sm text-white">Ad Sponsor Scratch & Win</h3>
                <p className="text-xs text-slate-400">Scratch to reveal surprise prize coins</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {scratchCards.map((card) => (
                <div
                  key={card.id}
                  onClick={() => {
                    soundFx.playClick();
                    setActiveScratchCard(card);
                  }}
                  className={`p-3.5 rounded-xl border text-center cursor-pointer transition-all flex flex-col items-center justify-between space-y-2 ${
                    card.isScratched
                      ? 'bg-slate-950 border-slate-800 text-slate-500 opacity-60'
                      : 'bg-gradient-to-br from-indigo-950/80 to-slate-900 border-indigo-800/60 hover:border-amber-400 text-white shadow-lg'
                  }`}
                >
                  <span className="text-2xl">{card.icon}</span>
                  <div className="text-xs font-bold">{card.title}</div>
                  <div className="text-[11px] font-extrabold text-amber-400">
                    {card.isScratched ? 'Revealed' : `Up to ${formatCoins(card.rewardCoins)} Coins`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Daily Streak Check-in */}
        <DailyCheckin
          streakDays={wallet.streakDays}
          lastCheckInDate={wallet.lastCheckInDate}
          onClaimDailyStreak={handleClaimDailyStreak}
        />

        {/* Refer & Earn Program */}
        <ReferralCard
          referralCode={wallet.referralCode}
          totalReferrals={wallet.totalReferrals}
          onAddReferralReward={handleAddReferralReward}
        />

        {/* Transaction Ledger */}
        <TransactionHistory
          transactions={transactions}
          onViewReceipt={(txn) => setSelectedReceiptTxn(txn)}
        />
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-6 text-center text-xs text-slate-500 space-y-2 mt-8">
        <div className="flex items-center justify-center space-x-2 text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold text-slate-300">EarnUPI Rewards India • Direct NPCI Bank Transfers</span>
        </div>
        <p>Minimum daily withdrawal: ₹1 (100 Coins) | Maximum daily limit: ₹1,00,000 (1 Lakh)</p>
        <p className="text-[11px] text-slate-600">Supported Gateways: BHIM UPI, PhonePe, Google Pay, Paytm & Amazon Pay UPI</p>
      </footer>

      {/* ALL MODALS */}
      <VideoAdWatcherModal
        ad={activeVideoAd}
        onClose={() => setActiveVideoAd(null)}
        onClaimReward={handleClaimVideoAd}
      />

      <BannerTaskModal
        task={activeBannerTask}
        onClose={() => setActiveBannerTask(null)}
        onClaimReward={handleClaimBannerTask}
      />

      <SpinWheelModal
        isOpen={isSpinModalOpen}
        onClose={() => setIsSpinModalOpen(false)}
        onSpinWin={handleSpinWin}
        spinsLeft={spinsLeft}
      />

      <ScratchCardModal
        card={activeScratchCard}
        onClose={() => setActiveScratchCard(null)}
        onClaimScratch={handleClaimScratchCard}
      />

      <UPIWithdrawModal
        isOpen={isWithdrawModalOpen}
        wallet={wallet}
        onClose={() => setIsWithdrawModalOpen(false)}
        onConfirmWithdrawal={handleConfirmWithdrawal}
      />

      <ReceiptModal
        transaction={selectedReceiptTxn}
        onClose={() => setSelectedReceiptTxn(null)}
      />

      <FAQModal
        isOpen={isFAQModalOpen}
        onClose={() => setIsFAQModalOpen(false)}
      />
    </div>
  );
}
