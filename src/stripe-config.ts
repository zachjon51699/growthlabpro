// Stripe product configuration
export const stripeProducts = {
  'contractor-essentials': {
    priceId: 'price_1S8pthH0LoMPsmTkg1QdLmfw',
    name: 'Growth Starter',
    description: 'Complete marketing system for contractors',
    mode: 'subscription' as const
  },
  'contractor-supreme': {
    priceId: 'price_1S8puTH0LoMPsmTkSVintRX0',
    name: 'Growth Pro', 
    description: 'Everything in Growth Starter +',
    mode: 'subscription' as const
  },
  'contractor-enterprise': {
    priceId: 'price_1S8puvH0LoMPsmTk3j6vGVJr',
    name: 'Growth Enterprise',
    description: 'Custom solutions for large contractor operations',
    mode: 'subscription' as const
  },
  'video-marketing': {
    priceId: 'price_1S8py4H0LoMPsmTk9kc2bZt3',
    name: 'Video Marketing Package',
    description: 'Professional video content creation and marketing',
    mode: 'payment' as const
  },
  'social-media': {
    priceId: 'price_1S8pxVH0LoMPsmTkBmQjmCRd',
    name: 'Social Media Management',
    description: 'Complete social media content and posting service',
    mode: 'subscription' as const
  },
  'landing-pages': {
    priceId: 'price_1S8pwsH0LoMPsmTktH42oXH4',
    name: 'Custom Landing Pages',
    description: 'Service-specific landing pages for better conversions',
    mode: 'payment' as const
  }
};

export type ProductKey = keyof typeof stripeProducts;