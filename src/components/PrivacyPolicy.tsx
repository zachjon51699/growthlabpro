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
              Last Updated: October 2025
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{color: '#0A2540'}}>
                GrowthLabPro Privacy Policy
              </h2>
              <p className="mb-4" style={{color: '#6B7280'}}>
                This Privacy Policy describes how GrowthLabPro LLC ("GrowthLabPro," "we," "us," or "our") collects, uses, and protects your information when you visit our website, respond to our advertisements, or use our services.
              </p>
              <p style={{color: '#6B7280'}}>
                By using our services, you agree to this Privacy Policy and the collection and use of information as described herein.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{color: '#0A2540'}}>
                Mobile Communication Policy
              </h2>
              <p className="mb-4" style={{color: '#6B7280'}}>
                We value your privacy and are committed to protecting your personal information.
              </p>
              <p className="mb-4" style={{color: '#6B7280'}}>
                By providing your mobile number, you consent to receive SMS messages related to account notifications, onboarding, support, and promotional offers.
              </p>
              <p className="mb-4" style={{color: '#6B7280'}}>
                <strong>No Third-Party Sharing:</strong> Your mobile number and opt-in information will not be shared or sold to third parties for marketing purposes.
              </p>
              <p className="mb-4" style={{color: '#6B7280'}}>
                <strong>Opt-Out Instructions:</strong> You may opt out of receiving SMS messages at any time by replying STOP to any message you receive.
              </p>
              <p style={{color: '#6B7280'}}>
                <strong>Support:</strong> For assistance, reply HELP to any of our messages or contact us at contact@growthlabpro.com.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{color: '#0A2540'}}>
                Interpretation and Definitions
              </h2>
              <h3 className="text-xl font-semibold mb-3" style={{color: '#0A2540'}}>
                Interpretation
              </h3>
              <p className="mb-4" style={{color: '#6B7280'}}>
                Capitalized words have the meanings defined below. The same meaning applies whether they appear in singular or plural form.
              </p>
              <h3 className="text-xl font-semibold mb-3" style={{color: '#0A2540'}}>
                Definitions
              </h3>
              <p className="mb-4" style={{color: '#6B7280'}}>
                For the purposes of this Privacy Policy:
              </p>
              <ul className="list-disc pl-6 mb-4" style={{color: '#6B7280'}}>
                <li><strong>Company</strong> (referred to as "the Company," "we," "us," or "our") means GrowthLabPro LLC, headquartered in Baton Rouge, Louisiana.</li>
                <li><strong>Device</strong> means any device that can access the service, such as a computer, smartphone, or tablet.</li>
                <li><strong>Personal Data</strong> means any information that identifies or could reasonably identify an individual.</li>
                <li><strong>Service</strong> refers to GrowthLabPro's marketing systems, websites, automations, advertisements, and related platforms.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{color: '#0A2540'}}>
                Collecting and Using Your Personal Data
              </h2>
              <h3 className="text-xl font-semibold mb-3" style={{color: '#0A2540'}}>
                Types of Data Collected
              </h3>
              <p className="mb-4" style={{color: '#6B7280'}}>
                While using our services, we may collect the following information:
              </p>
              <ul className="list-disc pl-6 mb-4" style={{color: '#6B7280'}}>
                <li>First and last name</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Business name and details</li>
                <li>Location information (city, state, or region)</li>
                <li>Communications or inquiries sent to us</li>
                <li>Technical data such as browser type, device ID, or IP address</li>
              </ul>
              <h3 className="text-xl font-semibold mb-3" style={{color: '#0A2540'}}>
                How We Use Your Personal Data
              </h3>
              <p className="mb-4" style={{color: '#6B7280'}}>
                GrowthLabPro may use your information for the following purposes:
              </p>
              <ul className="list-disc pl-6 mb-4" style={{color: '#6B7280'}}>
                <li>To provide, maintain, and improve our services</li>
                <li>To contact you by email, SMS, or phone for support, updates, and promotional communications</li>
                <li>To manage and respond to your requests or inquiries</li>
                <li>To analyze service performance and improve user experience</li>
                <li>To comply with legal and regulatory obligations</li>
                <li>To prevent, detect, or investigate fraud, abuse, or security incidents</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{color: '#0A2540'}}>
                Data Sharing and Disclosure
              </h2>
              <p className="mb-4" style={{color: '#6B7280'}}>
                GrowthLabPro does not sell or rent your personal information.
              </p>
              <p className="mb-4" style={{color: '#6B7280'}}>
                We may share limited information in the following cases:
              </p>
              <ul className="list-disc pl-6 mb-4" style={{color: '#6B7280'}}>
                <li><strong>Service Providers:</strong> With trusted third-party vendors (e.g., payment processors like Stripe, analytics tools like Google Analytics) who assist in operating our business.</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights, users, or property.</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, sale, or reorganization of GrowthLabPro.</li>
              </ul>
              <p style={{color: '#6B7280'}}>
                All third parties are bound by confidentiality and data protection obligations consistent with this policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{color: '#0A2540'}}>
                Security of Your Personal Data
              </h2>
              <p className="mb-4" style={{color: '#6B7280'}}>
                We use commercially reasonable safeguards to protect your data from unauthorized access, alteration, or disclosure.
              </p>
              <p style={{color: '#6B7280'}}>
                However, no online system is 100% secure. While we strive to use industry-standard measures, we cannot guarantee absolute security.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{color: '#0A2540'}}>
                Cookies and Tracking Technologies
              </h2>
              <p className="mb-4" style={{color: '#6B7280'}}>
                We may use cookies and similar technologies to enhance your browsing experience, remember preferences, and analyze traffic.
              </p>
              <p style={{color: '#6B7280'}}>
                You can disable cookies in your browser settings, but some parts of the service may not function properly as a result.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{color: '#0A2540'}}>
                Data Retention
              </h2>
              <p style={{color: '#6B7280'}}>
                We retain your personal data only as long as necessary to fulfill the purposes outlined in this policy, comply with our legal obligations, and enforce our agreements.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{color: '#0A2540'}}>
                Your Rights
              </h2>
              <p className="mb-4" style={{color: '#6B7280'}}>
                Depending on your location, you may have the right to:
              </p>
              <ul className="list-disc pl-6 mb-4" style={{color: '#6B7280'}}>
                <li>Access or request a copy of your personal data</li>
                <li>Request correction or deletion of your data</li>
                <li>Object to or restrict certain processing</li>
                <li>Opt out of marketing communications</li>
              </ul>
              <p style={{color: '#6B7280'}}>
                To exercise these rights, contact us at contact@growthlabpro.com.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{color: '#0A2540'}}>
                Changes to This Privacy Policy
              </h2>
              <p className="mb-4" style={{color: '#6B7280'}}>
                We may update this Privacy Policy periodically.
              </p>
              <p className="mb-4" style={{color: '#6B7280'}}>
                When changes are made, we will update the "Last Updated" date at the top of this page.
              </p>
              <p style={{color: '#6B7280'}}>
                Your continued use of our services after changes are posted constitutes acceptance of the revised policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{color: '#0A2540'}}>
                Contact Us
              </h2>
              <p style={{color: '#6B7280'}}>
                If you have questions about this Privacy Policy or our data practices, please contact us:
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