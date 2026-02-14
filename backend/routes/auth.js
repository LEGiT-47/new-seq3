import express from 'express';
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

const router = express.Router();

// User Signup
router.post(
  '/signup',
  validateUserSignup,
  asyncHandler(async (req, res) => {
    const { name, email, phone, password, address } = req.validatedBody;

    // Check if user already exists by email
    const existingUserEmail = await User.findOne({ email });
    if (existingUserEmail) {
      return sendErrorResponse(res, 409, 'Email already registered');
    }

    // Check if user already exists by phone
    const existingUserPhone = await User.findOne({ phone });
    if (existingUserPhone) {
      return sendErrorResponse(res, 409, 'Phone number already registered');
    }

    // Create new user
    const user = new User({
      name,
      email,
      phone,
      password,
    });

    // Add address if provided
    if (address && (address.street || address.city || address.state || address.pincode)) {
      user.addresses.push({
        name: address.name || name,
        phone: address.phone || phone,
        street: address.street,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        isDefault: true // First address is default
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
      'User registered successfully'
    );
  })
);

// User Login
router.post(
  '/login',
  loginLimiter,
  validateUserLogin,
  asyncHandler(async (req, res) => {
    const { email, password } = req.validatedBody;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return sendErrorResponse(res, 401, 'Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return sendErrorResponse(res, 401, 'Invalid email or password');
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
