import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
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

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const cartData = await cartService.getCart(user?._id);
      if (cartData) setCart(cartData);
    } catch (error) {
      if (error.response?.status !== 404) {
        console.error('Error fetching cart:', error);
      }
    } finally {
      setLoading(false);
    }
  }, [user?._id]);

  // Only re-fetch when the logged-in user changes
  useEffect(() => {
    const currentUserId = user?._id;
    if (!authLoading && prevUserIdRef.current !== currentUserId) {
      prevUserIdRef.current = currentUserId;
      fetchCart();
    }
  }, [authLoading, user?._id, fetchCart]);

  // Keep itemCount in sync with cart
  useEffect(() => {
    setItemCount(
      cart?.products?.reduce((total, item) => total + item.quantity, 0) ?? 0
    );
  }, [cart]);

  const addToCart = useCallback(async (productId, quantity, size, category) => {
    try {
      const updatedCart = await cartService.addToCart(productId, quantity, size, category, user?._id);
      setCart(updatedCart);
      return updatedCart;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  }, [user?._id]);

  const updateQuantity = useCallback(async (productId, quantity, size, category) => {
    try {
      const updatedCart = await cartService.updateCartQuantity(productId, quantity, size, category, user?._id);
      setCart(updatedCart);
      return updatedCart;
    } catch (error) {
      console.error('Error updating cart:', error);
      throw error;
    }
  }, [user?._id]);

  const removeFromCart = useCallback(async (productId, size, category) => {
    try {
      const updatedCart = await cartService.removeFromCart(productId, size, category, user?._id);
      setCart(updatedCart);
      return updatedCart;
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  }, [user?._id]);

  const getTotalPrice = useCallback(() => cart?.totalPrice || 0, [cart?.totalPrice]);

  const value = useMemo(() => ({
    cart,
    loading,
    itemCount,
    addToCart,
    updateQuantity,
    removeFromCart,
    fetchCart,
    getTotalPrice,
  }), [cart, loading, itemCount, addToCart, updateQuantity, removeFromCart, fetchCart, getTotalPrice]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
