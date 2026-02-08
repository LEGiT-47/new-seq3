import React, { createContext, useContext, useState } from 'react';

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

  const addToCart = (product, quantity = 1, options = {}) => {
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
  };

  const removeFromCart = (cartItemId) => {
    setCartItems(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.cartItemId === cartItemId
          ? { ...item, quantity }
          : item
      )
    );
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

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const generateWhatsAppMessage = () => {
    let message = 'Hello! I would like to order the following items:\n\n';

    cartItems.forEach((item, index) => {
      message += `${index + 1}. ${item.name}`;

      if (item.selectedCoating || item.selectedFlavor) {
        const details = [];
        if (item.selectedCoating) details.push(`Coating: ${item.selectedCoating}`);
        if (item.selectedFlavor) details.push(`Flavor: ${item.selectedFlavor}`);
        message += `\n   (${details.join(', ')})`;
      }

      message += '\n';
    });

    message += '\nPlease let me know the total price and availability. Thank you!';
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
    generateWhatsAppMessage
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
