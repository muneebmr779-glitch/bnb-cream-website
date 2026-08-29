const nodemailer = require('nodemailer');

let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;

  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    return null;
  }

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  return transporter;
};

/**
 * Sends an email if SMTP is configured; otherwise logs it.
 * Never throws — email delivery failures must not break the request flow.
 */
const sendEmail = async ({ to, subject, html, text }) => {
  const activeTransporter = getTransporter();

  if (!activeTransporter) {
    if (process.env.NODE_ENV !== 'test') {
      console.log('--- Email (SMTP not configured, logging only) ---');
      console.log(`To: ${to}\nSubject: ${subject}\n${text || html}`);
      console.log('---------------------------------------------------');
    }
    return { delivered: false, logged: true };
  }

  try {
    await activeTransporter.sendMail({
      from: process.env.EMAIL_FROM || 'AutoCare Pro <no-reply@autocarepro.com>',
      to,
      subject,
      html,
      text,
    });
    return { delivered: true };
  } catch (err) {
    console.error(`Failed to send email to ${to}:`, err.message);
    return { delivered: false, error: err.message };
  }
};

module.exports = sendEmail;
