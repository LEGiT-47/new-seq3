import express from 'express';
import Product from '../models/Product.js';
import { asyncHandler, sendErrorResponse, sendSuccessResponse } from '../utils/helpers.js';

const router = express.Router();

// Get all products
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const products = await Product.find({ isHidden: false });
    sendSuccessResponse(res, 200, products);
  })
);

// Get products by category
router.get(
  '/category/:category',
  asyncHandler(async (req, res) => {
    const { category } = req.params;
    const products = await Product.find({
      category,
      isHidden: false,
    });

    sendSuccessResponse(res, 200, products);
  })
);

// Get deliverable products only
router.get(
  '/deliverable/list',
  asyncHandler(async (req, res) => {
    const products = await Product.find({
      $or: [{ productType: 'deliverable' }, { isHeroProduct: true }],
      isHidden: false,
    });

    sendSuccessResponse(res, 200, products);
  })
);

// Get single product by ID
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Try to find by MongoDB _id first, then by productId
    let product = await Product.findById(id);
    if (!product) {
      product = await Product.findOne({ productId: parseInt(id) });
    }

    if (!product) {
      return sendErrorResponse(res, 404, 'Product not found');
    }

    sendSuccessResponse(res, 200, product);
  })
);

// Get bestseller products
router.get(
  '/bestseller/products',
  asyncHandler(async (req, res) => {
    const products = await Product.find({
      bestseller: true,
      isHidden: false,
    }).limit(8);

    sendSuccessResponse(res, 200, products);
  })
);

export default router;
