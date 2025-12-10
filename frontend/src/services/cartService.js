import api from './api';
import { v4 as uuidv4 } from 'uuid';

// Generate or get guest ID
const getGuestId = () => {
  let guestId = localStorage.getItem('guestId');
  if (!guestId) {
    guestId = uuidv4();
    localStorage.setItem('guestId', guestId);
  }
  return guestId;
};

export const cartService = {
  // Get cart for user or guest
  getCart: async (userId) => {
    const guestId = getGuestId();
    const response = await api.get('/cart', {
      params: { userId, guestId },
    });
    return response.data;
  },

  // Add item to cart
  addToCart: async (productId, quantity, size, category, userId) => {
    const guestId = getGuestId();
    const response = await api.post('/cart', {
      productId,
      quantity,
      size,
      category,
      userId,
      guestId,
    });
    return response.data;
  },

  // Update cart item quantity
  updateCartQuantity: async (productId, quantity, size, category, userId) => {
    const guestId = getGuestId();
    const response = await api.put('/cart', {
      productId,
      quantity,
      size,
      category,
      userId,
      guestId,
    });
    return response.data;
  },

  // Remove item from cart
  removeFromCart: async (productId, size, category, userId) => {
    const guestId = getGuestId();
    const response = await api.delete('/cart', {
      data: {
        productId,
        size,
        category,
        userId,
        guestId,
      },
    });
    return response.data;
  },

  // Merge guest cart with user cart after login
  mergeCart: async () => {
    const guestId = localStorage.getItem('guestId');
    if (!guestId) return null;
    
    const response = await api.post('/cart/merge', { guestId });
    localStorage.removeItem('guestId'); // Clear guest ID after merge
    return response.data;
  },

  // Get guest ID
  getGuestId,
};
