import { VideoAd, BannerTask, ScratchCardData, Transaction } from '../types';

export const VIDEO_ADS: VideoAd[] = [
  {
    id: 'ad-1',
    title: 'Tata Neu Super App - Earn NeuCoins',
    sponsorName: 'Tata Neu',
    sponsorLogo: '⚡',
    durationSeconds: 15,
    rewardCoins: 200,
    rewardRupees: 2.0,
    category: 'shopping',
    bannerImage: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&auto=format&fit=crop&q=80',
    adText: 'Shop electronics, groceries, fashion & flights on Tata Neu. Get 5% NeuCoins on every order!',
    ctaText: 'Explore Tata Neu Offer',
    ctaLink: 'https://www.tataneu.com',
    videoBgColor: 'from-purple-900 to-indigo-900',
    rating: 4.8,
    totalViews: '2.4M'
  },
  {
    id: 'ad-2',
    title: 'Swiggy Gourmet - Special Lunch Thalis & Combos',
    sponsorName: 'Swiggy Lunch',
    sponsorLogo: '🍱',
    durationSeconds: 20,
    rewardCoins: 350,
    rewardRupees: 3.5,
    category: 'food',
    bannerImage: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80',
    adText: 'Order delicious North Indian Thalis, Biryanis, Salads & Chinese Bowls with Flat 50% Off Lunch Deals!',
    ctaText: 'Order Lunch Deal',
    ctaLink: 'https://www.swiggy.com',
    videoBgColor: 'from-orange-900 to-amber-900',
    rating: 4.9,
    totalViews: '4.1M'
  },
  {
    id: 'ad-lunch-1',
    title: 'Zomato Everyday Lunch Bowls @ ₹99',
    sponsorName: 'Zomato',
    sponsorLogo: '🍲',
    durationSeconds: 15,
    rewardCoins: 450,
    rewardRupees: 4.5,
    category: 'food',
    bannerImage: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop&q=80',
    adText: 'Home-style cooked fresh lunch meals delivered hot to your office or home in under 20 minutes.',
    ctaText: 'Get Lunch @ ₹99',
    ctaLink: 'https://www.zomato.com',
    videoBgColor: 'from-red-900 to-rose-950',
    rating: 4.9,
    totalViews: '3.6M'
  },
  {
    id: 'ad-3',
    title: 'Flipkart Big Savings Days Sale',
    sponsorName: 'Flipkart',
    sponsorLogo: '🛍️',
    durationSeconds: 30,
    rewardCoins: 500,
    rewardRupees: 5.0,
    category: 'shopping',
    bannerImage: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80',
    adText: 'Up to 80% Off on Smartphones, Laptops & Home Appliances + Extra 10% Instant Discount on Bank Cards!',
    ctaText: 'Shop Big Sale',
    ctaLink: 'https://www.flipkart.com',
    videoBgColor: 'from-blue-900 to-sky-900',
    rating: 4.7,
    totalViews: '5.8M'
  },
  {
    id: 'ad-4',
    title: 'Zerodha Coin - Zero Brokerage SIPs',
    sponsorName: 'Zerodha',
    sponsorLogo: '📈',
    durationSeconds: 25,
    rewardCoins: 400,
    rewardRupees: 4.0,
    category: 'fintech',
    bannerImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80',
    adText: 'Invest directly in Mutual Funds with 0% commission. Build your long-term wealth hassle-free.',
    ctaText: 'Open Free Account',
    ctaLink: 'https://zerodha.com',
    videoBgColor: 'from-teal-900 to-emerald-900',
    rating: 4.9,
    totalViews: '1.9M'
  },
  {
    id: 'ad-5',
    title: 'Lenskart Buy 1 Get 1 Gold Pass',
    sponsorName: 'Lenskart',
    sponsorLogo: '👓',
    durationSeconds: 15,
    rewardCoins: 250,
    rewardRupees: 2.5,
    category: 'shopping',
    bannerImage: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80',
    adText: 'Get 2 pairs of trendsetting eyeglasses at the price of 1 + Free Home Eye Checkup in top cities!',
    ctaText: 'Claim BOGO Pass',
    ctaLink: 'https://www.lenskart.com',
    videoBgColor: 'from-cyan-900 to-blue-900',
    rating: 4.6,
    totalViews: '3.2M'
  },
  {
    id: 'ad-6',
    title: 'CRED Garage - Car Vehicle Management',
    sponsorName: 'CRED',
    sponsorLogo: '🚗',
    durationSeconds: 30,
    rewardCoins: 600,
    rewardRupees: 6.0,
    category: 'fintech',
    bannerImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80',
    adText: 'Keep track of fastag balances, motor insurance renewals, and service records in one sleek dashboard.',
    ctaText: 'Check Cred Garage',
    ctaLink: 'https://cred.club',
    videoBgColor: 'from-zinc-900 to-slate-900',
    rating: 4.8,
    totalViews: '2.8M'
  }
];

