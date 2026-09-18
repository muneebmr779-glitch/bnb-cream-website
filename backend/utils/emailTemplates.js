const wrap = (title, bodyHtml) => `
  <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #1a1a1a;">
    <div style="background:#111827;padding:20px 24px;border-radius:8px 8px 0 0;">
      <h1 style="color:#fff;margin:0;font-size:20px;">AutoCare Pro</h1>
    </div>
    <div style="border:1px solid #e5e7eb;border-top:none;padding:24px;border-radius:0 0 8px 8px;">
      <h2 style="margin-top:0;font-size:18px;">${title}</h2>
      ${bodyHtml}
      <p style="margin-top:32px;font-size:12px;color:#6b7280;">
        AutoCare Pro Workshop &middot; This is an automated message, please do not reply directly.
      </p>
    </div>
  </div>
`;

const bookingConfirmationEmail = (appointment) =>
  wrap(
    'Appointment Confirmation',
    `
    <p>Hi ${appointment.customerName},</p>
    <p>Thank you for booking with AutoCare Pro. Here are your appointment details:</p>
    <table style="width:100%;border-collapse:collapse;margin:16px 0;">
      <tr><td style="padding:6px 0;color:#6b7280;">Booking ID</td><td style="padding:6px 0;font-weight:bold;">${appointment.bookingId}</td></tr>
      <tr><td style="padding:6px 0;color:#6b7280;">Service</td><td style="padding:6px 0;">${appointment.serviceName}</td></tr>
      <tr><td style="padding:6px 0;color:#6b7280;">Vehicle</td><td style="padding:6px 0;">${appointment.vehicle}</td></tr>
      <tr><td style="padding:6px 0;color:#6b7280;">Date</td><td style="padding:6px 0;">${appointment.date}</td></tr>
      <tr><td style="padding:6px 0;color:#6b7280;">Time</td><td style="padding:6px 0;">${appointment.time}</td></tr>
      <tr><td style="padding:6px 0;color:#6b7280;">Status</td><td style="padding:6px 0;text-transform:capitalize;">${appointment.status}</td></tr>
    </table>
    <p>We will notify you as soon as your appointment is confirmed by our team.</p>
  `
  );

const statusUpdateEmail = (appointment) =>
  wrap(
    'Appointment Status Updated',
    `
    <p>Hi ${appointment.customerName},</p>
    <p>Your appointment <strong>${appointment.bookingId}</strong> for <strong>${appointment.serviceName}</strong> is now:</p>
    <p style="font-size:18px;font-weight:bold;text-transform:capitalize;color:#dc2626;">${appointment.status}</p>
  `
  );

const passwordResetEmail = (name, resetUrl) =>
  wrap(
    'Reset Your Password',
    `
    <p>Hi ${name},</p>
    <p>We received a request to reset your password. Click the button below to choose a new one. This link expires in 30 minutes.</p>
    <p style="margin:24px 0;">
      <a href="${resetUrl}" style="background:#dc2626;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold;">Reset Password</a>
    </p>
    <p>If you did not request this, you can safely ignore this email.</p>
  `
  );

const contactReceivedEmail = (name) =>
  wrap(
    'We Received Your Message',
    `
    <p>Hi ${name},</p>
    <p>Thanks for reaching out to AutoCare Pro. Our team will get back to you shortly.</p>
  `
  );

module.exports = {
  bookingConfirmationEmail,
  statusUpdateEmail,
  passwordResetEmail,
  contactReceivedEmail,
};
