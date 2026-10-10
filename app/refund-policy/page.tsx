import type { Metadata } from "next";
import { LegalDoc, LegalSection } from "@/components/legal-doc";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "Refund and cancellation policy for Yoga Write Code subscriptions.",
  alternates: { canonical: "/refund-policy" },
};

export default function RefundPolicyPage() {
  return (
    <LegalDoc title="Refund Policy" updated="October 2, 2026" path="/refund-policy">
      <LegalSection n="1" title="Overview">
        <p>
          This Refund Policy explains how refunds and cancellations work for paid Yoga Write Code
          subscriptions ("Pro"). It forms part of, and should be read together with, my{" "}
          <a href="/terms" className="text-brand underline underline-offset-4">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="text-brand underline underline-offset-4">
            Privacy Policy
          </a>
          . I am based in Nepal and sell worldwide.
        </p>
      </LegalSection>

      <LegalSection n="2" title="Free trial">
        <p>
          The Pro plan includes a 7-day free trial. You will not be charged during the trial. If you
          do not cancel before the trial ends, the subscription starts and the payment method you
          provided is charged the applicable price. You can cancel at any time during the trial to
          avoid being charged.
        </p>
      </LegalSection>

      <LegalSection n="3" title="Payments and merchant of record">
        <p>
          Payments are processed by Dodo Payments, which acts as my merchant of record. Dodo Payments handles the
          checkout, charges your payment method, and appears on your bank or card statement. Where
          Dodo Payments is the merchant of record, refunds are issued through Dodo Payments to your original
          payment method.
        </p>
      </LegalSection>

      <LegalSection n="4" title="Cancellations">
        <p>
          Subscriptions renew automatically until cancelled. You can cancel at any time from your
          account settings or by emailing me. After cancelling, you keep access to Pro until the end
          of the period you have already paid for. Partial periods are not billed again.
        </p>
      </LegalSection>

      <LegalSection n="5" title="Refunds">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>First purchase:</strong> if you are not satisfied, request a refund within 14
            days of your first paid charge and I will refund it in full.
          </li>
          <li>
            <strong>Renewals:</strong> if you forgot to cancel, contact me within 7 days of a renewal
            charge and, provided you have not made substantial use of Pro during that period, I
            will refund the renewal.
          </li>
          <li>
            <strong>Annual plans:</strong> annual charges cancelled mid-term are handled at my
            discretion; where a refund is approved it may be pro-rated for the unused portion.
          </li>
          <li>
            <strong>Billing errors:</strong> duplicate or incorrect charges are refunded in full once
            verified.
          </li>
        </ul>
      </LegalSection>

      <LegalSection n="6" title="What is not refundable">
        <p>
          Periods already used, add-on credits that have been consumed, and charges older than the
          windows in Section 5 are generally not refundable. Nothing in this policy limits any
          non-waivable rights you may have under the consumer law that applies to you.
        </p>
      </LegalSection>

      <LegalSection n="7" title="How to request a refund">
        <p>
          Email support@yogawritecode.com from the address on your account with your order or
          transaction ID (shown in your Dodo Payments receipt) and a short description of the issue. I
          usually respond within 3 business days. Approved refunds are processed through Dodo Payments and
          typically appear on your statement within 5–10 business days, depending on your bank.
        </p>
      </LegalSection>

      <LegalSection n="8" title="Chargebacks">
        <p>
          If you believe a charge is wrong, please contact me before filing a chargeback so I can
          resolve it quickly. Filing a chargeback without contacting me may result in the account
          being suspended while the dispute is investigated.
        </p>
      </LegalSection>

      <LegalSection n="9" title="Changes to this policy">
        <p>
          I may update this policy from time to time. I will change the "Last updated" date above,
          and material changes will not apply retroactively to purchases already made.
        </p>
      </LegalSection>

      <LegalSection n="10" title="Contact">
        <p>Questions about refunds: support@yogawritecode.com.</p>
      </LegalSection>
    </LegalDoc>
  );
}
