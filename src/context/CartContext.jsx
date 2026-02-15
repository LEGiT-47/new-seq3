import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { cartAPI } from '../lib/api';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, user } = useAuth();

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('guestCart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading saved cart:', error);
      }
    }
  }, []);

  // Load cart from backend when user authenticates
  useEffect(() => {
    const loadAuthenticatedCart = async () => {
      if (isAuthenticated && user) {
        try {
          setIsLoading(true);
          const response = await cartAPI.getCart();
          setCartItems(response.data.data || []);
          // Clear guest cart when switching to authenticated
          localStorage.removeItem('guestCart');
        } catch (error) {
          console.error('Error loading cart from backend:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadAuthenticatedCart();
  }, [isAuthenticated, user]);

  // Save cart to localStorage or backend
  useEffect(() => {
    if (isAuthenticated && user) {
      // For authenticated users, cart is saved to backend via individual API calls
      // No need to save to localStorage
    } else {
      // For guest users, save to localStorage
      localStorage.setItem('guestCart', JSON.stringify(cartItems));
    }
  }, [cartItems, isAuthenticated, user]);

  const addToCart = async (product, quantity = 1, options = {}) => {
    setCartItems(prev => {
      const cartItemId = `${product.id}-${options.coating || ''}-${options.flavor || ''}`;
      const existingItem = prev.find(item =>
        item.id === product.id &&
        item.selectedCoating === options.coating &&
        item.selectedFlavor === options.flavor
      );
      if (existingItem) {
        return prev.map(item =>
          item === existingItem
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, {
        ...product,
        cartItemId,
        quantity,
        selectedCoating: options.coating || null,
        selectedFlavor: options.flavor || null
      }];
    });

    // Sync with backend if authenticated
    if (isAuthenticated && user) {
      try {
        await cartAPI.addToCart({
          productId: product.id,
          quantity,
          selectedCoating: options.coating || null,
          selectedFlavor: options.flavor || null
        });
      } catch (error) {
        console.error('Error syncing cart with backend:', error);
      }
    }
  };

  const removeFromCart = async (cartItemId) => {
    const itemToRemove = cartItems.find(item => item.cartItemId === cartItemId);
    setCartItems(prev => prev.filter(item => item.cartItemId !== cartItemId));

    // Sync with backend if authenticated
    if (isAuthenticated && user && itemToRemove) {
      try {
        await cartAPI.removeFromCart(
          itemToRemove.id,
          itemToRemove.selectedCoating,
          itemToRemove.selectedFlavor
        );
      } catch (error) {
        console.error('Error syncing removal with backend:', error);
      }
    }
  };

  const updateQuantity = async (cartItemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    const item = cartItems.find(i => i.cartItemId === cartItemId);
    setCartItems(prev =>
      prev.map(item =>
        item.cartItemId === cartItemId
          ? { ...item, quantity }
          : item
      )
    );

    // Sync with backend if authenticated
    if (isAuthenticated && user && item) {
      try {
        await cartAPI.updateCart(item.id, {
          quantity,
          selectedCoating: item.selectedCoating,
          selectedFlavor: item.selectedFlavor
        });
      } catch (error) {
        console.error('Error updating cart quantity on backend:', error);
      }
    }
  };

  const updateCartItemOptions = (cartItemId, options) => {
    setCartItems(prev => {
      const item = prev.find(i => i.cartItemId === cartItemId);
      if (!item) return prev;

      const newCoating = options.coating !== undefined ? options.coating : item.selectedCoating;
      const newFlavor = options.flavor !== undefined ? options.flavor : item.selectedFlavor;
      const newCartItemId = `${item.id}-${newCoating || ''}-${newFlavor || ''}`;

      // Check if an item with these new options already exists
      const existingItem = prev.find(i =>
        i.id === item.id &&
        i.selectedCoating === newCoating &&
        i.selectedFlavor === newFlavor &&
        i.cartItemId !== cartItemId
      );

      if (existingItem) {
        // Merge quantities if item with same options exists
        return prev
          .filter(i => i.cartItemId !== cartItemId)
          .map(i =>
            i.cartItemId === existingItem.cartItemId
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          );
      }

      // Update the item with new options
      return prev.map(i =>
        i.cartItemId === cartItemId
          ? {
              ...i,
              cartItemId: newCartItemId,
              selectedCoating: newCoating,
              selectedFlavor: newFlavor
            }
          : i
      );
    });
  };

  const clearCart = async () => {
    setCartItems([]);

    // Sync with backend if authenticated
    if (isAuthenticated && user) {
      try {
        await cartAPI.clearCart();
      } catch (error) {
        console.error('Error clearing cart on backend:', error);
      }
    } else {
      localStorage.removeItem('guestCart');
    }
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getDeliveryItems = () => {
    return cartItems.filter(item => item.isDeliverable);
  };

  const getWhatsAppItems = () => {
    return cartItems.filter(item => !item.isDeliverable);
  };

  const generateWhatsAppMessage = (items = cartItems) => {
    let message = 'Hello! I would like to order the following items:\n\n';

    items.forEach((item, index) => {
      message += `${index + 1}. ${item.name}`;

      if (item.selectedCoating || item.selectedFlavor) {
        const details = [];
        if (item.selectedCoating) details.push(`Coating: ${item.selectedCoating}`);
        if (item.selectedFlavor) details.push(`Flavor: ${item.selectedFlavor}`);
        message += `\n   (${details.join(', ')})`;
      }

      message += `\n   Qty: ${item.quantity} x ₹${item.price}\n`;
    });

    let total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    message += `\nTotal: ₹${total}\n`;
    message += '\nPlease let me know the availability. Thank you!';
    return encodeURIComponent(message);
  };

  const value = {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    updateCartItemOptions,
    clearCart,
    getTotalItems,
    getTotalPrice,
    generateWhatsAppMessage,
    getDeliveryItems,
    getWhatsAppItems,
    isLoading
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
