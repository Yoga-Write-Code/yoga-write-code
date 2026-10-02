import type { Metadata } from "next";
import { LegalDoc, LegalSection } from "@/components/legal-doc";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for Yoga Write Code.",
};

export default function TermsPage() {
  return (
    <LegalDoc title="Terms of Service" updated="September 11, 2026">
      <LegalSection n="1" title="Acceptance of these terms">
        <p>
          These Terms of Service ("Terms") govern your use of Yoga Write Code
          ("Yoga Write Code", "we", "us"), a web-based software service available at
          yogawritecode.com and its subdomains. By creating an account or using the service, you
          agree to these Terms. If you do not agree, do not use the service.
        </p>
      </LegalSection>

      <LegalSection n="2" title="The service">
        <p>
          Yoga Write Code is an AI-assisted SEO and content planning tool. The core workflow is:
          website analysis → content opportunities → topic clusters → SEO briefs → article
          outlines → drafting in an editor. Features may change over time as the product evolves.
        </p>
      </LegalSection>

      <LegalSection n="3" title="Eligibility">
        <p>
          You must be at least 16 years old and capable of entering a binding agreement to use the
          service. If you use the service on behalf of a company, you represent that you are
          authorized to bind that company.
        </p>
      </LegalSection>

      <LegalSection n="4" title="Accounts">
        <p>
          You register with an email address and password. You are responsible for maintaining the
          confidentiality of your credentials and for all activity under your account. Notify us
          immediately at support@yogawritecode.com if you suspect unauthorized use.
        </p>
      </LegalSection>

      <LegalSection n="5" title="Billing and payments">
        <p>
          The core service is free. The optional Pro plan is billed on a recurring basis through
          Paddle, our merchant of record, at the price shown at checkout. New Pro subscriptions
          include a 7-day free trial; unless you cancel before it ends, your payment method is
          charged and the subscription renews automatically each billing period until cancelled. To
          cancel, use your account settings or email us. Refunds and cancellations are governed by
          our Refund Policy at /refund-policy, which is incorporated into these Terms by reference.
        </p>
      </LegalSection>

      <LegalSection n="6" title="Acceptable use">
        <p>You agree not to:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>violate any law or third-party right;</li>
          <li>attempt to gain unauthorized access to the service or its infrastructure;</li>
          <li>use automated means to access the service at abusive volumes;</li>
          <li>resell or white-label the service without written permission;</li>
          <li>submit content that is unlawful, infringing, or malicious.</li>
        </ul>
      </LegalSection>

      <LegalSection n="7" title="Your content and website data">
        <p>
          You keep all rights to content you create in the service (drafts, edits) and to the
          website URLs you submit. You grant us a limited license to process submitted URLs and
          fetched public page content solely to operate and provide the service to you. You
          represent that you are permitted to analyze the websites you submit.
        </p>
      </LegalSection>

      <LegalSection n="8" title="AI-generated outputs">
        <p>
          The service uses third-party AI models (currently Amazon Bedrock) to generate analyses,
          opportunities, clusters, briefs, and outlines. Outputs are probabilistic suggestions,
          not professional, legal, or financial advice. We do not guarantee that any output will
          improve search rankings, traffic, conversions, or revenue. You are responsible for
          reviewing, editing, and validating all AI-generated content before publishing or relying
          on it.
        </p>
      </LegalSection>

      <LegalSection n="9" title="Intellectual property">
        <p>
          The service, including its software, design, and branding, is owned by Yoga Write Code.
          Except for your own content, nothing in these Terms transfers ownership of our
          intellectual property to you.
        </p>
      </LegalSection>

      <LegalSection n="10" title="Third-party services">
        <p>
          The service relies on third-party infrastructure, including Vercel (hosting), Supabase
          (database and authentication), and Amazon Web Services (AI models). Your use of the
          service is also subject to the acceptable-use policies of those providers to the extent
          applicable.
        </p>
      </LegalSection>

      <LegalSection n="11" title="Availability and changes">
        <p>
          We strive for high availability but do not promise uninterrupted service. We may modify,
          suspend, or discontinue features with reasonable notice where practical. Continued use
          after changes constitutes acceptance.
        </p>
      </LegalSection>

      <LegalSection n="12" title="Suspension and termination">
        <p>
          You may delete your projects and drafts at any time from the dashboard. We may suspend
          or terminate accounts that violate these Terms or abuse the service. Upon termination,
          your right to use the service ends; provisions that by nature survive (disclaimers,
          liability, governing law) continue to apply.
        </p>
      </LegalSection>

      <LegalSection n="13" title="Privacy">
        <p>
          Our handling of personal data is described in our Privacy Policy at /privacy, which is
          incorporated into these Terms by reference.
        </p>
      </LegalSection>

      <LegalSection n="14" title="Disclaimers">
        <p>
          The service is provided "as is" and "as available" without warranties of any kind,
          express or implied, including merchantability, fitness for a particular purpose, and
          non-infringement.
        </p>
      </LegalSection>

      <LegalSection n="15" title="Limitation of liability">
        <p>
          To the maximum extent permitted by law, we are not liable for indirect, incidental,
          special, consequential, or punitive damages, or for lost profits, revenue, data, or
          goodwill. Our total liability for any claim arising from the service is limited to the
          amount you paid us in the twelve months before the claim (currently zero).
        </p>
      </LegalSection>

      <LegalSection n="16" title="Indemnification">
        <p>
          You will indemnify and hold us harmless from claims arising from your misuse of the
          service, your violation of these Terms, or your infringement of third-party rights.
        </p>
      </LegalSection>

      <LegalSection n="17" title="Governing law">
        <p>
          These Terms are governed by the laws of Nepal, without regard to conflict-of-law
          principles. Disputes will be resolved in the courts of Nepal unless we both agree
          otherwise.
        </p>
      </LegalSection>

      <LegalSection n="18" title="Changes to these terms">
        <p>
          We may update these Terms from time to time. We will change the "Last updated" date and,
          for material changes, provide notice in the product. Continued use after changes means
          you accept them.
        </p>
      </LegalSection>

      <LegalSection n="19" title="Contact">
        <p>
          Questions about these Terms: support@yogawritecode.com [mailbox to be provisioned].
        </p>
      </LegalSection>
    </LegalDoc>
  );
}