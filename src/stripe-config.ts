// Stripe product configuration
export const stripeProducts = {
  'contractor-essentials': {
    priceId: 'price_1S9x2JH0LoMPsmTk8gYGnKTm',
    name: 'Growth Starter',
    description: 'Complete marketing system for contractors',
    mode: 'subscription' as const
  },
  'contractor-supreme': {
    priceId: 'price_1S9x2rH0LoMPsmTkHNTFWlBs',
    name: 'Growth Pro', 
    description: 'Everything in Growth Starter +',
    mode: 'subscription' as const
  },
  'contractor-enterprise': {
    priceId: 'price_1S9x2aH0LoMPsmTkehf4r5hs',
    name: 'Growth Enterprise',
    description: 'Custom solutions for large contractor operations',
    mode: 'subscription' as const
  },
  'video-marketing': {
    priceId: 'price_1S9x46H0LoMPsmTkPveBuTHg',
    name: 'Video Marketing Package',
    description: 'Professional video content creation and marketing',
    mode: 'payment' as const
  },
  'social-media': {
    priceId: 'price_1S9x3oH0LoMPsmTkTlG6Hf39',
    name: 'Social Media Management',
    description: 'Complete social media content and posting service',
    mode: 'subscription' as const
  },
  'landing-pages': {
    priceId: 'price_1S9x3WH0LoMPsmTkIyGeydx6',
    name: 'Custom Landing Pages',
    description: 'Service-specific landing pages for better conversions',
    mode: 'payment' as const
  }
};

export type ProductKey = keyof typeof stripeProducts;