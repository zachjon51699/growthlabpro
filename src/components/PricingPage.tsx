import React, { useState, useEffect, useRef } from 'react';
import Logo from './Logo';
import { stripeProducts } from '../stripe-config';
import TermsOfService from './TermsOfService';
import PrivacyPolicy from './PrivacyPolicy';
import { 
  Check, 
  X, 
  ArrowRight, 
  Rocket,
  Home,
  ShoppingCart,
  Star,
  ChevronDown,
  Globe,
  Phone,
  Zap,
  Target,
  Users,
  CheckCircle
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
  onNavigateToPage?: (page: string) => void;
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  getCartItemCount: () => number;
  showCart: boolean;
  setShowCart: (show: boolean) => void;
}

const PricingPage = ({ onNavigateHome, onNavigateToPage, cart, addToCart, removeFromCart, getCartItemCount, showCart, setShowCart }: PricingPageProps) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [isAboutDropdownOpen, setIsAboutDropdownOpen] = useState(false);
  const [isMobileAboutDropdownOpen, setIsMobileAboutDropdownOpen] = useState(false);
  const aboutDropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Handle About dropdown delay on mouse leave
  const handleAboutMouseEnter = () => {
    if (aboutDropdownTimeoutRef.current) {
      clearTimeout(aboutDropdownTimeoutRef.current);
      aboutDropdownTimeoutRef.current = null;
    }
    setIsAboutDropdownOpen(true);
  };

  const handleAboutMouseLeave = () => {
    aboutDropdownTimeoutRef.current = setTimeout(() => {
      setIsAboutDropdownOpen(false);
    }, 300);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (aboutDropdownTimeoutRef.current) {
        clearTimeout(aboutDropdownTimeoutRef.current);
      }
    };
  }, []);

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
        'Professional Website (up to 10 pages)',
        'Basic Booking Form (Request a Quote)',
        'Lead Follow-Up',
        'Missed Call Follow-Up',
        'Automated Google Reviews',
        'Marketing Campaigns',
        'On-Site SEO',
      ]
    }
  ];


  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <header className="fixed w-full top-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center">
              <Logo onClick={onNavigateHome} size="md" />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => {
                  onNavigateHome();
                  setTimeout(() => {
                    const servicesSection = document.getElementById('services');
                    if (servicesSection) {
                      servicesSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }, 100);
                }}
                className="font-medium transition-colors" 
                style={{color: '#0A2540'}} 
                onMouseEnter={(e) => e.currentTarget.style.color = '#D4AF37'} 
                onMouseLeave={(e) => e.currentTarget.style.color = '#0A2540'}
              >
                Services
              </button>
              <a href="#pricing" className="font-medium transition-colors" style={{color: '#0A2540'}} onMouseEnter={(e) => e.target.style.color = '#D4AF37'} onMouseLeave={(e) => e.target.style.color = '#0A2540'}>Pricing</a>
              {onNavigateToPage && (
                <button onClick={() => onNavigateToPage('portfolio')} className="font-medium transition-colors" style={{color: '#0A2540'}} onMouseEnter={(e) => e.target.style.color = '#D4AF37'} onMouseLeave={(e) => e.target.style.color = '#0A2540'}>Portfolio</button>
              )}
              {/* About Dropdown */}
              <div 
                className="relative"
                onMouseEnter={handleAboutMouseEnter}
                onMouseLeave={handleAboutMouseLeave}
              >
                <button 
                  className="font-medium transition-colors flex items-center" 
                  style={{color: '#0A2540'}} 
                  onMouseEnter={(e) => e.currentTarget.style.color = '#D4AF37'} 
                  onMouseLeave={(e) => e.currentTarget.style.color = '#0A2540'}
                >
                  <span>About</span>
                  <ChevronDown 
                    size={16} 
                    className="ml-1" 
                    style={{transform: isAboutDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s'}}
                  />
                </button>
                
                {isAboutDropdownOpen && onNavigateToPage && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <div className="py-2">
                      <button
                        onClick={() => { 
                          onNavigateToPage('trades-we-serve'); 
                          setIsAboutDropdownOpen(false);
                          window.scrollTo(0, 0);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors"
                        style={{color: '#0A2540'}}
                      >
                        Trades We Serve
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <button 
                onClick={() => {
                  onNavigateHome();
                  setTimeout(() => {
                    const testimonialsSection = document.getElementById('testimonials');
                    if (testimonialsSection) {
                      testimonialsSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }, 100);
                }}
                className="font-medium transition-colors" 
                style={{color: '#0A2540'}} 
                onMouseEnter={(e) => e.currentTarget.style.color = '#D4AF37'} 
                onMouseLeave={(e) => e.currentTarget.style.color = '#0A2540'}
              >
                Reviews
              </button>
              {onNavigateToPage && (
                <button 
                  onClick={() => {
                    onNavigateToPage('contact');
                    window.scrollTo(0, 0);
                  }} 
                  className="font-medium transition-colors" 
                  style={{color: '#0A2540'}} 
                  onMouseEnter={(e) => e.currentTarget.style.color = '#D4AF37'} 
                  onMouseLeave={(e) => e.currentTarget.style.color = '#0A2540'}
                >
                  Contact
                </button>
              )}
              
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
                className="border-2 px-6 py-2 rounded-lg transition-colors font-medium mr-4"
                style={{borderColor: '#D4AF37', color: '#D4AF37'}}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#D4AF37';
                  e.target.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#D4AF37';
                }}
                onClick={() => {
                  const loginUrl = 'https://app.growthlabpro.com';
                  try {
                    window.open(loginUrl, '_blank');
                  } catch (error) {
                    console.error('Error opening login:', error);
                    window.location.href = loginUrl;
                  }
                }}
              >
                Login
              </button>
              <button 
                className="text-white px-6 py-2 rounded-lg transition-colors font-medium"
                style={{backgroundColor: '#D4AF37'}}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#B8860B'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#D4AF37'}
                onClick={() => window.open('https://api.leadconnectorhq.com/widget/bookings/bookwithusdigitalmarketing-c88db2b9-1b27-4207-8b88-ac02f1888281', '_blank')}
              >
                Book a Call
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
      <section className="pt-32 pb-16" style={{background: 'linear-gradient(to bottom right, #F9FAFB, #F3F4F6)'}}>
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
          <div className="grid grid-cols-1 gap-8 max-w-2xl mx-auto">
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
                
                <div className="p-10">
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
                    
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{color: '#0A2540'}}>
              Everything Your Contractor Business Needs to Grow
            </h2>
            <p className="text-2xl font-bold mt-6" style={{color: '#D4AF37'}}>
              All included for only $297/mo
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Professional Websites */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <Globe className="h-12 w-12 mb-4" style={{color: 'rgb(253, 230, 138)'}} />
              <h3 className="text-xl font-bold mb-3" style={{color: 'rgb(10, 37, 64)'}}>Professional Websites</h3>
              <p className="mb-4" style={{color: 'rgb(107, 114, 128)'}}>Contractor websites built for results, not just looks. Lightning-fast loading, search engine optimized, and strategically designed to turn visitors into leads.</p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm" style={{color: 'rgb(107, 114, 128)'}}>
                  <CheckCircle className="h-4 w-4 mr-2" style={{color: 'rgb(212, 175, 55)'}} />
                  Mobile-First Design
                </li>
                <li className="flex items-center text-sm" style={{color: 'rgb(107, 114, 128)'}}>
                  <CheckCircle className="h-4 w-4 mr-2" style={{color: 'rgb(212, 175, 55)'}} />
                  Lead Capture Forms
                </li>
                <li className="flex items-center text-sm" style={{color: 'rgb(107, 114, 128)'}}>
                  <CheckCircle className="h-4 w-4 mr-2" style={{color: 'rgb(212, 175, 55)'}} />
                  SEO Optimization
                </li>
              </ul>
          </div>
          
            {/* Missed Call Text Back */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <Phone className="h-12 w-12 mb-4" style={{color: 'rgb(253, 230, 138)'}} />
              <h3 className="text-xl font-bold mb-3" style={{color: 'rgb(10, 37, 64)'}}>Missed Call Text Back</h3>
              <p className="mb-4" style={{color: 'rgb(107, 114, 128)'}}>Instantly text every caller you miss, turning unanswered rings into active conversations. No more lost leads—every call gets a follow-up, even when you're on another job.</p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm" style={{color: 'rgb(107, 114, 128)'}}>
                  <CheckCircle className="h-4 w-4 mr-2" style={{color: 'rgb(212, 175, 55)'}} />
                  Instant Text Response
                </li>
                <li className="flex items-center text-sm" style={{color: 'rgb(107, 114, 128)'}}>
                  <CheckCircle className="h-4 w-4 mr-2" style={{color: 'rgb(212, 175, 55)'}} />
                  Custom Message Templates
                </li>
                <li className="flex items-center text-sm" style={{color: 'rgb(107, 114, 128)'}}>
                  <CheckCircle className="h-4 w-4 mr-2" style={{color: 'rgb(212, 175, 55)'}} />
                  Lead Capture Integration
                </li>
              </ul>
                  </div>

            {/* Automated Review Generator */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <Star className="h-12 w-12 mb-4" style={{color: 'rgb(253, 230, 138)'}} />
              <h3 className="text-xl font-bold mb-3" style={{color: 'rgb(10, 37, 64)'}}>Automated Review Generator</h3>
              <p className="mb-4" style={{color: 'rgb(107, 114, 128)'}}>Systematically gather 5-star reviews from happy customers without lifting a finger. Build a reputation that brings in new business while you focus on the work you do best.</p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm" style={{color: 'rgb(107, 114, 128)'}}>
                  <CheckCircle className="h-4 w-4 mr-2" style={{color: 'rgb(212, 175, 55)'}} />
                  Automated Review Requests
                </li>
                <li className="flex items-center text-sm" style={{color: 'rgb(107, 114, 128)'}}>
                  <CheckCircle className="h-4 w-4 mr-2" style={{color: 'rgb(212, 175, 55)'}} />
                  Multi-Platform Integration
                </li>
                <li className="flex items-center text-sm" style={{color: 'rgb(107, 114, 128)'}}>
                  <CheckCircle className="h-4 w-4 mr-2" style={{color: 'rgb(212, 175, 55)'}} />
                  Review Response Management
                </li>
              </ul>
                    </div>

            {/* One Click Marketing Campaigns */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <Zap className="h-12 w-12 mb-4" style={{color: 'rgb(253, 230, 138)'}} />
              <h3 className="text-xl font-bold mb-3" style={{color: 'rgb(10, 37, 64)'}}>One Click Marketing Campaigns</h3>
              <p className="mb-4" style={{color: 'rgb(107, 114, 128)'}}>Deploy ready-to-go campaigns instantly with contractor-tested templates. Launch review drives, re-engagement campaigns, and holiday promos with zero setup time.</p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm" style={{color: 'rgb(107, 114, 128)'}}>
                  <CheckCircle className="h-4 w-4 mr-2" style={{color: 'rgb(212, 175, 55)'}} />
                  Pre-Built Campaign Templates
                </li>
                <li className="flex items-center text-sm" style={{color: 'rgb(107, 114, 128)'}}>
                  <CheckCircle className="h-4 w-4 mr-2" style={{color: 'rgb(212, 175, 55)'}} />
                  Multi-Platform Deployment
                </li>
                <li className="flex items-center text-sm" style={{color: 'rgb(107, 114, 128)'}}>
                  <CheckCircle className="h-4 w-4 mr-2" style={{color: 'rgb(212, 175, 55)'}} />
                  Performance Tracking
                </li>
              </ul>
                  </div>

            {/* Local SEO */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <Target className="h-12 w-12 mb-4" style={{color: 'rgb(253, 230, 138)'}} />
              <h3 className="text-xl font-bold mb-3" style={{color: 'rgb(10, 37, 64)'}}>Local SEO</h3>
              <p className="mb-4" style={{color: 'rgb(107, 114, 128)'}}>Own local search results when customers in your area need your services. Optimized Google profiles, directory listings, and content that puts you on the map.</p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm" style={{color: 'rgb(107, 114, 128)'}}>
                  <CheckCircle className="h-4 w-4 mr-2" style={{color: 'rgb(212, 175, 55)'}} />
                  Google My Business Optimization
                </li>
                <li className="flex items-center text-sm" style={{color: 'rgb(107, 114, 128)'}}>
                  <CheckCircle className="h-4 w-4 mr-2" style={{color: 'rgb(212, 175, 55)'}} />
                  Local Directory Listings
                </li>
                <li className="flex items-center text-sm" style={{color: 'rgb(107, 114, 128)'}}>
                  <CheckCircle className="h-4 w-4 mr-2" style={{color: 'rgb(212, 175, 55)'}} />
                  Local Keyword Optimization
                </li>
              </ul>
                </div>

            {/* Done-For-You Solutions */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <Users className="h-12 w-12 mb-4" style={{color: 'rgb(253, 230, 138)'}} />
              <h3 className="text-xl font-bold mb-3" style={{color: 'rgb(10, 37, 64)'}}>Done-For-You Solutions</h3>
              <p className="mb-4" style={{color: 'rgb(107, 114, 128)'}}>Full-service marketing management that lets you stay on the tools. We run your campaigns, capture your leads, and handle everything while you close jobs.</p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm" style={{color: 'rgb(107, 114, 128)'}}>
                  <CheckCircle className="h-4 w-4 mr-2" style={{color: 'rgb(212, 175, 55)'}} />
                  Full Campaign Management
                </li>
                <li className="flex items-center text-sm" style={{color: 'rgb(107, 114, 128)'}}>
                  <CheckCircle className="h-4 w-4 mr-2" style={{color: 'rgb(212, 175, 55)'}} />
                  Monthly Reporting
                </li>
                <li className="flex items-center text-sm" style={{color: 'rgb(107, 114, 128)'}}>
                  <CheckCircle className="h-4 w-4 mr-2" style={{color: 'rgb(212, 175, 55)'}} />
                  Dedicated Account Manager
                </li>
              </ul>
              </div>
          </div>
        </div>
      </section>


      {/* Shopping Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-2xl font-bold" style={{ color: '#0A2540' }}>Shopping Cart</h2>
              <button
                onClick={() => setShowCart(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} style={{ color: '#6B7280' }} />
              </button>
            </div>

            <div className="p-6">
              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart size={48} className="mx-auto mb-4" style={{ color: '#D1D5DB' }} />
                  <p className="text-lg mb-2" style={{ color: '#6B7280' }}>Your cart is empty</p>
                  <p className="text-sm" style={{ color: '#9CA3AF' }}>Add a plan to get started</p>
                  <button
                    onClick={() => setShowCart(false)}
                    className="mt-4 text-white px-6 py-2 rounded-lg transition-colors font-medium"
                    style={{ backgroundColor: '#D4AF37' }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#B8860B')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#D4AF37')}
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex-1">
                          <h3 className="font-semibold" style={{ color: '#0A2540' }}>{item.name}</h3>
                          <p className="text-sm" style={{ color: '#6B7280' }}>
                            {item.type === 'plan' ? `${item.billingCycle} billing` : 'One-time purchase'}
                          </p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="font-semibold" style={{ color: '#D4AF37' }}>
                            ${item.price.toLocaleString()}{item.type === 'plan' ? '/mo' : ''}
                          </span>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-1 hover:bg-red-100 rounded transition-colors"
                          >
                            <X size={16} style={{ color: '#EF4444' }} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-semibold" style={{ color: '#0A2540' }}>Total:</span>
                      <span className="text-2xl font-bold" style={{ color: '#D4AF37' }}>
                        ${cart.reduce((total, item) => total + item.price, 0).toLocaleString()}
                      </span>
                    </div>

                    <button
                      onClick={handleCartCheckout}
                      disabled={isLoading === 'cart-checkout'}
                      className="w-full py-3 px-6 rounded-lg font-semibold transition-colors text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ backgroundColor: '#D4AF37' }}
                      onMouseEnter={(e) => {
                        if (!e.currentTarget.disabled) {
                          e.currentTarget.style.backgroundColor = '#B8860B';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!e.currentTarget.disabled) {
                          e.currentTarget.style.backgroundColor = '#D4AF37';
                        }
                      }}
                    >
                      {isLoading === 'cart-checkout' ? 'Processing...' : 'Proceed to Checkout'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

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
              onClick={() => window.open('https://api.leadconnectorhq.com/widget/bookings/bookwithusdigitalmarketing-c88db2b9-1b27-4207-8b88-ac02f1888281', '_blank')}
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
            <div className="flex flex-col">
              <div className="mb-4" style={{display: 'flex', alignItems: 'baseline', minHeight: '24px'}}>
                <img 
                  src="/images/logo footer.png" 
                  alt="GrowthLabPro" 
                  style={{height: '160px', width: 'auto', objectFit: 'contain', display: 'block', marginTop: '-60px', marginLeft: '-30px'}}
                />
              </div>
              <p className="mb-4" style={{color: '#94A3B8', marginTop: '-70px'}}>
                Website Design & Marketing Systems for Contractors. 
                Smarter campaigns. Faster results.
              </p>
              <p className="text-sm" style={{color: '#64748B'}}>
                © 2026 GrowthLabPro. All rights reserved.
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
                <li>
                  <button 
                    onClick={() => {
                      onNavigateHome();
                      setTimeout(() => {
                        const testimonialsSection = document.getElementById('testimonials');
                        if (testimonialsSection) {
                          testimonialsSection.scrollIntoView({ behavior: 'smooth' });
                        }
                      }, 100);
                    }}
                    className="transition-colors" 
                    onMouseEnter={(e) => e.target.style.color = 'white'} 
                    onMouseLeave={(e) => e.target.style.color = '#94A3B8'}
                  >
                    Reviews
                  </button>
                </li>
                {onNavigateToPage && (
                  <li><button onClick={() => onNavigateToPage('contact')} className="transition-colors" onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = '#94A3B8'}>Contact</button></li>
                )}
                <li><button onClick={onNavigateHome} className="transition-colors" onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = '#94A3B8'}>Case Studies</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2" style={{color: '#94A3B8'}}>
                <li>Phone: 225-475-9305</li>
                <li>Email: contact@growthlabpro.com</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PricingPage;