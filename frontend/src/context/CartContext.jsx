import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [cart, setCart] = useState({ products: [], totalPrice: 0 });
  const [loading, setLoading] = useState(false);
  const [itemCount, setItemCount] = useState(0);
  const prevUserIdRef = React.useRef();

  // Fetch cart when auth loading completes or when userId changes
  useEffect(() => {
    const currentUserId = user?._id;
    
    // Only fetch if:
    // 1. Auth has finished loading, AND
    // 2. UserId has actually changed (including from undefined to a value)
    if (!authLoading && prevUserIdRef.current !== currentUserId) {
      console.log('Fetching cart - userId changed from', prevUserIdRef.current, 'to', currentUserId);
      prevUserIdRef.current = currentUserId;
      fetchCart();
    }
  }, [authLoading, user?._id]);

  //Calculate item count whenever cart changes
  useEffect(() => {
    if (cart && cart.products) {
      const count = cart.products.reduce((total, item) => total + item.quantity, 0);
      setItemCount(count);
    } else {
      setItemCount(0);
    }
  }, [cart]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const userId = user?._id;
      console.log('Fetching cart for userId:', userId);
      const cartData = await cartService.getCart(userId);
      console.log('Cart fetched successfully:', cartData);
      
      // Only update cart if we got valid data
      if (cartData) {
        setCart(cartData);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      // If it's a 404, that means no cart exists yet - this is OK, keep current cart
      if (error.response?.status === 404) {
        console.log('No cart found (404), keeping current cart state');
        // Don't update cart on 404 - the empty cart from state initialization is fine
      } else {
        console.error('Server error fetching cart:', error);
        // On server errors, don't clear the cart
      }
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity, size, category) => {
    try {
      const userId = user?._id;
      const updatedCart = await cartService.addToCart(
        productId,
        quantity,
        size,
        category,
        userId
      );
      setCart(updatedCart);
      return updatedCart;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  };

  const updateQuantity = async (productId, quantity, size, category) => {
    try {
      const userId = user?._id;
      const updatedCart = await cartService.updateCartQuantity(
        productId,
        quantity,
        size,
        category,
        userId
      );
      setCart(updatedCart);
      return updatedCart;
    } catch (error) {
      console.error('Error updating cart:', error);
      throw error;
    }
  };

  const removeFromCart = async (productId, size, category) => {
    try {
      const userId = user?._id;
      const updatedCart = await cartService.removeFromCart(
        productId,
        size,
        category,
        userId
      );
      setCart(updatedCart);
      return updatedCart;
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  };

  const getTotalPrice = () => {
    return cart?.totalPrice || 0;
  };

  const value = {
    cart,
    loading,
    itemCount,
    addToCart,
    updateQuantity,
    removeFromCart,
    fetchCart,
    getTotalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
