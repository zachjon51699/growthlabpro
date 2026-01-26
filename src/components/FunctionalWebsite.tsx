import { useRef, useEffect } from 'react';
import { Menu, X, Star, ArrowRight, ShoppingCart, ChevronDown, Search, Smartphone, MessageSquare } from 'lucide-react';
import Logo from './Logo';

interface FunctionalWebsiteProps {
  onNavigateBack: () => void;
  setCurrentPage: (page: string) => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  isServicesDropdownOpen: boolean;
  setIsServicesDropdownOpen: (open: boolean) => void;
  isMobileServicesDropdownOpen: boolean;
  setIsMobileServicesDropdownOpen: (open: boolean) => void;
  showCart: boolean;
  setShowCart: (show: boolean) => void;
  getCartItemCount: () => number;
  toggleMenu: () => void;
}

const FunctionalWebsite = ({ 
  onNavigateBack, 
  setCurrentPage,
  isMenuOpen,
  setIsMenuOpen,
  isServicesDropdownOpen,
  setIsServicesDropdownOpen,
  isMobileServicesDropdownOpen,
  setIsMobileServicesDropdownOpen,
  showCart,
  setShowCart,
  getCartItemCount,
  toggleMenu
}: FunctionalWebsiteProps) => {
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle dropdown delay on mouse leave
  const handleMouseEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setIsServicesDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsServicesDropdownOpen(false);
    }, 300); // 300ms delay before closing
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
    };
  }, []);

  // Fetch Google Reviews (requires backend API endpoint)
  // Note: Google Reviews API requires server-side implementation due to CORS and API key security
  // You'll need to create a backend endpoint that uses Google Places API or a service like Reviews.io
  useEffect(() => {
    // Example: Fetch Google Reviews from your backend API
    // const fetchGoogleReviews = async () => {
    //   try {
    //     const response = await fetch('/api/google-reviews');
    //     const reviews = await response.json();
    //     // Merge with existing testimonials or replace
    //   } catch (error) {
    //     console.error('Error fetching Google reviews:', error);
    //   }
    // };
    // fetchGoogleReviews();
  }, []);

  // Testimonials data - grid layout format
  const testimonials = [
    {
      name: 'Mike Johnson',
      company: 'Johnson Roofing',
      initials: 'MJ',
      text: '"Game changer for our business. We were stuck at 2-3 leads a month and now we\'re getting 15+ qualified leads consistently. The return on investment speaks for itself."'
    },
    {
      name: 'Sarah Rodriguez',
      company: 'Elite Plumbing Services',
      initials: 'SR',
      text: '"They actually understand how contractors operate. Their strategies work because they\'re built for our industry, not generic business advice that doesn\'t fit our world."'
    },
    {
      name: 'David Thompson',
      company: 'Thompson Construction',
      initials: 'DT',
      text: '"The website looks professional and the automation runs 24/7 capturing leads even when we\'re sleeping. Hands down the best money we\'ve spent on growing this business."'
    },
    {
      name: 'Adam',
      company: 'Contractor',
      initials: 'AD',
      text: '"Highly recommended, they are here to help us contractors that don\'t like to deal with the website stuff. It feels like you have partner looking out for you that\'s actually helping you succeed."'
    },
    {
      name: 'Dale',
      company: 'Contractor',
      initials: 'DA',
      text: '"I\'ve been working with GrowthLabPro for the last few months and it\'s been absolutely amazing. If you\'re out there and you need someone that\'s gonna be there for you... we love working with them"'
    },
    {
      name: 'George',
      company: 'Contractor',
      initials: 'GE',
      text: '"Shoutout to Kai and Remy for an amazing job that they did doing my website. I\'ve been a pain in the butt every now and then but they did it right. Check them out, you won\'t be dissapointed."'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Same as main site */}
      <header className="fixed w-full top-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Logo onClick={onNavigateBack} size="md" />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {/* Services Dropdown */}
              <div 
                className="relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <button 
                  className="font-medium transition-colors flex items-center" 
                  style={{color: '#0A2540'}} 
                  onMouseEnter={(e) => e.currentTarget.style.color = '#D4AF37'} 
                  onMouseLeave={(e) => e.currentTarget.style.color = '#0A2540'}
                >
                  <span>Services</span>
                  <ChevronDown 
                    size={16} 
                    className="ml-1" 
                    style={{transform: isServicesDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s'}}
                  />
                </button>
                
                {isServicesDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <div className="py-2">
                      <button
                        onClick={() => { setCurrentPage('functional-website'); setIsServicesDropdownOpen(false); }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors"
                        style={{color: '#0A2540'}}
                      >
                        Professional Website
                      </button>
                      <button
                        onClick={() => { setCurrentPage('all-in-one-inbox'); setIsServicesDropdownOpen(false); }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors"
                        style={{color: '#0A2540'}}
                      >
                        All In One Inbox
                      </button>
                      <button
                        onClick={() => { setCurrentPage('5-star-magic-review-funnel'); setIsServicesDropdownOpen(false); }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors"
                        style={{color: '#0A2540'}}
                      >
                        Review Funnel
                      </button>
                      <button
                        onClick={() => { setCurrentPage('missed-call-text-back'); setIsServicesDropdownOpen(false); }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors"
                        style={{color: '#0A2540'}}
                      >
                        Missed Call Follow-Up
                      </button>
                      <button
                        onClick={() => { setCurrentPage('business-phone'); setIsServicesDropdownOpen(false); }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors"
                        style={{color: '#0A2540'}}
                      >
                        Business Phone
                      </button>
                      <button
                        onClick={() => { setCurrentPage('one-click-marketing-campaigns'); setIsServicesDropdownOpen(false); }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors"
                        style={{color: '#0A2540'}}
                      >
                        Marketing Campaigns
                      </button>
                      <button
                        onClick={() => { setCurrentPage('automated-lead-follow-up'); setIsServicesDropdownOpen(false); }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors"
                        style={{color: '#0A2540'}}
                      >
                        Lead Follow-Up
                      </button>
                      <button
                        onClick={() => { setCurrentPage('local-seo'); setIsServicesDropdownOpen(false); }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors"
                        style={{color: '#0A2540'}}
                      >
                        Local SEO
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <button onClick={() => setCurrentPage('pricing')} className="font-medium transition-colors" style={{color: '#0A2540'}} onMouseEnter={(e) => e.currentTarget.style.color = '#D4AF37'} onMouseLeave={(e) => e.currentTarget.style.color = '#0A2540'}>Pricing</button>
              <a href="#about" className="font-medium transition-colors" style={{color: '#0A2540'}} onMouseEnter={(e) => e.currentTarget.style.color = '#D4AF37'} onMouseLeave={(e) => e.currentTarget.style.color = '#0A2540'}>About</a>
              <a href="#testimonials" className="font-medium transition-colors" style={{color: '#0A2540'}} onMouseEnter={(e) => e.currentTarget.style.color = '#D4AF37'} onMouseLeave={(e) => e.currentTarget.style.color = '#0A2540'}>Reviews</a>
              <a href="#contact" className="font-medium transition-colors" style={{color: '#0A2540'}} onMouseEnter={(e) => e.currentTarget.style.color = '#D4AF37'} onMouseLeave={(e) => e.currentTarget.style.color = '#0A2540'}>Contact</a>
              
              {/* Cart Button */}
              <div className="relative">
                <button 
                 onClick={() => setShowCart(true)}
                  className="p-2 rounded-lg transition-colors"
                  style={{color: '#0A2540'}}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#D4AF37'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#0A2540'}
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
                  e.currentTarget.style.backgroundColor = '#D4AF37';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#D4AF37';
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
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#B8860B'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#D4AF37'}
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
                onMouseEnter={(e) => e.currentTarget.style.color = '#D4AF37'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#0A2540'}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
                {/* Mobile Services Dropdown */}
                <div>
                  <button 
                    onClick={() => setIsMobileServicesDropdownOpen(!isMobileServicesDropdownOpen)}
                    className="w-full flex items-center justify-between px-3 py-2 transition-colors" 
                    style={{color: '#0A2540'}} 
                    onMouseEnter={(e) => e.currentTarget.style.color = '#D4AF37'} 
                    onMouseLeave={(e) => e.currentTarget.style.color = '#0A2540'}
                  >
                    <span>Services</span>
                    <ChevronDown 
                      size={16} 
                      style={{transform: isMobileServicesDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s'}}
                    />
                  </button>
                  {isMobileServicesDropdownOpen && (
                    <div className="pl-4 space-y-1">
                      <button
                        onClick={() => { setCurrentPage('functional-website'); setIsMenuOpen(false); setIsMobileServicesDropdownOpen(false); }}
                        className="block w-full text-left px-3 py-2 transition-colors text-sm"
                        style={{color: '#0A2540'}}
                      >
                        Professional Website
                      </button>
                      <button
                        onClick={() => { setCurrentPage('all-in-one-inbox'); setIsMenuOpen(false); setIsMobileServicesDropdownOpen(false); }}
                        className="block w-full text-left px-3 py-2 transition-colors text-sm"
                        style={{color: '#0A2540'}}
                      >
                        All In One Inbox
                      </button>
                      <button
                        onClick={() => { setCurrentPage('5-star-magic-review-funnel'); setIsMenuOpen(false); setIsMobileServicesDropdownOpen(false); }}
                        className="block w-full text-left px-3 py-2 transition-colors text-sm"
                        style={{color: '#0A2540'}}
                      >
                        Review Funnel
                      </button>
                      <button
                        onClick={() => { setCurrentPage('missed-call-text-back'); setIsMenuOpen(false); setIsMobileServicesDropdownOpen(false); }}
                        className="block w-full text-left px-3 py-2 transition-colors text-sm"
                        style={{color: '#0A2540'}}
                      >
                        Missed Call Follow-Up
                      </button>
                      <button
                        onClick={() => { setCurrentPage('business-phone'); setIsMenuOpen(false); setIsMobileServicesDropdownOpen(false); }}
                        className="block w-full text-left px-3 py-2 transition-colors text-sm"
                        style={{color: '#0A2540'}}
                      >
                        Business Phone
                      </button>
                      <button
                        onClick={() => { setCurrentPage('one-click-marketing-campaigns'); setIsMenuOpen(false); setIsMobileServicesDropdownOpen(false); }}
                        className="block w-full text-left px-3 py-2 transition-colors text-sm"
                        style={{color: '#0A2540'}}
                      >
                        Marketing Campaigns
                      </button>
                      <button
                        onClick={() => { setCurrentPage('automated-lead-follow-up'); setIsMenuOpen(false); setIsMobileServicesDropdownOpen(false); }}
                        className="block w-full text-left px-3 py-2 transition-colors text-sm"
                        style={{color: '#0A2540'}}
                      >
                        Lead Follow-Up
                      </button>
                      <button
                        onClick={() => { setCurrentPage('local-seo'); setIsMenuOpen(false); setIsMobileServicesDropdownOpen(false); }}
                        className="block w-full text-left px-3 py-2 transition-colors text-sm"
                        style={{color: '#0A2540'}}
                      >
                        Local SEO
                      </button>
                    </div>
                  )}
                </div>
                <button onClick={() => setCurrentPage('pricing')} className="block px-3 py-2 transition-colors text-left w-full" style={{color: '#0A2540'}} onMouseEnter={(e) => e.currentTarget.style.color = '#D4AF37'} onMouseLeave={(e) => e.currentTarget.style.color = '#0A2540'}>Pricing</button>
                <a href="#about" className="block px-3 py-2 transition-colors" style={{color: '#0A2540'}} onMouseEnter={(e) => e.currentTarget.style.color = '#D4AF37'} onMouseLeave={(e) => e.currentTarget.style.color = '#0A2540'}>About</a>
                <a href="#testimonials" className="block px-3 py-2 transition-colors" style={{color: '#0A2540'}} onMouseEnter={(e) => e.currentTarget.style.color = '#D4AF37'} onMouseLeave={(e) => e.currentTarget.style.color = '#0A2540'}>Reviews</a>
                <a href="#contact" className="block px-3 py-2 transition-colors" style={{color: '#0A2540'}} onMouseEnter={(e) => e.currentTarget.style.color = '#D4AF37'} onMouseLeave={(e) => e.currentTarget.style.color = '#0A2540'}>Contact</a>
                <button 
                  className="w-full text-left px-3 py-2 border-2 rounded-lg transition-colors mb-2"
                  style={{borderColor: '#D4AF37', color: '#D4AF37'}}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#D4AF37';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#D4AF37';
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
                  className="w-full text-left px-3 py-2 text-white rounded-lg transition-colors"
                  style={{backgroundColor: '#D4AF37'}}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#B8860B'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#D4AF37'}
                  onClick={() => setCurrentPage('pricing')}
                >
                  Get Started
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Intro Section with Statistics */}
      <section className="pt-32 pb-20 relative overflow-hidden" style={{background: 'linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 50%, #E5E7EB 100%)'}}>
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 opacity-10" style={{background: 'radial-gradient(circle, #D4AF37 0%, transparent 70%)', transform: 'translate(30%, -30%)'}}></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 opacity-10" style={{background: 'radial-gradient(circle, #D4AF37 0%, transparent 70%)', transform: 'translate(-30%, 30%)'}}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight" style={{color: '#0A2540'}}>
              Professional Website
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto" style={{color: '#6B7280'}}>
              A professional website that actually works for your business
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Statistics */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p style={{color: '#6B7280'}}>
                <span className="text-4xl font-bold" style={{color: '#D4AF37'}}>75%</span> <br />
                of people judge a company's credibility based on their website
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p style={{color: '#6B7280'}}>
                <span className="text-4xl font-bold" style={{color: '#D4AF37'}}>78%</span> <br />
                of small business owners say a website has boosted their growth.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p style={{color: '#6B7280'}}>
                <span className="text-4xl font-bold" style={{color: '#D4AF37'}}>67%</span> <br />
                of users trust websites with a seamless experience, boosting sales.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What is the Professional Website Section */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{color: '#0A2540'}}>
              What is the professional website?
            </h2>
            <p className="text-xl max-w-2xl mx-auto" style={{color: '#6B7280'}}>
              More than just a pretty design - a website that actually drives results for your business
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Actually Get Found Online */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-14 h-14 rounded-xl mr-4" style={{backgroundColor: '#FDE68A'}}>
                  <Search size={28} style={{color: '#D4AF37'}} />
                </div>
                <h3 className="text-2xl font-bold" style={{color: '#0A2540'}}>Actually Get Found Online</h3>
              </div>
              <p className="text-lg leading-relaxed" style={{color: '#6B7280'}}>
                We ensure all our websites are properly indexed to appear on Google. We also follow all of Google's best practices for SEO. Before building, we add the right keywords, meta tags, H1 and H2 headers, and make sure everything is optimized for page speed. We also offer blog posts to help with your content creation.
              </p>
            </div>

            {/* Showcase Your Best Reviews */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-14 h-14 rounded-xl mr-4" style={{backgroundColor: '#FDE68A'}}>
                  <Star size={28} className="fill-current" style={{color: '#D4AF37'}} />
                </div>
                <h3 className="text-2xl font-bold" style={{color: '#0A2540'}}>Showcase Your Best Reviews</h3>
              </div>
              <p className="text-lg leading-relaxed" style={{color: '#6B7280'}}>
                An online reputation is arguably the most important part of any business. We ensure your company puts its best foot forward by showcasing your top reviews on every page of your website. We'll keep your reviews updated and ensure they are all responded to promptly.
              </p>
            </div>

            {/* Mobile Friendly */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-14 h-14 rounded-xl mr-4" style={{backgroundColor: '#FDE68A'}}>
                  <Smartphone size={28} style={{color: '#D4AF37'}} />
                </div>
                <h3 className="text-2xl font-bold" style={{color: '#0A2540'}}>Mobile Friendly</h3>
              </div>
              <p className="text-lg leading-relaxed" style={{color: '#6B7280'}}>
                87% of customers search for local businesses on their mobile devices. Ensuring your website loads and functions properly on mobile is our top priority. Our mobile optimizations include clear call-to-actions, hyperlinked phone numbers, and quick load speeds.
              </p>
            </div>

            {/* Instantly Starts SMS Conversations */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-14 h-14 rounded-xl mr-4" style={{backgroundColor: '#FDE68A'}}>
                  <MessageSquare size={28} style={{color: '#D4AF37'}} />
                </div>
                <h3 className="text-2xl font-bold" style={{color: '#0A2540'}}>Instantly Starts SMS Conversations</h3>
              </div>
              <p className="text-lg leading-relaxed" style={{color: '#6B7280'}}>
                We aim to create SMS conversations with potential customers, eliminating the need for email back-and-forths for quotes. Each of our websites includes functional quote forms and a chat widget that instantly starts a text conversation with customers. They'll receive instant confirmation messages when they reach out, and by capturing their phone number, we ensure you can contact them directly, even if they leave your website.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden" style={{backgroundColor: '#0A2540'}}>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 opacity-5" style={{background: 'radial-gradient(circle, #D4AF37 0%, transparent 70%)', transform: 'translate(30%, -30%)'}}></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 opacity-5" style={{background: 'radial-gradient(circle, #D4AF37 0%, transparent 70%)', transform: 'translate(-30%, 30%)'}}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white leading-tight">
              Want to schedule a time to talk?
            </h2>
            <p className="text-xl md:text-2xl mb-10" style={{color: '#CBD5E1'}}>
              See everything we do to help you grow your business so you can implement it yourself or let us do it for you.
            </p>
            <button
              onClick={() => window.open('https://api.leadconnectorhq.com/widget/bookings/growthlabpro', '_blank')}
              className="text-white px-10 py-5 rounded-xl transition-all duration-300 transform hover:scale-110 hover:shadow-2xl text-lg font-semibold inline-flex items-center shadow-lg"
              style={{backgroundColor: '#D4AF37'}}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#B8860B'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#D4AF37'}
            >
              Book A Call
              <ArrowRight className="ml-2" size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Our Process Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight" style={{color: '#0A2540'}}>
              What working with us looks like...
            </h1>
            <p className="text-xl" style={{color: '#6B7280'}}>Simple, fast, and effective</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-20 left-1/4 right-1/4 h-1" style={{backgroundColor: '#E5E7EB', transform: 'translateY(-50%)'}}>
              <div className="absolute left-0 top-0 h-full w-full" style={{background: 'linear-gradient(to right, #D4AF37, #D4AF37)', width: '100%'}}></div>
            </div>
            
            {/* Step 1 */}
            <div className="text-center relative z-10">
              <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-4xl font-bold shadow-xl transition-all duration-300 hover:scale-110" style={{backgroundColor: '#D4AF37'}}>
                1
              </div>
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <h3 className="text-2xl font-bold mb-4" style={{color: '#0A2540'}}>
                  Demo Call <br /><span className="text-lg font-normal" style={{color: '#6B7280'}}>(20 mins)</span>
                </h3>
                <p className="text-lg leading-relaxed" style={{color: '#6B7280'}}>
                  It's actually a sales call, we just didn't want to scare you. But seriously... we'll answer all your questions, show you any features you have questions about, and show you live client accounts & results.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="text-center relative z-10">
              <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-4xl font-bold shadow-xl transition-all duration-300 hover:scale-110" style={{backgroundColor: '#D4AF37'}}>
                2
              </div>
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <h3 className="text-2xl font-bold mb-4" style={{color: '#0A2540'}}>
                  We build your system <br /><span className="text-lg font-normal" style={{color: '#6B7280'}}>(7-10 days)</span>
                </h3>
                <p className="text-lg leading-relaxed" style={{color: '#6B7280'}}>
                  Fill out a basic onboarding form with your business details. After we have the correct information, we'll get to work on building your new website & marketing system.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="text-center relative z-10">
              <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-4xl font-bold shadow-xl transition-all duration-300 hover:scale-110" style={{backgroundColor: '#D4AF37'}}>
                3
              </div>
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <h3 className="text-2xl font-bold mb-4" style={{color: '#0A2540'}}>
                  Launch Call <br /><span className="text-lg font-normal" style={{color: '#6B7280'}}>(25 mins)</span>
                </h3>
                <p className="text-lg leading-relaxed" style={{color: '#6B7280'}}>
                  We'll walk you through your new website & marketing system, answer any questions you have, and show you how "everything" works... And by everything, we're really just talking about pressing two buttons.
                </p>
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
              See What Contractors Are Saying
            </h2>
            <p className="text-xl" style={{color: '#6B7280'}}>
              Real feedback from real contractors who turned their marketing around with GrowthLabPro.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" style={{color: '#D4AF37'}} />
                  ))}
                </div>
                <p className="mb-6" style={{color: '#6B7280'}}>
                  {testimonial.text}
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold" style={{backgroundColor: '#D4AF37'}}>
                    {testimonial.initials}
                  </div>
                  <div className="ml-4">
                    <div className="font-semibold" style={{color: '#0A2540'}}>
                      {testimonial.name}
                    </div>
                    <div className="text-sm" style={{color: '#6B7280'}}>
                      {testimonial.company}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer - Same as main site */}
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
                © 2026 GrowthLabPro. All rights reserved.
              </p>
              <div className="flex space-x-4 mt-2">
                <button 
                  onClick={() => setCurrentPage('terms')} 
                  className="text-xs transition-colors" 
                  style={{color: '#64748B'}}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#94A3B8'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#64748B'}
                >
                  Terms of Service
                </button>
                <button 
                  onClick={() => setCurrentPage('privacy')} 
                  className="text-xs transition-colors" 
                  style={{color: '#64748B'}}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#94A3B8'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#64748B'}
                >
                  Privacy Policy
                </button>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2" style={{color: '#94A3B8'}}>
                <li><a href="#" className="transition-colors" onMouseEnter={(e) => e.currentTarget.style.color = 'white'} onMouseLeave={(e) => e.currentTarget.style.color = '#94A3B8'}>Website Design</a></li>
                <li><a href="#" className="transition-colors" onMouseEnter={(e) => e.currentTarget.style.color = 'white'} onMouseLeave={(e) => e.currentTarget.style.color = '#94A3B8'}>Lead Generation</a></li>
                <li><a href="#" className="transition-colors" onMouseEnter={(e) => e.currentTarget.style.color = 'white'} onMouseLeave={(e) => e.currentTarget.style.color = '#94A3B8'}>Marketing Automation</a></li>
                <li><a href="#" className="transition-colors" onMouseEnter={(e) => e.currentTarget.style.color = 'white'} onMouseLeave={(e) => e.currentTarget.style.color = '#94A3B8'}>Social Media Marketing</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2" style={{color: '#94A3B8'}}>
                <li><a href="#about" className="transition-colors" onMouseEnter={(e) => e.currentTarget.style.color = 'white'} onMouseLeave={(e) => e.currentTarget.style.color = '#94A3B8'}>About</a></li>
                <li><a href="#testimonials" className="transition-colors" onMouseEnter={(e) => e.currentTarget.style.color = 'white'} onMouseLeave={(e) => e.currentTarget.style.color = '#94A3B8'}>Reviews</a></li>
                <li><a href="#contact" className="transition-colors" onMouseEnter={(e) => e.currentTarget.style.color = 'white'} onMouseLeave={(e) => e.currentTarget.style.color = '#94A3B8'}>Contact</a></li>
                <li><a href="#" className="transition-colors" onMouseEnter={(e) => e.currentTarget.style.color = 'white'} onMouseLeave={(e) => e.currentTarget.style.color = '#94A3B8'}>Case Studies</a></li>
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

export default FunctionalWebsite;
