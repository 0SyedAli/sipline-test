import Image from "next/image";

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-8">
          <div className="dash_head2">
            <h1 className="fw-bolder">Terms & Conditions</h1>
          </div>

          <section>
            <h2 className="text-2xl font-semibold text-green-400 mb-4">
              1. Eligibility
            </h2>
            <p className="text-gray-300 mb-4">
              {
                "To use the SipLine application (“App”) and services (“Services”), you must be at least 21 years of age or the legal drinking age in your location, whichever is greater. By using the Services, you represent and warrant that you meet this requirement. Use of the App is void where prohibited."
              }
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-green-400 mb-4">
              2. Our Services
            </h2>
            <p className="text-gray-300 mb-2">SipLine enables users to:</p>
            <ul className="list-disc list-inside text-gray-300 space-y-1 ml-4">
              <li>
                Discover and browse participating bars, restaurants, and venues
              </li>
              <li>Pre-order alcoholic and non-alcoholic beverages</li>
              <li>Customize drink selections</li>
              <li>Receive real-time order status updates</li>
              <li>Access membership perks through paid subscriptions</li>
            </ul>
            <p>SipLine is a technology platform. We do not prepare, sell, or
              deliver beverages. Orders are fulfilled by independently
              operated third-party bars, restaurants, and venues.</p>
            {/* <p className="text-gray-300 mt-4">
              SpLine is a technology platform; we do not prepare, sell, or
              deliver beverages. Orders are fulfilled by independently operated
              third-party bars, restaurants, and venues.
            </p> */}
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-green-400 mb-4">
              3. Venue Access Disclaimer
            </h2>
            <p className="text-gray-300 mb-4">
              Entry into participating venues is solely at the discretion of the
              venue. SipLine does not guarantee entry and is not responsible for
              denied admission, cover charges, dress code enforcement, age
              verification, capacity limits, or any other venue-specific
              policies or requirements. Users are responsible for complying with
              all entry conditions imposed by the venue. SipLine facilitates
              drink orders but does not control access to or the physical
              operations of third-party venues.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-green-400 mb-4">
              4. User Accounts
            </h2>
            <p className="text-gray-300 mb-2">
              By creating an account, users agree to:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-1 ml-4">
              <li>Provide true, accurate, and complete information</li>
              <li>Maintain the confidentiality of user credentials</li>
              <li>Be responsible for all activities under user accounts</li>
            </ul>
            <p className="text-gray-300 mt-4">
              SipLine may suspend or terminate accounts for suspected misuse,
              fraud, or violation of these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-green-400 mb-4">
              5. Payments & Billing
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium text-green-300 mb-2">
                  a. Payment Authorization:
                </h3>
                <p className="text-gray-300">
                  User authorizes SipLine to charge the chosen payment method at
                  the time of purchase, including taxes and service fees.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-green-300 mb-2">
                  b. Fraudulent Activity:
                </h3>
                <p className="text-gray-300">
                  Fraudulent chargebacks or misuse of the platform will result
                  in account suspension, possible legal action, and liability
                  for all incurred damages.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-green-400 mb-4">
              6. Subscriptions
            </h2>
            <p className="text-gray-300 mb-4">
              SipLine offers recurring subscriptions with VIP perks such as
              discounts, expedited service, and early access to exclusive
              events.
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-1 ml-4">
              <li>
                Subscriptions auto-renew at the beginning of each billing cycle
                based on the original purchase date, unless canceled beforehand.
              </li>
              <li>Fees are non-refundable after renewal.</li>
              <li>
                Users may cancel at any time via account settings; benefits will
                remain active through the paid period.
              </li>
              <li>
                SipLine reserves the right to adjust subscription pricing from time to time to reflect changes in operational costs, including but not limited to inflation and market conditions. Users will be notified of any such changes at least 30 days in advance. Continued use of the service after the effective date of the pricing change constitutes acceptance of the new rate.
              </li>
            </ul>
          </section>
          <section>
            <h2 className="text-2xl font-semibold text-green-400 mb-4">
              7. Prohibited Conduct
            </h2>
            <p className="text-gray-300 mb-2">Users may not:</p>
            <ul className="list-disc list-inside text-gray-300 space-y-1 ml-4">
              <li>
                Use the Services for any unlawful, harmful, or fraudulent
                purpose
              </li>
              <li>
                Violate any local, state, or federal laws regarding alcohol
                consumption
              </li>
              <li>Interfere with the operation of the App or any venue</li>
              <li>
                Attempt to scrape, reverse engineer, or duplicate SipLine
                technology
              </li>
            </ul>
            <p className="text-gray-300 mt-4">
              Violation of these rules may result in permanent suspension.
              Violations shall be reported to the appropriate authorities.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-green-400 mb-4">
              8. Partner Venue Responsibility
            </h2>
            <p className="text-gray-300 mb-2">
              Partner venues are solely responsible for:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-1 ml-4">
              <li>Preparing and serving drinks correctly, as ordered</li>
              <li>
                Complying with all liquor laws, including ID and age
                verification, and beverage consumption
              </li>
              <li>
                Handling any customer service issues directly related to drink
                preparation or service
              </li>
              <li>
                Selecting and maintaining the quality of liquor brands offered
                through SipLine, ensuring that all products meet advertised
                standards and customer expectations
              </li>
            </ul>
            <p className="text-gray-300 mt-4">
              SipLine is not liable for venue-related service failures,
              including issues related to brand substitutions or quality
              discrepancies, but will assist in dispute resolution when
              contacted within 24 hours of service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-green-400 mb-4">
              9. Refunds & Cancellations
            </h2>
            <p className="text-gray-300 mb-4">
              Due to the nature of beverage service, which prohibits the resale
              or restocking of prepared drinks, full refunds are only available
              prior to drink preparation. Users may request a full refund only
              if the beverage has not yet been made.
            </p>
            <p className="text-gray-300 mb-4">
              {
                "Once a beverage is marked as “Picked Up” or otherwise confirmed as made, the refund request will be handled on a case by case basis."
              }
            </p>
            <p className="text-gray-300 mb-4">
              {
                "If a venue approves and processes a refund at the location, SipLine is released from any financial obligation related to that order. Refund timelines vary by venue and payment provider but may take 5–10 business days to reflect in the user’s account."
              }
            </p>
            <p className="text-gray-300 mb-4">
              Each refund request is reviewed individually and is not
              guaranteed. All refund decisions are final and at the sole
              discretion of SipLine or the partner venue, depending on timing
              and circumstances.
            </p>
            <p className="text-gray-300 mb-2">
              Refunds may be issued on a case-by-case basis under the following
              conditions:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-1 ml-4">
              <li>
                At the discretion of the bartender or partner venue staff.
              </li>
              <li>
                Entry to the participating venue is denied, preventing the user
                from retrieving the beverage.
              </li>
              <li>
                The requested beverage is unavailable due to inventory
                limitations at the partner venue.
              </li>
            </ul>
            <p className="text-gray-300 mt-4">
              Refund requests outside of these conditions may not be honored.
              Abuse of the refund policy may result in account suspension or
              termination.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-green-400 mb-4">
              10. Intellectual Property
            </h2>
            <p className="text-gray-300 mb-4">
              All trademarks, logos, app content, software, text, graphics, and
              branding are owned and or licensed to SipLine.
            </p>
            <p className="text-gray-300 mb-4">
              Unless we expressly authorize users in writing, one may not
              modify, publish, copy, display, distribute, transmit, reproduce,
              license, create derivative works from, adapt, transfer, sell or in
              any manner commercially exploit any of the trademarks, logos, app
              content, software, text, graphics, and branding (Content) are
              owned and or licensed to SipLine. This prohibition includes, but
              is not limited to, the practice of “screen scraping” which we
              consider theft or conversion of the Content and those who obtain
              the Content in this manner will be liable to SipLine The SipLine{" "}
              <a href="www.thesipline.com">www.thesipline.com</a> By using
              SipLine The SipLine{" "}
              <a href="www.thesipline.com">www.thesipline.com</a> or the
              Services users represent to us that they will not use their
              content or the Content for any unlawful purpose, tortious conduct
              or any prohibited use. If we determine, in our sole discretion,
              that any user is in violation of the Agreement, then we may block
              access to or use of SipLine The SipLine
              <a href="www.thesipline.com">www.thesipline.com</a> and/or the
              Services or terminate this Agreement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-green-400 mb-4">
              11. Disclaimers & Limitation of Liability
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium text-green-300 mb-2">
                  a. Disclaimer:
                </h3>
                <p className="text-gray-300">
                  {
                    "The Services are provided “as is” and “as available.” SipLine disclaims all express or implied warranties, including fitness for a particular purpose or merchantability."
                  }
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-green-300 mb-2">
                  b. Limitation of Liability:
                </h3>
                <p className="text-gray-300 mb-4">
                  {
                    "SipLine’s liability for any claim shall not exceed the amount you paid for the specific transaction in dispute. We are not liable for:"
                  }
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-1 ml-4">
                  <li>Missed pickup windows</li>
                  <li>Incorrect drink preparation</li>
                  <li>Delays caused by venues</li>
                  <li>Indirect, incidental, or consequential damages</li>
                </ul>
                <p className="text-gray-300 mt-4">
                  Some jurisdictions do not allow certain exclusions, so these
                  limitations may not apply to users fully.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-green-400 mb-4">
              12. Indemnification
            </h2>
            <p className="text-gray-300 mb-4">
              {
                "Users agree to indemnify, defend, and hold harmless SipLine, its affiliates, officers, agents, and employees from all claims, liabilities, damages, and expenses (including attorney’s fees) arising out of the users:"
              }
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-1 ml-4">
              <li>Misuse of the Services</li>
              <li>Violation of these Terms</li>
              <li>Violation of any applicable law or third-party right</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-green-400 mb-4">
              13. Dispute Resolution
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium text-green-300 mb-2">
                  a. Informal Process:
                </h3>
                <p className="text-gray-300">
                  Please contact us first with any concerns. We strive to
                  resolve disputes amicably.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-green-300 mb-2">
                  b. Arbitration Agreement:
                </h3>
                <p className="text-gray-300">
                  If unresolved, users agree to resolve all disputes through
                  binding arbitration conducted in Louisville, Kentucky, under
                  the rules of the American Arbitration Association (AAA). Users
                  waive the right to participate in any class action or jury
                  trial.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-green-300 mb-2">
                  c. Jurisdiction-Specific Rights:
                </h3>
                <p className="text-gray-300">
                  If users reside outside the U.S., local consumer rights may apply and may override certain arbitration clauses.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-green-400 mb-4">
              14. Governing Law
            </h2>
            <p className="text-gray-300 mb-4">
              These Terms and any disputes will be governed exclusively by the laws of the Commonwealth of Kentucky, without regard to conflict-of-law principles.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-green-400 mb-4">
              15. Changes to Terms
            </h2>
            <p className="text-gray-300 mb-4">
              {
                "We may revise these Terms at any time. Material changes will be announced via email or app notification. Continued use of the Services after changes constitutes users’ agreement to the new terms."
              }
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-green-400 mb-4">
              16. Contact Us
            </h2>
            <p className="text-gray-300 mb-2">
              If there are any questions or concerns about these Terms, please email:
            </p>
            <p className="d-flex align-items-center gap-2">
              <Image src="/images/email-2.png" width={20} height={20} alt="" style={{ objectFit: "contain" }} />
              <a
                href="mailto:info@khrenterprize.com"
                className="hover:underline"
              >
                info@khrenterprize.com
              </a>
            </p>
            <p className="text-gray-300 mt-4">
              SipLine does not provide phone support. All communications must be via email for record-keeping and legal purposes.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
