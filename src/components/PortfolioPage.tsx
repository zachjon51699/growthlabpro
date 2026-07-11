import { Menu, X, ShoppingCart, ChevronDown, ArrowRight } from 'lucide-react';
import { useState, useRef, useEffect, Dispatch, SetStateAction } from 'react';
import Logo from './Logo';
import type { AppPage } from '../types/app-page';

interface PortfolioPageProps {
  onNavigateBack: () => void;
  setCurrentPage: Dispatch<SetStateAction<AppPage>>;
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  showCart: boolean;
  setShowCart: (show: boolean) => void;
  getCartItemCount: () => number;
  toggleMenu: () => void;
}

const PortfolioPage = ({ 
  onNavigateBack, 
  setCurrentPage,
  isMenuOpen,
  setIsMenuOpen,
  showCart,
  setShowCart,
  getCartItemCount,
  toggleMenu
}: PortfolioPageProps) => {
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
      {/* Header */}
      <header className="fixed w-full top-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center">
              <Logo onClick={() => setCurrentPage('home')} size="md" />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => {
                  setCurrentPage('home');
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
                <button onClick={() => setCurrentPage('pricing')} className="block px-3 py-2 transition-colors text-left w-full" style={{color: '#0A2540'}} onMouseEnter={(e) => e.target.style.color = '#D4AF37'} onMouseLeave={(e) => e.target.style.color = '#0A2540'}>Pricing</button>
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
                      window.location.href = loginUrl;
                    }
                  }}
                >
                  Login
                </button>
                <button 
                  className="w-full text-left px-3 py-2 rounded-lg transition-colors font-medium"
                  style={{backgroundColor: '#D4AF37', color: 'white'}}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#B8860B'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#D4AF37'}
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

      {/* Portfolio Content */}
      <main className="pt-32">
        <section className="pb-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight whitespace-nowrap" style={{color: '#0A2540'}}>
                Look at what we've done for other contractors
              </h1>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <img 
                alt="website example" 
                loading="lazy" 
                className="w-full h-auto rounded-lg"
                src="/images/image1.png"
                decoding="async"
                width="800"
                height="600"
              />
              <img 
                alt="website example" 
                loading="lazy" 
                className="w-full h-auto rounded-lg"
                src="/images/image2.png"
              />
              <img 
                alt="website example" 
                loading="lazy" 
                className="w-full h-auto rounded-lg"
                src="/images/image3.png"
              />
              <img 
                alt="website example" 
                loading="lazy" 
                className="w-full h-auto rounded-lg"
                src="/images/image4.png"
              />
              <img 
                alt="website example" 
                loading="lazy" 
                className="w-full h-auto rounded-lg"
                src="/images/image5.png"
              />
              <img 
                alt="website example" 
                loading="lazy" 
                className="w-full h-auto rounded-lg"
                src="/images/image6.png"
              />
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
              Join hundreds of contractors who have transformed their businesses with GrowthLabPro. Start with a free consultation to find the perfect plan for your needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                className="text-white px-8 py-4 rounded-lg transition-colors text-lg font-semibold flex items-center justify-center mx-auto sm:mx-0"
                style={{backgroundColor: '#D4AF37'}}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#B8860B'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#D4AF37'}
                onClick={() => window.open('https://api.leadconnectorhq.com/widget/bookings/bookwithusdigitalmarketing-c88db2b9-1b27-4207-8b88-ac02f1888281', '_blank')}
              >
                Schedule Free Consultation
                <ArrowRight className="ml-2" size={20} style={{color: '#FDE68A'}} />
              </button>
              <button 
                className="border-2 border-white text-white px-8 py-4 rounded-lg transition-colors text-lg font-semibold"
                style={{backgroundColor: 'transparent', color: 'white'}}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                onClick={() => {
                  setCurrentPage('pricing');
                  window.scrollTo(0, 0);
                }}
              >
                Compare All Plans
              </button>
            </div>
          </div>
        </section>
      </main>

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
    </div>
  );
};

export default PortfolioPage;

