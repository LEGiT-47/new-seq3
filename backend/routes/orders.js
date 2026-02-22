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

// Prepare Order (Validate and calculate total without creating order)
router.post(
  '/prepare',
  verifyUserToken,
  validateOrderCreation,
  asyncHandler(async (req, res) => {
    const { items, deliveryAddress } = req.validatedBody;

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

    sendSuccessResponse(
      res,
      200,
      {
        items: enrichedItems,
        totalAmount,
        deliveryAddress,
      },
      'Order prepared for payment'
    );
  })
);

// Create Order (Protected) - Called after payment verification
router.post(
  '/create',
  verifyUserToken,
  asyncHandler(async (req, res) => {
    const { items, deliveryAddress, razorpayOrderId } = req.body;
    const userId = req.userId;

    // Verify Razorpay order exists and is paid
    const paymentTx = await PaymentTransaction.findOne({
      razorpayOrderId,
      status: 'success',
    });

    if (!paymentTx) {
      return sendErrorResponse(res, 400, 'Payment not verified. Cannot create order.');
    }

    // Verify this order hasn't been created yet
    const existingOrder = await Order.findOne({
      razorpayOrderId,
    });

    if (existingOrder) {
      return sendSuccessResponse(
        res,
        200,
        {
          order: {
            id: existingOrder._id,
            orderNumber: existingOrder.orderNumber,
            totalAmount: existingOrder.totalAmount,
            items: existingOrder.items,
          },
        },
        'Order already exists'
      );
    }

    // Calculate total to verify
    const totalAmount = calculateOrderTotal(items);

    // Create order
    const orderNumber = generateOrderNumber();
    const order = new Order({
      orderNumber,
      userId,
      items,
      customerDetails: {
        name: deliveryAddress.name,
        email: req.user?.email || '',
        phone: deliveryAddress.phone,
      },
      deliveryAddress,
      totalAmount,
      paymentStatus: 'paid',
      deliveryStatus: 'pending',
      razorpayOrderId,
    });

    await order.save();

    // Update payment transaction with order reference
    paymentTx.orderId = order._id;
    await paymentTx.save();

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

// Initiate Razorpay payment (Protected) - Without requiring DB order
router.post(
  '/payment/initiate',
  verifyUserToken,
  paymentInitiateLimiter,
  asyncHandler(async (req, res) => {
    const { items, deliveryAddress, totalAmount } = req.body;
    const userId = req.userId;

    if (!items || !items.length || !totalAmount || !deliveryAddress) {
      return sendErrorResponse(res, 400, 'Missing required order data');
    }

    // Verify all items are deliverable
    if (!areAllItemsDeliverable(items)) {
      return sendErrorResponse(res, 400, 'Not all items in this order are deliverable.');
    }

    // Verify prices haven't changed (fetch fresh product prices)
    const enrichedItems = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findOne({ productId: item.productId });
        if (!product) {
          throw new Error(`Product ${item.productId} not found`);
        }

        if (product.price !== item.price) {
          throw new Error(`Price mismatch for ${product.name}. Please refresh and try again.`);
        }

        return item;
      })
    );

    // Verify total calculation
    const calculatedTotal = calculateOrderTotal(enrichedItems);
    if (Math.abs(calculatedTotal - totalAmount) > 0.01) {
      return sendErrorResponse(res, 400, 'Total amount mismatch. Please refresh and try again.');
    }

    // Generate order number for receipt
    const orderNumber = generateOrderNumber();

    // Create Razorpay order
    try {
      const razorpayResponse = await axios.post(
        'https://api.razorpay.com/v1/orders',
        {
          amount: Math.round(totalAmount * 100), // Convert to paise
          currency: 'INR',
          receipt: orderNumber,
          notes: {
            customerName: deliveryAddress.name,
            userId: userId,
          },
        },
        {
          auth: {
            username: process.env.RAZORPAY_KEY_ID || 'test_key',
            password: process.env.RAZORPAY_KEY_SECRET || 'test_secret',
          },
        }
      );

      // Create payment transaction record (no orderId yet)
      const paymentTx = new PaymentTransaction({
        amount: totalAmount,
        razorpayOrderId: razorpayResponse.data.id,
        status: 'initiated',
        userIp: req.ip,
        attemptNumber: 1,
      });

      await paymentTx.save();

      sendSuccessResponse(
        res,
        200,
        {
          razorpayOrderId: razorpayResponse.data.id,
          amount: totalAmount,
          keyId: process.env.RAZORPAY_KEY_ID,
          orderNumber,
        },
        'Payment request created'
      );
    } catch (error) {
      console.error('Razorpay API Error:', error);
      return sendErrorResponse(res, 500, 'Failed to create payment request');
    }
  })
);

// Verify payment (Protected) - Verifies signature and prepares order data
router.post(
  '/payment/verify',
  verifyUserToken,
  paymentLimiter,
  validatePaymentVerification,
  asyncHandler(async (req, res) => {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.validatedBody;

    // Verify Razorpay signature
    const isSignatureValid = verifyRazorpaySignature(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    );

    if (!isSignatureValid) {
      console.error(`Payment signature verification failed for razorpay order ${razorpayOrderId}`);

      // Update payment transaction status to failed
      const paymentTx = await PaymentTransaction.findOne({ razorpayOrderId });
      if (paymentTx) {
        paymentTx.status = 'failed';
        await paymentTx.save();
      }

      return sendErrorResponse(res, 400, 'Payment verification failed. Invalid signature.');
    }

    // Signature is valid, update payment transaction
    const paymentTx = await PaymentTransaction.findOne({ razorpayOrderId });
    if (paymentTx) {
      paymentTx.status = 'success';
      paymentTx.razorpayPaymentId = razorpayPaymentId;
      await paymentTx.save();
    } else {
      // Create payment transaction if it doesn't exist
      const newPaymentTx = new PaymentTransaction({
        razorpayOrderId,
        razorpayPaymentId,
        status: 'success',
        userIp: req.ip,
        attemptNumber: 1,
      });
      await newPaymentTx.save();
    }

    sendSuccessResponse(
      res,
      200,
      {
        message: 'Payment verified successfully. Order will be created next.',
        razorpayOrderId,
      },
      'Payment verified'
    );
  })
);

export default router;
