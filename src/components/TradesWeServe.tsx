import React, { useEffect, useState, useRef, Dispatch, SetStateAction } from 'react';
import Logo from './Logo';
import { Menu, X, ShoppingCart, CheckCircle, ChevronDown, ArrowRight } from 'lucide-react';
import type { AppPage } from '../types/app-page';

interface TradesWeServeProps {
  onNavigateBack: () => void;
  setCurrentPage: Dispatch<SetStateAction<AppPage>>;
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  showCart: boolean;
  setShowCart: (show: boolean) => void;
  getCartItemCount: () => number;
  toggleMenu: () => void;
}

const TradesWeServe = ({ 
  onNavigateBack, 
  setCurrentPage,
  isMenuOpen,
  setIsMenuOpen,
  showCart,
  setShowCart,
  getCartItemCount,
  toggleMenu
}: TradesWeServeProps) => {
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

  const trades = [
    // Core Trades (Most Common)
    { name: 'HVAC', image: '/images/hvac.jpg' },
    { name: 'Plumbing', image: '/images/plumbing.avif' },
    { name: 'Electrician', image: '/images/electrician.jpg' },
    { name: 'Roofing', image: '/images/roofing.webp' },
    // General & Remodeling
    { name: 'General Contractors', image: '/images/general contractor.webp' },
    { name: 'Remodeling', image: '/images/remodeling.webp' },
    { name: 'Handyman', image: '/images/handyman.webp' },
    // Exterior Work
    { name: 'Siding', image: '/images/siding.jpg' },
    { name: 'Windows & Doors', image: '/images/windows and doors.jpg' },
    { name: 'Painters', image: '/images/painters.jpg' },
    // Landscaping & Outdoor
    { name: 'Landscapers', image: '/images/landscaper.webp' },
    { name: 'Hardscaping', image: '/images/hardscaping.jpg' },
    { name: 'Paving', image: '/images/paving.jpg' },
    { name: 'Pool Construction', image: '/images/pool construction.jpg' },
    { name: 'Decks & Patios', image: '/images/decks and patios.webp' },
    { name: 'Tree Service', image: '/images/tree service.webp' },
    // Specialized Services
    { name: 'Floor & Carpet Cleaning', image: '/images/floor and carpet cleaner.jpg' },
    { name: 'Pressure Washer', image: '/images/pressure washer.jpg' },
    { name: 'Moving Companies', image: '/images/moving company.jpg' },
    { name: 'Dog Groomers', image: '/images/dog groomers.jpg' },
    { name: 'Pest Control', image: '/images/pest control.webp' }
  ];

  const allTrades = [
    'Additions & Remodeling',
    'Air Conditioning',
    'Appliances',
    'Appraiser',
    'Architects & Engineers',
    'Art & Mirror Mounting',
    'Audio/Visual & Computers',
    'Awnings',
    'Brick & Stone',
    'Cabinets',
    'Carpenters',
    'Carpet & Upholstery Cleaning',
    'Ceilings',
    'Central Vacuum',
    'Cleaning & Maid Services',
    'Commercial Contractors',
    'Concrete',
    'Construction',
    'Countertops',
    'Decks',
    'Demolition Service',
    'Designers & Decorators',
    'Disability Services',
    'Disaster Recovery Services',
    'Docks',
    'Doors',
    'Drywall & Plaster',
    'Electrical',
    'Excavation',
    'Fans',
    'Fences',
    'Fireplace & Wood Stoves',
    'Sports Equipment Assembly',
    'Flooring & Carpet',
    'Foundations',
    'Fountains & Ponds',
    'Furniture Assembly',
    'Furniture Repair & Refinish',
    'Garage & Garage Doors',
    'General Contractors',
    'Glass & Mirrors',
    'Gutters',
    'Handyman Services',
    'Heating & Furnace Systems',
    'Home Inspection',
    'Home Maintenance',
    'Home Services',
    'Hot Tubs, Spas & Saunas',
    'Household Help',
    'HVAC',
    'Insulation',
    'Landscaping',
    'Lawn & Garden Care',
    'Lifting & Moving Heavy Items',
    'Locksmith',
    'Metal Fabrication',
    'Mold & Asbestos Services',
    'Moving',
    'New Home Builders',
    'Organizers',
    'Outdoor Playgrounds',
    'Packing & Unpacking Services',
    'Painting',
    'Paving',
    'Permit Services',
    'Pest Control',
    'Plumbing',
    'Powdercoating',
    'Remodeling',
    'Roofing',
    'Sandblasting Service',
    'Septic Tanks & Wells',
    'Sheds & Enclosures',
    'Siding',
    'Sign Making Service',
    'Skylights',
    'Snow Removal Service',
    'Solar',
    'Stained Glass',
    'Swimming Pools',
    'Tennis or Game Court',
    'Tile',
    'Tree Service',
    'Wall Coverings',
    'Waste Material Removal',
    'Water Treatment System',
    'Waterproofing',
    'Window Coverings',
    'Windows',
    'Yard & Garden Work'
  ];

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
                  if (setCurrentPage) {
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
                    if (setCurrentPage) {
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
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20" style={{background: 'linear-gradient(to bottom right, #F9FAFB, #F3F4F6)'}}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight" style={{color: '#0A2540'}}>
                Who We Help
              </h1>
              <p className="text-xl mb-8 max-w-3xl mx-auto" style={{color: '#6B7280'}}>
                Built specifically for contractors across every trade. Whether you're in HVAC, plumbing, landscaping, or any other trade, we provide the marketing tools and website solutions that turn leads into booked jobs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  className="text-white px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 text-lg font-semibold flex items-center justify-center mx-auto sm:mx-0"
                  style={{backgroundColor: '#D4AF37'}}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#B8860B'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#D4AF37'}
                  onClick={() => {
                    setCurrentPage('pricing');
                    window.scrollTo(0, 0);
                  }}
                >
                  Start Growing Today
                  <ArrowRight className="ml-2" size={20} style={{color: '#FDE68A'}} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Trades Grid Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trades.map((trade, index) => (
                <div 
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <img 
                    src={trade.image} 
                    alt={trade.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <h3 className="text-xl font-bold text-center" style={{color: '#0A2540'}}>
                    {trade.name}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* All Trades by Category Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{color: '#0A2540'}}>
                All Trades by Category
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {allTrades.map((trade, index) => (
                <div 
                  key={index}
                  className="flex items-center space-x-2 py-2"
                >
                  <CheckCircle 
                    size={30} 
                    strokeWidth={2}
                    style={{color: '#D4AF37', flexShrink: 0}}
                  />
                  <p className="text-base" style={{color: '#6B7280'}}>
                    {trade}
                  </p>
                </div>
              ))}
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
                <li><a href="#contact" className="transition-colors" onMouseEnter={(e) => e.currentTarget.style.color = 'white'} onMouseLeave={(e) => e.currentTarget.style.color = '#94A3B8'}>Contact</a></li>
                <li><button onClick={() => setCurrentPage('portfolio')} className="transition-colors text-left" onMouseEnter={(e) => e.currentTarget.style.color = 'white'} onMouseLeave={(e) => e.currentTarget.style.color = '#94A3B8'}>Case Studies</button></li>
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

export default TradesWeServe;

