import api from './api';

export const productService = {
  // Get all products with optional category filter
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

  // Get single product by ID
  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Get products by category (convenience method)
  getProductsByCategory: async (category) => {
    return productService.getProducts(category);
  },
};
