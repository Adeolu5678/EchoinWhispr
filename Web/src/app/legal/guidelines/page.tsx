import { Users } from 'lucide-react';

export default function CommunityGuidelinesPage() {
  return (
    <article className="legal-document">
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center shadow-lg">
          <Users className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-1">Community Guidelines</h1>
          <p className="text-muted-foreground text-sm">Last updated: January 15, 2026</p>
        </div>
      </div>

      {/* Philosophy */}
      <section className="legal-section">
        <h2 className="legal-heading">Our Philosophy</h2>
        <p className="legal-paragraph">
          EchoinWhispr is built on the power of anonymous expression. With that power comes responsibility. 
          These guidelines help maintain a safe, respectful space for everyone to share their thoughts, 
          connect with others, and be heard without judgment.
        </p>
        <p className="legal-paragraph">
          Anonymity is a privilege that enables genuine connection. We ask that you use it responsibly.
        </p>
      </section>

      {/* Respect and Kindness */}
      <section className="legal-section">
        <h2 className="legal-heading">1. Respect and Kindness</h2>
        <p className="legal-paragraph">The foundation of our community is mutual respect. Please:</p>
        <ul className="legal-list">
          <li>Treat others with respect, even when anonymous</li>
          <li>Remember there&apos;s a real person receiving your Whispers</li>
          <li>Disagree constructively without personal attacks</li>
          <li>Celebrate diversity and different perspectives</li>
          <li>Be patient and understanding with new users</li>
        </ul>
      </section>

      {/* Prohibited Content */}
      <section className="legal-section">
        <h2 className="legal-heading">2. Prohibited Content</h2>
        <p className="legal-paragraph">The following content is strictly prohibited on EchoinWhispr:</p>
        
        <h3 className="legal-subheading">Harassment & Bullying</h3>
        <p className="legal-paragraph">
          Targeted harassment, bullying, intimidation, or threats against any individual or group.
        </p>

        <h3 className="legal-subheading">Hate Speech</h3>
        <p className="legal-paragraph">
          Content attacking people based on race, ethnicity, religion, gender, sexual orientation, 
          disability, or other protected characteristics.
        </p>

        <h3 className="legal-subheading">Violence</h3>
        <p className="legal-paragraph">
          Threats of violence, glorification of violence, or incitement to violent acts.
        </p>

        <h3 className="legal-subheading">Explicit Content</h3>
        <p className="legal-paragraph">
          Pornography, sexually explicit material, or any content involving minors in inappropriate contexts.
        </p>

        <h3 className="legal-subheading">Illegal Activity</h3>
        <p className="legal-paragraph">
          Content promoting illegal actions, drug trafficking, or other criminal behavior.
        </p>

        <h3 className="legal-subheading">Doxxing</h3>
        <p className="legal-paragraph">
          Sharing private or personally identifiable information about others without their consent.
        </p>

        <h3 className="legal-subheading">Spam & Manipulation</h3>
        <p className="legal-paragraph">
          Repetitive, unwanted, or promotional content designed to manipulate or deceive users.
        </p>

        <h3 className="legal-subheading">Self-Harm</h3>
        <p className="legal-paragraph">
          Content encouraging self-harm or suicide. If you&apos;re struggling, please reach out to 
          local crisis resources.
        </p>
      </section>

      {/* Chamber Guidelines */}
      <section className="legal-section">
        <h2 className="legal-heading">3. Chamber Guidelines</h2>
        <p className="legal-paragraph">When participating in Chambers (group spaces):</p>
        
        <h3 className="legal-subheading">For Participants</h3>
        <ul className="legal-list">
          <li>Follow Chamber-specific rules set by moderators</li>
          <li>Stay on topic for themed Chambers</li>
          <li>Report violations to Chamber moderators</li>
          <li>Respect moderator decisions</li>
          <li>Don&apos;t spam or flood the chat</li>
        </ul>

        <h3 className="legal-subheading">For Chamber Creators</h3>
        <ul className="legal-list">
          <li>Set clear, reasonable rules for your Chamber</li>
          <li>Moderate content actively and fairly</li>
          <li>Report serious violations to EchoinWhispr</li>
          <li>Don&apos;t create Chambers to circumvent platform rules</li>
          <li>Foster a welcoming environment</li>
        </ul>
      </section>

      {/* Reporting */}
      <section className="legal-section">
        <h2 className="legal-heading">4. Reporting Violations</h2>
        <p className="legal-paragraph">If you encounter content that violates these guidelines:</p>
        <ul className="legal-list">
          <li><strong>Use the in-app report feature</strong> on the offending content</li>
          <li><strong>Provide context</strong> when reporting to help us understand the situation</li>
          <li><strong>Don&apos;t engage</strong> with harmful content—report and move on</li>
          <li><strong>Block users</strong> who make you uncomfortable</li>
        </ul>
        <div className="legal-notice">
          <p className="legal-paragraph">
            <strong>For urgent safety concerns</strong> (imminent threats, child safety issues), please contact 
            local authorities immediately. You can also reach our safety team at safety@echoinwhispr.com.
          </p>
        </div>
      </section>

      {/* Consequences */}
      <section className="legal-section">
        <h2 className="legal-heading">5. Consequences</h2>
        <p className="legal-paragraph">Violations of these guidelines may result in:</p>
        <ul className="legal-list">
          <li><strong>Warning:</strong> For minor or first-time violations</li>
          <li><strong>Content Removal:</strong> Offending content will be deleted</li>
          <li><strong>Temporary Suspension:</strong> Account access restricted temporarily (24 hours to 30 days)</li>
          <li><strong>Permanent Ban:</strong> For severe or repeated violations</li>
          <li><strong>Legal Action:</strong> For illegal activity, we may involve authorities</li>
        </ul>
        <p className="legal-paragraph">
          The severity of consequences depends on the nature of the violation, user history, and context.
        </p>
      </section>

      {/* Appeals */}
      <section className="legal-section">
        <h2 className="legal-heading">6. Appeals</h2>
        <p className="legal-paragraph">If you believe an action was taken in error:</p>
        <ul className="legal-list">
          <li>Contact us at appeals@echoinwhispr.com</li>
          <li>Include your account information and context</li>
          <li>Explain why you believe the action was incorrect</li>
        </ul>
        <p className="legal-paragraph">
          Appeals are reviewed within 5-7 business days. We review each case individually and may 
          overturn actions if warranted.
        </p>
      </section>

      {/* Your Safety */}
      <section className="legal-section">
        <h2 className="legal-heading">7. Protecting Yourself</h2>
        <p className="legal-paragraph">To stay safe on EchoinWhispr:</p>
        <ul className="legal-list">
          <li>Never share personal identifying information (real name, address, phone number)</li>
          <li>Be cautious about revealing your identity, even through context clues</li>
          <li>Block users who make you uncomfortable</li>
          <li>Report concerning behavior immediately</li>
          <li>Trust your instincts—if something feels wrong, it probably is</li>
        </ul>
      </section>

      {/* Contact */}
      <section className="legal-section">
        <h2 className="legal-heading">8. Contact Us</h2>
        <p className="legal-paragraph">Questions about these guidelines? We&apos;re here to help:</p>
        <div className="legal-contact-box">
          <p><strong>General Support:</strong> support@echoinwhispr.com</p>
          <p><strong>Safety Team:</strong> safety@echoinwhispr.com</p>
          <p><strong>Appeals:</strong> appeals@echoinwhispr.com</p>
        </div>
      </section>
    </article>
  );
}
