const nodemailer = require('nodemailer');

// Uses Brevo (Sendinblue) SMTP — works on Render, sends to any email
const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_SMTP_USER, // your Brevo account email
    pass: process.env.BREVO_SMTP_PASS, // Brevo SMTP key (not login password)
  },
});

async function sendPasswordReset(toEmail, resetUrl) {
  await transporter.sendMail({
    from: `"L&D Society" <${process.env.BREVO_SMTP_USER}>`,
    to: toEmail,
    subject: 'Reset your password — L&D Society',
    html: `
      <div style="font-family: Georgia, serif; background: #1a1410; color: #e8dcc8; padding: 40px; max-width: 500px; margin: 0 auto; border: 1px solid #c9a84c44;">
        <h2 style="color: #c9a84c; font-size: 24px; margin-bottom: 16px;">Password Reset</h2>
        <p style="line-height: 1.6; margin-bottom: 24px;">
          You requested a password reset for your Literary &amp; Debating Society account.
          Click the link below to set a new password. This link expires in <strong>1 hour</strong>.
        </p>
        <a href="${resetUrl}" style="display: inline-block; background: #c9a84c; color: #1a1410; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 4px;">
          Reset Password
        </a>
        <p style="margin-top: 24px; color: #e8dcc880; font-size: 13px;">
          If you didn't request this, you can safely ignore this email.
        </p>
      </div>
    `,
  });
}

module.exports = { sendPasswordReset };
