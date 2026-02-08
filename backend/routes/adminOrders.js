import express from 'express';
import Order from '../models/Order.js';
import PaymentTransaction from '../models/PaymentTransaction.js';
import { verifyAdminToken } from '../middleware/auth.js';
import { asyncHandler, sendErrorResponse, sendSuccessResponse } from '../utils/helpers.js';

const router = express.Router();

// Get all orders (Admin only)
router.get(
  '/',
  verifyAdminToken,
  asyncHandler(async (req, res) => {
    const { status, paymentStatus, sortBy, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (status) filter.deliveryStatus = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;

    const sortOptions = {};
    if (sortBy === 'recent') sortOptions.createdAt = -1;
    if (sortBy === 'oldest') sortOptions.createdAt = 1;
    if (sortBy === 'amount') sortOptions.totalAmount = -1;

    const skip = (page - 1) * limit;

    const orders = await Order.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(filter);

    sendSuccessResponse(res, 200, {
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  })
);

// Get order details (Admin only)
router.get(
  '/:orderId',
  verifyAdminToken,
  asyncHandler(async (req, res) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
      return sendErrorResponse(res, 404, 'Order not found');
    }

    const paymentTransactions = await PaymentTransaction.find({ orderId });

    sendSuccessResponse(res, 200, {
      order,
      paymentTransactions,
    });
  })
);

// Update order status (Admin only)
router.put(
  '/:orderId/status',
  verifyAdminToken,
  asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const { deliveryStatus, notes } = req.body;

    if (!['pending', 'shipped', 'delivered', 'cancelled'].includes(deliveryStatus)) {
      return sendErrorResponse(res, 400, 'Invalid delivery status');
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        deliveryStatus,
        ...(notes && { notes }),
      },
      { new: true }
    );

    if (!order) {
      return sendErrorResponse(res, 404, 'Order not found');
    }

    sendSuccessResponse(res, 200, order, 'Order status updated');
  })
);

// Get dashboard analytics (Admin only)
router.get(
  '/analytics/dashboard',
  verifyAdminToken,
  asyncHandler(async (req, res) => {
    const { startDate, endDate } = req.query;

    const filter = {};
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    // Total stats
    const totalOrders = await Order.countDocuments(filter);
    const totalRevenue = await Order.aggregate([
      { $match: { ...filter, paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);

    // Payment status breakdown
    const paymentBreakdown = await Order.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$paymentStatus',
          count: { $sum: 1 },
          total: { $sum: '$totalAmount' },
        },
      },
    ]);

    // Delivery status breakdown
    const deliveryBreakdown = await Order.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$deliveryStatus',
          count: { $sum: 1 },
        },
      },
    ]);

    // Product-wise sales
    const productSales = await Order.aggregate([
      { $match: filter },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.productName',
          quantity: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
          orders: { $sum: 1 },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 10 },
    ]);

    // Recent orders
    const recentOrders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .limit(10);

    sendSuccessResponse(res, 200, {
      summary: {
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        pendingOrders: paymentBreakdown.find((p) => p._id === 'pending')?.count || 0,
        paidOrders: paymentBreakdown.find((p) => p._id === 'paid')?.count || 0,
      },
      paymentBreakdown,
      deliveryBreakdown,
      productSales,
      recentOrders,
    });
  })
);

// Get payment analytics (Admin only)
router.get(
  '/analytics/payments',
  verifyAdminToken,
  asyncHandler(async (req, res) => {
    const { startDate, endDate } = req.query;

    const filter = {};
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const paymentStats = await PaymentTransaction.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
        },
      },
    ]);

    const successRate = await PaymentTransaction.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          successful: {
            $sum: {
              $cond: [{ $eq: ['$status', 'success'] }, 1, 0],
            },
          },
        },
      },
      {
        $project: {
          successRate: {
            $cond: [
              { $gt: ['$total', 0] },
              { $divide: ['$successful', '$total'] },
              0,
            ],
          },
        },
      },
    ]);

    sendSuccessResponse(res, 200, {
      paymentStats,
      successRate: successRate[0]?.successRate || 0,
    });
  })
);

// Get delivery overview (Admin only)
router.get(
  '/delivery/overview',
  verifyAdminToken,
  asyncHandler(async (req, res) => {
    const pendingDeliveries = await Order.find({
      paymentStatus: 'paid',
      deliveryStatus: 'pending',
    }).sort({ createdAt: 1 });

    const shippedDeliveries = await Order.find({
      deliveryStatus: 'shipped',
    }).sort({ createdAt: 1 });

    const completedDeliveries = await Order.find({
      deliveryStatus: 'delivered',
    }).sort({ createdAt: -1 }).limit(20);

    sendSuccessResponse(res, 200, {
      pending: pendingDeliveries,
      shipped: shippedDeliveries,
      completed: completedDeliveries,
    });
  })
);

export default router;
