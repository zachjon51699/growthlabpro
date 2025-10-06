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
                GrowthLabPro Terms & Conditions
              </h2>
              <p style={{color: '#6B7280'}}>
                These Terms and Conditions apply to all services, automations, and SMS messages sent or received as part of GrowthLabPro's contractor marketing platform. Your use of this service constitutes acceptance of these terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{color: '#0A2540'}}>
                SMS Disclosure
              </h2>
              <p className="mb-4" style={{color: '#6B7280'}}>
                By opting in to GrowthLabPro's SMS services, you agree to receive text messages related to notifications, account updates, marketing offers, and other service-related communications.
              </p>
              <p className="mb-4" style={{color: '#6B7280'}}>
                Message frequency may vary depending on your usage.
              </p>
              <p className="mb-4" style={{color: '#6B7280'}}>
                Standard message & data rates apply according to your mobile carrier's terms.
              </p>
              <p className="mb-4" style={{color: '#6B7280'}}>
                To opt out of SMS communications at any time, reply STOP to any message you receive. For assistance, reply HELP or contact us directly at contact@growthlabpro.com.
              </p>
              <p style={{color: '#6B7280'}}>
                For more information on data handling, please refer to our{' '}
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
                Messaging Consent
              </h2>
              <p style={{color: '#6B7280'}}>
                By using our platform, you explicitly consent to receive communications from GrowthLabPro. Consent can be granted through website opt-ins, forms, live interactions, or verbal agreements during customer onboarding.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{color: '#0A2540'}}>
                Message Types and Frequency
              </h2>
              <p className="mb-4" style={{color: '#6B7280'}}>
                Messages sent by GrowthLabPro may include service alerts, updates, reminders, promotional offers, and account notifications.
              </p>
              <p style={{color: '#6B7280'}}>
                Message frequency will vary based on your activity and engagement with the platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{color: '#0A2540'}}>
                Data Rates and Charges
              </h2>
              <p style={{color: '#6B7280'}}>
                Standard message and data rates apply to all texts sent or received. Charges depend on your mobile carrier's plan and are not the responsibility of GrowthLabPro.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{color: '#0A2540'}}>
                Opt-Out Instructions
              </h2>
              <p className="mb-4" style={{color: '#6B7280'}}>
                You may opt out of receiving text messages at any time by replying STOP to any message.
              </p>
              <p style={{color: '#6B7280'}}>
                Opting out removes you from all SMS communications, including important service updates.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{color: '#0A2540'}}>
                Message Delivery
              </h2>
              <p style={{color: '#6B7280'}}>
                GrowthLabPro does not guarantee that SMS or email messages will be delivered without delay or failure. Message issues may arise from carrier outages, network errors, or device compatibility issues.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{color: '#0A2540'}}>
                User Obligations
              </h2>
              <p className="mb-4" style={{color: '#6B7280'}}>
                By using our platform, you agree to:
              </p>
              <ul className="list-disc pl-6" style={{color: '#6B7280'}}>
                <li>Abide by all applicable laws and communication regulations.</li>
                <li>Use the system responsibly and avoid sending messages that are unlawful, harassing, or misleading.</li>
                <li>Obtain consent from your own contacts before sending messages through GrowthLabPro automations.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{color: '#0A2540'}}>
                Compliance with Laws
              </h2>
              <p style={{color: '#6B7280'}}>
                You acknowledge that all communications must comply with the Telephone Consumer Protection Act (TCPA), CAN-SPAM Act, and any other relevant federal or state regulations. GrowthLabPro is not responsible for violations arising from your misuse of the platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{color: '#0A2540'}}>
                Subscription Plans and Billing
              </h2>
              <p className="mb-4" style={{color: '#6B7280'}}>
                GrowthLabPro offers two primary subscription plans:
              </p>
              <ul className="list-disc pl-6 mb-4" style={{color: '#6B7280'}}>
                <li><strong>$297/month:</strong> Includes a fully built website (up to 20 pages), access to the GrowthLabPro platform, CRM, automations, missed call text back, automated Google review system, and marketing campaign templates.</li>
                <li><strong>$750/month:</strong> Includes all features from the $297 plan, plus full management and optimization of Google Local Service Ads.</li>
              </ul>
              <p style={{color: '#6B7280'}}>
                Subscriptions are available on a month-to-month basis or as a prepaid 3-month term, which includes a complimentary Google Business Profile optimization (valued at $400).
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{color: '#0A2540'}}>
                Advance Payment & Auto-Renewal
              </h2>
              <p className="mb-4" style={{color: '#6B7280'}}>
                All subscriptions are billed in advance and automatically renewed until canceled.
              </p>
              <p style={{color: '#6B7280'}}>
                Payment is securely processed via Stripe using a valid credit or debit card.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{color: '#0A2540'}}>
                Usage-Based Charges (Rebillable Costs)
              </h2>
              <p className="mb-4" style={{color: '#6B7280'}}>
                Certain services may incur additional usage-based costs, including phone number fees, SMS/MMS messaging, or call usage. Current rates are:
              </p>
              <ul className="list-disc pl-6 mb-4" style={{color: '#6B7280'}}>
                <li>Local Numbers: $1.15/month</li>
                <li>Toll-Free Numbers: $2.15/month</li>
                <li>SMS (US/Canada): $0.0079/segment (inbound/outbound)</li>
                <li>MMS (US/Canada): $0.02 outbound | $0.01–$0.02 inbound</li>
                <li>Voice Calls: $0.0180/min outbound | $0.0085–$0.0220/min inbound</li>
              </ul>
              <p style={{color: '#6B7280'}}>
                These fees are automatically billed as part of your subscription.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{color: '#0A2540'}}>
                Wallet Balance and Auto Top-Up
              </h2>
              <p className="mb-4" style={{color: '#6B7280'}}>
                Clients maintain a digital wallet balance to cover usage-based charges.
              </p>
              <p style={{color: '#6B7280'}}>
                When your wallet reaches a low balance, it will automatically top up based on your preferred settings.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{color: '#0A2540'}}>
                No Refund Policy
              </h2>
              <p style={{color: '#6B7280'}}>
                All payments made to GrowthLabPro are final and non-refundable, including subscription fees and usage charges. Because services begin immediately and are custom-configured, they cannot be reversed once initiated.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{color: '#0A2540'}}>
                Chargebacks Are Not Permitted
              </h2>
              <p className="mb-4" style={{color: '#6B7280'}}>
                By subscribing, you agree not to initiate chargebacks for services rendered.
              </p>
              <p style={{color: '#6B7280'}}>
                Fraudulent chargebacks will result in account termination, and GrowthLabPro reserves the right to pursue recovery for outstanding balances and legal costs.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{color: '#0A2540'}}>
                Cancellation Terms
              </h2>
              <p className="mb-4" style={{color: '#6B7280'}}>
                You may cancel your subscription at any time. Cancellation becomes effective on your next billing cycle, and no future charges will be made beyond that date. Early cancellation does not entitle you to a refund for the unused portion of a prepaid term.
              </p>
              <p className="mb-4" style={{color: '#6B7280'}}>
                Upon cancellation:
              </p>
              <ul className="list-disc pl-6 mb-4" style={{color: '#6B7280'}}>
                <li>Access to your website, automations, CRM, and platform features will be suspended.</li>
                <li>All systems, assets, and automations remain the property of GrowthLabPro.</li>
                <li>Domain names purchased directly by you remain your property.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{color: '#0A2540'}}>
                Delivery of Services
              </h2>
              <p className="mb-4" style={{color: '#6B7280'}}>
                Services are considered rendered and fulfilled once:
              </p>
              <ul className="list-disc pl-6 mb-4" style={{color: '#6B7280'}}>
                <li>Your website has been completed and delivered.</li>
                <li>Your CRM, automations, and platform setup are finalized.</li>
              </ul>
              <p style={{color: '#6B7280'}}>
                Support or onboarding assistance may be provided but is not a prerequisite for fulfillment.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{color: '#0A2540'}}>
                Free Trials and Promotions
              </h2>
              <p className="mb-4" style={{color: '#6B7280'}}>
                GrowthLabPro may occasionally offer free trials or discounts. During any trial period, setup may be limited.
              </p>
              <p className="mb-4" style={{color: '#6B7280'}}>
                Full service delivery occurs once billing begins.
              </p>
              <p style={{color: '#6B7280'}}>
                Discounted promotions do not alter these Terms and Conditions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{color: '#0A2540'}}>
                Payment Failures and Service Suspension
              </h2>
              <p className="mb-4" style={{color: '#6B7280'}}>
                If a payment fails, we will attempt up to four (4) retries over three weeks.
              </p>
              <p style={{color: '#6B7280'}}>
                If unpaid after 48 hours from the first failed attempt, your account and access will be suspended until the balance is paid in full.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{color: '#0A2540'}}>
                Consent and Agreement
              </h2>
              <p className="mb-4" style={{color: '#6B7280'}}>
                By subscribing to GrowthLabPro or checking the agreement box at checkout, you confirm that:
              </p>
              <ul className="list-disc pl-6 mb-4" style={{color: '#6B7280'}}>
                <li>You have read, understood, and agree to these Terms & Conditions.</li>
                <li>You accept our No Refund Policy.</li>
                <li>You waive the right to initiate chargebacks for services rendered.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{color: '#0A2540'}}>
                Changes to Terms and Conditions
              </h2>
              <p className="mb-4" style={{color: '#6B7280'}}>
                GrowthLabPro reserves the right to update these Terms and Conditions at any time.
              </p>
              <p className="mb-4" style={{color: '#6B7280'}}>
                Changes will be communicated through our website or direct notice to clients.
              </p>
              <p style={{color: '#6B7280'}}>
                Continued use of our services constitutes acceptance of the revised Terms.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
export default TermsOfService;