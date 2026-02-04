import api from './api';

export const productService = {

  getProducts: async (category) => {
    try {
      const url = category ? `/products?category=${category}` : '/products';
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  getProductsByCategory: async (category) => {
    return productService.getProducts(category);
  },
};
