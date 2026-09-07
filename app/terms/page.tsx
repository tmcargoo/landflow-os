import Link from 'next/link'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">LF</span>
          </div>
          <span className="font-semibold text-gray-900">LandFlow OS</span>
        </Link>
        <Link href="/login" className="text-sm text-gray-500 hover:text-gray-900">Log In</Link>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: September 6, 2026</p>

        <div className="prose prose-gray max-w-none space-y-8 text-sm text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">1. Agreement to Terms</h2>
            <p>These Terms of Service ("Terms") govern your access to and use of LandFlow OS, a software-as-a-service platform operated by Pan American Developers and Investors Inc. ("Company," "we," "us," or "our"), a corporation organized under the laws of the State of Maryland. By accessing or using LandFlow OS, you agree to be bound by these Terms. If you do not agree, do not use the service.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">2. Description of Service</h2>
            <p>LandFlow OS is a workflow and decision-support platform for real estate investors. Features include lead pipeline management, AI-powered deal analysis, skip tracing, offer letter generation, and mail merge export. The service is provided on a subscription basis.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">3. Subscriptions and Billing</h2>
            <p>LandFlow OS is offered on a monthly subscription basis. Subscription fees are billed in advance on a monthly cycle. All fees are non-refundable except as required by law. We reserve the right to change pricing with 30 days notice to active subscribers. Your subscription will automatically renew unless cancelled before the renewal date.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">4. Account Responsibilities</h2>
            <p>You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. You must notify us immediately of any unauthorized use of your account. You may not share your account credentials with others or allow multiple users to access the service under a single account.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">5. Acceptable Use</h2>
            <p>You agree to use LandFlow OS only for lawful purposes and in accordance with these Terms. You may not use the service to violate any applicable laws or regulations, including those related to telemarketing, data privacy, and consumer protection. You are solely responsible for ensuring your use of skip tracing and contact data complies with the Telephone Consumer Protection Act (TCPA), the Do Not Call Registry rules, and all other applicable laws.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">6. Skip Tracing and Contact Data</h2>
            <p>LandFlow OS provides skip tracing services through third-party data providers. We do not guarantee the accuracy, completeness, or legality of any contact information returned by skip tracing. You are solely responsible for how you use any contact information obtained through the service, including compliance with DNC registry requirements, TCPA regulations, and all applicable federal and state laws governing outreach to property owners.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">7. AI-Generated Content</h2>
            <p>LandFlow OS uses artificial intelligence to assist with deal analysis and document generation. AI-generated content, including offer letters and deal assessments, is provided for informational purposes only and does not constitute legal or financial advice. You should consult qualified legal and financial professionals before acting on any AI-generated content. We are not responsible for any decisions made based on AI-generated output.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">8. Intellectual Property</h2>
            <p>LandFlow OS and its original content, features, and functionality are owned by Pan American Developers and Investors Inc. and are protected by applicable intellectual property laws. You may not copy, modify, distribute, or create derivative works based on our service without our express written permission.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">9. Data and Privacy</h2>
            <p>Your use of LandFlow OS is also governed by our Privacy Policy, which is incorporated into these Terms by reference. By using the service, you consent to our collection and use of your data as described in the Privacy Policy.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">10. Disclaimer of Warranties</h2>
            <p>LandFlow OS is provided "as is" and "as available" without warranties of any kind, either express or implied. We do not warrant that the service will be uninterrupted, error-free, or free of harmful components. We do not warrant the accuracy or completeness of any data provided through the service.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">11. Limitation of Liability</h2>
            <p>To the maximum extent permitted by law, Pan American Developers and Investors Inc. shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of LandFlow OS. Our total liability to you for any claims arising from these Terms or your use of the service shall not exceed the amount you paid us in the three months preceding the claim.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">12. Termination</h2>
            <p>We reserve the right to suspend or terminate your access to LandFlow OS at any time, with or without cause, with or without notice. You may cancel your subscription at any time through your account settings. Upon termination, your right to use the service ceases immediately.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">13. Governing Law</h2>
            <p>These Terms shall be governed by and construed in accordance with the laws of the State of Maryland, without regard to its conflict of law provisions. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts located in Maryland.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">14. Changes to Terms</h2>
            <p>We reserve the right to modify these Terms at any time. We will notify active subscribers of material changes by email or through the platform. Your continued use of the service after changes take effect constitutes your acceptance of the revised Terms.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">15. Contact Us</h2>
            <p>If you have questions about these Terms, please contact us at:</p>
            <p className="mt-2">Pan American Developers and Investors Inc.<br />Maryland, USA<br />support@panad.org</p>
          </section>

        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 flex gap-4 text-sm text-gray-500">
          <Link href="/privacy" className="hover:text-gray-900">Privacy Policy</Link>
          <Link href="/login" className="hover:text-gray-900">Log In</Link>
        </div>
      </div>
    </div>
  )
}