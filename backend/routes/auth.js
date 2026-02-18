import express from 'express';
import mongoose from 'mongoose';
import User from '../models/User.js';
import {
  generateUserToken,
  asyncHandler,
  sendErrorResponse,
  sendSuccessResponse,
} from '../utils/helpers.js';
import { verifyUserToken } from '../middleware/auth.js';
import { loginLimiter } from '../middleware/rateLimiter.js';
import { validateUserSignup, validateUserLogin } from '../middleware/validation.js';
import { generateVerificationToken, sendVerificationEmail, verifyEmailToken } from '../services/emailService.js';

const router = express.Router();

// Step 1: Initiate signup with email, name, password, and phone
router.post(
  '/send-verification-email',
  asyncHandler(async (req, res) => {
    const { email, name, password, phone, countryCode } = req.body;

    if (!email || !phone || !password || !name) {
      return sendErrorResponse(res, 400, 'Email, phone, name, and password are required');
    }

    // Check if email is already registered
    const existingEmail = await User.findOne({ email });
    if (existingEmail && existingEmail.isEmailVerified) {
      return sendErrorResponse(res, 409, 'Email already registered');
    }

    // Check if phone is already registered
    const existingPhone = await User.findOne({ phone });
    if (existingPhone && existingPhone.isEmailVerified) {
      return sendErrorResponse(res, 409, 'Phone number already registered');
    }

    // Ensure email and phone are different
    if (email.includes(phone) || phone.includes(email.split('@')[0])) {
      return sendErrorResponse(res, 400, 'Email and phone must be different');
    }

    // Generate verification token
    const verificationToken = generateVerificationToken();
    const verificationExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    try {
      // Create or update user with pending verification
      let user = existingEmail || existingPhone;
      if (!user) {
        user = new User({
          email,
          phone,
          name,
          password,
          emailVerificationToken: verificationToken,
          emailVerificationExpiresAt: verificationExpiresAt,
          signupStep: 'email-pending',
        });
      } else {
        user.email = email;
        user.phone = phone;
        user.name = name;
        user.password = password;
        user.emailVerificationToken = verificationToken;
        user.emailVerificationExpiresAt = verificationExpiresAt;
        user.signupStep = 'email-pending';
      }

      await user.save();

      // Send verification email
      const verificationLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}&email=${encodeURIComponent(email)}`;
      const emailResult = await sendVerificationEmail(email, verificationToken, verificationLink);

      if (!emailResult.success) {
        return sendErrorResponse(res, 500, 'Failed to send verification email. Please try again.');
      }

      sendSuccessResponse(res, 200, {
        message: 'Verification email sent successfully',
        expiresIn: 86400, // 24 hours in seconds
      });
    } catch (error) {
      console.error('Error sending verification email:', error);
      return sendErrorResponse(res, 500, 'Failed to send verification email. Please try again.');
    }
  })
);

// Step 2: Verify email
router.post(
  '/verify-email',
  asyncHandler(async (req, res) => {
    const { email, token } = req.body;

    if (!email || !token) {
      return sendErrorResponse(res, 400, 'Email and verification token are required');
    }

    const user = await User.findOne({ email });
    if (!user) {
      return sendErrorResponse(res, 404, 'User not found. Please signup first.');
    }

    // Verify email token
    const verification = verifyEmailToken(user.emailVerificationToken, token, user.emailVerificationExpiresAt);
    if (!verification.success) {
      return sendErrorResponse(res, 400, verification.message);
    }

    // Mark email as verified
    user.isEmailVerified = true;
    user.signupStep = 'email-verified';
    await user.save();

    sendSuccessResponse(res, 200, {
      message: 'Email verified successfully',
      emailVerified: true,
    });
  })
);

// Step 3: Complete Signup (with address only, after email is verified)
router.post(
  '/signup-complete',
  asyncHandler(async (req, res) => {
    const { email, address } = req.body;

    if (!email) {
      return sendErrorResponse(res, 400, 'Email is required');
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return sendErrorResponse(res, 404, 'User not found. Please verify your email first.');
    }

    if (!user.isEmailVerified) {
      return sendErrorResponse(res, 400, 'Email not verified. Please verify your email first.');
    }

    user.signupStep = 'completed';

    // Add address if provided
    if (address && (address.street || address.city || address.state || address.pincode)) {
      user.addresses.push({
        name: address.name || user.name,
        phone: address.phone || user.phone,
        street: address.street,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        isDefault: true,
      });
    }

    await user.save();

    // Generate token
    const token = generateUserToken(user._id);

    sendSuccessResponse(
      res,
      201,
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          addresses: user.addresses,
        },
        token,
      },
      'Account created successfully'
    );
  })
);

// User Login with Phone Number
router.post(
  '/login',
  loginLimiter,
  asyncHandler(async (req, res) => {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return sendErrorResponse(res, 400, 'Phone number and password are required');
    }

    // Find user by phone
    const user = await User.findOne({ phone });
    if (!user) {
      return sendErrorResponse(res, 401, 'Invalid phone number or password');
    }

    // Check if signup is completed
    if (user.signupStep !== 'completed') {
      return sendErrorResponse(res, 400, 'Please complete your signup first');
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return sendErrorResponse(res, 401, 'Invalid phone number or password');
    }

    // Generate token
    const token = generateUserToken(user._id);

    sendSuccessResponse(
      res,
      200,
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
        },
        token,
      },
      'Login successful'
    );
  })
);

// Get User Profile (Protected)
router.get(
  '/profile',
  verifyUserToken,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.userId);
    if (!user) {
      return sendErrorResponse(res, 404, 'User not found');
    }

    sendSuccessResponse(res, 200, {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      addresses: user.addresses,
    });
  })
);

// Update User Profile (Protected)
router.put(
  '/profile',
  verifyUserToken,
  asyncHandler(async (req, res) => {
    const { name, phone } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      { name, phone },
      { new: true, runValidators: true }
    );

    if (!user) {
      return sendErrorResponse(res, 404, 'User not found');
    }

    sendSuccessResponse(res, 200, {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
    });
  })
);

// Add or update address (Protected)
router.post(
  '/addresses',
  verifyUserToken,
  asyncHandler(async (req, res) => {
    const { name, phone, street, city, state, pincode, isDefault } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return sendErrorResponse(res, 404, 'User not found');
    }

    const address = {
      id: new mongoose.Types.ObjectId(),
      name,
      phone,
      street,
      city,
      state,
      pincode,
      isDefault: isDefault || false,
    };

    user.addresses.push(address);
    await user.save();

    sendSuccessResponse(res, 201, { addresses: user.addresses });
  })
);

export default router;
