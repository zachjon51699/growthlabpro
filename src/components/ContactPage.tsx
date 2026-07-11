import React, { useEffect, useState, useRef } from 'react';
import Logo from './Logo';
import { ArrowRight, ChevronDown, ShoppingCart, Menu, X } from 'lucide-react';
import type { AppPage } from '../types/app-page';

interface ContactPageProps {
  onNavigateHome: () => void;
  onNavigateToPage: (page: AppPage) => void;
  setCurrentPage: React.Dispatch<React.SetStateAction<AppPage>>;
  showCart?: boolean;
  setShowCart?: (show: boolean) => void;
  getCartItemCount?: () => number;
}

const ContactPage = ({ onNavigateHome, onNavigateToPage, setCurrentPage, showCart, setShowCart, getCartItemCount }: ContactPageProps) => {
  const [isAboutDropdownOpen, setIsAboutDropdownOpen] = useState(false);
  const [isMobileAboutDropdownOpen, setIsMobileAboutDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <header className="fixed w-full top-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center cursor-pointer" onClick={onNavigateHome}>
              <Logo />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => {
                  if (setCurrentPage) {
                    setCurrentPage('home');
                    setTimeout(() => {
                      const servicesSection = document.getElementById('services');
                      if (servicesSection) {
                        servicesSection.scrollIntoView({ behavior: 'smooth' });
                      }
                    }, 100);
                  } else {
                    onNavigateHome();
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
              <button 
                onClick={() => {
                  setCurrentPage('portfolio');
                  window.scrollTo(0, 0);
                }} 
                className="font-medium transition-colors" 
                style={{color: '#0A2540'}} 
                onMouseEnter={(e) => e.currentTarget.style.color = '#D4AF37'} 
                onMouseLeave={(e) => e.currentTarget.style.color = '#0A2540'}
              >
                Portfolio
              </button>
              
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
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage('home');
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
              <button 
                onClick={() => {
                  setCurrentPage('contact');
                  window.scrollTo(0, 0);
                }} 
                className="font-medium transition-colors font-semibold" 
                style={{color: '#D4AF37'}} 
                onMouseEnter={(e) => e.currentTarget.style.color = '#B8860B'} 
                onMouseLeave={(e) => e.currentTarget.style.color = '#D4AF37'}
              >
                Contact
              </button>
              
              {/* Cart Button */}
              {setShowCart && getCartItemCount && (
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
              )}
              
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
                onClick={() => window.open('https://api.leadconnectorhq.com/widget/bookings/bookwithusdigitalmarketing-c88db2b9-1b27-4207-8b88-ac02f1888281', '_blank')}
              >
                Book a Call
              </button>
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
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
                <button 
                  onClick={() => {
                    setIsMenuOpen(false);
                    setCurrentPage('home');
                    setTimeout(() => {
                      const servicesSection = document.getElementById('services');
                      if (servicesSection) {
                        servicesSection.scrollIntoView({ behavior: 'smooth' });
                      }
                    }, 200);
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
                <button 
                  onClick={() => { 
                    setCurrentPage('portfolio'); 
                    setIsMenuOpen(false); 
                    window.scrollTo(0, 0);
                  }} 
                  className="block px-3 py-2 transition-colors text-left w-full" 
                  style={{color: '#0A2540'}} 
                  onMouseEnter={(e) => e.currentTarget.style.color = '#D4AF37'} 
                  onMouseLeave={(e) => e.currentTarget.style.color = '#0A2540'}
                >
                  Portfolio
                </button>
                <button 
                  onClick={() => {
                    setIsMenuOpen(false);
                    setCurrentPage('contact');
                    window.scrollTo(0, 0);
                  }} 
                  className="block px-3 py-2 transition-colors text-left w-full font-semibold" 
                  style={{color: '#D4AF37'}} 
                  onMouseEnter={(e) => e.currentTarget.style.color = '#B8860B'} 
                  onMouseLeave={(e) => e.currentTarget.style.color = '#D4AF37'}
                >
                  Contact
                </button>
                
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
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    setIsMenuOpen(false);
                    setCurrentPage('home');
                    setTimeout(() => {
                      const testimonialsSection = document.getElementById('testimonials');
                      if (testimonialsSection) {
                        testimonialsSection.scrollIntoView({ behavior: 'smooth' });
                      }
                    }, 200);
                  }}
                  className="block px-3 py-2 transition-colors text-left w-full" 
                  style={{color: '#0A2540'}} 
                  onMouseEnter={(e) => e.currentTarget.style.color = '#D4AF37'} 
                  onMouseLeave={(e) => e.currentTarget.style.color = '#0A2540'}
                >
                  Reviews
                </button>
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
                    setIsMenuOpen(false);
                    try {
                      window.open(loginUrl, '_blank');
                    } catch (error) {
                      window.location.href = loginUrl;
                    }
                  }}
                >
                  Login
                </button>
                <button 
                  className="w-full text-left px-3 py-2 rounded-lg transition-colors text-white font-medium"
                  style={{backgroundColor: '#D4AF37'}}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#B8860B'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#D4AF37'}
                  onClick={() => {
                    setIsMenuOpen(false);
                    window.open('https://api.leadconnectorhq.com/widget/bookings/bookwithusdigitalmarketing-c88db2b9-1b27-4207-8b88-ac02f1888281', '_blank');
                  }}
                >
                  Book a Call
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-12 text-center" style={{color: '#0A2540'}}>
            Want to book a time to talk?
          </h1>
          
          <div className="max-w-5xl mx-auto">
            <div style={{width: '100%', minHeight: '900px'}}>
              <iframe 
                src="https://api.leadconnectorhq.com/widget/bookings/bookwithusdigitalmarketing-c88db2b9-1b27-4207-8b88-ac02f1888281" 
                style={{width: '100%', height: '900px', border: 'none', overflow: 'scroll', minHeight: '900px'}}
                id="calendar-iframe"
                loading="eager"
                title="Book a consultation"
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-white py-12 mt-20" style={{backgroundColor: '#0A2540'}}>
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
                      setCurrentPage('home');
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
                <li><button onClick={() => onNavigateToPage('contact')} className="transition-colors" onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = '#94A3B8'}>Contact</button></li>
                <li><button onClick={onNavigateHome} className="transition-colors" onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = '#94A3B8'}>Case Studies</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2" style={{color: '#94A3B8'}}>
                <li><button onClick={() => onNavigateToPage('terms')} className="transition-colors" onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = '#94A3B8'}>Terms of Service</button></li>
                <li><button onClick={() => onNavigateToPage('privacy')} className="transition-colors" onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = '#94A3B8'}>Privacy Policy</button></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ContactPage;

