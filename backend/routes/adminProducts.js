import express from 'express';
import Product from '../models/Product.js';
import { verifyAdminToken } from '../middleware/auth.js';
import { asyncHandler, sendErrorResponse, sendSuccessResponse } from '../utils/helpers.js';

const router = express.Router();

// Get products for admin inventory management
router.get(
  '/',
  verifyAdminToken,
  asyncHandler(async (req, res) => {
    const products = await Product.find({
      isHidden: false,
      $or: [
        { productType: 'deliverable' },
        { isDeliverable: true },
        { isHeroProduct: true },
      ],
      $and: [
        {
          $or: [
            { parentProduct: { $exists: false } },
            { parentProduct: '' },
            { flavour: { $regex: '[A-Za-z0-9]' } },
          ],
        },
      ],
    })
      .sort({ category: 1, name: 1, flavour: 1 })
      .select('productId name category flavour price stockQuantity lowStockThreshold isHidden productType isDeliverable isHeroProduct updatedAt');

    sendSuccessResponse(res, 200, products);
  })
);

// Update stock and/or price for a product
router.patch(
  '/:productId',
  verifyAdminToken,
  asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const { stockQuantity, price, lowStockThreshold } = req.body;

    const parsedProductId = parseInt(productId, 10);
    if (Number.isNaN(parsedProductId)) {
      return sendErrorResponse(res, 400, 'Invalid product id');
    }

    const updates = {};

    if (stockQuantity !== undefined) {
      const parsedStock = Number(stockQuantity);
      if (!Number.isFinite(parsedStock) || parsedStock < 0) {
        return sendErrorResponse(res, 400, 'stockQuantity must be a non-negative number');
      }
      updates.stockQuantity = Math.floor(parsedStock);
    }

    if (price !== undefined) {
      const parsedPrice = Number(price);
      if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
        return sendErrorResponse(res, 400, 'price must be a non-negative number');
      }
      updates.price = Math.round(parsedPrice);
    }

    if (lowStockThreshold !== undefined) {
      const parsedThreshold = Number(lowStockThreshold);
      if (!Number.isFinite(parsedThreshold) || parsedThreshold < 0) {
        return sendErrorResponse(res, 400, 'lowStockThreshold must be a non-negative number');
      }
      updates.lowStockThreshold = Math.floor(parsedThreshold);
    }

    if (!Object.keys(updates).length) {
      return sendErrorResponse(res, 400, 'At least one valid field is required');
    }

    const product = await Product.findOneAndUpdate(
      { productId: parsedProductId },
      updates,
      { new: true }
    );

    if (!product) {
      return sendErrorResponse(res, 404, 'Product not found');
    }

    sendSuccessResponse(res, 200, product, 'Product inventory updated');
  })
);

export default router;
