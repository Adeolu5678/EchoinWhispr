export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24 pb-12 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <div className="prose prose-invert prose-indigo max-w-none">
          <p className="text-lg text-slate-400 mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">1. Agreement to Terms</h2>
            <p className="text-slate-400">
              By accessing or using VentureDeck, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">2. User Accounts</h2>
            <p className="text-slate-400 mb-4">
              When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">3. Intellectual Property</h2>
            <p className="text-slate-400 mb-4">
              The Service and its original content (excluding Content provided by users), features, and functionality are and will remain the exclusive property of VentureDeck and its licensors.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">4. User Content</h2>
            <p className="text-slate-400 mb-4">
              Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material ("Content"). You are responsible for the Content that you post to the Service, including its legality, reliability, and appropriateness.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">5. Termination</h2>
            <p className="text-slate-400">
              We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">6. Contact Us</h2>
            <p className="text-slate-400">
              If you have any questions about these Terms, please contact us at <a href="mailto:legal@venturedeck.com" className="text-indigo-400 hover:underline">legal@venturedeck.com</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
