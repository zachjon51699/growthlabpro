import React, { useState } from 'react';
import { ghlService } from '../services/gohighlevel';
import { X, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: () => void;
}

const AuthModal = ({ isOpen, onClose, onAuthSuccess }: AuthModalProps) => {
  const [isLogin, setIsLogin] = useState(false); // Default to signup for lead capture
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        // For GoHighLevel, we'll redirect to OAuth
        ghlService.initiateOAuth();
      } else {
        // Create contact in GoHighLevel
        const [firstName, ...lastNameParts] = name.split(' ');
        const lastName = lastNameParts.join(' ');
        
        await ghlService.createContact({
          firstName,
          lastName,
          email,
          phone,
          tags: ['website-signup', 'contractor-lead'],
          customFields: {
            company: company,
            source: 'growthlabpro-website'
          }
        });

        setSuccess(true);
        setTimeout(() => {
          onAuthSuccess();
          onClose();
        }, 2000);
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setName('');
    setPhone('');
    setCompany('');
    setError('');
    setSuccess(false);
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  if (!isOpen) return null;

  if (success) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{backgroundColor: '#D4AF37'}}>
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{color: '#0A2540'}}>Welcome to GrowthLabPro!</h2>
          <p style={{color: '#6B7280'}}>
            Thank you for joining us. We'll be in touch soon to help grow your contracting business.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold" style={{color: '#0A2540'}}>
            {isLogin ? 'Sign In with GoHighLevel' : 'Get Started Today'}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} style={{color: '#6B7280'}} />
          </button>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1" style={{color: '#374151'}}>
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{color: '#9CA3AF'}} />
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent"
                      style={{borderColor: '#D1D5DB', '--tw-ring-color': '#D4AF37'}}
                      placeholder="Your full name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium mb-1" style={{color: '#374151'}}>
                    Company Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{color: '#9CA3AF'}} />
                    <input
                      type="text"
                      id="company"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent"
                      style={{borderColor: '#D1D5DB', '--tw-ring-color': '#D4AF37'}}
                      placeholder="Your company name"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1" style={{color: '#374151'}}>
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{color: '#9CA3AF'}} />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent"
                  style={{borderColor: '#D1D5DB', '--tw-ring-color': '#D4AF37'}}
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-1" style={{color: '#374151'}}>
                  Phone Number
                </label>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{color: '#9CA3AF'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent"
                    style={{borderColor: '#D1D5DB', '--tw-ring-color': '#D4AF37'}}
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="p-3 rounded-lg" style={{backgroundColor: '#FEE2E2', color: '#DC2626'}}>
                <p className="text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors text-white ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              style={{backgroundColor: '#D4AF37'}}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.target.style.backgroundColor = '#B8860B';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.target.style.backgroundColor = '#D4AF37';
                }
              }}
            >
              {isLoading ? 'Please wait...' : (isLogin ? 'Sign In with GoHighLevel' : 'Get Started')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm" style={{color: '#6B7280'}}>
              {isLogin ? "New to GrowthLabPro?" : "Already have a GoHighLevel account?"}
              <button
                onClick={switchMode}
                className="ml-1 font-medium transition-colors"
                style={{color: '#D4AF37'}}
                onMouseEnter={(e) => e.target.style.color = '#B8860B'}
                onMouseLeave={(e) => e.target.style.color = '#D4AF37'}
              >
                {isLogin ? 'Get started' : 'Sign in'}
              </button>
            </p>
          </div>

          {!isLogin && (
            <div className="mt-4 p-3 rounded-lg" style={{backgroundColor: '#F0F9FF', color: '#0369A1'}}>
              <p className="text-xs">
                By getting started, you agree to our Terms of Service and Privacy Policy. 
                We'll add you to our system to provide you with marketing services and updates.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;