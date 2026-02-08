import express from 'express';
import Order from '../models/Order.js';
import PaymentTransaction from '../models/PaymentTransaction.js';
import { verifyUserToken } from '../middleware/auth.js';
import { asyncHandler, sendErrorResponse, sendSuccessResponse } from '../utils/helpers.js';

const router = express.Router();

// Get Razorpay key for frontend (Public route)
router.get('/config/razorpay-key', (req, res) => {
  const keyId = process.env.RAZORPAY_KEY_ID || 'test_key';
  sendSuccessResponse(res, 200, { keyId });
});

// Get payment status for an order (Protected)
router.get(
  '/status/:orderId',
  verifyUserToken,
  asyncHandler(async (req, res) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order || order.userId.toString() !== req.userId) {
      return sendErrorResponse(res, 404, 'Order not found');
    }

    const transactions = await PaymentTransaction.find({ orderId }).sort({ createdAt: -1 });

    sendSuccessResponse(res, 200, {
      orderId,
      orderNumber: order.orderNumber,
      paymentStatus: order.paymentStatus,
      totalAmount: order.totalAmount,
      transactions,
      lastAttempt: transactions[0] || null,
    });
  })
);

// Webhook handler for Razorpay (when account is ready)
router.post('/webhook/razorpay', asyncHandler(async (req, res) => {
  // This will be implemented when Razorpay account is ready
  // For now, just acknowledge the webhook
  console.log('Razorpay webhook received:', req.body);

  res.status(200).json({
    success: true,
    message: 'Webhook received (implementation pending)',
  });
}));

export default router;
