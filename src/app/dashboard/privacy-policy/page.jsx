import Image from "next/image"

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
            SipLine, a service of KHR Enterprize LLC (“SipLine,” “we,” “us,” or “our”), is committed to protecting user privacy. This Privacy Policy describes how we collect, use, and disclose user personal information through the SipLine mobile application and website. By accessing or using SipLine, users consent to this Privacy Policy and our Terms of Use. If users do not agree, please discontinue use of the service.
          </p>
        </div>

        <div className="pp_item pp_item2">
          <h3>2. Information We Collect</h3>
          <h4 className="font-semibold mt-4 mb-2">a. Personal Information</h4>
          <p>We may collect the following when users create an account, make a purchase, or use the app:</p>
          <ul className="list-disc ml-6 mt-2 mb-4">
            <li>Full name</li>
            <li>Email address</li>
            <li>Mobile phone number</li>
            <li>Billing and shipping addresses</li>
            <li>Payment details (processed securely via third-party provider)</li>
            <li>Location data (with permission)</li>
          </ul>

          <h4 className="font-semibold mt-4 mb-2">b. Usage Data</h4>
          <p>When users use the app or website, we automatically collect:</p>
          <ul className="list-disc ml-6 mt-2">
            <li>Device type and operating system</li>
            <li>IP address</li>
            <li>App usage patterns</li>
            <li>Pages or features accessed</li>
            <li>Location information (if enabled)</li>
            <li>Cookies and tracking technologies for analytics and personalization</li>
          </ul>
        </div>

        <div className="pp_item">
          <h3>3. How We Use Your Information</h3>
          <p>We use your data to:</p>
          <ul className="list-disc ml-6 mt-2">
            <li>Process cocktail pre orders and subscriptions</li>
            <li>Personalize offers, recommendations, and content</li>
            <li>Communicate about user account and promotions</li>
            <li>Improve our services and user experience</li>
            <li>Prevent fraud and ensure system integrity</li>
            <li>Enforce our Terms of Use and comply with legal obligations</li>
          </ul>
        </div>

        <div className="pp_item">
          <h3>4. Sharing Your Information</h3>
          <p>SipLine does not sell user personal information. We only share user information with:</p>
          <ul className="list-disc ml-6 mt-2">
            <li>Payment processors (to complete transactions)</li>
            <li>Technical vendors and service providers (hosting, customer support, etc.)</li>
            <li>Legal authorities when required by law or to protect SipLine’s rights</li>
            <li>In the event of a merger, acquisition, or asset sale</li>
          </ul>
          <p>These parties are bound to use user data solely to provide contracted services.</p>
        </div>

        <div className="pp_item">
          <h3>5. Data Retention</h3>
          <p>We retain user information:</p>
          <ul className="list-disc ml-6 mt-2">
            <li>As long as your account is activex</li>
            <li>As needed to deliver services and fulfill subscriptions</li>
            <li>As required by law or to resolve disputes</li>
          </ul>
          <p>You may request deletion of your account by contacting us.</p>
        </div>

        <div className="pp_item">
          <h3>6. Your Rights</h3>
          <p>You have the right to:</p>
          <ul className="list-disc ml-6 mt-2">
            <li>Access or request a copy of your data</li>
            <li>Correct or delete your personal information</li>
            <li>Opt out of marketing communications</li>
            <li>Revoke access to location services via your device settings</li>
          </ul>
          <p>To make a privacy request, contact:  <a href="mailto:info@KHRenterprize.com">info@KHRenterprize.com</a></p>
        </div>

        <div className="pp_item">
          <h3>7. Security</h3>
          <p>
            We use commercially reasonable safeguards (including encryption and secure servers) to protect your data. However, no system is 100% secure, and users share data with us at their own risk.
          </p>
        </div>

        <div className="pp_item">
          <h3>{"8. Children's Privacy"}</h3>
          <p>
            SipLine is intended for users aged 21 and older. We do not knowingly collect personal information from anyone under 21. If users believe a minor has submitted data, contact us so we can delete it.
          </p>
        </div>

        <div className="pp_item">
          <h3>9. Changes to This Policy</h3>
          <p>
            We may update this Privacy Policy periodically. Updates will be posted here with a new effective date. Continued use of SipLine after changes means you accept the updated terms.
          </p>
        </div>

        <div className="pp_item">
          <h3>10. Contact</h3>
          <p>
            For questions about this policy or to exercise your privacy rights, contact:
          </p>
          <p className="d-flex align-items-center gap-2">
            <Image src="/images/email-2.png" width={20} height={20} alt="" style={{objectFit:"contain"}} />
            <a
              href="mailto:info@khrenterprize.com"
              className="hover:underline"
            >
              info@khrenterprize.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy
