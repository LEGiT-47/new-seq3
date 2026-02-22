import express from 'express';
import Gifting from '../models/Gifting.js';
import { asyncHandler, sendErrorResponse, sendSuccessResponse } from '../utils/helpers.js';

const router = express.Router();

// Get all gifting products
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { category, isFestive } = req.query;

    let query = { isActive: true };

    if (category) {
      query.category = category;
    }

    if (isFestive === 'true') {
      query.isFestive = true;
    }

    const products = await Gifting.find(query).sort({ isPopular: -1, createdAt: -1 });

    sendSuccessResponse(res, 200, products, 'Gifting products fetched successfully');
  })
);

// Get festive products only
router.get(
  '/festive/all',
  asyncHandler(async (req, res) => {
    const products = await Gifting.find({ isFestive: true, isActive: true }).sort({ isPopular: -1, createdAt: -1 });

    if (products.length === 0) {
      return sendSuccessResponse(res, 200, [], 'No festive products available');
    }

    sendSuccessResponse(res, 200, products, 'Festive products fetched successfully');
  })
);

// Get product by ID
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const product = await Gifting.findById(id);

    if (!product) {
      return sendErrorResponse(res, 404, 'Gifting product not found');
    }

    sendSuccessResponse(res, 200, product);
  })
);

// Get products by category
router.get(
  '/category/:category',
  asyncHandler(async (req, res) => {
    const { category } = req.params;

    const products = await Gifting.find({ category, isActive: true }).sort({ isPopular: -1, createdAt: -1 });

    sendSuccessResponse(res, 200, products, `Products in ${category} category fetched successfully`);
  })
);

export default router;
