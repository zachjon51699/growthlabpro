import React, { useState } from 'react';
import { stripeProducts } from '../stripe-config';
import { 
  Check, 
  X, 
  Star, 
  ArrowRight, 
  Zap, 
  Crown, 
  Rocket,
  Shield,
  Users,
  TrendingUp,
  Globe,
  Target,
  Home,
  ShoppingCart,
  Plus,
  Minus,
  Trash2
} from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  type: 'plan' | 'addon';
  billingCycle?: 'monthly' | 'annual';
}


interface PricingPageProps {
  onNavigateHome: () => void;
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  getCartItemCount: () => number;
  showCart: boolean;
  setShowCart: (show: boolean) => void;
}

const PricingPage = ({ onNavigateHome, cart, addToCart, removeFromCart, getCartItemCount, showCart, setShowCart }: PricingPageProps) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price, 0);
  };

  const handleCheckout = async (productKey: string) => {
    setIsLoading(productKey);
    
    try {
      const product = stripeProducts[productKey as keyof typeof stripeProducts];
      if (!product) {
        throw new Error('Product not found');
      }

      // Create a direct Stripe checkout session
      const stripe = window.Stripe ? window.Stripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY) : null;
      
      if (!stripe) {
        throw new Error('Stripe is not loaded. Please refresh the page and try again.');
      }

      // Create checkout session directly with Stripe
      const response = await fetch('/.netlify/functions/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          price_id: product.priceId,
          mode: product.mode,
          success_url: `${window.location.origin}?success=true`,
          cancel_url: `${window.location.origin}?canceled=true`,
        }),
      });

      if (!response.ok) {
        // Fallback to direct Stripe checkout
        const { error } = await stripe.redirectToCheckout({
          lineItems: [{
            price: product.priceId,
            quantity: 1,
          }],
          mode: product.mode,
          successUrl: `${window.location.origin}?success=true`,
          cancelUrl: `${window.location.origin}?canceled=true`,
        });
        
        if (error) {
          throw new Error(error.message);
        }
        return;
      }

      const { sessionId } = await response.json();
      
      // Redirect to Stripe Checkout
      const { error } = await stripe.redirectToCheckout({
        sessionId: sessionId,
      });
      
      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert(`Checkout error: ${error.message}`);
    } finally {
      setIsLoading(null);
    }
  };

  const handleCartCheckout = async () => {
    if (cart.length === 0) {
      alert('Your cart is empty. Please add items before checking out.');
      return;
    }

    setIsLoading('cart-checkout');
    
    try {
      // Build line items array from cart
      const lineItems = cart.map(item => {
        // Map cart item names to product keys
        let productKey;
        if (item.name === 'Growth Starter') {
          productKey = 'contractor-essentials';
        } else if (item.name === 'Growth Pro') {
          productKey = 'contractor-supreme';
        } else if (item.name === 'Growth Enterprise') {
          productKey = 'contractor-enterprise';
        } else if (item.name === 'Custom Landing Pages') {
          productKey = 'landing-pages';
        } else if (item.name === 'Social Media Management') {
          productKey = 'social-media';
        } else if (item.name === 'Video Marketing Package') {
          productKey = 'video-marketing';
        } else {
          throw new Error('Product configuration not found for: ' + item.name);
        }
        
        const product = stripeProducts[productKey];
        if (!product) {
          throw new Error('Product configuration not found for: ' + item.name);
        }
        
        return {
          price: product.priceId,
          quantity: 1
        };
      });
      
      // Determine checkout mode - if any item is a subscription, use subscription mode
      const hasSubscription = cart.some(item => item.type === 'plan');
      const checkoutMode = hasSubscription ? 'subscription' : 'payment';
      
      console.log('Creating checkout for items:', lineItems);
      console.log('Checkout mode:', checkoutMode);

      // Try Netlify function first
      const response = await fetch('/.netlify/functions/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          line_items: lineItems,
          mode: checkoutMode,
          success_url: `${window.location.origin}?success=true`,
          cancel_url: `${window.location.origin}?canceled=true`,
        }),
      });

      if (!response.ok) {
        let errorMessage = 'Unknown error occurred';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (parseError) {
          const errorText = await response.text();
          errorMessage = errorText || `HTTP ${response.status}: ${response.statusText}`;
        }
        console.error('Netlify function failed:', errorMessage);
        
        // Check if Stripe is loaded and API key is available
        const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
        
        if (!stripePublishableKey || stripePublishableKey.includes('your_actual')) {
          throw new Error(`Stripe configuration error: ${errorMessage}. Please check your environment variables.`);
        }
        
        if (!window.Stripe) {
          throw new Error('Stripe is not loaded. Please refresh the page and try again.');
        }
        
        console.log('Netlify function failed, trying direct Stripe checkout...');
        const stripe = window.Stripe(stripePublishableKey);
        
        const { error } = await stripe.redirectToCheckout({
          lineItems: lineItems,
          mode: checkoutMode,
          successUrl: `${window.location.origin}?success=true`,
          cancelUrl: `${window.location.origin}?canceled=true`,
        });
        
        if (error) {
          throw new Error(error.message);
        }
        return;
      }

      const { sessionId } = await response.json();
      
      // Check if Stripe is loaded for redirect
      const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
      
      if (!stripePublishableKey || stripePublishableKey.includes('your_actual')) {
        throw new Error('Stripe publishable key is not configured. Please add your real Stripe publishable key to the .env file.');
      }
      
      if (!window.Stripe) {
        throw new Error('Stripe is not loaded. Please refresh the page and try again.');
      }
      
      const stripe = window.Stripe(stripePublishableKey);
      
      // Redirect to Stripe Checkout
      const { error } = await stripe.redirectToCheckout({
        sessionId: sessionId,
      });
      
      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Cart checkout error:', error);
      alert(`Checkout error: ${error.message}. Please try again or contact support.`);
    } finally {
      setIsLoading(null);
    }
  };



  const plans = [
    {
      name: 'Growth Starter',
      icon: <Rocket className="h-8 w-8" style={{color: '#FDE68A'}} />,
      description: 'Complete marketing system for contractors',
      monthlyPrice: 297,
      annualPrice: 2673, // 10% discount
      popular: false,
      features: [
        'Functional Website (up to 10 pages)',
        'Basic Booking Form (Request a Quote)',
        'Automated Lead Follow Up',
        'Missed Call Text Back',
        'Automated Google Reviews',
        'One-Click Marketing Campaigns',
        'On-Site SEO',
      ],
      notIncluded: [
        'Qualified Leads & Appointments',
        'Online Booking System with Calendar Sync',
        'Google Ads Management',
        'Google My Business Optimizations',
        'Blog Posts',
        'Enterprise-Level Features',
      ]
    },
    {
      name: 'Growth Pro',
      icon: <Star className="h-8 w-8" style={{color: '#FDE68A'}} />,
      description: 'Everything in Growth Starter +',
      monthlyPrice: 750,
      annualPrice: 6750, // 10% discount
      popular: true,
      features: [
        'Everything in Growth Starter',
        'Qualified Leads & Appointments',
        'Online Booking System with Calendar Sync',
        'Google Ads Management',
        'Google My Business Optimizations',
        'Blog Posts',
      ],
      notIncluded: [
        'Multi-location Management',
        'White-label Client Reporting',
        'Custom API Integrations',
        'Advanced Custom Features (Enterprise)',
      ]
    },
    {
      name: 'Growth Enterprise',
      icon: <Crown className="h-8 w-8" style={{color: '#FDE68A'}} />,
      description: 'Custom solutions for large contractor operations',
      monthlyPrice: 1500,
      annualPrice: 13500, // 10% discount
      popular: false,
      features: [
        'Everything in Contractor Essentials',
        'Qualified Leads & Appointments',
        'Online Booking System with Calendar Sync & Automated Confirmations',
        'Google Ads Management',
        'Google My Business Optimizations',
        'Blog Posts',
        'Multi-location Management',
        'White-label Client Reporting',
        'Custom API Integrations',
        '24/7 Priority Support',
        'Custom Development Work',
        'Advanced Analytics Dashboard',
        'Custom Automations',
      ],
      notIncluded: []
    }
  ];

  const addOns = [
    {
      name: 'Custom Landing Pages',
      description: 'Service-specific landing pages for better conversions',
      price: '$497 per page',
      icon: <Globe className="h-6 w-6" style={{color: '#FDE68A'}} />
    },
    {
      name: 'Social Media Management',
      description: 'Complete social media content and posting service',
      price: '$297/month',
      icon: <Zap className="h-6 w-6" style={{color: '#FDE68A'}} />
    },
    {
      name: 'Video Marketing Package',
      description: 'Professional video content creation and marketing',
      price: '$497/month',
      icon: <Shield className="h-6 w-6" style={{color: '#FDE68A'}} />
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <header className="fixed w-full top-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <button 
                  onClick={onNavigateHome}
                  className="text-2xl font-bold transition-colors" 
                  style={{color: '#D4AF37'}}
                  onMouseEnter={(e) => e.target.style.color = '#B8860B'}
                  onMouseLeave={(e) => e.target.style.color = '#D4AF37'}
                >
                  GrowthLabPro
                </button>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <button onClick={onNavigateHome} className="font-medium transition-colors" style={{color: '#0A2540'}} onMouseEnter={(e) => e.target.style.color = '#D4AF37'} onMouseLeave={(e) => e.target.style.color = '#0A2540'}>Services</button>
              <a href="#pricing" className="font-medium transition-colors" style={{color: '#0A2540'}} onMouseEnter={(e) => e.target.style.color = '#D4AF37'} onMouseLeave={(e) => e.target.style.color = '#0A2540'}>Pricing</a>
              <button onClick={onNavigateHome} className="font-medium transition-colors" style={{color: '#0A2540'}} onMouseEnter={(e) => e.target.style.color = '#D4AF37'} onMouseLeave={(e) => e.target.style.color = '#0A2540'}>About</button>
              <button onClick={onNavigateHome} className="font-medium transition-colors" style={{color: '#0A2540'}} onMouseEnter={(e) => e.target.style.color = '#D4AF37'} onMouseLeave={(e) => e.target.style.color = '#0A2540'}>Reviews</button>
              <button onClick={onNavigateHome} className="font-medium transition-colors" style={{color: '#0A2540'}} onMouseEnter={(e) => e.target.style.color = '#D4AF37'} onMouseLeave={(e) => e.target.style.color = '#0A2540'}>Contact</button>
              
              {/* Cart Button */}
              <button 
                onClick={() => setShowCart(true)}
                className="relative p-2 rounded-lg transition-colors"
                style={{color: '#0A2540'}}
                onMouseEnter={(e) => e.target.style.color = '#D4AF37'}
                onMouseLeave={(e) => e.target.style.color = '#0A2540'}
              >
                <ShoppingCart size={24} />
                {getCartItemCount() > 0 && (
                  <span 
                    className="absolute -top-1 -right-1 text-xs font-bold text-white rounded-full w-5 h-5 flex items-center justify-center"
                    style={{backgroundColor: '#D4AF37'}}
                  >
                    {getCartItemCount()}
                  </span>
                )}
              </button>
              
              <button 
                className="text-white px-6 py-2 rounded-lg transition-colors font-medium"
                style={{backgroundColor: '#D4AF37'}}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#B8860B'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#D4AF37'}
              >
                Get Started
              </button>
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => {}} // You can add mobile menu functionality here if needed
                className="transition-colors"
                style={{color: '#0A2540'}}
                onMouseEnter={(e) => e.target.style.color = '#D4AF37'}
                onMouseLeave={(e) => e.target.style.color = '#0A2540'}
              >
                <Home size={24} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Header */}
      <section className="pt-20 pb-16" style={{background: 'linear-gradient(to bottom right, #F9FAFB, #F3F4F6)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6" style={{color: '#0A2540'}}>
            Simple, Transparent
            <span style={{color: '#D4AF37'}}> Pricing</span>
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto" style={{color: '#6B7280'}}>
            Choose the perfect plan to grow your contracting business. All plans include our proven 
            marketing systems and dedicated support.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center mb-12">
            <span className={`mr-3 ${billingCycle === 'monthly' ? 'font-semibold' : ''}`} style={{color: billingCycle === 'monthly' ? '#0A2540' : '#6B7280'}}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
              className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
              style={{backgroundColor: billingCycle === 'annual' ? '#D4AF37' : '#D1D5DB'}}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`ml-3 ${billingCycle === 'annual' ? 'font-semibold' : ''}`} style={{color: billingCycle === 'annual' ? '#0A2540' : '#6B7280'}}>
              Annual
            </span>
            <span className="ml-2 px-2 py-1 text-xs font-semibold text-white rounded-full" style={{backgroundColor: '#D4AF37'}}>
              Save 10%
            </span>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section id="pricing-cards" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div
                key={plan.name}
                className={`relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
                  plan.popular ? 'ring-2 scale-105' : 'border border-gray-200'
                }`}
                style={{ringColor: plan.popular ? '#D4AF37' : undefined}}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="px-4 py-2 text-sm font-semibold text-white rounded-full" style={{backgroundColor: '#D4AF37'}}>
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="p-8">
                  <div className="flex items-center mb-4">
                    {plan.icon}
                    <h3 className="text-2xl font-bold ml-3" style={{color: '#0A2540'}}>{plan.name}</h3>
                  </div>
                  
                  <p className="mb-6" style={{color: '#6B7280'}}>{plan.description}</p>
                  
                  <div className="mb-8">
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold" style={{color: '#0A2540'}}>
                        ${billingCycle === 'monthly' ? plan.monthlyPrice.toLocaleString() : Math.round(plan.annualPrice / 12).toLocaleString()}
                      </span>
                      <span className="ml-2" style={{color: '#6B7280'}}>/month</span>
                    </div>
                    {billingCycle === 'annual' && (
                      <p className="text-sm mt-1" style={{color: '#6B7280'}}>
                        Billed annually (${plan.annualPrice.toLocaleString()})
                      </p>
                    )}
                  </div>
                  
                  <button
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors mb-8 ${
                      plan.popular 
                        ? 'text-white' 
                        : 'border-2 transition-colors'
                    }`}
                    style={{
                      backgroundColor: plan.popular ? '#D4AF37' : 'transparent',
                      borderColor: plan.popular ? '#D4AF37' : '#D4AF37',
                      color: plan.popular ? 'white' : '#D4AF37'
                    }}
                    onClick={() => {
                      const planItem: CartItem = {
                        id: `plan-${index}`,
                        name: plan.name,
                        price: billingCycle === 'monthly' ? plan.monthlyPrice : Math.round(plan.annualPrice / 12),
                        type: 'plan',
                        billingCycle
                      };
                      addToCart(planItem);
                      setShowCart(true);
                    }}
                    onMouseEnter={(e) => {
                      if (plan.popular) {
                        e.target.style.backgroundColor = '#B8860B';
                      } else {
                        e.target.style.backgroundColor = '#D4AF37';
                        e.target.style.color = 'white';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (plan.popular) {
                        e.target.style.backgroundColor = '#D4AF37';
                      } else {
                        e.target.style.backgroundColor = 'transparent';
                        e.target.style.color = '#D4AF37';
                      }
                    }}
                  >
                    Add to Cart
                  </button>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold" style={{color: '#0A2540'}}>What's included:</h4>
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start">
                        <Check className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" style={{color: '#D4AF37'}} />
                        <span className="text-sm" style={{color: '#6B7280'}}>{feature}</span>
                      </div>
                    ))}
                    
                    {plan.notIncluded.length > 0 && (
                      <>
                        <h4 className="font-semibold mt-6" style={{color: '#0A2540'}}>Not included:</h4>
                        {plan.notIncluded.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-start">
                            <X className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" style={{color: '#9CA3AF'}} />
                            <span className="text-sm" style={{color: '#9CA3AF'}}>{feature}</span>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Add-ons Section */}
      <section className="py-20" style={{backgroundColor: '#F9FAFB'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{color: '#0A2540'}}>
              Add-On Services
            </h2>
            <p className="text-xl" style={{color: '#6B7280'}}>
              Enhance your plan with additional services tailored to your specific needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {addOns.map((addon, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    {addon.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2" style={{color: '#0A2540'}}>{addon.name}</h3>
                    <p className="mb-3" style={{color: '#6B7280'}}>{addon.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold" style={{color: '#D4AF37'}}>{addon.price}</span>
                      <button 
                        className="text-sm px-4 py-2 rounded-lg transition-colors"
                        style={{backgroundColor: '#D4AF37', color: 'white'}}
                        onClick={() => {
                          const addonItem: CartItem = {
                            id: `addon-${index}`,
                            name: addon.name,
                            price: parseInt(addon.price.replace(/[^0-9]/g, '')),
                            type: 'addon'
                          };
                          addToCart(addonItem);
                          setShowCart(true);
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#B8860B'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#D4AF37'}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {showTerms && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <TermsOfService 
              onNavigateBack={() => setShowTerms(false)} 
              onNavigateToPrivacy={() => {
                setShowTerms(false);
                setShowPrivacy(true);
              }}
            />
          </div>
        </div>
      )}

      {/* Privacy Policy Modal */}
      {showPrivacy && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <PrivacyPolicy onNavigateBack={() => setShowPrivacy(false)} />
          </div>
        </div>
      )}

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{color: '#0A2540'}}>
              Frequently Asked Questions
            </h2>
          </div>
          
          <div className="space-y-8">
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-lg font-semibold mb-3" style={{color: '#0A2540'}}>
                What's included in the setup process?
              </h3>
              <p style={{color: '#6B7280'}}>
                Every plan includes a comprehensive onboarding process where we set up your website, 
                marketing systems, and tracking. Our team handles all the technical details so you can 
                focus on your contracting work.
              </p>
            </div>
            
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-lg font-semibold mb-3" style={{color: '#0A2540'}}>
                Can I upgrade or downgrade my plan?
              </h3>
              <p style={{color: '#6B7280'}}>
                Yes, you can change your plan at any time. Upgrades take effect immediately, while 
                downgrades take effect at your next billing cycle. We'll help you transition smoothly 
                between plans.
              </p>
            </div>
            
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-lg font-semibold mb-3" style={{color: '#0A2540'}}>
                Do you require long-term contracts?
              </h3>
              <p style={{color: '#6B7280'}}>
                No long-term contracts required. All plans are month-to-month, though you can save 10% 
                by choosing annual billing. You can cancel anytime with 30 days notice.
              </p>
            </div>
            
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-lg font-semibold mb-3" style={{color: '#0A2540'}}>
                What kind of results can I expect?
              </h3>
              <p style={{color: '#6B7280'}}>
                While results vary by market and business, our clients typically see a 2-3x increase 
                in qualified leads within the first 90 days. We provide detailed reporting so you can 
                track your ROI.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3" style={{color: '#0A2540'}}>
                Do you work with all types of contractors?
              </h3>
              <p style={{color: '#6B7280'}}>
                We specialize in home service contractors including roofers, plumbers, electricians, 
                HVAC, landscapers, and general contractors. Our systems are proven across all these industries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20" style={{backgroundColor: '#0A2540'}}>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Choose Your Plan?
          </h2>
          <p className="text-xl mb-8" style={{color: '#CBD5E1'}}>
            Join hundreds of contractors who have transformed their businesses with GrowthLabPro. 
            Start with a free consultation to find the perfect plan for your needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              className="text-white px-8 py-4 rounded-lg transition-colors text-lg font-semibold flex items-center justify-center"
              style={{backgroundColor: '#D4AF37'}}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#B8860B'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#D4AF37'}
              onClick={() => window.open('https://api.leadconnectorhq.com/widget/bookings/growthlabpro', '_blank')}
            >
              Schedule Free Consultation
              <ArrowRight className="ml-2" size={20} style={{color: '#FDE68A'}} />
            </button>
            <button 
              className="border-2 border-white text-white px-8 py-4 rounded-lg transition-colors text-lg font-semibold"
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'white';
                e.target.style.color = '#0A2540';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = 'white';
              }}
            >
              Compare All Plans
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-white py-12" style={{backgroundColor: '#0A2540'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4" style={{color: '#D4AF37'}}>GrowthLabPro</h3>
              <p className="mb-4" style={{color: '#94A3B8'}}>
                Website Design & Marketing Systems for Contractors. 
                Smarter campaigns. Faster results.
              </p>
              <p className="text-sm" style={{color: '#64748B'}}>
                © 2025 GrowthLabPro. All rights reserved.
              </p>
              <div className="flex space-x-4 mt-2">
                <button 
                  onClick={() => setShowTerms(true)} 
                  className="text-xs transition-colors" 
                  style={{color: '#64748B'}}
                  onMouseEnter={(e) => e.target.style.color = '#94A3B8'}
                  onMouseLeave={(e) => e.target.style.color = '#64748B'}
                >
                  Terms of Service
                </button>
                <button 
                  onClick={() => setShowPrivacy(true)} 
                  className="text-xs transition-colors" 
                  style={{color: '#64748B'}}
                  onMouseEnter={(e) => e.target.style.color = '#94A3B8'}
                  onMouseLeave={(e) => e.target.style.color = '#64748B'}
                >
                  Privacy Policy
                </button>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2" style={{color: '#94A3B8'}}>
                <li><button onClick={onNavigateHome} className="transition-colors" onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = '#94A3B8'}>Website Design</button></li>
                <li><button onClick={onNavigateHome} className="transition-colors" onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = '#94A3B8'}>Lead Generation</button></li>
                <li><button onClick={onNavigateHome} className="transition-colors" onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = '#94A3B8'}>Marketing Automation</button></li>
                <li><button onClick={onNavigateHome} className="transition-colors" onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = '#94A3B8'}>Social Media Marketing</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2" style={{color: '#94A3B8'}}>
                <li><button onClick={onNavigateHome} className="transition-colors" onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = '#94A3B8'}>About</button></li>
                <li><button onClick={onNavigateHome} className="transition-colors" onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = '#94A3B8'}>Reviews</button></li>
                <li><button onClick={onNavigateHome} className="transition-colors" onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = '#94A3B8'}>Contact</button></li>
                <li><button onClick={onNavigateHome} className="transition-colors" onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = '#94A3B8'}>Case Studies</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2" style={{color: '#94A3B8'}}>
                <li>Phone: 225-454-5977</li>
                <li>Email: contact@growthlabpro.com</li>
                <li>Baton Rouge, LA</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PricingPage;