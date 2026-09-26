import { Resend } from "resend";

/**
 * Resend wiring for signup email.
 *
 * Server-only by construction: this is imported from a "use server" action and a
 * route handler, never from a client component. RESEND_API_KEY has no
 * NEXT_PUBLIC_ prefix, so Next.js replaces it with undefined in client bundles
 * even if this module were ever pulled in by mistake.
 *
 * Nothing here should ever break signup: every send is best-effort and logs on
 * failure instead of throwing. If Resend is not configured, sending is skipped
 * rather than crashing the request.
 */

const apiKey: string | undefined = process.env.RESEND_API_KEY;

/** e.g. "Yoga Write Code <hello@notifications.yogawritecode.com>". */
const from: string | undefined = process.env.RESEND_FROM_EMAIL;

const siteUrl: string = process.env.NEXT_PUBLIC_SITE_URL ?? "https://yogawritecode.com";

/** Absolute link helper so templates never emit a relative href. */
function absolute(path: string): string {
  return new URL(path, siteUrl).toString();
}

export type EmailResult = { sent: boolean; skipped?: boolean; error?: string };

async function sendEmail(options: {
  to: string;
  subject: string;
  html: string;
}): Promise<EmailResult> {
  if (!apiKey || !from) {
    console.warn(
      "[email] skipped: set RESEND_API_KEY and RESEND_FROM_EMAIL to send signup email"
    );
    return { sent: false, skipped: true };
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });

    if (error) {
      console.error("[email] resend send failed:", error.message);
      return { sent: false, error: error.message };
    }

    return { sent: true };
  } catch (caught) {
    const message = caught instanceof Error ? caught.message : "unknown error";
    console.error("[email] resend threw:", message);
    return { sent: false, error: message };
  }
}

/**
 * Inline-styled HTML. Email clients strip <style> blocks and do not support
 * Tailwind classes, so the brand tokens are repeated as literal hex here.
 */
function shell({ heading, intro, cta, footnote }: {
  heading: string;
  intro: string;
  cta: { label: string; href: string };
  footnote: string;
}): string {
  const brand = "#5b4bdb";
  const brandHover = "#4c3dc7";
  const ink = "#1c1917";
  const inkSecondary = "#57534e";
  const inkMuted = "#78716c";
  const line = "#e7e5e4";
  const surfaceSubtle = "#f5f5f4";

  return `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:0;background:#fafaf9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fafaf9;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border:1px solid ${line};border-radius:10px;">
            <tr>
              <td style="padding:32px 32px 8px 32px;">
                <p style="margin:0;font-size:11px;font-weight:600;letter-spacing:0.16em;text-transform:uppercase;color:${brand};">Yoga Write Code</p>
                <h1 style="margin:16px 0 0 0;font-size:24px;line-height:1.2;font-weight:600;color:${ink};">${heading}</h1>
                <p style="margin:12px 0 0 0;font-size:15px;line-height:1.6;color:${inkSecondary};">${intro}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 32px 0 32px;">
                <table role="presentation" cellpadding="0" cellspacing="0" style="background:${surfaceSubtle};border-radius:8px;">
                  <tr><td style="padding:16px 20px;font-size:14px;line-height:1.6;color:${inkSecondary};">
                    <strong style="color:${ink};">Your five-step workflow</strong>
                    <br />Analyze &rarr; Opportunities &rarr; Clusters &rarr; Briefs &rarr; Outlines
                  </td></tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 32px 0 32px;">
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr><td style="border-radius:6px;background:${brand};">
                    <a href="${cta.href}" style="display:inline-block;padding:12px 24px;font-size:14px;font-weight:500;color:#ffffff;text-decoration:none;">${cta.label}</a>
                  </td></tr>
                </table>
                <p style="margin:12px 0 0 0;font-size:13px;color:${inkMuted};">Button not working? Paste this link into your browser:<br /><a href="${cta.href}" style="color:${brandHover};">${cta.href}</a></p>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 32px 32px 32px;border-top:1px solid ${line};margin-top:28px;">
                <p style="margin:0;font-size:12px;line-height:1.6;color:${inkMuted};">${footnote}</p>
                <p style="margin:8px 0 0 0;font-size:12px;color:${inkMuted};">
                  <a href="${absolute("/privacy")}" style="color:${inkMuted};">Privacy Policy</a>
                  &nbsp;&middot;&nbsp;
                  <a href="${absolute("/terms")}" style="color:${inkMuted};">Terms</a>
                </p>
              </td>
            </tr>
          </table>
          <p style="margin:16px 0 0 0;font-size:12px;color:${inkMuted};">Yoga Write Code &middot; ${siteUrl.replace(/^https?:\/\//, "")}</p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

/** Sent once, after the address is confirmed (or straight away if unconfirmed). */
export function sendWelcomeEmail(to: string): Promise<EmailResult> {
  return sendEmail({
    to,
    subject: "Welcome to Yoga Write Code",
    html: shell({
      heading: "Your workspace is ready.",
      intro:
        "Paste a website URL to find the content opportunities your business is best placed to write about, then take each one through a brief and an outline.",
      cta: { label: "Open your workspace", href: absolute("/dashboard") },
      footnote:
        "You are receiving this because you created a Yoga Write Code account. If you did not, you can ignore this email.",
    }),
  });
}
