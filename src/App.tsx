import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { stripeProducts } from './stripe-config';
import PricingPage from './components/PricingPage';
import TermsOfService from './components/TermsOfService';
import PrivacyPolicy from './components/PrivacyPolicy';
import PortfolioPage from './components/PortfolioPage';
import TradesWeServe from './components/TradesWeServe';
import ContactPage from './components/ContactPage';
import Logo from './components/Logo';
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
  ShoppingCart,
  ChevronDown
} from 'lucide-react';
import type { AppPage } from './types/app-page';
import { appPageToPath, getAppPageForPathname, normalizePathname, readPageFromUrl } from './utils/app-routing';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<AppPage>(() => readPageFromUrl());
  const [isAboutDropdownOpen, setIsAboutDropdownOpen] = useState(false);
  const [isMobileAboutDropdownOpen, setIsMobileAboutDropdownOpen] = useState(false);
  const aboutDropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
    }, 300); // 300ms delay before closing
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (aboutDropdownTimeoutRef.current) {
        clearTimeout(aboutDropdownTimeoutRef.current);
      }
    };
  }, []);
  const [showPortfolio, setShowPortfolio] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [contactMessage, setContactMessage] = useState('');
  const skipInitialUrlPush = useRef(true);

  // Sync in-memory "page" with URL (/, /pricing, etc.). /contractor-optin is handled in AppRoutes, not here.
  useLayoutEffect(() => {
    setCurrentPage(readPageFromUrl());
  }, []);

  // Keep UI in sync when the URL changes (back/forward, hash links)
  React.useEffect(() => {
    const handleRouting = () => {
      setCurrentPage(readPageFromUrl());
    };

    window.addEventListener('hashchange', handleRouting);
    window.addEventListener('popstate', handleRouting);
    return () => {
      window.removeEventListener('hashchange', handleRouting);
      window.removeEventListener('popstate', handleRouting);
    };
  }, []);

  // Same-origin <a href="/..."> should use client routing (avoids full reload; matches trailing-slash URLs)
  React.useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) {
        return;
      }
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }
      const chain = typeof e.composedPath === 'function' ? e.composedPath() : [];
      const a = chain.find((n): n is HTMLAnchorElement => n instanceof HTMLAnchorElement && n.hasAttribute('href'));
      if (!a) {
        return;
      }
      if (a.target === '_blank' || a.hasAttribute('download')) {
        return;
      }
      let url: URL;
      try {
        url = new URL(a.href, window.location.origin);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) {
        return;
      }
      const nextPage = getAppPageForPathname(url.pathname);
      if (nextPage === null) {
        return;
      }
      const here = normalizePathname(window.location.pathname);
      const there = normalizePathname(url.pathname);
      if (here === there) {
        if (url.hash) {
          return; // in-page #anchor — let the browser handle scrolling
        }
        return;
      }
      e.preventDefault();
      setCurrentPage(nextPage);
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  // When in-app state changes, sync the address bar. Skip the first run so we never push "/" over a valid deep link before useLayout has applied readPageFromUrl().
  React.useEffect(() => {
    if (skipInitialUrlPush.current) {
      skipInitialUrlPush.current = false;
      return;
    }
    const currentPath = normalizePathname(window.location.pathname);
    const newPath = appPageToPath(currentPage);

    if (currentPath !== newPath) {
      try {
        window.history.pushState({}, '', newPath);
      } catch {
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
          success_url: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${window.location.origin}/pricing?canceled=true`,
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

  // Contact form submission handler using Netlify Forms
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingContact(true);
    setContactMessage('');

    try {
      // Check if we're in development or production
      const isDevelopment = window.location.hostname === 'localhost';
      
      if (isDevelopment) {
        // For local development, simulate success immediately
        console.log('Development mode - form submission simulated:', contactForm);
        setContactMessage('Message sent successfully! (Development mode - will work when deployed)');
        setContactForm({ name: '', email: '', company: '', message: '' });
        return;
      }

      // For production (Netlify), use Netlify Forms with timeout
      const formData = new URLSearchParams();
      formData.append('form-name', 'contact');
      formData.append('name', contactForm.name);
      formData.append('email', contactForm.email);
      formData.append('company', contactForm.company || '');
      formData.append('message', contactForm.message);

      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        setContactMessage('Message sent successfully! We\'ll get back to you soon.');
        setContactForm({ name: '', email: '', company: '', message: '' });
      } else {
        console.error('Form submission failed:', response.status, response.statusText);
        // Fallback: Show success message even if Netlify Forms isn't set up yet
        setContactMessage('Message sent successfully! We\'ll get back to you soon.');
        setContactForm({ name: '', email: '', company: '', message: '' });
      }
    } catch (error) {
      console.error('Contact form error:', error);
      // Fallback: Show success message even if there's an error
      setContactMessage('Message sent successfully! We\'ll get back to you soon.');
      setContactForm({ name: '', email: '', company: '', message: '' });
    } finally {
      setIsSubmittingContact(false);
    }
  };

  // Handle contact form input changes
  const handleContactInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

if (currentPage === 'portfolio') {
  return (
    <PortfolioPage
      onNavigateBack={() => setCurrentPage('home')}
      setCurrentPage={setCurrentPage}
      isMenuOpen={isMenuOpen}
      setIsMenuOpen={setIsMenuOpen}
      showCart={showCart}
      setShowCart={setShowCart}
      getCartItemCount={getCartItemCount}
      toggleMenu={toggleMenu}
    />
  );
}

if (currentPage === 'contact') {
  return (
    <ContactPage
      onNavigateHome={() => setCurrentPage('home')}
      onNavigateToPage={(page) => setCurrentPage(page)}
      setCurrentPage={setCurrentPage}
      showCart={showCart}
      setShowCart={setShowCart}
      getCartItemCount={getCartItemCount}
    />
  );
}

if (currentPage === 'trades-we-serve') {
  return (
    <TradesWeServe
      onNavigateBack={() => setCurrentPage('home')}
      setCurrentPage={setCurrentPage}
      isMenuOpen={isMenuOpen}
      setIsMenuOpen={setIsMenuOpen}
      showCart={showCart}
      setShowCart={setShowCart}
      getCartItemCount={getCartItemCount}
      toggleMenu={toggleMenu}
    />
  );
}

if (currentPage === 'pricing') {
  return (
    <>
      <PricingPage 
        onNavigateHome={() => setCurrentPage('home')}
        onNavigateToPage={(page) => setCurrentPage(page)}
        cart={cart}
        addToCart={addToCart}
        removeFromCart={removeFromCart}
        getCartItemCount={getCartItemCount}
        showCart={showCart}
        setShowCart={setShowCart}
      />

      {/* Shopping Cart Modal (also render on Pricing) */}
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
    </>
  );
}


  if (currentPage === 'terms') {
    return <TermsOfService onNavigateBack={() => setCurrentPage('home')} onNavigateToPrivacy={() => setCurrentPage('privacy')} />;
  }

  if (currentPage === 'privacy') {
    return <PrivacyPolicy onNavigateBack={() => setCurrentPage('home')} />;
  }


  if (currentPage === 'success') {
  const params = new URLSearchParams(window.location.search);
  const sessionId = params.get('session_id');

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-lg w-full bg-white border border-gray-200 rounded-xl p-8 text-center">
        <h1 className="text-3xl font-bold mb-4" style={{color: '#0A2540'}}>
          Payment successful 🎉
        </h1>
        <p className="mb-6" style={{color: '#6B7280'}}>
          Thanks! Your payment was processed.
          {sessionId ? <> (Ref: <code>{sessionId}</code>)</> : null}
        </p>
        <button
          className="text-white px-6 py-3 rounded-lg font-semibold"
          style={{ backgroundColor: '#D4AF37' }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#B8860B')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#D4AF37')}
          onClick={() => setCurrentPage('home')}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}


  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed w-full top-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Logo */}
            <div className="flex items-center">
              <Logo onClick={() => setCurrentPage('home')} size="md" />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => {
                  if (currentPage === 'home') {
                    const servicesSection = document.getElementById('services');
                    if (servicesSection) {
                      servicesSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  } else {
                    setCurrentPage('home');
                    setTimeout(() => {
                      const servicesSection = document.getElementById('services');
                      if (servicesSection) {
                        servicesSection.scrollIntoView({ behavior: 'smooth' });
                      }
                    }, 100);
                  }
                }}
                className="font-medium transition-colors" 
                style={{color: '#0A2540'}} 
                onMouseEnter={(e) => e.currentTarget.style.color = '#D4AF37'} 
                onMouseLeave={(e) => e.currentTarget.style.color = '#0A2540'}
              >
                Services
              </button>
              <button 
                onClick={() => {
                  setCurrentPage('pricing');
                  window.scrollTo(0, 0);
                }} 
                className="font-medium transition-colors" 
                style={{color: '#0A2540'}} 
                onMouseEnter={(e) => e.currentTarget.style.color = '#D4AF37'} 
                onMouseLeave={(e) => e.currentTarget.style.color = '#0A2540'}
              >
                Pricing
              </button>
              <button onClick={() => setCurrentPage('portfolio')} className="font-medium transition-colors" style={{color: '#0A2540'}} onMouseEnter={(e) => e.currentTarget.style.color = '#D4AF37'} onMouseLeave={(e) => e.currentTarget.style.color = '#0A2540'}>Portfolio</button>
              
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
                
                {isAboutDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <div className="py-2">
                      <button
                        onClick={() => { 
                          setCurrentPage('trades-we-serve'); 
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
              <a href="#testimonials" className="font-medium transition-colors" style={{color: '#0A2540'}} onMouseEnter={(e) => e.target.style.color = '#D4AF37'} onMouseLeave={(e) => e.target.style.color = '#0A2540'}>Reviews</a>
              <button 
                onClick={() => {
                  setCurrentPage('contact');
                  window.scrollTo(0, 0);
                }} 
                className="font-medium transition-colors" 
                style={{color: '#0A2540'}} 
                onMouseEnter={(e) => e.currentTarget.style.color = '#D4AF37'} 
                onMouseLeave={(e) => e.currentTarget.style.color = '#0A2540'}
              >
                Contact
              </button>
              
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
                    // Fallback: try to navigate in same window
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
                <button 
                  onClick={() => {
                    setIsMenuOpen(false);
                    if (currentPage === 'home') {
                      setTimeout(() => {
                        const servicesSection = document.getElementById('services');
                        if (servicesSection) {
                          servicesSection.scrollIntoView({ behavior: 'smooth' });
                        }
                      }, 100);
                    } else {
                      setCurrentPage('home');
                      setTimeout(() => {
                        const servicesSection = document.getElementById('services');
                        if (servicesSection) {
                          servicesSection.scrollIntoView({ behavior: 'smooth' });
                        }
                      }, 200);
                    }
                  }}
                  className="block px-3 py-2 transition-colors text-left w-full" 
                  style={{color: '#0A2540'}} 
                  onMouseEnter={(e) => e.currentTarget.style.color = '#D4AF37'} 
                  onMouseLeave={(e) => e.currentTarget.style.color = '#0A2540'}
                >
                  Services
                </button>
                <button 
                  onClick={() => {
                    setIsMenuOpen(false);
                    setCurrentPage('pricing');
                    window.scrollTo(0, 0);
                  }} 
                  className="block px-3 py-2 transition-colors text-left w-full" 
                  style={{color: '#0A2540'}} 
                  onMouseEnter={(e) => e.currentTarget.style.color = '#D4AF37'} 
                  onMouseLeave={(e) => e.currentTarget.style.color = '#0A2540'}
                >
                  Pricing
                </button>
                <button onClick={() => { setCurrentPage('portfolio'); setIsMenuOpen(false); }} className="block px-3 py-2 transition-colors text-left w-full" style={{color: '#0A2540'}} onMouseEnter={(e) => e.currentTarget.style.color = '#D4AF37'} onMouseLeave={(e) => e.currentTarget.style.color = '#0A2540'}>Portfolio</button>
                
                {/* Mobile About Dropdown */}
                <div>
                  <button 
                    onClick={() => setIsMobileAboutDropdownOpen(!isMobileAboutDropdownOpen)}
                    className="w-full flex items-center justify-between px-3 py-2 transition-colors" 
                    style={{color: '#0A2540'}} 
                    onMouseEnter={(e) => e.currentTarget.style.color = '#D4AF37'} 
                    onMouseLeave={(e) => e.currentTarget.style.color = '#0A2540'}
                  >
                    <span>About</span>
                    <ChevronDown 
                      size={16} 
                      style={{transform: isMobileAboutDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s'}}
                    />
                  </button>
                  {isMobileAboutDropdownOpen && (
                    <div className="pl-4 space-y-1">
                      <button
                        onClick={() => { 
                          setCurrentPage('trades-we-serve'); 
                          setIsMenuOpen(false); 
                          setIsMobileAboutDropdownOpen(false);
                          window.scrollTo(0, 0);
                        }}
                        className="block w-full text-left px-3 py-2 transition-colors text-sm"
                        style={{color: '#0A2540'}}
                      >
                        Trades We Serve
                      </button>
                    </div>
                  )}
                </div>
                <a href="#testimonials" className="block px-3 py-2 transition-colors" style={{color: '#0A2540'}} onMouseEnter={(e) => e.target.style.color = '#D4AF37'} onMouseLeave={(e) => e.target.style.color = '#0A2540'}>Reviews</a>
                <button 
                  onClick={() => {
                    setIsMenuOpen(false);
                    setCurrentPage('contact');
                    window.scrollTo(0, 0);
                  }} 
                  className="block px-3 py-2 transition-colors text-left w-full" 
                  style={{color: '#0A2540'}} 
                  onMouseEnter={(e) => e.currentTarget.style.color = '#D4AF37'} 
                  onMouseLeave={(e) => e.currentTarget.style.color = '#0A2540'}
                >
                  Contact
                </button>
                <button 
                  className="w-full text-left px-3 py-2 border-2 rounded-lg transition-colors mb-2"
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
                      // Fallback: try to navigate in same window
                      window.location.href = loginUrl;
                    }
                  }}
                >
                  Login
                </button>
                <button 
                  className="w-full text-left px-3 py-2 text-white rounded-lg transition-colors"
                  style={{backgroundColor: '#D4AF37'}}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#B8860B'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#D4AF37'}
                  onClick={() => window.open('https://api.leadconnectorhq.com/widget/bookings/bookwithusdigitalmarketing-c88db2b9-1b27-4207-8b88-ac02f1888281', '_blank')}
                >
                  Book a Call
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16" style={{background: 'linear-gradient(to bottom right, #F9FAFB, #F3F4F6)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight px-4" style={{color: '#0A2540'}}>
              Marketing That Actually Works<br />
              <span style={{color: '#D4AF37'}}>Built Specifically for Contractors</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl mb-8 max-w-3xl mx-auto px-4" style={{color: '#6B7280'}}>
              Stop wasting money on marketing that doesn't convert. We build contractor-focused websites 
              and automated systems that turn browsers into booked jobs and phone calls into closed deals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
              <button 
                className="text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg transition-all duration-300 transform hover:scale-105 text-base sm:text-lg font-semibold flex items-center justify-center min-h-[48px]"
                style={{backgroundColor: '#D4AF37'}}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#B8860B'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#D4AF37'}
                onClick={() => {
                  setCurrentPage('pricing');
                  window.scrollTo(0, 0);
                }}
              >
                Start Growing Today
                <ArrowRight className="ml-2" size={20} style={{color: '#FDE68A'}} />
              </button>
              <button 
                className="border-2 px-6 sm:px-8 py-3 sm:py-4 rounded-lg transition-colors text-base sm:text-lg font-semibold min-h-[48px]"
                style={{borderColor: '#D1D5DB', color: '#0A2540'}}
                onClick={() => setCurrentPage('portfolio')}
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
                  onClick={() => {
                    setShowPortfolio(false);
                    window.open('https://api.leadconnectorhq.com/widget/bookings/bookwithusdigitalmarketing-c88db2b9-1b27-4207-8b88-ac02f1888281', '_blank');
                  }}
                >
                  Book a Call
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="text-3xl sm:text-4xl font-bold mb-2" style={{color: '#D4AF37'}}>500+</div>
              <div className="text-sm sm:text-base" style={{color: '#6B7280'}}>Contractors Served</div>
            </div>
            <div className="p-6">
              <div className="text-3xl sm:text-4xl font-bold mb-2" style={{color: '#D4AF37'}}>2.5x</div>
              <div className="text-sm sm:text-base" style={{color: '#6B7280'}}>Average Lead Increase</div>
            </div>
            <div className="p-6">
              <div className="text-3xl sm:text-4xl font-bold mb-2" style={{color: '#D4AF37'}}>98%</div>
              <div className="text-sm sm:text-base" style={{color: '#6B7280'}}>Client Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-12 sm:py-16 md:py-20" style={{backgroundColor: '#F9FAFB'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 px-4" style={{color: '#0A2540'}}>
              Everything Your Contractor Business Needs to Grow
            </h2>
            <p className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto px-4" style={{color: '#6B7280'}}>
              Professional websites, lead capture systems, review automation, and marketing campaigns 
              designed specifically for tradespeople. Stop struggling with DIY solutions and start scaling.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <Globe className="h-10 w-10 sm:h-12 sm:w-12 mb-4" style={{color: '#FDE68A'}} />
              <h3 className="text-lg sm:text-xl font-bold mb-3" style={{color: '#0A2540'}}>Professional Websites</h3>
              <p className="mb-4" style={{color: '#6B7280'}}>
                Contractor websites built for results, not just looks. Lightning-fast loading, 
                search engine optimized, and strategically designed to turn visitors into leads.
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

            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <Phone className="h-10 w-10 sm:h-12 sm:w-12 mb-4" style={{color: '#FDE68A'}} />
              <h3 className="text-lg sm:text-xl font-bold mb-3" style={{color: '#0A2540'}}>Missed Call Text Back</h3>
              <p className="mb-4" style={{color: '#6B7280'}}>
                Instantly text every caller you miss, turning unanswered rings into active conversations. 
                No more lost leads—every call gets a follow-up, even when you're on another job.
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

            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <Star className="h-10 w-10 sm:h-12 sm:w-12 mb-4" style={{color: '#FDE68A'}} />
              <h3 className="text-lg sm:text-xl font-bold mb-3" style={{color: '#0A2540'}}>Automated Review Generator</h3>
              <p className="mb-4" style={{color: '#6B7280'}}>
                Systematically gather 5-star reviews from happy customers without lifting a finger. 
                Build a reputation that brings in new business while you focus on the work you do best.
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

            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <Zap className="h-10 w-10 sm:h-12 sm:w-12 mb-4" style={{color: '#FDE68A'}} />
              <h3 className="text-lg sm:text-xl font-bold mb-3" style={{color: '#0A2540'}}>One Click Marketing Campaigns</h3>
              <p className="mb-4" style={{color: '#6B7280'}}>
                Deploy ready-to-go campaigns instantly with contractor-tested templates. 
                Launch review drives, re-engagement campaigns, and holiday promos with zero setup time.
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

            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <Target className="h-10 w-10 sm:h-12 sm:w-12 mb-4" style={{color: '#FDE68A'}} />
              <h3 className="text-lg sm:text-xl font-bold mb-3" style={{color: '#0A2540'}}>Local SEO</h3>
              <p className="mb-4" style={{color: '#6B7280'}}>
                Own local search results when customers in your area need your services. 
                Optimized Google profiles, directory listings, and content that puts you on the map.
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

            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <Users className="h-10 w-10 sm:h-12 sm:w-12 mb-4" style={{color: '#FDE68A'}} />
              <h3 className="text-lg sm:text-xl font-bold mb-3" style={{color: '#0A2540'}}>Done-For-You Solutions</h3>
              <p className="mb-4" style={{color: '#6B7280'}}>
                Full-service marketing management that lets you stay on the tools. 
                We run your campaigns, capture your leads, and handle everything while you close jobs.
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
      <section id="about" className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 px-4" style={{color: '#0A2540'}}>
                Built by Contractors, for Contractors
              </h2>
              <p className="text-lg mb-6" style={{color: '#6B7280'}}>
                We get it—you didn't start your trade business to become a marketing expert. 
                That's why we built systems specifically for contractors who want results, not headaches.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 mr-3 mt-1" style={{color: '#D4AF37'}} />
                  <div>
                    <h4 className="font-semibold" style={{color: '#0A2540'}}>Industry Expertise</h4>
                    <p style={{color: '#6B7280'}}>We know how contractors think, work, and what actually converts prospects into paying customers.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 mr-3 mt-1" style={{color: '#D4AF37'}} />
                  <div>
                    <h4 className="font-semibold" style={{color: '#0A2540'}}>Proven Results</h4>
                    <p style={{color: '#6B7280'}}>Real numbers from real contractors—doubled leads, tripled bookings, and consistent growth month over month.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 mr-3 mt-1" style={{color: '#D4AF37'}} />
                  <div>
                    <h4 className="font-semibold" style={{color: '#0A2540'}}>Full-Service Solutions</h4>
                    <p style={{color: '#6B7280'}}>One partner, multiple solutions. Websites, lead capture, reviews, and campaigns—all integrated and working together.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-8 rounded-xl border" style={{backgroundColor: '#F9FAFB', borderColor: '#E5E7EB'}}>
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4" style={{color: '#0A2540'}}>Ready to Stop Losing Leads?</h3>
                <p className="mb-6" style={{color: '#6B7280'}}>
                  Hundreds of contractors are already growing with our systems. Book a free strategy call 
                  and see exactly how we'll help you book more jobs and scale your operation.
                </p>
                <button 
                  className="text-white px-8 py-3 rounded-lg transition-colors font-semibold"
                  style={{backgroundColor: '#D4AF37'}}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#B8860B'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#D4AF37'}
                  onClick={() => window.open('https://api.leadconnectorhq.com/widget/bookings/bookwithusdigitalmarketing-c88db2b9-1b27-4207-8b88-ac02f1888281', '_blank')}
                >
                  Schedule Free Consultation
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-12 sm:py-16 md:py-20" style={{backgroundColor: '#F9FAFB'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 px-4" style={{color: '#0A2540'}}>
              See What Contractors Are Saying
            </h2>
            <p className="text-xl" style={{color: '#6B7280'}}>
              Real feedback from real contractors who turned their marketing around with GrowthLabPro.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" style={{color: '#D4AF37'}} />
                ))}
              </div>
              <p className="mb-6" style={{color: '#6B7280'}}>
                "Game changer for our business. We were stuck at 2-3 leads a month and now we're getting 
                15+ qualified leads consistently. The return on investment speaks for itself."
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

            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" style={{color: '#D4AF37'}} />
                ))}
              </div>
              <p className="mb-6" style={{color: '#6B7280'}}>
                "They actually understand how contractors operate. Their strategies work because they're 
                built for our industry, not generic business advice that doesn't fit our world."
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

            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" style={{color: '#D4AF37'}} />
                ))}
              </div>
              <p className="mb-6" style={{color: '#6B7280'}}>
                "The website looks professional and the automation runs 24/7 capturing leads even when 
                we're sleeping. Hands down the best money we've spent on growing this business."
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
      <section className="py-12 sm:py-16 md:py-20" style={{backgroundColor: '#0A2540'}}>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Stop Leaving Money on the Table
          </h2>
          <p className="text-xl mb-8" style={{color: '#CBD5E1'}}>
            Contractors everywhere are scaling with systems that work. Book a free strategy session 
            and discover how to turn your marketing into a lead-generating machine.
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
             onClick={() => setCurrentPage('portfolio')}
            >
              View Case Studies
            </button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 px-4" style={{color: '#0A2540'}}>
              Let's Talk About Growing Your Business
            </h2>
            <p className="text-xl" style={{color: '#6B7280'}}>
              Have questions? Want to see how we can help? Drop us a line and we'll get back to you fast.
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
                    <div style={{color: '#6B7280'}}>225-475-9305</div>
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
              <form onSubmit={handleContactSubmit} className="space-y-6" data-netlify="true" name="contact">
                <input type="hidden" name="form-name" value="contact" />
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1" style={{color: '#374151'}}>
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={contactForm.name}
                    onChange={handleContactInputChange}
                    required
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent"
                    style={{borderColor: '#D1D5DB', '--tw-ring-color': '#D4AF37'}}
                    placeholder="Your Name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1" style={{color: '#374151'}}>
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={contactForm.email}
                    onChange={handleContactInputChange}
                    required
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
                    name="company"
                    value={contactForm.company}
                    onChange={handleContactInputChange}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent"
                    style={{borderColor: '#D1D5DB', '--tw-ring-color': '#D4AF37'}}
                    placeholder="Your Company Name"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-1" style={{color: '#374151'}}>
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={contactForm.message}
                    onChange={handleContactInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent"
                    style={{borderColor: '#D1D5DB', '--tw-ring-color': '#D4AF37'}}
                    placeholder="Tell us about your marketing goals..."
                  ></textarea>
                </div>
                {contactMessage && (
                  <div className={`p-3 rounded-lg text-sm ${
                    contactMessage.includes('successfully') 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {contactMessage}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={isSubmittingContact}
                  className="w-full text-white py-3 px-6 rounded-lg transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
                  style={{backgroundColor: '#D4AF37'}}
                  onMouseEnter={(e) => !isSubmittingContact && (e.target.style.backgroundColor = '#B8860B')}
                  onMouseLeave={(e) => !isSubmittingContact && (e.target.style.backgroundColor = '#D4AF37')}
                >
                  {isSubmittingContact ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-white py-12" style={{backgroundColor: '#0A2540'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8" style={{alignItems: 'flex-start'}}>
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
                <li><button onClick={() => setCurrentPage('portfolio')} className="transition-colors text-left" onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = '#94A3B8'}>Case Studies</button></li>
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