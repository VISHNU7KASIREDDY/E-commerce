import api from './api';
import { v4 as uuidv4 } from 'uuid';

const getGuestId = () => {
  let guestId = localStorage.getItem('guestId');
  if (!guestId) {
    guestId = uuidv4();
    localStorage.setItem('guestId', guestId);
  }
  return guestId;
};

export const cartService = {

  getCart: async (userId) => {
    const guestId = getGuestId();
    const response = await api.get('/cart', {
      params: { userId, guestId },
    });
    return response.data;
  },

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

  mergeCart: async () => {
    const guestId = localStorage.getItem('guestId');
    if (!guestId) return null;
    
    const response = await api.post('/cart/merge', { guestId });
    localStorage.removeItem('guestId'); 
    return response.data;
  },

  getGuestId,
};
