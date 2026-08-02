import { UPIGateway, UPIGatewayType } from '../types';

export const UPI_GATEWAYS: UPIGateway[] = [
  {
    id: 'bhim',
    name: 'BHIM / Any UPI',
    icon: '⚡',
    color: 'from-emerald-600 to-teal-700',
    placeholder: 'username@upi',
    recommendedSuffixes: ['@upi', '@bhim']
  },
  {
    id: 'gpay',
    name: 'Google Pay',
    icon: '🔵',
    color: 'from-blue-600 to-indigo-600',
    placeholder: 'mobile/name@okicici',
    recommendedSuffixes: ['@okicici', '@oksbi', '@okaxis', '@okhdfcbank']
  },
  {
    id: 'phonepe',
    name: 'PhonePe',
    icon: '🟣',
    color: 'from-purple-600 to-indigo-700',
    placeholder: 'number@ybl or name@ibl',
    recommendedSuffixes: ['@ybl', '@ibl', '@axl']
  },
  {
    id: 'paytm',
    name: 'Paytm UPI',
    icon: '🔷',
    color: 'from-sky-500 to-blue-700',
    placeholder: 'number@paytm',
    recommendedSuffixes: ['@paytm']
  },
  {
    id: 'amazonpay',
    name: 'Amazon Pay',
    icon: '🟧',
    color: 'from-amber-500 to-orange-600',
    placeholder: 'number@apl',
    recommendedSuffixes: ['@apl', '@rapl']
  }
];

// Validate standard VPA format (e.g. user@bank or 9876543210@ybl)
export function isValidUPI(vpa: string): boolean {
  if (!vpa || typeof vpa !== 'string') return false;
  const clean = vpa.trim().toLowerCase();
  // Standard regex for VPA handles in India
  const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
  return upiRegex.test(clean);
}

// Generate realistic Indian NPCI UTR Number (12 digits)
export function generateUTRNumber(): string {
  const prefix = 'UTR40';
  const randomDigits = Array.from({ length: 7 }, () => Math.floor(Math.random() * 10)).join('');
  return `${prefix}${randomDigits}`;
}

// Format INR with Indian Numbering System (e.g., ₹1,00,000)
export function formatINR(amount: number): string {
  if (isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2
  }).format(amount);
}

// Format numbers into Lakhs / Thousands representation
export function formatLakhs(amount: number): string {
  if (amount >= 100000) {
    const lakhs = (amount / 100000).toFixed(amount % 100000 === 0 ? 0 : 2);
    return `₹${lakhs} Lakh${Number(lakhs) > 1 ? 's' : ''}`;
  }
  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}k`;
  }
  return `₹${amount}`;
}

// Format coin counts
export function formatCoins(coins: number): string {
  return new Intl.NumberFormat('en-IN').format(Math.floor(coins));
}

// Convert coins to INR (100 coins = 1 INR)
export function coinsToRupees(coins: number): number {
  return parseFloat((coins / 100).toFixed(2));
}

// Convert INR to Coins
export function rupeesToCoins(rupees: number): number {
  return Math.round(rupees * 100);
}

// Get bank display name based on handle
export function getBankNameFromVPA(upiId: string): string {
  if (!upiId || !upiId.includes('@')) return 'State Bank of India (NPCI UPI)';
  const handle = upiId.split('@')[1]?.toLowerCase();
  switch (handle) {
    case 'ybl': return 'Yes Bank (PhonePe)';
    case 'ibl': return 'IndusInd Bank (PhonePe)';
    case 'axl': return 'Axis Bank (PhonePe)';
    case 'okicici': return 'ICICI Bank (Google Pay)';
    case 'oksbi': return 'State Bank of India (Google Pay)';
    case 'okaxis': return 'Axis Bank (Google Pay)';
    case 'okhdfcbank': return 'HDFC Bank (Google Pay)';
    case 'paytm': return 'Paytm Payments Bank';
    case 'apl': return 'Amazon Pay (Axis Bank)';
    case 'bhim': return 'NPCI BHIM Switch';
    default: return `${handle.toUpperCase()} Bank (UPI Unified Switch)`;
  }
}
