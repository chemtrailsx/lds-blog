const axios = require('axios');

async function sendPasswordReset(toEmail, resetUrl) {
  await axios.post(
    'https://api.brevo.com/v3/smtp/email',
    {
      sender: { name: 'L&D Society', email: 'noreply@ldsnitjsr.in' },
      to: [{ email: toEmail }],
      subject: 'Reset your password — L&D Society',
      htmlContent: `
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
    },
    {
      headers: {
        'api-key': process.env.BREVO_API_KEY,
        'Content-Type': 'application/json',
      },
    }
  );
}

module.exports = { sendPasswordReset };
