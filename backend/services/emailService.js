import nodemailer from 'nodemailer';
import crypto from 'crypto';

// Initialize email transporter using SendGrid
const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  secure: false, // false for port 587, true for 465
  auth: {
    user: 'apikey', // SendGrid SMTP username is always 'apikey'
    pass: process.env.SENDGRID_API_KEY, // Your SendGrid API Key
  },
  connectionTimeout: 15000, // 15 seconds
  socketTimeout: 15000, // 15 seconds
  logger: true, // Enable logging for debugging
  debug: true, // Enable debug output
});

// Generate email verification token
export const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Send verification email
export const sendVerificationEmail = async (email, verificationToken, verificationLink) => {
  try {
    const mailOptions = {
      from: process.env.SENDGRID_SENDER_EMAIL, // Must be a verified sender in SendGrid
      to: email,
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

    await transporter.sendMail(mailOptions);
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
