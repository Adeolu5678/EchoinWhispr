'use client';

import { Cookie } from 'lucide-react';

export default function CookiePolicyPage() {
  return (
    <article className="legal-document">
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
          <Cookie className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-1">Cookie Policy</h1>
          <p className="text-muted-foreground text-sm">Last updated: January 15, 2026</p>
        </div>
      </div>

      {/* What Are Cookies */}
      <section className="legal-section">
        <h2 className="legal-heading">1. What Are Cookies?</h2>
        <p className="legal-paragraph">
          Cookies are small text files placed on your device when you visit a website. They help make 
          websites work efficiently and provide useful information to site owners.
        </p>
        <p className="legal-paragraph">
          This Cookie Policy explains how EchoinWhispr (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) uses cookies and similar 
          technologies when you use our Service.
        </p>
      </section>

      {/* Types of Cookies */}
      <section className="legal-section">
        <h2 className="legal-heading">2. Types of Cookies We Use</h2>
        
        <h3 className="legal-subheading">2.1 Essential Cookies</h3>
        <p className="legal-paragraph">These cookies are necessary for the Service to function properly:</p>
        <ul className="legal-list">
          <li>User authentication and session management</li>
          <li>Security features and fraud prevention</li>
          <li>Remembering your login status</li>
          <li>Enabling access to secure areas</li>
        </ul>
        <div className="legal-notice">
          <p className="legal-paragraph">
            <strong>Note:</strong> Essential cookies cannot be disabled as they are required for the Service to operate.
          </p>
        </div>

        <h3 className="legal-subheading">2.2 Functional Cookies</h3>
        <p className="legal-paragraph">These cookies enable enhanced functionality and personalization:</p>
        <ul className="legal-list">
          <li>Remembering your preferences and settings</li>
          <li>Storing your theme preference (dark/light mode)</li>
          <li>Remembering notification settings</li>
          <li>Enabling features like auto-save for drafts</li>
        </ul>

        <h3 className="legal-subheading">2.3 Analytics Cookies</h3>
        <p className="legal-paragraph">These cookies help us understand how visitors interact with our Service:</p>
        <ul className="legal-list">
          <li>Pages visited and time spent on each page</li>
          <li>Features used and interaction patterns</li>
          <li>Error reports and performance metrics</li>
          <li>Overall usage statistics</li>
        </ul>

        <h3 className="legal-subheading">2.4 Performance Cookies</h3>
        <p className="legal-paragraph">These cookies help us improve the performance of our Service:</p>
        <ul className="legal-list">
          <li>Measuring load times and response speeds</li>
          <li>Identifying performance bottlenecks</li>
          <li>Testing new features and optimizations</li>
        </ul>
      </section>

      {/* Specific Cookies */}
      <section className="legal-section">
        <h2 className="legal-heading">3. Specific Cookies We Use</h2>
        <div className="overflow-x-auto">
          <table className="legal-table">
            <thead>
              <tr>
                <th>Cookie Name</th>
                <th>Type</th>
                <th>Purpose</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>__clerk_session</td>
                <td>Essential</td>
                <td>Authentication session management</td>
                <td>Session</td>
              </tr>
              <tr>
                <td>__clerk_db_jwt</td>
                <td>Essential</td>
                <td>Secure token for API requests</td>
                <td>Session</td>
              </tr>
              <tr>
                <td>theme</td>
                <td>Functional</td>
                <td>Stores your theme preference</td>
                <td>1 year</td>
              </tr>
              <tr>
                <td>notification_prefs</td>
                <td>Functional</td>
                <td>Stores notification preferences</td>
                <td>1 year</td>
              </tr>
              <tr>
                <td>_ga</td>
                <td>Analytics</td>
                <td>Google Analytics - distinguishes users</td>
                <td>2 years</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Third-Party Cookies */}
      <section className="legal-section">
        <h2 className="legal-heading">4. Third-Party Cookies</h2>
        <p className="legal-paragraph">Some cookies on our Service are set by third-party services we use:</p>
        
        <h3 className="legal-subheading">Clerk (Authentication)</h3>
        <p className="legal-paragraph">
          We use Clerk for secure user authentication. Clerk sets essential cookies to manage your login 
          session and maintain security.
        </p>

        <h3 className="legal-subheading">Google Analytics (Optional)</h3>
        <p className="legal-paragraph">
          We may use Google Analytics to understand how users interact with our Service. You can opt out 
          by installing the Google Analytics Opt-out Browser Add-on.
        </p>

        <h3 className="legal-subheading">Convex (Backend)</h3>
        <p className="legal-paragraph">
          Our backend services are powered by Convex, which may use cookies for session management and 
          real-time data synchronization.
        </p>
      </section>

      {/* Managing Cookies */}
      <section className="legal-section">
        <h2 className="legal-heading">5. Managing Your Cookie Preferences</h2>
        
        <h3 className="legal-subheading">Browser Settings</h3>
        <p className="legal-paragraph">Most web browsers allow you to control cookies through their settings. You can:</p>
        <ul className="legal-list">
          <li>View cookies stored on your device</li>
          <li>Delete all or specific cookies</li>
          <li>Block cookies from specific sites</li>
          <li>Block all cookies (though this may affect Service functionality)</li>
        </ul>

        <h3 className="legal-subheading">Impact of Disabling Cookies</h3>
        <p className="legal-paragraph">Please note that disabling cookies may affect certain features:</p>
        <ul className="legal-list">
          <li><strong>Without essential cookies:</strong> You won&apos;t be able to use the Service properly</li>
          <li><strong>Without functional cookies:</strong> Your preferences may not be saved between sessions</li>
          <li><strong>Without analytics cookies:</strong> We won&apos;t be able to improve the Service based on usage patterns</li>
        </ul>
      </section>

      {/* Local Storage */}
      <section className="legal-section">
        <h2 className="legal-heading">6. Similar Technologies</h2>
        <p className="legal-paragraph">In addition to cookies, we may use similar technologies:</p>
        
        <h3 className="legal-subheading">Local Storage</h3>
        <p className="legal-paragraph">Local storage allows us to store data locally on your browser. We use it to:</p>
        <ul className="legal-list">
          <li>Cache certain data to improve performance</li>
          <li>Store draft messages temporarily</li>
          <li>Remember UI state and preferences</li>
        </ul>

        <h3 className="legal-subheading">Session Storage</h3>
        <p className="legal-paragraph">
          Session storage is similar to local storage but is cleared when you close your browser. We use 
          it for temporary data that should not persist between sessions.
        </p>
      </section>

      {/* Updates */}
      <section className="legal-section">
        <h2 className="legal-heading">7. Updates to This Cookie Policy</h2>
        <p className="legal-paragraph">
          We may update this Cookie Policy from time to time to reflect changes in our practices or for 
          legal, operational, or regulatory reasons. We will post any changes on this page and update 
          the &quot;Last updated&quot; date.
        </p>
      </section>

      {/* Contact */}
      <section className="legal-section">
        <h2 className="legal-heading">8. Contact Us</h2>
        <p className="legal-paragraph">
          If you have any questions about our use of cookies or this Cookie Policy, please contact us:
        </p>
        <div className="legal-contact-box">
          <p><strong>Email:</strong> privacy@echoinwhispr.com</p>
          <p><strong>Subject:</strong> Cookie Policy Inquiry</p>
        </div>
      </section>
    </article>
  );
}
