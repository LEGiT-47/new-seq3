import sgMail from '@sendgrid/mail';
import crypto from 'crypto';

// Initialize SendGrid Mail API
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Generate email verification token (6-digit OTP)
export const generateVerificationToken = () => {
  return String(Math.floor(100000 + Math.random() * 900000));
};

// Send verification email with OTP
export const sendVerificationEmail = async (email, verificationToken) => {
  try {
    const msg = {
      to: email,
      from: process.env.SENDGRID_SENDER_EMAIL, // Must be a verified sender in SendGrid
      subject: 'Email Verification - Sequeira Foods',
      html: `
        <h2>Welcome to Sequeira Foods!</h2>
        <p>Please use the following OTP to verify your email address:</p>
        <div style="
          display: inline-block;
          padding: 20px 30px;
          margin: 20px 0;
          background-color: #f0f0f0;
          border: 2px solid #007bff;
          border-radius: 5px;
          font-size: 24px;
          font-weight: bold;
          letter-spacing: 2px;
          color: #007bff;
        ">${verificationToken}</div>
        <p>This OTP will expire in 24 hours.</p>
        <p>If you did not create this account, please ignore this email.</p>
      `,
    };

    await sgMail.send(msg);
    return { success: true, message: 'Verification email sent successfully' };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, message: 'Failed to send verification email', error: error.message };
  }
};

// Verify email token
export const verifyEmailToken = (storedToken, providedToken, expiresAt) => {
  if (new Date() > new Date(expiresAt)) {
    return { success: false, message: 'Verification link has expired' };
  }
  
  if (storedToken === providedToken) {
    return { success: true, message: 'Email verified successfully' };
  }
  
  return { success: false, message: 'Invalid verification token' };
};