export const BANNER_TASKS: BannerTask[] = [
  {
    id: 'banner-1',
    title: 'Inspect Zepto 10-Min Delivery Deal',
    sponsor: 'Zepto',
    rewardCoins: 150,
    rewardRupees: 1.5,
    timerSeconds: 10,
    icon: '⚡',
    bgGradient: 'from-violet-600 to-purple-800',
    description: 'Visit page & stay active for 10s to collect your UPI coins.'
  },
  {
    id: 'banner-2',
    title: 'Check Meesho Reseller Earnings',
    sponsor: 'Meesho',
    rewardCoins: 200,
    rewardRupees: 2.0,
    timerSeconds: 12,
    icon: '🛍️',
    bgGradient: 'from-pink-600 to-rose-700',
    description: 'Discover trending fashion items at zero commission.'
  },
  {
    id: 'banner-3',
    title: 'Explore Navi Instant Home Loans',
    sponsor: 'Navi',
    rewardCoins: 300,
    rewardRupees: 3.0,
    timerSeconds: 15,
    icon: '🏠',
    bgGradient: 'from-emerald-600 to-teal-800',
    description: 'Check loan eligibility up to ₹20 Lakhs instantly.'
  },
  {
    id: 'banner-lunch',
    title: 'EatClub 50% Off Lunch Thalis & Biryanis',
    sponsor: 'EatClub Lunch',
    rewardCoins: 300,
    rewardRupees: 3.0,
    timerSeconds: 10,
    icon: '🍱',
    bgGradient: 'from-amber-600 to-orange-800',
    description: 'Explore gourmet lunch thalis, royal biryanis & desserts with flat 50% discount.'
  },
  {
    id: 'banner-4',
    title: 'Myntra Fashion End of Reason Sale',
    sponsor: 'Myntra',
    rewardCoins: 250,
    rewardRupees: 2.5,
    timerSeconds: 10,
    icon: '👗',
    bgGradient: 'from-fuchsia-600 to-purple-800',
    description: 'Top international brands at 50-80% discounts.'
  }
];

export const INITIAL_SCRATCH_CARDS: ScratchCardData[] = [
  {
    id: 'scratch-1',
    title: 'Ad Sponsor Jackpot Card',
    rewardCoins: 350,
    rewardRupees: 3.5,
    isScratched: false,
    themeColor: 'from-amber-500 to-yellow-600',
    icon: '🎰'
  },
  {
    id: 'scratch-2',
    title: 'Daily Lucky Ad Scratch',
    rewardCoins: 500,
    rewardRupees: 5.0,
    isScratched: false,
    themeColor: 'from-emerald-500 to-teal-700',
    icon: '✨'
  },
  {
    id: 'scratch-3',
    title: 'Super UPI Bumper Card',
    rewardCoins: 1000,
    rewardRupees: 10.0,
    isScratched: false,
    themeColor: 'from-purple-600 to-indigo-700',
    icon: '💎'
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'TXN-90412',
    type: 'upi_withdrawal',
    title: 'Instant UPI Payout (PhonePe)',
    coins: 50000,
    rupees: 500.0,
    timestamp: '2026-08-01 18:32',
    status: 'SUCCESS',
    upiId: 'rahul.mehra@ybl',
    gateway: 'phonepe',
    utrNumber: 'UTR409281742019',
    bankRef: 'State Bank of India (Yes Bank Switch)',
    note: 'Daily withdrawal limit count: ₹500/₹1,00,000'
  },
  {
    id: 'TXN-90388',
    type: 'ad_reward',
    title: 'Watched Tata Neu Rewarded Video Ad',
    coins: 200,
    rupees: 2.0,
    timestamp: '2026-08-01 16:15',
    status: 'SUCCESS'
  },
  {
    id: 'TXN-90210',
    type: 'streak_reward',
    title: '7-Day Check-in Streak Bonus',
    coins: 1000,
    rupees: 10.0,
    timestamp: '2026-08-01 09:00',
    status: 'SUCCESS'
  }
];
