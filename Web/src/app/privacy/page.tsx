export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24 pb-12 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <div className="prose prose-invert prose-indigo max-w-none">
          <p className="text-lg text-slate-400 mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">1. Introduction</h2>
            <p className="text-slate-400">
              VentureDeck ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">2. Information We Collect</h2>
            <p className="text-slate-400 mb-4">
              We collect information that you provide directly to us when you register, create a profile, or communicate with us. This may include:
            </p>
            <ul className="list-disc pl-6 text-slate-400 space-y-2">
              <li>Personal identification information (Name, email address, phone number)</li>
              <li>Professional information (Resume, LinkedIn profile, skills)</li>
              <li>Project details (Pitch decks, business plans)</li>
              <li>Financial information (for accredited investors)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">3. How We Use Your Information</h2>
            <p className="text-slate-400 mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 text-slate-400 space-y-2">
              <li>Provide, operate, and maintain our platform</li>
              <li>Match entrepreneurs with investors and talent</li>
              <li>Verify identities and credentials to build trust</li>
              <li>Send you updates, security alerts, and support messages</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">4. Data Security</h2>
            <p className="text-slate-400">
              We implement appropriate technical and organizational security measures to protect your personal information. However, please note that no method of transmission over the Internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">5. Contact Us</h2>
            <p className="text-slate-400">
              If you have any questions about this Privacy Policy, please contact us at <a href="mailto:privacy@venturedeck.com" className="text-indigo-400 hover:underline">privacy@venturedeck.com</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
