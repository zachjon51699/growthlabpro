import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface PrivacyPolicyProps {
  onNavigateBack: () => void;
}

const PrivacyPolicy = ({ onNavigateBack }: PrivacyPolicyProps) => {
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
            Privacy Policy
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-lg mb-6" style={{color: '#6B7280'}}>
              Last updated: January 2025
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{color: '#0A2540'}}>
                1. Information We Collect
              </h2>
              <p style={{color: '#6B7280'}}>
                We collect information you provide directly to us, such as when you create an account, subscribe to our services, or contact us for support. This may include:
              </p>
              <ul className="list-disc pl-6 mt-4" style={{color: '#6B7280'}}>
                <li>Name, email address, and phone number</li>
                <li>Business information and company details</li>
                <li>Payment and billing information</li>
                <li>Communications with our support team</li>
                <li>Website usage data and analytics</li>
                <li>Marketing preferences and interests</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{color: '#0A2540'}}>
                2. How We Use Your Information
              </h2>
              <p style={{color: '#6B7280'}}>
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 mt-4" style={{color: '#6B7280'}}>
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>Send technical notices and support messages</li>
                <li>Communicate about products, services, and promotional offers</li>
                <li>Monitor and analyze usage patterns and trends</li>
                <li>Personalize your experience with our services</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{color: '#0A2540'}}>
                3. Information Sharing and Disclosure
              </h2>
              <p style={{color: '#6B7280'}}>
                We do not sell, trade, or otherwise transfer your personal information to third parties except in the following circumstances:
              </p>
              <ul className="list-disc pl-6 mt-4" style={{color: '#6B7280'}}>
                <li><strong>Service Providers:</strong> We may share information with trusted third-party service providers who assist us in operating our business</li>
                <li><strong>Legal Requirements:</strong> We may disclose information when required by law or to protect our rights and safety</li>
                <li><strong>Business Transfers:</strong> Information may be transferred in connection with a merger, acquisition, or sale of assets</li>
                <li><strong>Consent:</strong> We may share information with your explicit consent</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{color: '#0A2540'}}>
                4. Data Security
              </h2>
              <p style={{color: '#6B7280'}}>
                We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
              </p>
              <ul className="list-disc pl-6 mt-4" style={{color: '#6B7280'}}>
                <li>Encryption of sensitive data in transit and at rest</li>
                <li>Regular security assessments and updates</li>
                <li>Access controls and authentication procedures</li>
                <li>Employee training on data protection practices</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{color: '#0A2540'}}>
                5. Cookies and Tracking Technologies
              </h2>
              <p style={{color: '#6B7280'}}>
                We use cookies and similar technologies to collect information about your browsing activities. This helps us:
              </p>
              <ul className="list-disc pl-6 mt-4" style={{color: '#6B7280'}}>
                <li>Remember your preferences and settings</li>
                <li>Analyze website traffic and usage patterns</li>
                <li>Provide personalized content and advertisements</li>
                <li>Improve website functionality and user experience</li>
              </ul>
              <p className="mt-4" style={{color: '#6B7280'}}>
                You can control cookie settings through your browser preferences. Where required by law, we will ask for your consent before placing certain cookies. Please note some features may not function properly if cookies are disabled.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{color: '#0A2540'}}>
                6. Your Rights and Choices
              </h2>
              <p style={{color: '#6B7280'}}>
                You have the following rights regarding your personal information:
              </p>
              <ul className="list-disc pl-6 mt-4" style={{color: '#6B7280'}}>
                <li><strong>Access:</strong> Request access to your personal information</li>
                <li><strong>Correction:</strong> Request correction of inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
                <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                <li><strong>Restriction:</strong> Request restriction of processing in certain circumstances</li>
              </ul>
              <p className="mt-4" style={{color: '#6B7280'}}>
                To exercise these rights, please contact us at contact@growthlabpro.com. We may request verification of your identity before fulfilling your request.
              </p>
              <p className="mt-4" style={{color: '#6B7280'}}>
                Residents of the European Economic Area (EEA), the United Kingdom, and California may have additional rights under applicable privacy laws, which we will honor as required.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{color: '#0A2540'}}>
                7. Data Retention
              </h2>
              <p style={{color: '#6B7280'}}>
                We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this policy. For example, we retain billing information for at least seven (7) years to comply with tax and accounting obligations.
              </p>
              <p className="mt-4" style={{color: '#6B7280'}}>
                We may also retain certain information as required by law, to resolve disputes, or to enforce our agreements.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{color: '#0A2540'}}>
                8. International Data Transfers
              </h2>
              <p style={{color: '#6B7280'}}>
                If you access our services from outside the United States, please note that your information may be transferred to and processed in countries where data protection laws may differ from those of your jurisdiction. We take steps to ensure that appropriate safeguards are in place to protect your information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{color: '#0A2540'}}>
                9. Third-Party Services
              </h2>
              <p style={{color: '#6B7280'}}>
                Our services may integrate with third-party platforms and services, including:
              </p>
              <ul className="list-disc pl-6 mt-4" style={{color: '#6B7280'}}>
                <li>Payment processors (e.g., Stripe)</li>
                <li>Analytics services (e.g., Google Analytics)</li>
                <li>Marketing platforms</li>
                <li>Customer support tools</li>
              </ul>
              <p className="mt-4" style={{color: '#6B7280'}}>
                These third parties have their own privacy policies, and we encourage you to review them.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{color: '#0A2540'}}>
                10. Children's Privacy
              </h2>
              <p style={{color: '#6B7280'}}>
                Our services are not intended for children under 13 years of age (or 16 where required by law). We do not knowingly collect personal information from children. If we become aware that we have collected such information, we will take steps to delete it.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{color: '#0A2540'}}>
                11. Changes to This Privacy Policy
              </h2>
              <p style={{color: '#6B7280'}}>
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on our website and updating the "Last updated" date. Your continued use of our services after such changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{color: '#0A2540'}}>
                12. Contact Us
              </h2>
              <p style={{color: '#6B7280'}}>
                If you have any questions about this Privacy Policy or our data practices, please contact us at:
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

export default PrivacyPolicy;