import { useRef, useEffect, useState } from 'react';
import Logo from './Logo';
import { Menu, X, Star, ArrowRight, ShoppingCart, ChevronDown, Mail, ChevronUp } from 'lucide-react';

interface AllInOneInboxProps {
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

const AllInOneInbox = ({ 
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
}: AllInOneInboxProps) => {
  // Debug log
  console.log('🎯 AllInOneInbox component is rendering NOW!');
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

  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
    };
  }, []);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Testimonials data - images only (videos removed until available)
  const testimonials = [
    {
      name: 'Adam',
      image: '/images/thumbnails/Adam1.png',
      text: '"Highly recommended, they are here to help us contractors that don\'t like to deal with the website stuff. It feels like you have partner looking out for you that\'s actually helping you succeed."'
    },
    {
      name: 'Dale',
      image: '/images/thumbnails/Dale.png',
      text: '"I\'ve been working with GrowthLabPro for the last few months and it\'s been absolutely amazing. If you\'re out there and you need someone that\'s gonna be there for you... we love working with them"'
    },
    {
      name: 'George',
      image: '/images/thumbnails/George.png',
      text: '"Shoutout to Kai and Remy for an amazing job that they did doing my website. I\'ve been a pain in the butt every now and then but they did it right. Check them out, you won\'t be dissapointed."'
    },
    {
      name: 'Cody',
      image: '/images/thumbnails/Cody.jpg',
      text: '"If you are looking for someone to get that phone ringing, they\'re the right fit for you! I\'m so happy with them!"'
    },
    {
      name: 'Armando',
      image: '/images/thumbnails/Armando.jpg',
      text: '"They are the absolute best at what they do. They built me a new website and within 10 day\'s I got my first unpaid for Lead! Best money spent with Kai and GrowthLabPro"'
    },
    {
      name: 'James',
      image: '/images/thumbnails/James.jpg',
      text: '"After going through 2-3 other people i finally found someone that told me the truth. Really easy to work with and very respectable. I would recommend them to anyone!"'
    },
    {
      name: 'Manny',
      image: '/images/thumbnails/Manny.jpg',
      text: '"Ever since he implemented the new website and landing pages, it\'s been nothing but great and our conversion has gone way up. We started getting calls almost immediately."'
    },
    {
      name: 'Wendy',
      image: '/images/thumbnails/Wendy.jpg',
      text: '"Getting 5 star reviews has always given me anxiety, Kai and his team have taken all that away and I have seen a significant increase in business since I started working with them. I would recommend them to anyone!"'
    },
    {
      name: 'Netane',
      image: '/images/thumbnails/Netane.jpg',
      text: '"Nothing but professional and awesome in every way, they are absolutely great to work with"'
    },
    {
      name: 'Frank',
      image: '/images/thumbnails/Frank.jpg',
      text: '"I would highly recommend going with GrowthLabPro, my business has ramped up, literally overnight and their prices are very affordable. Feel free to reach out to me personally with any questions about them!"'
    },
    {
      name: 'David',
      image: '/images/thumbnails/David.jpg',
      text: '"I\'ve seen a significant improvement in my business. GrowthLabPro has made my life so much easier!"'
    },
    {
      name: 'Rick',
      image: '/images/thumbnails/Rick.jpg',
      text: '"Thank you to Kai and GrowthLabPro, our company finally has the web presence it needs and our sales and profits have grown significantly! We look forward to working with them for many years to come!"'
    },
    {
      name: 'Luckie',
      image: '/images/thumbnails/Luckie.jpg',
      text: '"Their business marketing systems have helped us a lot. Anytime I need anything I can always give them a call. They\'re super helpful with everything they do, I would recommend them to anybody"'
    },
    {
      name: 'Lopaka',
      image: '/images/thumbnails/Lopaka.jpg',
      text: '"Before I started working with GrowthLabPro I was paying $1500/month with another service that just was not working for me. GrowthLabPro is super affordable and they do a fantastic Job!"'
    },
    {
      name: 'Adam',
      image: '/images/thumbnails/Adam.jpg',
      text: '"It\'s been great and all I needed was one sale a month to pay for the service. Since I signed up i\'ve gotten quite a bit more than that. I would recommend them to anyone!"'
    },
    {
      name: 'Mason',
      image: '/images/thumbnails/Mason.jpg',
      text: '"They made me a brand new website, super professional and it\'s been absolutely amazing. I cannot say enough good things about them. It turned those 100s of viewers into 100s of clients!"'
    },
    {
      name: 'Matt',
      image: '/images/thumbnails/Matt.jpg',
      text: '"First i thought it was a scam, but then it turns out they\'re just a really good company at a really good price. I would recommend them to anyone!"'
    },
    {
      name: 'Ryan',
      image: '/images/thumbnails/RyanSmith.jpg',
      text: '"They\'ve made it so easy with all their automations and the awesome website. I can\'t thank them enough and you should all definitely check them out"'
    },
    {
      name: 'Scott',
      image: '/images/thumbnails/William.jpg',
      text: '"He really got everything going well. I\'m getting organic leads now that don\'t cost me any money. I would recommend them to anyone!"'
    },
    {
      name: 'Zach',
      image: '/images/thumbnails/Zach.jpg',
      text: '"Big shoutout to Kai and GrowthLabPro for helping me with my website and getting me more leads. I would recommend them to anyone!"'
    }
  ];

  const getSlidesToShow = () => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 768 ? 2 : 1;
    }
    return 1;
  };

  const [slidesToShow, setSlidesToShow] = useState(getSlidesToShow());

  useEffect(() => {
    const handleResize = () => {
      setSlidesToShow(getSlidesToShow());
      const maxIndex = Math.max(0, testimonials.length - getSlidesToShow());
      if (currentTestimonialIndex > maxIndex) {
        setCurrentTestimonialIndex(maxIndex);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [testimonials.length, currentTestimonialIndex]);

  const maxIndex = Math.max(0, testimonials.length - slidesToShow);

  const nextTestimonial = () => {
    setCurrentTestimonialIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevTestimonial = () => {
    setCurrentTestimonialIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
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
      <section className="pt-32 pb-16" style={{background: 'linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 50%, #E5E7EB 100%)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Title */}
          <h1 className="text-4xl md:text-6xl font-bold mb-12 text-center pt-12" style={{color: '#0A2540'}}>
            All In One Inbox
          </h1>
          
          {/* Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <p style={{color: '#6B7280'}}>
                <span className="text-4xl font-bold" style={{color: '#D4AF37'}}>70%</span> <br />
                of contractors respond faster to customers with one inbox.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <p style={{color: '#6B7280'}}>
                <span className="text-4xl font-bold" style={{color: '#D4AF37'}}>61%</span> <br />
                of contractors are less overwhelmed when using only one inbox.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <p style={{color: '#6B7280'}}>
                <span className="text-4xl font-bold" style={{color: '#D4AF37'}}>83%</span> <br />
                of contractors become more organized when using just one inbox.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What is the all in one inbox Section */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight" style={{color: '#0A2540'}}>
              What is the all in one inbox?
            </h1>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-14 h-14 rounded-xl mr-4" style={{backgroundColor: '#FDE68A'}}>
                  <Mail size={28} style={{color: '#D4AF37'}} />
                </div>
                <h3 className="text-2xl font-bold" style={{color: '#0A2540'}}>4-in-1 All In One Inbox</h3>
              </div>
              <p className="text-lg leading-relaxed" style={{color: '#6B7280'}}>
                Consolidate Facebook messages, Instagram DMs, text messages, and emails into a single dashboard. Stop switching between apps and platforms—everything lands in one place so you can respond faster, stay organized, and never drop the ball on customer inquiries. Simple, efficient, and built for busy contractors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden" style={{backgroundColor: '#0A2540'}}>
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
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
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
      <section className="py-24 relative" style={{backgroundColor: '#F9FAFB'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight" style={{color: '#0A2540'}}>
              The proof is in the pudding... <br /> Let's see what our clients have to say
            </h1>
          </div>
          
          {/* Carousel Container */}
          <div className="relative">
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ 
                  transform: `translateX(-${currentTestimonialIndex * (100 / slidesToShow)}%)`,
                  width: `${(testimonials.length / slidesToShow) * 100}%`
                }}
              >
                {testimonials.map((testimonial, index) => (
                  <div 
                    key={index}
                    className="flex-shrink-0 px-2 md:px-4"
                    style={{ width: `${100 / slidesToShow}%` }}
                  >
                    <div className="bg-white p-6 rounded-lg shadow-md h-full">
                      <div>
                        <div className="flex mb-4">
                          {[...Array(5)].map((_, i) => (
                            <img key={i} src="/images/star.png" alt="star" className="w-5 h-5" style={{marginRight: '4px'}} />
                          ))}
                        </div>
                        <p className="mb-6" style={{color: '#6B7280'}}>
                          {testimonial.text}
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="font-semibold" style={{color: '#0A2540'}}>-{testimonial.name}</p>
                          <a 
                            href="#testimonials" 
                            className="flex items-center text-sm font-medium transition-colors"
                            style={{color: '#0A2540'}}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#D4AF37'}
                            onMouseLeave={(e) => e.currentTarget.style.color = '#0A2540'}
                          >
                            See All
                            <ArrowRight className="ml-1" size={16} />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="flex justify-center items-center mt-8 gap-4">
              <button
                onClick={prevTestimonial}
                className="p-2 rounded-full transition-colors focus:outline-none"
                style={{backgroundColor: '#E5E7EB', color: '#0A2540'}}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#D4AF37';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#E5E7EB';
                  e.currentTarget.style.color = '#0A2540';
                }}
                aria-label="Previous testimonial"
              >
                <ChevronUp size={16} style={{transform: 'rotate(-90deg)', display: 'block'}} />
              </button>
              <button
                onClick={nextTestimonial}
                className="p-2 rounded-full transition-colors focus:outline-none"
                style={{backgroundColor: '#E5E7EB', color: '#0A2540'}}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#D4AF37';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#E5E7EB';
                  e.currentTarget.style.color = '#0A2540';
                }}
                aria-label="Next testimonial"
              >
                <ChevronUp size={16} style={{transform: 'rotate(90deg)', display: 'block'}} />
              </button>
            </div>
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

      {/* Shopping Cart Modal - Add this from FunctionalWebsite if needed */}
    </div>
  );
};

export default AllInOneInbox;

