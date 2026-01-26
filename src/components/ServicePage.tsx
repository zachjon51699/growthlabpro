import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface ServicePageProps {
  title: string;
  description: string;
  onNavigateBack: () => void;
}

const ServicePage = ({ title, description, onNavigateBack }: ServicePageProps) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed w-full top-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button 
                onClick={onNavigateBack}
                className="flex items-center text-2xl font-bold transition-colors mr-4" 
                style={{color: '#D4AF37'}}
                onMouseEnter={(e) => e.currentTarget.style.color = '#B8860B'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#D4AF37'}
              >
                <ArrowLeft size={24} className="mr-2" />
                GrowthLabPro
              </button>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
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
                onClick={onNavigateBack}
              >
                Get Started
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-8" style={{color: '#0A2540'}}>
            {title}
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-lg mb-6" style={{color: '#6B7280'}}>
              {description}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{color: '#0A2540'}}>
                About This Service
              </h2>
              <p style={{color: '#6B7280'}} className="mb-4">
                {description}
              </p>
              <p style={{color: '#6B7280'}}>
                Contact us to learn more about how this service can help grow your contracting business.
              </p>
            </section>

            <section className="mt-12">
              <button
                onClick={onNavigateBack}
                className="text-white px-8 py-3 rounded-lg transition-colors font-semibold"
                style={{backgroundColor: '#D4AF37'}}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#B8860B'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#D4AF37'}
              >
                Back to Home
              </button>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicePage;




