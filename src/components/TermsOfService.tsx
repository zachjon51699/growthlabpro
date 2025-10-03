import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface TermsOfServiceProps {
  onNavigateBack: () => void;
  onNavigateToPrivacy: () => void;
}

const TermsOfService = ({ onNavigateBack, onNavigateToPrivacy }: TermsOfServiceProps) => {
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
                onMouseEnter={(e) => e.target.style.color = '#B8860B'}
                onMouseLeave={(e) => e.target.style.color = '#D4AF37'}
              >
                <ArrowLeft size={24} className="mr-2" />
                GrowthLabPro
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-8" style={{color: '#0A2540'}}>
            Terms of Service
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-lg mb-6" style={{color: '#6B7280'}}>
              Last updated: January 2025
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{color: '#0A2540'}}>
                1. Agreement to Terms
              </h2>
              <p style={{color: '#6B7280'}}>
                By accessing and using GrowthLabPro's services, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree, you may not use our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{color: '#0A2540'}}>
                2. Services Description
              </h2>
              <p style={{color: '#6B7280'}}>
                GrowthLabPro provides website design, marketing systems, and lead generation services specifically for contractors. Our services include but are not limited to:
              </p>
              <ul className="list-disc pl-6 mt-4" style={{color: '#6B7280'}}>
                <li>Professional website design and development</li>
                <li>Marketing automation systems</li>
                <li>Lead generation and management</li>
                <li>Search engine optimization (SEO)</li>
                <li>Social media marketing</li>
                <li>Review management systems</li>
              </ul>
              <p className="mt-4" style={{color: '#6B7280'}}>
                We may update, modify, or discontinue any service features at our discretion.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{color: '#0A2540'}}>
                3. Payment Terms
              </h2>
              <ul className="list-disc pl-6" style={{color: '#6B7280'}}>
                <li>Payment for services is due according to the billing cycle selected (monthly or annual).</li>
                <li>All fees are non-refundable except as expressly stated in these Terms.</li>
                <li>We reserve the right to change our pricing with 30 days' written notice.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{color: '#0A2540'}}>
                4. Cancellation Policy
              </h2>
              <ul className="list-disc pl-6" style={{color: '#6B7280'}}>
                <li>You may cancel your subscription at any time with 30 days' written notice.</li>
                <li>Upon cancellation, you will continue to have access to services until the end of your current billing period.</li>
                <li>No refunds will be provided for partial months of service.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{color: '#0A2540'}}>
                5. Intellectual Property
              </h2>
              <p style={{color: '#6B7280'}}>
                All content, features, and functionality of our services are owned by GrowthLabPro and are protected by copyright, trademark, and other intellectual property laws. You are granted a limited, non-transferable license to use our services for your business purposes only.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{color: '#0A2540'}}>
                6. Website & Marketing Assets Ownership
              </h2>
              <p className="mb-4" style={{color: '#6B7280'}}>
                Websites, booking systems, automations, and marketing tools provided under this agreement are built and hosted within GrowthLabPro's platform. These assets remain the property of GrowthLabPro for the duration of your subscription.
              </p>
              <p className="mb-4" style={{color: '#6B7280'}}>
                If you remain an active subscriber for six (6) consecutive months, ownership of the website design (not including the proprietary automation systems, integrations, or software) may be transferred to you upon request.
              </p>
              <p className="mb-4" style={{color: '#6B7280'}}>
                If you cancel before six (6) months, GrowthLabPro retains ownership and reserves the right to deactivate the website and related services.
              </p>
              <p style={{color: '#6B7280'}}>
                Domain names purchased by you remain your property at all times.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{color: '#0A2540'}}>
                7. Client Responsibilities
              </h2>
              <p className="mb-4" style={{color: '#6B7280'}}>
                Clients are responsible for:
              </p>
              <ul className="list-disc pl-6" style={{color: '#6B7280'}}>
                <li>Providing accurate information, timely feedback, and necessary access to implement services.</li>
                <li>Complying with all applicable laws and regulations in their use of our services.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{color: '#0A2540'}}>
                8. Limitation of Liability
              </h2>
              <p style={{color: '#6B7280'}}>
                GrowthLabPro shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, goodwill, or other intangible losses, resulting from your use of our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{color: '#0A2540'}}>
                9. Indemnification
              </h2>
              <p style={{color: '#6B7280'}}>
                You agree to indemnify and hold harmless GrowthLabPro, its officers, employees, and affiliates, from any claims, liabilities, damages, losses, or expenses arising out of your use of the services or violation of these Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{color: '#0A2540'}}>
                10. Privacy Policy
              </h2>
              <p style={{color: '#6B7280'}}>
                Your use of our services is also governed by our{' '}
                <button 
                  onClick={onNavigateToPrivacy}
                  className="font-medium transition-colors underline"
                  style={{color: '#D4AF37'}}
                  onMouseEnter={(e) => e.target.style.color = '#B8860B'}
                  onMouseLeave={(e) => e.target.style.color = '#D4AF37'}
                >
                  Privacy Policy
                </button>.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{color: '#0A2540'}}>
                11. Modifications to Terms
              </h2>
              <p style={{color: '#6B7280'}}>
                We reserve the right to modify these Terms at any time. We will provide notice of significant changes via email or through our services. Your continued use of our services after such modifications constitutes acceptance of the updated Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{color: '#0A2540'}}>
                12. Governing Law & Dispute Resolution
              </h2>
              <p className="mb-4" style={{color: '#6B7280'}}>
                These Terms are governed by and construed in accordance with the laws of the State of Louisiana, without regard to its conflict of law principles. Any dispute, claim, or controversy arising out of or relating to these Terms or the services shall be resolved exclusively in the state or federal courts located in Baton Rouge, Louisiana. By using our services, you consent to the jurisdiction and venue of these courts.
              </p>
              <p style={{color: '#6B7280'}}>
                Where permitted by law, any disputes shall first be attempted to be resolved through informal negotiations, and if unresolved, through binding arbitration in Baton Rouge, Louisiana.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{color: '#0A2540'}}>
                13. Contact Information
              </h2>
              <p className="mb-4" style={{color: '#6B7280'}}>
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="mt-4" style={{color: '#6B7280'}}>
                <p>Email: contact@growthlabpro.com</p>
                <p>Phone: (225) 454-5977</p>
                <p>Address: Baton Rouge, LA</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;