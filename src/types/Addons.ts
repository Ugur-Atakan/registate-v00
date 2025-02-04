export interface Addon {
    id: string;
    productId: string;
    productName: string;
    description?: string;
    features: string[];
    basePrice?: number | null;
    baseCurrency?: string | null;
    baseFrequency?: 'MONTHLY' | 'ANNUALLY' | 'ONETIME' | 'FREE' | null;
    basePriceStripeId?: string | null;
    prices: AddonPrice[];
    order: number;
  }
  
  export interface AddonPrice {
    id: string;
    name?: string;
    amount: number;
    currency: string;
    frequency: 'MONTHLY' | 'ANNUALLY' | 'ONETIME' | 'FREE';
    stripePriceId: string;
  }
  