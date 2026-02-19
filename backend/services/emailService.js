import sgMail from '@sendgrid/mail';
import crypto from 'crypto';

// Initialize SendGrid Mail API
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Generate email verification token
export const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Send verification email
export const sendVerificationEmail = async (email, verificationToken, verificationLink) => {
  try {
    const msg = {
      to: email,
      from: process.env.SENDGRID_SENDER_EMAIL, // Must be a verified sender in SendGrid
      subject: 'Email Verification - Sequeira Foods',
      html: `
        <h2>Welcome to Sequeira Foods!</h2>
        <p>Please verify your email address by clicking the link below:</p>
        <a href="${verificationLink}" style="
          display: inline-block;
          padding: 10px 20px;
          margin: 20px 0;
          background-color: #007bff;
          color: white;
          text-decoration: none;
          border-radius: 5px;
        ">Verify Email</a>
        <p>Or copy this link in your browser:</p>
        <p>${verificationLink}</p>
        <p>This link will expire in 24 hours.</p>
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
