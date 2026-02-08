import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// Generate user JWT token
export const generateUserToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'user_secret_key',
    { expiresIn: '30d' }
  );
};

// Generate admin JWT token
export const generateAdminToken = (adminId) => {
  return jwt.sign(
    { id: adminId },
    process.env.ADMIN_JWT_SECRET || 'admin_secret_key',
    { expiresIn: '7d' }
  );
};

// Generate unique order number
export const generateOrderNumber = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORD-${timestamp}-${random}`;
};

// Generate Razorpay order ID prefix (for internal tracking)
export const generateRazorpayOrderPrefix = () => {
  return crypto.randomBytes(6).toString('hex').toUpperCase();
};

// Format currency
export const formatCurrency = (amount) => {
  return `₹${parseFloat(amount).toFixed(2)}`;
};

// Calculate order total
export const calculateOrderTotal = (items) => {
  return items.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
};

// Error handler helper
export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Async handler wrapper
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Check if product is deliverable
export const isDeliverableProduct = (productId) => {
  // Products 21, 22, 23 are deliverable (Dry Fruits, Makhana, Gud Chana)
  // Update this based on your actual product IDs
  const deliverableProductIds = [21, 22, 23, 29]; // Almonds, Cashew, Pistachio, Makhana, Chana
  return deliverableProductIds.includes(productId);
};

// Check if all items in order are deliverable
export const areAllItemsDeliverable = (items) => {
  return items.every((item) => isDeliverableProduct(item.productId));
};

// Send error response
export const sendErrorResponse = (res, statusCode, message) => {
  return res.status(statusCode).json({
    success: false,
    error: message,
  });
};

// Send success response
export const sendSuccessResponse = (res, statusCode, data, message = 'Success') {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};