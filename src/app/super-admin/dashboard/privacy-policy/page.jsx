const PrivacyPolicy = () => {
  return (
    <div className="page px-0">
      <div className="dash_head2">
        <h1 className="fw-bolder">Privacy Policy</h1>
      </div>
      <div className="privacy_policy">
        <p className="text-sm text-gray-600 mb-6">Effective Date: June 1, 2025</p>

        <div className="pp_item">
          <h3>1. Overview</h3>
          <p>
            We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and disclose
            your personal information through the Site and our services. By accessing or using the Site, users consent
            to this Privacy Policy and our Terms of Use. If users do not agree, please discontinue use of the Site.
          </p>
        </div>

        <div className="pp_item">
          <h3>2. Information We Collect</h3>
          <h4 className="font-semibold mt-4 mb-2">a. Personal Information</h4>
          <p>When you create an account, make a purchase, or use the Site:</p>
          <ul className="list-disc ml-6 mt-2 mb-4">
            <li>Full name</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>Billing and shipping addresses</li>
            <li>Payment details (processed securely via third-party providers)</li>
            <li>Location data (with permission)</li>
          </ul>

          <h4 className="font-semibold mt-4 mb-2">b. Usage Data</h4>
          <p>We automatically collect:</p>
          <ul className="list-disc ml-6 mt-2">
            <li>Device type and operating system</li>
            <li>IP address</li>
            <li>App usage patterns</li>
            <li>Pages or features accessed</li>
            <li>Time and date of access</li>
            <li>Cookies and tracking technologies for analytics and personalization</li>
          </ul>
        </div>

        <div className="pp_item">
          <h3>3. How We Use Your Information</h3>
          <p>We use your data to:</p>
          <ul className="list-disc ml-6 mt-2">
            <li>Process orders and subscriptions</li>
            <li>Provide customer recommendations, app content</li>
            <li>Communicate about your account and promotions</li>
            <li>Improve our services and user experience</li>
            <li>Ensure security and prevent fraud</li>
            <li>Enforce our Terms of Use and comply with legal obligations</li>
          </ul>
        </div>

        <div className="pp_item">
          <h3>4. Sharing Your Information</h3>
          <p>We do not sell your personal information. We only share user information with:</p>
          <ul className="list-disc ml-6 mt-2">
            <li>Service providers (for complete transactions)</li>
            <li>{"Legal authorities when required by law or to protect our users' rights"}</li>
            <li>In the event of a merger, acquisition, or asset sale</li>
            <li>With your consent or at your direction</li>
            <li>Aggregated or anonymized user data solely to provide contracted services</li>
          </ul>
        </div>

        <div className="pp_item">
          <h3>5. Data Retention</h3>
          <p>We retain user information:</p>
          <ul className="list-disc ml-6 mt-2">
            <li>As long as your account is active</li>
            <li>As needed to deliver services and fulfill subscriptions</li>
            <li>To comply with legal, tax, or audit requirements</li>
            <li>You may request deletion of your account by contacting us</li>
          </ul>
        </div>

        <div className="pp_item">
          <h3>6. Your Rights</h3>
          <p>You have the rights:</p>
          <ul className="list-disc ml-6 mt-2">
            <li>Access or request a copy of your data</li>
            <li>Correct or update your personal information</li>
            <li>Opt out of marketing communications</li>
            <li>Request access to location services via your device settings</li>
            <li>
              For EU users, contact{" "}
              <a href="mailto:privacy@company.com" className="text-blue-600 underline">
                privacy@company.com
              </a>
            </li>
          </ul>
        </div>

        <div className="pp_item">
          <h3>7. Security</h3>
          <p>
            We employ industry-standard safeguards (including encryption and secure servers) to protect your data.
            However, no method is 100% secure, and users share data with us at their own risk.
          </p>
        </div>

        <div className="pp_item">
          <h3>{"8. Children's Privacy"}</h3>
          <p>
            The Site is intended for users aged 13 and older. We do not knowingly collect personal information from
            anyone under 13. If we learn that we have, we will delete it as soon as possible.
          </p>
        </div>

        <div className="pp_item">
          <h3>9. Changes to This Policy</h3>
          <p>
            We may update this Privacy Policy periodically. Updates will be posted here with a new effective date.
            Continued use of the Site after changes means you accept the updated terms.
          </p>
        </div>

        <div className="pp_item">
          <h3>10. Contact</h3>
          <p>
            For questions about this policy or to exercise your privacy rights, contact: <br />
            Email:{" "}
            <a href="mailto:privacy@company.com" className="text-blue-600 underline">
              privacy@company.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy
