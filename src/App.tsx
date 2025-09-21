import React, { useState } from 'react';
import { stripeProducts } from './stripe-config';
import PricingPage from './components/PricingPage';
import TermsOfService from './components/TermsOfService';
import PrivacyPolicy from './components/PrivacyPolicy';
import { 
  Menu, 
  X, 
  ArrowRight, 
  CheckCircle, 
  Star,
  Users,
  TrendingUp,
  Zap,
  Target,
  Globe,
  Phone,
  Mail,
  MapPin,
  ShoppingCart
} from 'lucide-react';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<'home' | 'pricing' | 'terms' | 'privacy'>('home');
  const [showPortfolio, setShowPortfolio] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Handle URL-based navigation on page load
  React.useEffect(() => {
    const handleRouting = () => {
      const hash = window.location.hash.replace('#', '');
      const path = window.location.pathname;
      
      // Check hash first (for compatibility)
      if (hash === 'pricing') {
        setCurrentPage('pricing');
      } else if (hash === 'terms') {
        setCurrentPage('terms');
      } else if (hash === 'privacy') {
        setCurrentPage('privacy');
      }
      // Then check pathname
      else if (path === '/pricing') {
        setCurrentPage('pricing');
      } else if (path === '/terms') {
        setCurrentPage('terms');
      } else if (path === '/privacy') {
        setCurrentPage('privacy');
      } else {
        setCurrentPage('home');
      }
    };

    handleRouting();
    
    // Listen for hash changes
    const handleHashChange = () => handleRouting();
    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    }
  }, []);

  // Update URL when page changes
  React.useEffect(() => {
    // Try pathname first, fallback to hash if needed
    const currentPath = window.location.pathname;
    const newPath = currentPage === 'home' ? '/' : `/${currentPage}`;
    
    if (currentPath !== newPath) {
      // Try to use pathname, but fallback to hash if there are issues
      try {
        window.history.pushState({}, '', newPath);
      } catch (error) {
        // Fallback to hash-based routing
        window.location.hash = currentPage === 'home' ? '' : currentPage;
      }
    }
  }, [currentPage]);

  interface CartItem {
    id: string;
    name: string;
    price: number;
    type: 'plan' | 'addon';
    billingCycle?: 'monthly' | 'annual';
  }

  const addToCart = (item: CartItem) => {
    setCart(prevCart => {
      // If adding a plan, remove any existing plan first
      if (item.type === 'plan') {
        const withoutPlans = prevCart.filter(cartItem => cartItem.type !== 'plan');
        return [...withoutPlans, item];
      }
      
      // For add-ons, check if it already exists
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart; // Don't add duplicates
      }
      
      return [...prevCart, item];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  };

  const getCartItemCount = () => {
    return cart.length;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  if (currentPage === 'pricing') {
    return (
      <PricingPage 
        onNavigateHome={() => setCurrentPage('home')}
        cart={cart}
        addToCart={addToCart}
        removeFromCart={removeFromCart}
        getCartItemCount={getCartItemCount}
       showCart={showCart}
        setShowCart={setShowCart}
      />
    );
  }

  if (currentPage === 'terms') {
    return <TermsOfService onNavigateBack={() => setCurrentPage('home')} onNavigateToPrivacy={() => setCurrentPage('privacy')} />;
  }

  if (currentPage === 'privacy') {
    return <PrivacyPolicy onNavigateBack={() => setCurrentPage('home')} />;
  }

  const handleCartCheckout = async () => {
    if (cart.length === 0) {
      alert('Your cart is empty. Please add items before checking out.');
      return;
    }

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
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed w-full top-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold" style={{color: '#D4AF37'}}>GrowthLabPro</h1>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#services" className="font-medium transition-colors" style={{color: '#0A2540'}} onMouseEnter={(e) => e.target.style.color = '#D4AF37'} onMouseLeave={(e) => e.target.style.color = '#0A2540'}>Services</a>
              <button onClick={() => setCurrentPage('pricing')} className="font-medium transition-colors" style={{color: '#0A2540'}} onMouseEnter={(e) => e.target.style.color = '#D4AF37'} onMouseLeave={(e) => e.target.style.color = '#0A2540'}>Pricing</button>
              <a href="#about" className="font-medium transition-colors" style={{color: '#0A2540'}} onMouseEnter={(e) => e.target.style.color = '#D4AF37'} onMouseLeave={(e) => e.target.style.color = '#0A2540'}>About</a>
              <a href="#testimonials" className="font-medium transition-colors" style={{color: '#0A2540'}} onMouseEnter={(e) => e.target.style.color = '#D4AF37'} onMouseLeave={(e) => e.target.style.color = '#0A2540'}>Reviews</a>
              <a href="#contact" className="font-medium transition-colors" style={{color: '#0A2540'}} onMouseEnter={(e) => e.target.style.color = '#D4AF37'} onMouseLeave={(e) => e.target.style.color = '#0A2540'}>Contact</a>
              
              {/* Cart Button */}
              <div className="relative">
                <button 
                 onClick={() => setShowCart(true)}
                  className="p-2 rounded-lg transition-colors"
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
              </div>
              
              <button 
                className="text-white px-6 py-2 rounded-lg transition-colors font-medium"
                style={{backgroundColor: '#D4AF37'}}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#B8860B'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#D4AF37'}
                onClick={() => setCurrentPage('pricing')}
              >
                Get Started
              </button>
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="transition-colors"
                style={{color: '#0A2540'}}
                onMouseEnter={(e) => e.target.style.color = '#D4AF37'}
                onMouseLeave={(e) => e.target.style.color = '#0A2540'}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
                <a href="#services" className="block px-3 py-2 transition-colors" style={{color: '#0A2540'}} onMouseEnter={(e) => e.target.style.color = '#D4AF37'} onMouseLeave={(e) => e.target.style.color = '#0A2540'}>Services</a>
                <button onClick={() => setCurrentPage('pricing')} className="block px-3 py-2 transition-colors text-left w-full" style={{color: '#0A2540'}} onMouseEnter={(e) => e.target.style.color = '#D4AF37'} onMouseLeave={(e) => e.target.style.color = '#0A2540'}>Pricing</button>
                <a href="#about" className="block px-3 py-2 transition-colors" style={{color: '#0A2540'}} onMouseEnter={(e) => e.target.style.color = '#D4AF37'} onMouseLeave={(e) => e.target.style.color = '#0A2540'}>About</a>
                <a href="#testimonials" className="block px-3 py-2 transition-colors" style={{color: '#0A2540'}} onMouseEnter={(e) => e.target.style.color = '#D4AF37'} onMouseLeave={(e) => e.target.style.color = '#0A2540'}>Reviews</a>
                <a href="#contact" className="block px-3 py-2 transition-colors" style={{color: '#0A2540'}} onMouseEnter={(e) => e.target.style.color = '#D4AF37'} onMouseLeave={(e) => e.target.style.color = '#0A2540'}>Contact</a>
                <button 
                  className="w-full text-left px-3 py-2 text-white rounded-lg transition-colors"
                  style={{backgroundColor: '#D4AF37'}}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#B8860B'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#D4AF37'}
                  onClick={() => setCurrentPage('pricing')}
                >
                  Get Started
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-16" style={{background: 'linear-gradient(to bottom right, #F9FAFB, #F3F4F6)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight" style={{color: '#0A2540'}}>
              Website Design & Marketing<br />
              <span style={{color: '#D4AF37'}}>Systems for Contractors</span>
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto" style={{color: '#6B7280'}}>
              Smarter campaigns. Faster results. Transform your contracting business with 
              professional websites and proven marketing systems that generate qualified leads.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                className="text-white px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 text-lg font-semibold flex items-center justify-center"
                style={{backgroundColor: '#D4AF37'}}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#B8860B'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#D4AF37'}
                onClick={() => setCurrentPage('pricing')}
              >
                Start Growing Today
                <ArrowRight className="ml-2" size={20} style={{color: '#FDE68A'}} />
              </button>
              <button 
                className="border-2 px-8 py-4 rounded-lg transition-colors text-lg font-semibold"
                style={{borderColor: '#D1D5DB', color: '#0A2540'}}
                onClick={() => setShowPortfolio(true)}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = '#D4AF37';
                  e.target.style.color = '#D4AF37';
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = '#D1D5DB';
                  e.target.style.color = '#0A2540';
                }}
              >
                View Our Work
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Modal */}
      {showPortfolio && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-2xl font-bold" style={{color: '#0A2540'}}>Our Work</h2>
              <button 
                onClick={() => setShowPortfolio(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} style={{color: '#6B7280'}} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Bolt Haulers */}
                <div className="space-y-4">
                  <div className="bg-gray-100 rounded-lg p-8 text-center">
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-sm mx-auto">
                      <iframe 
                        src="https://www.bolthaulers.com" 
                        className="w-full h-64 border-0"
                        title="BoltHaulers Website Preview"
                        style={{transform: 'scale(0.5)', transformOrigin: 'top left', width: '200%', height: '128px'}}
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2" style={{color: '#0A2540'}}>BoltHaulers.com</h3>
                    <p className="text-gray-600 mb-3">Professional hauling and junk removal service website with online booking system.</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Lead Generation</span>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Online Booking</span>
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">Mobile Responsive</span>
                    </div>
                    <div className="mt-3">
                      <a 
                        href="https://www.bolthaulers.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm font-medium transition-colors"
                        style={{color: '#D4AF37'}}
                        onMouseEnter={(e) => e.target.style.color = '#B8860B'}
                        onMouseLeave={(e) => e.target.style.color = '#D4AF37'}
                      >
                        Visit Live Site →
                      </a>
                    </div>
                  </div>
                </div>

                {/* Pumpkins to Geaux */}
                <div className="space-y-4">
                  <div className="bg-gray-100 rounded-lg p-8 text-center">
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-sm mx-auto">
                      <iframe 
                        src="https://www.pumpkinstogeaux.com" 
                        className="w-full h-64 border-0"
                        title="Pumpkins to Geaux Website Preview"
                        style={{transform: 'scale(0.5)', transformOrigin: 'top left', width: '200%', height: '128px'}}
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2" style={{color: '#0A2540'}}>PumpkinstoGeaux.com</h3>
                    <p className="text-gray-600 mb-3">Seasonal pumpkin patch and farm experience website with event booking and e-commerce integration.</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">E-commerce</span>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Event Booking</span>
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">Seasonal Marketing</span>
                    </div>
                    <div className="mt-3">
                      <a 
                        href="https://www.pumpkinstogeaux.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm font-medium transition-colors"
                        style={{color: '#D4AF37'}}
                        onMouseEnter={(e) => e.target.style.color = '#B8860B'}
                        onMouseLeave={(e) => e.target.style.color = '#D4AF37'}
                      >
                        Visit Live Site →
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 text-center">
                <p className="text-gray-600 mb-4">Ready to see what we can do for your business?</p>
                <button 
                  className="text-white px-8 py-3 rounded-lg transition-colors font-semibold"
                  style={{backgroundColor: '#D4AF37'}}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#B8860B'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#D4AF37'}
                  onClick={() => setShowPortfolio(false)}
                >
                  Get Started Today
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="text-4xl font-bold mb-2" style={{color: '#D4AF37'}}>500+</div>
              <div style={{color: '#6B7280'}}>Contractors Served</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold mb-2" style={{color: '#D4AF37'}}>2.5x</div>
              <div style={{color: '#6B7280'}}>Average Lead Increase</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold mb-2" style={{color: '#D4AF37'}}>98%</div>
              <div style={{color: '#6B7280'}}>Client Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20" style={{backgroundColor: '#F9FAFB'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{color: '#0A2540'}}>
              Complete Marketing Solutions for Contractors
            </h2>
            <p className="text-xl max-w-3xl mx-auto" style={{color: '#6B7280'}}>
              From professional websites to lead generation systems, we provide everything 
              your contracting business needs to dominate your local market.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <Globe className="h-12 w-12 mb-4" style={{color: '#FDE68A'}} />
              <h3 className="text-xl font-bold mb-3" style={{color: '#0A2540'}}>Professional Websites</h3>
              <p className="mb-4" style={{color: '#6B7280'}}>
                Mobile-responsive websites designed specifically for contractors. Fast loading, 
                SEO-optimized, and conversion-focused with professional design.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm" style={{color: '#6B7280'}}>
                  <CheckCircle className="h-4 w-4 mr-2" style={{color: '#D4AF37'}} />
                  Mobile-First Design
                </li>
                <li className="flex items-center text-sm" style={{color: '#6B7280'}}>
                  <CheckCircle className="h-4 w-4 mr-2" style={{color: '#D4AF37'}} />
                  Lead Capture Forms
                </li>
                <li className="flex items-center text-sm" style={{color: '#6B7280'}}>
                  <CheckCircle className="h-4 w-4 mr-2" style={{color: '#D4AF37'}} />
                  SEO Optimization
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <Phone className="h-12 w-12 mb-4" style={{color: '#FDE68A'}} />
              <h3 className="text-xl font-bold mb-3" style={{color: '#0A2540'}}>Missed Call Text Back</h3>
              <p className="mb-4" style={{color: '#6B7280'}}>
                Automatically send text messages to customers who call but don't reach you. 
                Never miss a potential lead again with instant follow-up.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm" style={{color: '#6B7280'}}>
                  <CheckCircle className="h-4 w-4 mr-2" style={{color: '#D4AF37'}} />
                  Instant Text Response
                </li>
                <li className="flex items-center text-sm" style={{color: '#6B7280'}}>
                  <CheckCircle className="h-4 w-4 mr-2" style={{color: '#D4AF37'}} />
                  Custom Message Templates
                </li>
                <li className="flex items-center text-sm" style={{color: '#6B7280'}}>
                  <CheckCircle className="h-4 w-4 mr-2" style={{color: '#D4AF37'}} />
                  Lead Capture Integration
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <Star className="h-12 w-12 mb-4" style={{color: '#FDE68A'}} />
              <h3 className="text-xl font-bold mb-3" style={{color: '#0A2540'}}>Automated Review Generator</h3>
              <p className="mb-4" style={{color: '#6B7280'}}>
                Automatically request and collect positive reviews from satisfied customers. 
                Build your online reputation with systematic review generation.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm" style={{color: '#6B7280'}}>
                  <CheckCircle className="h-4 w-4 mr-2" style={{color: '#D4AF37'}} />
                  Automated Review Requests
                </li>
                <li className="flex items-center text-sm" style={{color: '#6B7280'}}>
                  <CheckCircle className="h-4 w-4 mr-2" style={{color: '#D4AF37'}} />
                  Multi-Platform Integration
                </li>
                <li className="flex items-center text-sm" style={{color: '#6B7280'}}>
                  <CheckCircle className="h-4 w-4 mr-2" style={{color: '#D4AF37'}} />
                  Review Response Management
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <Zap className="h-12 w-12 mb-4" style={{color: '#FDE68A'}} />
              <h3 className="text-xl font-bold mb-3" style={{color: '#0A2540'}}>One Click Marketing Campaigns</h3>
              <p className="mb-4" style={{color: '#6B7280'}}>
                Launch complete marketing campaigns with a single click. Pre-built templates 
                for Google Ads, Facebook ads, and email marketing campaigns.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm" style={{color: '#6B7280'}}>
                  <CheckCircle className="h-4 w-4 mr-2" style={{color: '#D4AF37'}} />
                  Pre-Built Campaign Templates
                </li>
                <li className="flex items-center text-sm" style={{color: '#6B7280'}}>
                  <CheckCircle className="h-4 w-4 mr-2" style={{color: '#D4AF37'}} />
                  Multi-Platform Deployment
                </li>
                <li className="flex items-center text-sm" style={{color: '#6B7280'}}>
                  <CheckCircle className="h-4 w-4 mr-2" style={{color: '#D4AF37'}} />
                  Performance Tracking
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <Target className="h-12 w-12 mb-4" style={{color: '#FDE68A'}} />
              <h3 className="text-xl font-bold mb-3" style={{color: '#0A2540'}}>Local SEO</h3>
              <p className="mb-4" style={{color: '#6B7280'}}>
                Dominate local search results and get found by customers in your service area. 
                Google My Business optimization and local directory listings.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm" style={{color: '#6B7280'}}>
                  <CheckCircle className="h-4 w-4 mr-2" style={{color: '#D4AF37'}} />
                  Google My Business Optimization
                </li>
                <li className="flex items-center text-sm" style={{color: '#6B7280'}}>
                  <CheckCircle className="h-4 w-4 mr-2" style={{color: '#D4AF37'}} />
                  Local Directory Listings
                </li>
                <li className="flex items-center text-sm" style={{color: '#6B7280'}}>
                  <CheckCircle className="h-4 w-4 mr-2" style={{color: '#D4AF37'}} />
                  Local Keyword Optimization
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <Users className="h-12 w-12 mb-4" style={{color: '#FDE68A'}} />
              <h3 className="text-xl font-bold mb-3" style={{color: '#0A2540'}}>Done-For-You Solutions</h3>
              <p className="mb-4" style={{color: '#6B7280'}}>
                Complete marketing packages managed by our team. Focus on your work 
                while we handle your marketing and lead generation.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm" style={{color: '#6B7280'}}>
                  <CheckCircle className="h-4 w-4 mr-2" style={{color: '#D4AF37'}} />
                  Full Campaign Management
                </li>
                <li className="flex items-center text-sm" style={{color: '#6B7280'}}>
                  <CheckCircle className="h-4 w-4 mr-2" style={{color: '#D4AF37'}} />
                  Monthly Reporting
                </li>
                <li className="flex items-center text-sm" style={{color: '#6B7280'}}>
                  <CheckCircle className="h-4 w-4 mr-2" style={{color: '#D4AF37'}} />
                  Dedicated Account Manager
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{color: '#0A2540'}}>
                Why Contractors Choose GrowthLabPro
              </h2>
              <p className="text-lg mb-6" style={{color: '#6B7280'}}>
                We understand the unique challenges contractors face in growing their business. 
                That's why we've developed specialized marketing systems that work specifically 
                for the contracting industry.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 mr-3 mt-1" style={{color: '#D4AF37'}} />
                  <div>
                    <h4 className="font-semibold" style={{color: '#0A2540'}}>Industry Expertise</h4>
                    <p style={{color: '#6B7280'}}>Deep understanding of contractor marketing needs and customer behavior.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 mr-3 mt-1" style={{color: '#D4AF37'}} />
                  <div>
                    <h4 className="font-semibold" style={{color: '#0A2540'}}>Proven Results</h4>
                    <p style={{color: '#6B7280'}}>Track record of helping contractors double and triple their lead generation.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 mr-3 mt-1" style={{color: '#D4AF37'}} />
                  <div>
                    <h4 className="font-semibold" style={{color: '#0A2540'}}>Full-Service Solutions</h4>
                    <p style={{color: '#6B7280'}}>Everything you need in one place - from websites to lead generation systems.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-8 rounded-xl border" style={{backgroundColor: '#F9FAFB', borderColor: '#E5E7EB'}}>
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4" style={{color: '#0A2540'}}>Ready to Grow Your Business?</h3>
                <p className="mb-6" style={{color: '#6B7280'}}>
                  Join hundreds of contractors who have transformed their businesses with GrowthLabPro's 
                  marketing systems. Get started with a free consultation today.
                </p>
                <button 
                  className="text-white px-8 py-3 rounded-lg transition-colors font-semibold"
                  style={{backgroundColor: '#D4AF37'}}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#B8860B'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#D4AF37'}
                  onClick={() => window.open('https://api.leadconnectorhq.com/widget/bookings/growthlabpro', '_blank')}
                >
                  Schedule Free Consultation
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20" style={{backgroundColor: '#F9FAFB'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{color: '#0A2540'}}>
              What Our Clients Say
            </h2>
            <p className="text-xl" style={{color: '#6B7280'}}>
              Real results from real contractors who trusted GrowthLabPro with their marketing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" style={{color: '#D4AF37'}} />
                ))}
              </div>
              <p className="mb-6" style={{color: '#6B7280'}}>
                "GrowthLabPro completely transformed our online presence. We went from 2-3 leads per month 
                to over 15 qualified leads. The ROI has been incredible."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold" style={{backgroundColor: '#D4AF37'}}>
                  MJ
                </div>
                <div className="ml-4">
                  <div className="font-semibold" style={{color: '#0A2540'}}>Mike Johnson</div>
                  <div className="text-sm" style={{color: '#6B7280'}}>Johnson Roofing</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" style={{color: '#D4AF37'}} />
                ))}
              </div>
              <p className="mb-6" style={{color: '#6B7280'}}>
                "The team at GrowthLabPro knows contractors. Their marketing strategies actually work 
                and they understand our industry better than any agency we've worked with."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold" style={{backgroundColor: '#D4AF37'}}>
                  SR
                </div>
                <div className="ml-4">
                  <div className="font-semibold" style={{color: '#0A2540'}}>Sarah Rodriguez</div>
                  <div className="text-sm" style={{color: '#6B7280'}}>Elite Plumbing Services</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" style={{color: '#D4AF37'}} />
                ))}
              </div>
              <p className="mb-6" style={{color: '#6B7280'}}>
                "Our new website looks amazing and the lead generation system works around the clock. 
                Best investment we've made for our business growth."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold" style={{backgroundColor: '#D4AF37'}}>
                  DT
                </div>
                <div className="ml-4">
                  <div className="font-semibold" style={{color: '#0A2540'}}>David Thompson</div>
                  <div className="text-sm" style={{color: '#6B7280'}}>Thompson Construction</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20" style={{backgroundColor: '#0A2540'}}>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Contracting Business?
          </h2>
          <p className="text-xl mb-8" style={{color: '#CBD5E1'}}>
            Join successful contractors who chose GrowthLabPro for smarter campaigns and faster results. 
            Get your free marketing consultation today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              className="text-white px-8 py-4 rounded-lg transition-colors text-lg font-semibold"
              style={{backgroundColor: '#D4AF37'}}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#B8860B'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#D4AF37'}
              onClick={() => window.open('https://api.leadconnectorhq.com/widget/bookings/growthlabpro', '_blank')}
            >
              Get Free Consultation
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
             onClick={() => setCurrentPage('pricing')}
            >
              View Case Studies
            </button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{color: '#0A2540'}}>
              Get In Touch
            </h2>
            <p className="text-xl" style={{color: '#6B7280'}}>
              Ready to grow your contracting business? Let's discuss your marketing goals.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-6" style={{color: '#0A2540'}}>Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-center">
                  <Phone className="h-6 w-6 mr-4" style={{color: '#FDE68A'}} />
                  <div>
                    <div className="font-semibold" style={{color: '#0A2540'}}>Phone</div>
                    <div style={{color: '#6B7280'}}>225-454-5977</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Mail className="h-6 w-6 mr-4" style={{color: '#FDE68A'}} />
                  <div>
                    <div className="font-semibold" style={{color: '#0A2540'}}>Email</div>
                    <div style={{color: '#6B7280'}}>contact@growthlabpro.com</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-6 w-6 mr-4" style={{color: '#FDE68A'}} />
                  <div>
                    <div className="font-semibold" style={{color: '#0A2540'}}>Address</div>
                    <div style={{color: '#6B7280'}}>Baton Rouge, LA</div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1" style={{color: '#374151'}}>
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent"
                    style={{borderColor: '#D1D5DB', '--tw-ring-color': '#D4AF37'}}
                    placeholder="Your Name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1" style={{color: '#374151'}}>
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent"
                    style={{borderColor: '#D1D5DB', '--tw-ring-color': '#D4AF37'}}
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label htmlFor="company" className="block text-sm font-medium mb-1" style={{color: '#374151'}}>
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent"
                    style={{borderColor: '#D1D5DB', '--tw-ring-color': '#D4AF37'}}
                    placeholder="Your Company Name"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-1" style={{color: '#374151'}}>
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent"
                    style={{borderColor: '#D1D5DB', '--tw-ring-color': '#D4AF37'}}
                    placeholder="Tell us about your marketing goals..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full text-white py-3 px-6 rounded-lg transition-colors font-semibold"
                  style={{backgroundColor: '#D4AF37'}}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#B8860B'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#D4AF37'}
                >
                  Send Message
                </button>
              </form>
            </div>
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
                  onClick={() => setCurrentPage('terms')} 
                  className="text-xs transition-colors" 
                  style={{color: '#64748B'}}
                  onMouseEnter={(e) => e.target.style.color = '#94A3B8'}
                  onMouseLeave={(e) => e.target.style.color = '#64748B'}
                >
                  Terms of Service
                </button>
                <button 
                  onClick={() => setCurrentPage('privacy')} 
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
                <li><a href="#" className="transition-colors" onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = '#94A3B8'}>Website Design</a></li>
                <li><a href="#" className="transition-colors" onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = '#94A3B8'}>Lead Generation</a></li>
                <li><a href="#" className="transition-colors" onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = '#94A3B8'}>Marketing Automation</a></li>
                <li><a href="#" className="transition-colors" onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = '#94A3B8'}>Social Media Marketing</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2" style={{color: '#94A3B8'}}>
                <li><a href="#about" className="transition-colors" onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = '#94A3B8'}>About</a></li>
                <li><a href="#testimonials" className="transition-colors" onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = '#94A3B8'}>Reviews</a></li>
                <li><a href="#contact" className="transition-colors" onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = '#94A3B8'}>Contact</a></li>
                <li><a href="#" className="transition-colors" onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = '#94A3B8'}>Case Studies</a></li>
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
            <p className="text-sm" style={{ color: '#9CA3AF' }}>Add a plan and any add-ons to get started</p>
            <button
              onClick={() => { setShowCart(false); setCurrentPage('pricing'); }}
              className="mt-4 text-white px-6 py-2 rounded-lg transition-colors font-medium"
              style={{ backgroundColor: '#D4AF37' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#B8860B')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#D4AF37')}
            >
              View Pricing
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
                className="w-full py-3 px-6 rounded-lg font-semibold transition-colors text-white"
                style={{ backgroundColor: '#D4AF37' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#B8860B')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#D4AF37')}
              >
                Proceed to Checkout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;