import { Shield } from 'lucide-react';
import { LEGAL_LAST_UPDATED } from '../constants';

export default function PrivacyPolicyPage() {
  return (
    <article className="legal-document">
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
          <Shield className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-1">Privacy Policy</h1>
          <p className="text-muted-foreground text-sm">Last updated: {LEGAL_LAST_UPDATED}</p>
        </div>
      </div>

      {/* Introduction */}
      <section className="legal-section">
        <h2 className="legal-heading">1. Introduction</h2>
        <p className="legal-paragraph">
          EchoinWhispr (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy 
          explains how we collect, use, disclose, and safeguard your information when you use our anonymous 
          messaging platform (the &quot;Service&quot;).
        </p>
        <p className="legal-paragraph">
          Please read this Privacy Policy carefully. By using the Service, you consent to the practices 
          described in this policy.
        </p>
      </section>

      {/* Information We Collect */}
      <section className="legal-section">
        <h2 className="legal-heading">2. Information We Collect</h2>
        
        <h3 className="legal-subheading">2.1 Information You Provide</h3>
        <p className="legal-paragraph">We collect information you provide directly to us, including:</p>
        <ul className="legal-list">
          <li><strong>Account Information:</strong> When you register, we collect your email address, username (display name), and password.</li>
          <li><strong>Profile Information:</strong> Optional information such as your avatar, bio, and resonance preferences.</li>
          <li><strong>User Content:</strong> Whispers, Echoes, Chamber messages, and other content you create on the platform.</li>
          <li><strong>Communications:</strong> When you contact us for support or feedback.</li>
        </ul>

        <h3 className="legal-subheading">2.2 Information Collected Automatically</h3>
        <p className="legal-paragraph">When you use the Service, we automatically collect:</p>
        <ul className="legal-list">
          <li><strong>Usage Data:</strong> Pages visited, features used, time spent on the platform, and interaction patterns.</li>
          <li><strong>Device Information:</strong> Device type, operating system, browser type, IP address, and unique device identifiers.</li>
          <li><strong>Log Data:</strong> Access times, error logs, and referring URLs.</li>
          <li><strong>Cookies:</strong> See our Cookie Policy for more details.</li>
        </ul>

        <h3 className="legal-subheading">2.3 Information from Third Parties</h3>
        <p className="legal-paragraph">We may receive information about you from:</p>
        <ul className="legal-list">
          <li><strong>Authentication Providers:</strong> If you sign in using Clerk, we receive your email and basic profile information.</li>
          <li><strong>Analytics Partners:</strong> Aggregated usage statistics and demographic data.</li>
        </ul>
      </section>

      {/* How We Use Information */}
      <section className="legal-section">
        <h2 className="legal-heading">3. How We Use Your Information</h2>
        <p className="legal-paragraph">We use the information we collect to:</p>
        <ul className="legal-list">
          <li>Provide, maintain, and improve the Service</li>
          <li>Create and manage your account</li>
          <li>Process and deliver Whispers and Echoes</li>
          <li>Enable anonymous communication features</li>
          <li>Provide customer support and respond to inquiries</li>
          <li>Send service-related notifications and updates</li>
          <li>Detect, prevent, and address fraud, abuse, and security issues</li>
          <li>Enforce our Terms of Service and Community Guidelines</li>
          <li>Analyze usage patterns to improve user experience</li>
          <li>Comply with legal obligations</li>
        </ul>
      </section>

      {/* Anonymity and Privacy */}
      <section className="legal-section">
        <h2 className="legal-heading">4. Anonymity and Your Privacy</h2>
        <p className="legal-paragraph">
          EchoinWhispr is designed to protect your anonymity in communications with other users. Here&apos;s 
          how we protect your identity:
        </p>
        <ul className="legal-list">
          <li><strong>Anonymous Whispers:</strong> Recipients cannot see who sent a Whisper until you choose to reveal your identity.</li>
          <li><strong>Chamber Anonymity:</strong> Your identity may be visible or hidden depending on Chamber settings.</li>
          <li><strong>No Public User Lists:</strong> We do not display lists of all users publicly.</li>
        </ul>
        <div className="legal-notice">
          <p className="legal-paragraph font-medium">
            <strong>Important:</strong> While we protect your anonymity from other users, we maintain records 
            of your account and activity. We may be required to disclose this information in response to valid 
            legal processes.
          </p>
        </div>
      </section>

      {/* Information Sharing */}
      <section className="legal-section">
        <h2 className="legal-heading">5. How We Share Your Information</h2>
        <p className="legal-paragraph">We do not sell your personal information. We may share your information in the following circumstances:</p>
        
        <h3 className="legal-subheading">5.1 With Your Consent</h3>
        <p className="legal-paragraph">When you explicitly agree to share information with specific parties.</p>

        <h3 className="legal-subheading">5.2 Service Providers</h3>
        <p className="legal-paragraph">With trusted third-party service providers who assist us in operating the Service, including:</p>
        <ul className="legal-list">
          <li>Cloud hosting providers (for data storage)</li>
          <li>Authentication services (Clerk)</li>
          <li>Analytics providers</li>
          <li>Customer support tools</li>
        </ul>

        <h3 className="legal-subheading">5.3 Legal Requirements</h3>
        <p className="legal-paragraph">When required by law or in response to valid legal processes, including:</p>
        <ul className="legal-list">
          <li>Court orders and subpoenas</li>
          <li>Law enforcement requests</li>
          <li>Legal proceedings</li>
        </ul>

        <h3 className="legal-subheading">5.4 Safety and Security</h3>
        <p className="legal-paragraph">When necessary to protect the safety, rights, or property of EchoinWhispr, our users, or the public.</p>
      </section>

      {/* Data Retention */}
      <section className="legal-section">
        <h2 className="legal-heading">6. Data Retention</h2>
        <p className="legal-paragraph">We retain your information for as long as necessary to:</p>
        <ul className="legal-list">
          <li>Provide the Service to you</li>
          <li>Comply with legal obligations</li>
          <li>Resolve disputes and enforce agreements</li>
          <li>Support business operations</li>
        </ul>
        <p className="legal-paragraph">
          <strong>Message Retention:</strong> Whispers and messages may be retained for a limited period 
          to enable features like Echo responses. Expired or deleted messages are removed according to our data retention schedules.
        </p>
        <p className="legal-paragraph">
          <strong>Account Deletion:</strong> When you delete your account, we will delete or anonymize your 
          personal information within 30 days, except where retention is required by law.
        </p>
      </section>

      {/* Your Rights */}
      <section className="legal-section">
        <h2 className="legal-heading">7. Your Rights and Choices</h2>
        <p className="legal-paragraph">Depending on your location, you may have the following rights:</p>
        
        <h3 className="legal-subheading">7.1 Access and Portability</h3>
        <p className="legal-paragraph">You can request a copy of your personal data in a portable format.</p>

        <h3 className="legal-subheading">7.2 Correction</h3>
        <p className="legal-paragraph">You can update or correct inaccurate personal information through your account settings.</p>

        <h3 className="legal-subheading">7.3 Deletion</h3>
        <p className="legal-paragraph">You can request deletion of your account and associated data.</p>

        <h3 className="legal-subheading">7.4 Opt-Out</h3>
        <p className="legal-paragraph">You can opt out of non-essential communications and certain data collection practices.</p>

        <div className="legal-contact-box">
          <p>To exercise these rights, please contact us at <strong>privacy@echoinwhispr.com</strong></p>
        </div>
      </section>

      {/* Security */}
      <section className="legal-section">
        <h2 className="legal-heading">8. Data Security</h2>
        <p className="legal-paragraph">
          We implement appropriate technical and organizational measures to protect your personal information, including:
        </p>
        <ul className="legal-list">
          <li>Encryption of data in transit and at rest</li>
          <li>Secure authentication through Clerk</li>
          <li>Regular security assessments and audits</li>
          <li>Access controls and employee training</li>
          <li>Incident response procedures</li>
        </ul>
        <p className="legal-paragraph">
          However, no method of transmission over the Internet or electronic storage is 100% secure. 
          We cannot guarantee absolute security of your data.
        </p>
      </section>

      {/* Children's Privacy */}
      <section className="legal-section">
        <h2 className="legal-heading">9. Children&apos;s Privacy</h2>
        <p className="legal-paragraph">
          EchoinWhispr is not intended for users under 18 years of age. We do not knowingly collect 
          personal information from children under 18.
        </p>
        <p className="legal-paragraph">
          If we become aware that we have collected personal information from a child under 18, we will 
          take steps to delete that information promptly.
        </p>
      </section>

      {/* Changes to Policy */}
      <section className="legal-section">
        <h2 className="legal-heading">10. Changes to This Privacy Policy</h2>
        <p className="legal-paragraph">
          We may update this Privacy Policy from time to time. We will notify you of any material changes by:
        </p>
        <ul className="legal-list">
          <li>Posting the new Privacy Policy on this page</li>
          <li>Updating the &quot;Last updated&quot; date</li>
          <li>Sending you an email notification for significant changes</li>
        </ul>
      </section>

      {/* Contact */}
      <section className="legal-section">
        <h2 className="legal-heading">11. Contact Us</h2>
        <p className="legal-paragraph">
          If you have any questions or concerns about this Privacy Policy or our data practices, please contact us:
        </p>
        <div className="legal-contact-box">
          <p><strong>Email:</strong> privacy@echoinwhispr.com</p>
          <p><strong>Legal Inquiries:</strong> legal@echoinwhispr.com</p>
          <p><strong>Data Protection Officer (EU/EEA):</strong> dpo@echoinwhispr.com</p>
        </div>
      </section>
    </article>
  );
}
