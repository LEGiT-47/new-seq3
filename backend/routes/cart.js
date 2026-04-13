import express from 'express';
import { verifyUserToken } from '../middleware/auth.js';
import User from '../models/User.js';
import Product from '../models/Product.js';

const router = express.Router();

// Get user's cart
router.get('/cart', verifyUserToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const productIds = (user.cart || []).map((item) => item.productId);
    const productStocks = await Product.find({ productId: { $in: productIds } })
      .select('productId stockQuantity price')
      .lean();

    const stockMap = new Map(productStocks.map((product) => [product.productId, product]));

    const syncedCart = (user.cart || []).map((item) => {
      const latestProduct = stockMap.get(item.productId);
      return {
        ...item.toObject(),
        stockQuantity: latestProduct?.stockQuantity ?? item.stockQuantity ?? 0,
        price: latestProduct?.price ?? item.price,
      };
    });

    res.json({
      success: true,
      data: syncedCart
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

// Add or update item in cart
router.post('/cart/add', verifyUserToken, async (req, res) => {
  try {
    const { productId, quantity, selectedCoating, selectedFlavor } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const product = await Product.findOne({ productId });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.cart) {
      user.cart = [];
    }

    // Check if item with same product and options already exists
    const existingItemIndex = user.cart.findIndex(
      item =>
        item.productId === productId &&
        item.selectedCoating === (selectedCoating || null) &&
        item.selectedFlavor === (selectedFlavor || null)
    );

    if (existingItemIndex > -1) {
      // Update quantity if item exists
      const updatedQuantity = user.cart[existingItemIndex].quantity + quantity;
      const availableStock = product.stockQuantity ?? 0;

      if (updatedQuantity > availableStock) {
        return res.status(400).json({
          error: `Only ${availableStock} units available in stock`,
          availableStock,
        });
      }

      user.cart[existingItemIndex].quantity = updatedQuantity;
      user.cart[existingItemIndex].stockQuantity = availableStock;
    } else {
      const availableStock = product.stockQuantity ?? 0;
      if (quantity > availableStock) {
        return res.status(400).json({
          error: `Only ${availableStock} units available in stock`,
          availableStock,
        });
      }

      // Add new item
      user.cart.push({
        productId,
        name: product.name,
        price: product.price,
        quantity,
        selectedCoating: selectedCoating || null,
        selectedFlavor: selectedFlavor || null,
        image: product.image,
        category: product.category,
        isDeliverable: product.isDeliverable || false,
        stockQuantity: availableStock,
      });
    }

    await user.save();

    res.json({
      success: true,
      data: user.cart,
      message: 'Item added to cart'
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
});

// Update cart item quantity
router.patch('/cart/update/:productId', verifyUserToken, async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity, selectedCoating, selectedFlavor } = req.body;

    const product = await Product.findOne({ productId: parseInt(productId) }).select('stockQuantity');
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const availableStock = product.stockQuantity ?? 0;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const itemIndex = user.cart.findIndex(
      item =>
        item.productId === parseInt(productId) &&
        item.selectedCoating === (selectedCoating || null) &&
        item.selectedFlavor === (selectedFlavor || null)
    );

    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      user.cart.splice(itemIndex, 1);
    } else {
      if (quantity > availableStock) {
        return res.status(400).json({
          error: `Only ${availableStock} units available in stock`,
          availableStock,
        });
      }

      user.cart[itemIndex].quantity = quantity;
      user.cart[itemIndex].stockQuantity = availableStock;
    }

    await user.save();

    res.json({
      success: true,
      data: user.cart,
      message: 'Cart updated'
    });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ error: 'Failed to update cart' });
  }
});

// Remove item from cart
router.delete('/cart/remove/:productId', verifyUserToken, async (req, res) => {
  try {
    const { productId } = req.params;
    const { selectedCoating, selectedFlavor } = req.query;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.cart = user.cart.filter(
      item =>
        !(
          item.productId === parseInt(productId) &&
          item.selectedCoating === (selectedCoating === 'null' ? null : selectedCoating || null) &&
          item.selectedFlavor === (selectedFlavor === 'null' ? null : selectedFlavor || null)
        )
    );

    await user.save();

    res.json({
      success: true,
      data: user.cart,
      message: 'Item removed from cart'
    });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
});

// Clear entire cart
router.delete('/cart/clear', verifyUserToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.cart = [];
    await user.save();

    res.json({
      success: true,
      data: [],
      message: 'Cart cleared'
    });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});

export default router;
