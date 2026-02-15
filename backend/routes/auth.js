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
import { generateOTP, sendOTP, verifyOTP } from '../services/otpService.js';

const router = express.Router();

// Step 1: Send OTP to phone number
router.post(
  '/send-otp',
  asyncHandler(async (req, res) => {
    const { phone } = req.body;

    if (!phone) {
      return sendErrorResponse(res, 400, 'Phone number is required');
    }

    // Check if phone is already registered
    const existingUser = await User.findOne({ phone });
    if (existingUser && existingUser.isPhoneVerified) {
      return sendErrorResponse(res, 409, 'Phone number already registered');
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    try {
      // Send OTP via SMS
      await sendOTP(phone, otp);

      // If user exists but not verified, update their OTP
      // Otherwise create a temporary user
      if (existingUser && !existingUser.isPhoneVerified) {
        existingUser.otp = otp;
        existingUser.otpExpiresAt = otpExpiresAt;
        await existingUser.save();
      } else {
        // Create temporary user record (will be completed in step 2)
        const tempUser = new User({
          phone,
          otp,
          otpExpiresAt,
          signupStep: 'phone',
          name: 'Pending',
          password: 'temp', // Will be updated in step 2
        });
        await tempUser.save();
      }

      sendSuccessResponse(res, 200, {
        message: 'OTP sent successfully',
        expiresIn: 600, // 10 minutes in seconds
      });
    } catch (error) {
      console.error('Error sending OTP:', error);
      return sendErrorResponse(res, 500, 'Failed to send OTP. Please try again.');
    }
  })
);

// Step 2: Verify OTP
router.post(
  '/verify-otp',
  asyncHandler(async (req, res) => {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return sendErrorResponse(res, 400, 'Phone number and OTP are required');
    }

    const user = await User.findOne({ phone });
    if (!user) {
      return sendErrorResponse(res, 404, 'User not found. Please send OTP first.');
    }

    // Verify OTP
    const verification = verifyOTP(user.otp, otp, user.otpExpiresAt);
    if (!verification.success) {
      return sendErrorResponse(res, 400, verification.message);
    }

    // Mark phone as verified
    user.isPhoneVerified = true;
    user.signupStep = 'verified';
    await user.save();

    sendSuccessResponse(res, 200, {
      message: 'OTP verified successfully',
      phoneVerified: true,
    });
  })
);

// Step 3: Complete Signup (with email and address)
router.post(
  '/signup-complete',
  asyncHandler(async (req, res) => {
    const { phone, name, password, email, address } = req.body;

    if (!phone || !name || !password) {
      return sendErrorResponse(res, 400, 'Phone, name, and password are required');
    }

    // Find user by phone
    const user = await User.findOne({ phone });
    if (!user) {
      return sendErrorResponse(res, 404, 'User not found. Please verify OTP first.');
    }

    if (!user.isPhoneVerified) {
      return sendErrorResponse(res, 400, 'Phone number not verified. Please verify OTP first.');
    }

    // Check if email is already registered
    if (email) {
      const existingEmail = await User.findOne({ email, phone: { $ne: phone } });
      if (existingEmail) {
        return sendErrorResponse(res, 409, 'Email already registered');
      }
    }

    // Update user with remaining info
    user.name = name;
    user.password = password;
    if (email) {
      user.email = email;
    }
    user.signupStep = 'completed';

    // Add address if provided
    if (address && (address.street || address.city || address.state || address.pincode)) {
      user.addresses.push({
        name: address.name || name,
        phone: address.phone || phone,
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
