import Link from 'next/link'

export default function PrivacyPage() {
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: September 6, 2026</p>

        <div className="prose prose-gray max-w-none space-y-8 text-sm text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">1. Introduction</h2>
            <p>Pan American Developers and Investors Inc. ("Company," "we," "us," or "our") operates LandFlow OS. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform. Please read this policy carefully. If you disagree with its terms, please discontinue use of the service.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">2. Information We Collect</h2>
            <p>We collect information you provide directly to us, including:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Account information: name, email address, and password when you register</li>
              <li>Company profile information: company name, address, phone, and email</li>
              <li>Lead data: property and owner information you upload via CSV files</li>
              <li>Usage data: how you interact with features of the platform</li>
              <li>Feedback and communications: messages, ratings, and comments you submit</li>
              <li>Payment information: processed securely through Stripe; we do not store card numbers</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">3. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Provide, operate, and maintain LandFlow OS</li>
              <li>Process your subscription and payments</li>
              <li>Send administrative communications about your account</li>
              <li>Respond to your comments and questions</li>
              <li>Improve and develop new features based on usage patterns and feedback</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">4. Lead Data You Upload</h2>
            <p>Property and owner information you upload to LandFlow OS is your data. We store it securely in your account and use it solely to provide the service to you. We do not sell, share, or use your lead data for any purpose other than operating the platform features you use. Each subscriber's data is isolated and inaccessible to other subscribers.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">5. Skip Tracing Data</h2>
            <p>When you use the skip tracing feature, property addresses are sent to our third-party skip tracing provider (Tracerfy) to retrieve owner contact information. Results returned are stored in your account. We do not control the data practices of third-party providers and encourage you to review their privacy policies. You are responsible for using any contact information obtained in compliance with applicable law.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">6. Third-Party Services</h2>
            <p>LandFlow OS integrates with the following third-party services to operate:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Supabase</strong> — database and authentication hosting</li>
              <li><strong>Vercel</strong> — application hosting and deployment</li>
              <li><strong>Stripe</strong> — payment processing</li>
              <li><strong>Anthropic</strong> — AI-powered deal analysis and document generation</li>
              <li><strong>Tracerfy</strong> — skip tracing data</li>
            </ul>
            <p className="mt-2">Each of these providers has their own privacy policy governing their use of data.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">7. Data Security</h2>
            <p>We implement appropriate technical and organizational measures to protect your information against unauthorized access, alteration, disclosure, or destruction. All data is encrypted in transit using TLS. Access to subscriber data is controlled through Row Level Security enforced at the database level. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">8. Data Retention</h2>
            <p>We retain your account information and lead data for as long as your account is active. If you cancel your subscription, your data remains accessible for 90 days, after which it may be permanently deleted. You may request deletion of your data at any time by contacting us.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">9. Your Rights</h2>
            <p>You have the right to access, correct, or delete your personal information at any time. You may update your account information through the Settings page. To request deletion of your account and associated data, contact us at the email below. We will respond to all requests within 30 days.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">10. Children's Privacy</h2>
            <p>LandFlow OS is not directed to children under the age of 18. We do not knowingly collect personal information from children. If you become aware that a child has provided us with personal information, please contact us and we will take steps to delete such information.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">11. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date. Your continued use of the service after changes take effect constitutes your acceptance of the revised policy.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">12. Contact Us</h2>
            <p>If you have questions about this Privacy Policy or our data practices, please contact us at:</p>
            <p className="mt-2">Pan American Developers and Investors Inc.<br />Maryland, USA<br />support@panad.org</p>
          </section>

        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 flex gap-4 text-sm text-gray-500">
          <Link href="/terms" className="hover:text-gray-900">Terms of Service</Link>
          <Link href="/login" className="hover:text-gray-900">Log In</Link>
        </div>
      </div>
    </div>
  )
}