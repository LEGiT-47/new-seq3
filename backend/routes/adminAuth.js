import express from 'express';
import Admin from '../models/Admin.js';
import {
  generateAdminToken,
  asyncHandler,
  sendErrorResponse,
  sendSuccessResponse,
} from '../utils/helpers.js';
import { verifyAdminToken } from '../middleware/auth.js';
import { loginLimiter } from '../middleware/rateLimiter.js';
import { validateAdminLogin } from '../middleware/validation.js';

const router = express.Router();

// Admin Login
router.post(
  '/login',
  loginLimiter,
  validateAdminLogin,
  asyncHandler(async (req, res) => {
    const { username, password } = req.validatedBody;

    // Find admin by username
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return sendErrorResponse(res, 401, 'Invalid username or password');
    }

    if (!admin.isActive) {
      return sendErrorResponse(res, 403, 'Admin account is inactive');
    }

    // Verify password
    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return sendErrorResponse(res, 401, 'Invalid username or password');
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate token
    const token = generateAdminToken(admin._id);

    sendSuccessResponse(
      res,
      200,
      {
        admin: {
          id: admin._id,
          username: admin.username,
          email: admin.email,
          role: admin.role,
          permissions: admin.permissions,
        },
        token,
      },
      'Admin login successful'
    );
  })
);

// Get Admin Profile (Protected)
router.get(
  '/profile',
  verifyAdminToken,
  asyncHandler(async (req, res) => {
    const admin = await Admin.findById(req.adminId);
    if (!admin) {
      return sendErrorResponse(res, 404, 'Admin not found');
    }

    sendSuccessResponse(res, 200, {
      id: admin._id,
      username: admin.username,
      email: admin.email,
      role: admin.role,
      permissions: admin.permissions,
      lastLogin: admin.lastLogin,
    });
  })
);

// Verify Admin Token
router.get(
  '/verify',
  verifyAdminToken,
  asyncHandler(async (req, res) => {
    sendSuccessResponse(res, 200, { valid: true });
  })
);

export default router;
