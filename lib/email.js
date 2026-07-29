import nodemailer from "nodemailer";
import { TIER_LABELS } from "./constants";

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    return null;
  }
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
  return transporter;
}

function getSiteUrl() {
  return process.env.SITE_URL || "http://localhost:3000";
}

function getFrom() {
  return process.env.SMTP_FROM || process.env.SMTP_USER || "no-reply@thepossiblewoman.com";
}

function getAdminEmail() {
  return process.env.ADMIN_EMAIL || "sharon@impossiblewec.com";
}

/**
 * Sends an email, or logs it to the console if SMTP env vars are not configured,
 * so the app remains fully functional before real credentials are wired up.
 */
async function sendMail({ to, subject, html, text }) {
  const t = getTransporter();
  if (!t) {
    console.log("--- EMAIL NOT SENT (SMTP not configured) ---");
    console.log("To:", to);
    console.log("Subject:", subject);
    console.log(text || html);
    console.log("---------------------------------------------");
    return { queued: true, sent: false };
  }
  await t.sendMail({ from: getFrom(), to, subject, html, text });
  return { queued: true, sent: true };
}

export async function sendNewSubmissionEmail(member) {
  const reviewUrl = `${getSiteUrl()}/admin?highlight=${member.id}`;
  const name = `${member.firstName} ${member.lastName}`.trim();
  const html = `
    <div style="font-family: sans-serif; color:#1a0b22;">
      <h2 style="font-family: Georgia, serif;">New ${TIER_LABELS[member.tier]} member submission</h2>
      <p><strong>${name}</strong>${member.companyName ? ` &mdash; ${member.companyName}` : ""}</p>
      <ul>
        ${member.email ? `<li>Email: ${member.email}</li>` : ""}
        ${member.phone ? `<li>Phone: ${member.phone}</li>` : ""}
        ${member.website ? `<li>Website: ${member.website}</li>` : ""}
        <li>City/State: ${member.cityState || ""}</li>
        <li>Industry: ${member.industry || ""}</li>
      </ul>
      <p><a href="${reviewUrl}" style="background:#cdb59d;color:#1a0b22;padding:10px 20px;text-decoration:none;border-radius:4px;">Review submission</a></p>
      <p>Log in to the admin dashboard to approve or reject this listing.</p>
    </div>
  `;
  return sendMail({
    to: getAdminEmail(),
    subject: `New member submission: ${name}`,
    html,
    text: `New ${TIER_LABELS[member.tier]} submission from ${name}. Review at ${reviewUrl}`,
  });
}

export async function sendApprovedEmail(member) {
  if (!member.email) return { queued: false, sent: false };
  const editUrl = `${getSiteUrl()}/edit/${member.editToken}`;
  const html = `
    <div style="font-family: sans-serif; color:#1a0b22;">
      <h2 style="font-family: Georgia, serif;">You're live in The Possible Woman Directory!</h2>
      <p>Hi ${member.firstName},</p>
      <p>Your listing has been approved and is now visible in the member directory.</p>
      <p>You can update your listing at any time using your private edit link below. Keep it safe &mdash; anyone with this link can edit your listing.</p>
      <p><a href="${editUrl}" style="background:#cdb59d;color:#1a0b22;padding:10px 20px;text-decoration:none;border-radius:4px;">Edit my listing</a></p>
    </div>
  `;
  return sendMail({
    to: member.email,
    subject: "Your Possible Woman directory listing is live",
    html,
    text: `Your listing is live! Edit it any time at ${editUrl}`,
  });
}

export async function sendRejectedEmail(member) {
  if (!member.email) return { queued: false, sent: false };
  const resubmitUrl = `${getSiteUrl()}/join?tier=${member.tier}`;
  const html = `
    <div style="font-family: sans-serif; color:#1a0b22;">
      <h2 style="font-family: Georgia, serif;">A quick note about your directory listing</h2>
      <p>Hi ${member.firstName},</p>
      <p>Thanks for submitting your listing for The Possible Woman member directory. We weren't able to publish it as submitted &mdash; please review your details and resubmit.</p>
      <p><a href="${resubmitUrl}" style="background:#cdb59d;color:#1a0b22;padding:10px 20px;text-decoration:none;border-radius:4px;">Resubmit my listing</a></p>
      <p>If you have any questions, just reply to this email.</p>
    </div>
  `;
  return sendMail({
    to: member.email,
    subject: "Please resubmit your Possible Woman directory listing",
    html,
    text: `Please resubmit your listing at ${resubmitUrl}`,
  });
}

export async function sendMemberEditNotification(member) {
  const name = `${member.firstName} ${member.lastName}`.trim();
  const html = `
    <div style="font-family: sans-serif; color:#1a0b22;">
      <h2 style="font-family: Georgia, serif;">Listing updated</h2>
      <p><strong>${name}</strong> (${TIER_LABELS[member.tier]}) just updated their directory listing.</p>
      <p><a href="${getSiteUrl()}/admin">View in admin dashboard</a></p>
    </div>
  `;
  return sendMail({
    to: getAdminEmail(),
    subject: `Listing updated: ${name}`,
    html,
    text: `${name} updated their listing. View at ${getSiteUrl()}/admin`,
  });
}
