import express from 'express';
import Order from '../models/Order.js';
import PaymentTransaction from '../models/PaymentTransaction.js';
import Product from '../models/Product.js';
import { verifyUserToken } from '../middleware/auth.js';
import { paymentInitiateLimiter, paymentLimiter } from '../middleware/rateLimiter.js';
import { validateOrderCreation, validatePaymentVerification } from '../middleware/validation.js';
import {
  generateOrderNumber,
  calculateOrderTotal,
  asyncHandler,
  sendErrorResponse,
  sendSuccessResponse,
  areAllItemsDeliverable,
  verifyRazorpaySignature,
} from '../utils/helpers.js';
import axios from 'axios';

const router = express.Router();

// Create Order (Protected)
router.post(
  '/create',
  verifyUserToken,
  validateOrderCreation,
  asyncHandler(async (req, res) => {
    const { items, deliveryAddress } = req.validatedBody;
    const userId = req.userId;

    // Verify all items are deliverable
    if (!areAllItemsDeliverable(items)) {
      return sendErrorResponse(res, 400, 'Not all items in this order are deliverable. Please contact us via WhatsApp for non-deliverable items.');
    }

    // Fetch product details and verify prices
    const enrichedItems = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findOne({ productId: item.productId });
        if (!product) {
          throw new Error(`Product ${item.productId} not found`);
        }

        if (!product.isDeliverable) {
          throw new Error(`Product ${product.name} is not available for online purchase`);
        }

        return {
          productId: product.productId,
          productName: product.name,
          quantity: item.quantity,
          price: product.price,
          selectedOptions: item.selectedOptions || {},
        };
      })
    );

    // Calculate total
    const totalAmount = calculateOrderTotal(enrichedItems);

    // Create order
    const orderNumber = generateOrderNumber();
    const order = new Order({
      orderNumber,
      userId,
      items: enrichedItems,
      customerDetails: {
        name: deliveryAddress.name,
        email: req.user?.email || '',
        phone: deliveryAddress.phone,
      },
      deliveryAddress,
      totalAmount,
      paymentStatus: 'pending',
      deliveryStatus: 'pending',
    });

    await order.save();

    sendSuccessResponse(
      res,
      201,
      {
        order: {
          id: order._id,
          orderNumber: order.orderNumber,
          totalAmount: order.totalAmount,
          items: order.items,
        },
      },
      'Order created successfully'
    );
  })
);

// Get user orders (Protected)
router.get(
  '/my-orders',
  verifyUserToken,
  asyncHandler(async (req, res) => {
    const orders = await Order.find({ userId: req.userId }).sort({ createdAt: -1 });

    sendSuccessResponse(res, 200, orders);
  })
);

// Get single order (Protected)
router.get(
  '/:orderId',
  verifyUserToken,
  asyncHandler(async (req, res) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order || order.userId.toString() !== req.userId) {
      return sendErrorResponse(res, 404, 'Order not found');
    }

    sendSuccessResponse(res, 200, order);
  })
);

// Initiate Razorpay payment (Protected)
router.post(
  '/payment/initiate',
  verifyUserToken,
  paymentInitiateLimiter,
  asyncHandler(async (req, res) => {
    const { orderId } = req.body;

    // Find order
    const order = await Order.findById(orderId);
    if (!order || order.userId.toString() !== req.userId) {
      return sendErrorResponse(res, 404, 'Order not found');
    }

    if (order.paymentStatus === 'paid') {
      return sendErrorResponse(res, 400, 'This order has already been paid');
    }

    // Check if there's an active payment attempt
    const recentAttempt = await PaymentTransaction.findOne({
      orderId,
      status: 'pending',
      createdAt: { $gte: new Date(Date.now() - 5 * 60 * 1000) }, // Last 5 minutes
    });

    if (recentAttempt) {
      return sendErrorResponse(res, 429, 'Payment request already in progress. Please wait or complete the payment.');
    }

    // Update order with payment attempt
    order.paymentAttempts += 1;
    order.lastPaymentAttemptAt = new Date();
    await order.save();

    // Create Razorpay order
    try {
      const razorpayResponse = await axios.post(
        'https://api.razorpay.com/v1/orders',
        {
          amount: Math.round(order.totalAmount * 100), // Convert to paise
          currency: 'INR',
          receipt: order.orderNumber,
          notes: {
            orderId: order._id.toString(),
            customerName: order.customerDetails.name,
          },
        },
        {
          auth: {
            username: process.env.RAZORPAY_KEY_ID || 'test_key',
            password: process.env.RAZORPAY_KEY_SECRET || 'test_secret',
          },
        }
      );

      // Create payment transaction record
      const paymentTx = new PaymentTransaction({
        orderId,
        amount: order.totalAmount,
        razorpayOrderId: razorpayResponse.data.id,
        status: 'initiated',
        userIp: req.ip,
        attemptNumber: order.paymentAttempts,
      });

      await paymentTx.save();

      // Update order with Razorpay order ID
      order.razorpayOrderId = razorpayResponse.data.id;
      await order.save();

      sendSuccessResponse(
        res,
        200,
        {
          razorpayOrderId: razorpayResponse.data.id,
          amount: order.totalAmount,
          keyId: process.env.RAZORPAY_KEY_ID,
          orderNumber: order.orderNumber,
        },
        'Payment request created'
      );
    } catch (error) {
      console.error('Razorpay API Error:', error);
      return sendErrorResponse(res, 500, 'Failed to create payment request');
    }
  })
);

// Verify payment (Protected)
router.post(
  '/payment/verify',
  verifyUserToken,
  paymentLimiter,
  validatePaymentVerification,
  asyncHandler(async (req, res) => {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } = req.validatedBody;

    // Find order
    const order = await Order.findById(orderId);
    if (!order || order.userId.toString() !== req.userId) {
      return sendErrorResponse(res, 404, 'Order not found');
    }

    if (order.paymentStatus === 'paid') {
      return sendErrorResponse(res, 400, 'Order already paid');
    }

    // Verify Razorpay signature
    const isSignatureValid = verifyRazorpaySignature(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    );

    if (!isSignatureValid) {
      // Log failed verification attempts for security
      console.error(`Payment signature verification failed for order ${orderId}`);

      // Update payment transaction status to failed
      const paymentTx = await PaymentTransaction.findOne({ razorpayOrderId });
      if (paymentTx) {
        paymentTx.status = 'failed';
        await paymentTx.save();
      }

      return sendErrorResponse(res, 400, 'Payment verification failed. Invalid signature.');
    }

    // Signature is valid, mark order as paid
    order.paymentStatus = 'paid';
    order.razorpayOrderId = razorpayOrderId;
    order.razorpayPaymentId = razorpayPaymentId;
    order.razorpaySignature = razorpaySignature;
    order.deliveryStatus = 'pending';

    await order.save();

    // Update payment transaction
    const paymentTx = await PaymentTransaction.findOne({ razorpayOrderId });
    if (paymentTx) {
      paymentTx.status = 'success';
      paymentTx.razorpayPaymentId = razorpayPaymentId;
      await paymentTx.save();
    }

    sendSuccessResponse(
      res,
      200,
      {
        order: {
          id: order._id,
          orderNumber: order.orderNumber,
          paymentStatus: order.paymentStatus,
          deliveryStatus: order.deliveryStatus,
        },
      },
      'Payment verified successfully'
    );
  })
);

export default router;
