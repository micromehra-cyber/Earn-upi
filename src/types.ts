export type UPIGatewayType = 'bhim' | 'gpay' | 'phonepe' | 'paytm' | 'amazonpay' | 'other_upi';

export interface UPIGateway {
  id: UPIGatewayType;
  name: string;
  icon: string;
  color: string;
  placeholder: string;
  recommendedSuffixes: string[];
}

export interface UserWallet {
  coins: number;               // 100 coins = 1 INR
  rupees: number;              // Calculated or direct INR balance
  totalEarnedRupees: number;
  withdrawnToday: number;      // Amount withdrawn today in INR
  dailyWithdrawalLimit: number; // 100,000 (1 Lakh)
  minWithdrawal: number;        // 1 INR
  streakDays: number;
  lastCheckInDate: string | null;
  adsWatchedToday: number;
  maxDailyAds: number;
  referralCode: string;
  totalReferrals: number;
}

export type AdCategory = 'shopping' | 'gaming' | 'food' | 'fintech' | 'entertainment' | 'tech';

export interface VideoAd {
  id: string;
  title: string;
  sponsorName: string;
  sponsorLogo: string;
  durationSeconds: number;
  rewardCoins: number;
  rewardRupees: number;
  category: AdCategory;
  bannerImage: string;
  adText: string;
  ctaText: string;
  ctaLink: string;
  videoBgColor: string;
  rating: number;
  totalViews: string;
}

export interface BannerTask {
  id: string;
  title: string;
  sponsor: string;
  rewardCoins: number;
  rewardRupees: number;
  timerSeconds: number;
  icon: string;
  bgGradient: string;
  description: string;
  isCompleted?: boolean;
}

export type TransactionType = 'ad_reward' | 'banner_reward' | 'spin_reward' | 'scratch_reward' | 'streak_reward' | 'referral_reward' | 'upi_withdrawal';
export type TransactionStatus = 'SUCCESS' | 'PROCESSING' | 'FAILED' | 'REFUNDED';

export interface Transaction {
  id: string;
  type: TransactionType;
  title: string;
  coins: number;
  rupees: number;
  timestamp: string;
  status: TransactionStatus;
  upiId?: string;
  gateway?: UPIGatewayType;
  utrNumber?: string;
  bankRef?: string;
  note?: string;
}

export interface ScratchCardData {
  id: string;
  title: string;
  rewardCoins: number;
  rewardRupees: number;
  isScratched: boolean;
  themeColor: string;
  icon: string;
}
