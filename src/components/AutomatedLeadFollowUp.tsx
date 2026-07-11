import { useRef, useEffect, useState } from 'react';
import Logo from './Logo';
import { Menu, X, Star, ArrowRight, ShoppingCart, ChevronDown, ChevronUp, FileText, MessageCircle, Smartphone, Facebook } from 'lucide-react';

interface AutomatedLeadFollowUpProps {
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

const AutomatedLeadFollowUp = ({ 
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
}: AutomatedLeadFollowUpProps) => {
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

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
    }, 300);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
    };
  }, []);

  // Testimonials data
  const testimonials = [
    { image: '/images/thumbnails/Adam1.png', text: '"Highly recommended, they are here to help us contractors that don\'t like to deal with the website stuff. It feels like you have partner looking out for you that\'s actually helping you succeed."', name: '-Adam' },
    { image: '/images/thumbnails/Dale.png', text: '"I\'ve been working with stonesystems for the last few months and it\'s been absolutely amazing. If you\'re out there and you need someone that\'s gonna be there for you... we love working with stonesystems"', name: '-Dale' },
    { image: '/images/thumbnails/George.png', text: '"Shoutout to Kai and Remy for an amazing job that they did doing my website. I\'ve been a pain in the butt every now and then but they did it right. Check them out, you won\'t be dissapointed."', name: '-George' },
    { image: '/images/thumbnails/Cody.jpg', text: '"If you are looking for someone to get that phone ringing, they\'re the right fit for you! I\'m so happy with them!"', name: '-Cody' },
    { image: '/images/thumbnails/Armando.jpg', text: '"They are the absolute best at what they do. They built me a new website and within 10 day\'s I got my first unpaid for Lead! Best money spent with Kai and StoneSystems"', name: '-Armando' },
    { image: '/images/thumbnails/James.jpg', text: '"After going through 2-3 other people i finally found someone that told me the truth. Really easy to work with and very respectable. I would recommend them to anyone!"', name: '-James' },
    { image: '/images/thumbnails/Manny.jpg', text: '"Ever since he implemented the new website and landing pages, it\'s been nothing but great and our conversion has gone way up. We started getting calls almost immediately."', name: '-Manny' },
    { image: '/images/thumbnails/Wendy.jpg', text: '"Getting 5 star reviews has always given me anxiety, Kai and his team have taken all that away and I have seen a significant increase in business since I started working with them. I would recommend them to anyone!"', name: '-Wendy' },
  ];

  const slidesToShow = window.innerWidth >= 768 ? 2 : 1;
  const totalSlides = testimonials.length;

  const nextTestimonial = () => {
    setCurrentTestimonialIndex((prevIndex) => (prevIndex + 1) % totalSlides);
  };

  const prevTestimonial = () => {
    setCurrentTestimonialIndex((prevIndex) => (prevIndex - 1 + totalSlides) % totalSlides);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Same as main site */}
      <header className="fixed w-full top-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Logo onClick={() => setCurrentPage('home')} size="md" />
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
                <div>
                  <button 
                    onClick={() => setIsMobileServicesDropdownOpen(!isMobileServicesDropdownOpen)}
                    className="w-full flex items-center justify-between px-3 py-2 transition-colors" 
                    style={{color: '#0A2540'}} 
                  >
                    <span>Services</span>
                    <ChevronDown 
                      size={16} 
                      style={{transform: isMobileServicesDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s'}}
                    />
                  </button>
                  {isMobileServicesDropdownOpen && (
                    <div className="pl-4 space-y-1">
                      <button onClick={() => { setCurrentPage('functional-website'); setIsMobileServicesDropdownOpen(false); setIsMenuOpen(false); }} className="block px-3 py-2 transition-colors text-left w-full" style={{color: '#0A2540'}}>Professional Website</button>
                      <button onClick={() => { setCurrentPage('all-in-one-inbox'); setIsMobileServicesDropdownOpen(false); setIsMenuOpen(false); }} className="block px-3 py-2 transition-colors text-left w-full" style={{color: '#0A2540'}}>All In One Inbox</button>
                      <button onClick={() => { setCurrentPage('5-star-magic-review-funnel'); setIsMobileServicesDropdownOpen(false); setIsMenuOpen(false); }} className="block px-3 py-2 transition-colors text-left w-full" style={{color: '#0A2540'}}>Review Funnel</button>
                      <button onClick={() => { setCurrentPage('missed-call-text-back'); setIsMobileServicesDropdownOpen(false); setIsMenuOpen(false); }} className="block px-3 py-2 transition-colors text-left w-full" style={{color: '#0A2540'}}>Missed Call Follow-Up</button>
                      <button onClick={() => { setCurrentPage('business-phone'); setIsMobileServicesDropdownOpen(false); setIsMenuOpen(false); }} className="block px-3 py-2 transition-colors text-left w-full" style={{color: '#0A2540'}}>Business Phone</button>
                      <button onClick={() => { setCurrentPage('one-click-marketing-campaigns'); setIsMobileServicesDropdownOpen(false); setIsMenuOpen(false); }} className="block px-3 py-2 transition-colors text-left w-full" style={{color: '#0A2540'}}>Marketing Campaigns</button>
                      <button onClick={() => { setCurrentPage('automated-lead-follow-up'); setIsMobileServicesDropdownOpen(false); setIsMenuOpen(false); }} className="block px-3 py-2 transition-colors text-left w-full" style={{color: '#0A2540'}}>Lead Follow-Up</button>
                      <button onClick={() => { setCurrentPage('local-seo'); setIsMobileServicesDropdownOpen(false); setIsMenuOpen(false); }} className="block px-3 py-2 transition-colors text-left w-full" style={{color: '#0A2540'}}>Local SEO</button>
                    </div>
                  )}
                </div>
                <button onClick={() => setCurrentPage('pricing')} className="block px-3 py-2 transition-colors text-left w-full" style={{color: '#0A2540'}}>Pricing</button>
                <a href="#about" className="block px-3 py-2 transition-colors" style={{color: '#0A2540'}}>About</a>
                <a href="#testimonials" className="block px-3 py-2 transition-colors" style={{color: '#0A2540'}}>Reviews</a>
                <a href="#contact" className="block px-3 py-2 transition-colors" style={{color: '#0A2540'}}>Contact</a>
                <button 
                  className="w-full text-left px-3 py-2 border-2 rounded-lg transition-colors mb-2"
                  style={{borderColor: '#D4AF37', color: '#D4AF37'}}
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
      <section className="py-16 pt-32" style={{background: 'linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 50%, #E5E7EB 100%)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Title */}
          <h1 className="text-4xl md:text-6xl font-bold mb-12 text-center" style={{color: '#0A2540'}}>
            Lead Follow-Up
          </h1>
          
          {/* Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <p style={{color: '#6B7280'}}>
                <span className="text-4xl font-bold" style={{color: '#D4AF37'}}>70%</span> <br />
                of prospects respond to text follow-ups within a day
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <p style={{color: '#6B7280'}}>
                <span className="text-4xl font-bold" style={{color: '#D4AF37'}}>72%</span> <br />
                of trade businesses see revenue increases with automated messaging
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <p style={{color: '#6B7280'}}>
                <span className="text-4xl font-bold" style={{color: '#D4AF37'}}>97%</span> <br />
                of text messages get opened within the first day
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight" style={{color: '#0A2540'}}>
              What is SMS lead follow-up?
            </h1>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Feature 1: Website Quote Forms */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 mr-4 flex items-center justify-center" style={{color: '#D4AF37'}}>
                  <FileText size={48} />
                </div>
                <h3 className="text-xl font-bold" style={{color: '#0A2540'}}>Website Quote Forms</h3>
              </div>
              <p className="text-lg leading-relaxed" style={{color: '#6B7280'}}>
                Every time someone fills out a quote form on your site, we instantly text them to acknowledge their submission and open a dialogue. This professional approach builds trust and shows you're on top of your leads. Instant alerts mean you never miss an opportunity to connect.
              </p>
            </div>

            {/* Feature 2: Chat Widget */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 mr-4 flex items-center justify-center" style={{color: '#D4AF37'}}>
                  <MessageCircle size={48} />
                </div>
                <h3 className="text-xl font-bold" style={{color: '#0A2540'}}>Chat Widget</h3>
              </div>
              <p className="text-lg leading-relaxed" style={{color: '#6B7280'}}>
                The moment someone starts chatting on your site, they receive an immediate text acknowledging their message and initiating contact. This level of responsiveness creates a competitive edge and demonstrates your commitment to customer service. Real-time notifications keep you in the loop for fast response times.
              </p>
            </div>

            {/* Feature 3: Missed Call Follow-Up */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 mr-4 flex items-center justify-center" style={{color: '#D4AF37'}}>
                  <Smartphone size={48} />
                </div>
                <h3 className="text-xl font-bold" style={{color: '#0A2540'}}>Missed Call Follow-Up</h3>
              </div>
              <p className="text-lg leading-relaxed" style={{color: '#6B7280'}}>
                Missed a call? No problem. We immediately text that person to let them know you reached out, turning a missed connection into an active conversation starter. This proactive communication builds confidence in your reliability. You'll be notified instantly to keep the momentum going.
              </p>
            </div>

            {/* Feature 4: Instagram & Facebook Auto Responder */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 mr-4 flex items-center justify-center" style={{color: '#D4AF37'}}>
                  <Facebook size={48} />
                </div>
                <h3 className="text-xl font-bold" style={{color: '#0A2540'}}>Instagram & Facebook Auto Responder</h3>
              </div>
              <p className="text-lg leading-relaxed" style={{color: '#6B7280'}}>
                Social media messages get an instant automated response letting customers know you've received their inquiry and will respond shortly. This immediate acknowledgment shows professionalism and keeps potential clients engaged. Alerts ensure you never let a social media lead go cold.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden" style={{backgroundColor: '#0A2540'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white leading-tight">
              Ready to see how this works for your business?
            </h2>
            <p className="text-xl md:text-2xl mb-10" style={{color: '#CBD5E1'}}>
              Discover all the tools and strategies we use to grow contractor businesses. Whether you want to handle it yourself or have us manage it for you, we'll show you exactly how it works.
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
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-white p-8 rounded-xl shadow-lg text-center relative">
              <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center text-2xl font-bold text-white" style={{backgroundColor: '#D4AF37'}}>
                1
              </div>
              <h3 className="text-2xl font-bold mb-4" style={{color: '#0A2540'}}>
                Demo Call <br />(20 mins)
              </h3>
              <p className="text-lg leading-relaxed" style={{color: '#6B7280'}}>
                It's actually a sales call, we just didn't want to scare you. But seriously... we'll answer all your questions, show you any features you have questions about, and show you live client accounts & results.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-8 rounded-xl shadow-lg text-center relative">
              <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center text-2xl font-bold text-white" style={{backgroundColor: '#D4AF37'}}>
                2
              </div>
              <h3 className="text-2xl font-bold mb-4" style={{color: '#0A2540'}}>
                We build your system <br />(7-10 days)
              </h3>
              <p className="text-lg leading-relaxed" style={{color: '#6B7280'}}>
                Fill out a basic onboarding form with your business details. After we have the correct information, we'll get to work on building your new website & marketing system.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-8 rounded-xl shadow-lg text-center relative">
              <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center text-2xl font-bold text-white" style={{backgroundColor: '#D4AF37'}}>
                3
              </div>
              <h3 className="text-2xl font-bold mb-4" style={{color: '#0A2540'}}>
                Launch Call<br /> (25 mins)
              </h3>
              <p className="text-lg leading-relaxed" style={{color: '#6B7280'}}>
                We'll walk you through your new website & marketing system, answer any questions you have, and show you how "everything" works... And by everything, we're really just talking about pressing two buttons.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight" style={{color: '#0A2540'}}>
              The proof is in the pudding... <br /> Let's see what our clients have to say
            </h1>
          </div>
          
          <div className="relative">
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentTestimonialIndex * (100 / slidesToShow)}%)` }}
              >
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="flex-shrink-0 px-4" style={{ width: `${100 / slidesToShow}%` }}>
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                      <div className="flex mb-2">
                        {[...Array(5)].map((_, star) => (
                          <img key={star} src="/images/star.png" alt="star" className="w-5 h-5" />
                        ))}
                      </div>
                      <p className="text-lg mb-4" style={{color: '#6B7280'}}>
                        {testimonial.text}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="font-semibold" style={{color: '#0A2540'}}>{testimonial.name}</p>
                        <a href="/testimonials" className="flex items-center text-sm font-medium" style={{color: '#D4AF37'}}>
                          See All
                          <ArrowRight className="ml-1" size={16} />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Navigation Buttons */}
            <button
              onClick={prevTestimonial}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all z-10"
              style={{color: '#0A2540'}}
            >
              <ChevronUp size={20} style={{transform: 'rotate(90deg)'}} />
            </button>
            <button
              onClick={nextTestimonial}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all z-10"
              style={{color: '#0A2540'}}
            >
              <ChevronUp size={20} style={{transform: 'rotate(-90deg)'}} />
            </button>
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
                <li>Phone: 225-475-9305</li>
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

export default AutomatedLeadFollowUp;

