'use client';

import { FileText } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <article className="legal-document">
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
          <FileText className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-1">Terms of Service</h1>
          <p className="text-muted-foreground text-sm">Last updated: January 15, 2026</p>
        </div>
      </div>

      {/* Introduction */}
      <section className="legal-section">
        <h2 className="legal-heading">1. Introduction</h2>
        <p className="legal-paragraph">
          Welcome to EchoinWhispr (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). These Terms of Service (&quot;Terms&quot;) govern 
          your access to and use of the EchoinWhispr platform, including our website, mobile applications, 
          and all related services (collectively, the &quot;Service&quot;).
        </p>
        <p className="legal-paragraph">
          By accessing or using our Service, you agree to be bound by these Terms. If you do not agree 
          to these Terms, please do not use our Service.
        </p>
      </section>

      {/* Eligibility */}
      <section className="legal-section">
        <h2 className="legal-heading">2. Eligibility</h2>
        <p className="legal-paragraph">To use EchoinWhispr, you must:</p>
        <ul className="legal-list">
          <li>Be at least 18 years of age, or the age of majority in your jurisdiction</li>
          <li>Have the legal capacity to enter into a binding agreement</li>
          <li>Not be prohibited from using the Service under applicable laws</li>
          <li>Not have been previously banned or suspended from the Service</li>
        </ul>
        <p className="legal-paragraph">
          By using the Service, you represent and warrant that you meet all eligibility requirements.
        </p>
      </section>

      {/* Account Registration */}
      <section className="legal-section">
        <h2 className="legal-heading">3. Account Registration</h2>
        <p className="legal-paragraph">
          To access certain features of the Service, you must create an account. When creating an account, you agree to:
        </p>
        <ul className="legal-list">
          <li>Provide accurate, current, and complete information</li>
          <li>Maintain and promptly update your account information</li>
          <li>Maintain the security of your account credentials</li>
          <li>Accept responsibility for all activities under your account</li>
          <li>Notify us immediately of any unauthorized use of your account</li>
        </ul>
        <p className="legal-paragraph">
          We reserve the right to suspend or terminate accounts that violate these Terms or for any other reason 
          at our sole discretion.
        </p>
      </section>

      {/* Anonymous Messaging */}
      <section className="legal-section">
        <h2 className="legal-heading">4. Anonymous Messaging</h2>
        <p className="legal-paragraph">
          EchoinWhispr provides a platform for anonymous communication through &quot;Whispers&quot; and &quot;Echoes.&quot; 
          While we protect your anonymity to other users, you acknowledge that:
        </p>
        <ul className="legal-list">
          <li>Your identity is known to us through your account registration</li>
          <li>We may be required to disclose user information in response to valid legal processes</li>
          <li>Anonymity does not exempt you from responsibility for your communications</li>
          <li>We reserve the right to reveal user identity in cases of illegal activity or Terms violations</li>
        </ul>
      </section>

      {/* Acceptable Use */}
      <section className="legal-section">
        <h2 className="legal-heading">5. Acceptable Use Policy</h2>
        <p className="legal-paragraph">You agree to use the Service only for lawful purposes. You shall not:</p>
        <ul className="legal-list">
          <li>Post content that is illegal, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable</li>
          <li>Engage in harassment, bullying, or intimidation of other users</li>
          <li>Impersonate any person or entity, or falsely represent your affiliation</li>
          <li>Post spam, unsolicited advertisements, or promotional materials</li>
          <li>Transmit viruses, malware, or any other harmful code</li>
          <li>Attempt to gain unauthorized access to any portion of the Service</li>
          <li>Interfere with or disrupt the Service or servers connected to the Service</li>
          <li>Collect or store personal data about other users without their consent</li>
          <li>Use the Service for any commercial purpose without our express written consent</li>
          <li>Encourage or incite violence against any individual or group</li>
          <li>Share content depicting minors in any inappropriate context</li>
        </ul>
      </section>

      {/* Chambers */}
      <section className="legal-section">
        <h2 className="legal-heading">6. Chambers (Group Spaces)</h2>
        <p className="legal-paragraph">
          EchoinWhispr offers group communication spaces called &quot;Chambers.&quot; When creating or participating in Chambers:
        </p>
        <ul className="legal-list">
          <li>Chamber creators are responsible for moderating content within their Chambers</li>
          <li>All Chamber content must comply with these Terms and our Community Guidelines</li>
          <li>We reserve the right to remove Chambers that violate our policies</li>
          <li>Chamber participants must respect the rules set by Chamber moderators</li>
        </ul>
      </section>

      {/* User Content */}
      <section className="legal-section">
        <h2 className="legal-heading">7. User Content</h2>
        <p className="legal-paragraph">
          You retain ownership of content you submit to the Service (&quot;User Content&quot;). By submitting User Content, 
          you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and display 
          such content solely for the purpose of operating and improving the Service.
        </p>
        <p className="legal-paragraph">You represent and warrant that:</p>
        <ul className="legal-list">
          <li>You own or have the necessary rights to your User Content</li>
          <li>Your User Content does not infringe on the rights of any third party</li>
          <li>Your User Content complies with these Terms and all applicable laws</li>
        </ul>
      </section>

      {/* Intellectual Property */}
      <section className="legal-section">
        <h2 className="legal-heading">8. Intellectual Property</h2>
        <p className="legal-paragraph">
          The Service and its original content (excluding User Content), features, and functionality are 
          owned by EchoinWhispr and are protected by international copyright, trademark, patent, trade secret, 
          and other intellectual property laws.
        </p>
        <p className="legal-paragraph">
          You may not copy, modify, distribute, sell, or lease any part of the Service without our express 
          written permission.
        </p>
      </section>

      {/* Privacy */}
      <section className="legal-section">
        <h2 className="legal-heading">9. Privacy</h2>
        <p className="legal-paragraph">
          Your use of the Service is also governed by our Privacy Policy, which is incorporated into these 
          Terms by reference. Please review our Privacy Policy to understand how we collect, use, and protect 
          your information.
        </p>
      </section>

      {/* Termination */}
      <section className="legal-section">
        <h2 className="legal-heading">10. Termination</h2>
        <p className="legal-paragraph">
          We may terminate or suspend your account and access to the Service immediately, without prior notice 
          or liability, for any reason, including:
        </p>
        <ul className="legal-list">
          <li>Violation of these Terms</li>
          <li>Engagement in illegal activity</li>
          <li>Harmful behavior towards other users</li>
          <li>At our sole discretion for any other reason</li>
        </ul>
        <p className="legal-paragraph">
          Upon termination, your right to use the Service will immediately cease. All provisions of these 
          Terms that by their nature should survive termination shall survive.
        </p>
      </section>

      {/* Disclaimers */}
      <section className="legal-section">
        <h2 className="legal-heading">11. Disclaimers</h2>
        <div className="legal-notice">
          <p className="legal-paragraph font-medium uppercase text-sm tracking-wide">
            THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS 
            OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A 
            PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
          </p>
        </div>
        <p className="legal-paragraph mt-4">We do not warrant that:</p>
        <ul className="legal-list">
          <li>The Service will be uninterrupted, secure, or error-free</li>
          <li>The results obtained from using the Service will be accurate or reliable</li>
          <li>Any errors in the Service will be corrected</li>
        </ul>
      </section>

      {/* Limitation of Liability */}
      <section className="legal-section">
        <h2 className="legal-heading">12. Limitation of Liability</h2>
        <div className="legal-notice">
          <p className="legal-paragraph font-medium uppercase text-sm tracking-wide">
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, ECHOINWHISPR SHALL NOT BE LIABLE FOR ANY INDIRECT, 
            INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS 
            OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
          </p>
        </div>
        <p className="legal-paragraph mt-4">This includes damages resulting from:</p>
        <ul className="legal-list">
          <li>Your access to or use of or inability to access or use the Service</li>
          <li>Any conduct or content of any third party on the Service</li>
          <li>Any content obtained from the Service</li>
          <li>Unauthorized access, use, or alteration of your transmissions or content</li>
        </ul>
      </section>

      {/* Indemnification */}
      <section className="legal-section">
        <h2 className="legal-heading">13. Indemnification</h2>
        <p className="legal-paragraph">
          You agree to defend, indemnify, and hold harmless EchoinWhispr and its officers, directors, 
          employees, agents, and affiliates from and against any claims, liabilities, damages, losses, 
          and expenses arising out of or in any way connected with your access to or use of the Service 
          or your violation of these Terms.
        </p>
      </section>

      {/* Governing Law */}
      <section className="legal-section">
        <h2 className="legal-heading">14. Governing Law</h2>
        <p className="legal-paragraph">
          These Terms shall be governed by and construed in accordance with the laws of the jurisdiction 
          in which EchoinWhispr operates, without regard to its conflict of law provisions.
        </p>
        <p className="legal-paragraph">
          Any disputes arising under these Terms shall be resolved through binding arbitration in accordance 
          with the rules of the applicable arbitration association.
        </p>
      </section>

      {/* Changes to Terms */}
      <section className="legal-section">
        <h2 className="legal-heading">15. Changes to These Terms</h2>
        <p className="legal-paragraph">
          We reserve the right to modify these Terms at any time. We will notify users of any material 
          changes by posting the new Terms on this page and updating the &quot;Last updated&quot; date.
        </p>
        <p className="legal-paragraph">
          Your continued use of the Service after any such changes constitutes your acceptance of the 
          new Terms. Please review these Terms periodically for updates.
        </p>
      </section>

      {/* Severability */}
      <section className="legal-section">
        <h2 className="legal-heading">16. Severability</h2>
        <p className="legal-paragraph">
          If any provision of these Terms is held to be invalid or unenforceable, such provision shall 
          be struck and the remaining provisions shall be enforced to the fullest extent under law.
        </p>
      </section>

      {/* Contact */}
      <section className="legal-section">
        <h2 className="legal-heading">17. Contact Us</h2>
        <p className="legal-paragraph">
          If you have any questions about these Terms of Service, please contact us:
        </p>
        <div className="legal-contact-box">
          <p><strong>Email:</strong> legal@echoinwhispr.com</p>
          <p><strong>Support:</strong> Visit our Contact page for additional support options</p>
        </div>
      </section>
    </article>
  );
}
