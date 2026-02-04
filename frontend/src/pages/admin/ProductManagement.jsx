import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discountPrice: '',
    category: 'pickles',
    sizes: ['250g'],
    sizePricing: [],
    images: [],
    isAvailable: true,
    isBestseller: false,
    isVegetarian: true,
    ingredients: '',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      alert('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const imageUrl = await adminService.uploadImage(file);
      setFormData({
        ...formData,
        images: [...formData.images, { url: imageUrl }],
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : undefined,
      };

      if (editingProduct) {
        await adminService.updateProduct(editingProduct._id, productData);
        alert('Product updated successfully!');
      } else {
        await adminService.createProduct(productData);
        alert('Product created successfully!');
      }
      setShowModal(false);
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Failed to save product';
      alert(`Error: ${errorMsg}`);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      discountPrice: product.discountPrice || '',
      category: product.category,
      sizes: product.sizes || ['250g'],
      sizePricing: product.sizePricing || [],
      images: product.images || [],
      isAvailable: product.isAvailable,
      isBestseller: product.isBestseller || false,
      isVegetarian: product.isVegetarian !== undefined ? product.isVegetarian : true,
      ingredients: product.ingredients || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await adminService.deleteProduct(id);
      alert('Product deleted successfully!');
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      discountPrice: '',
      category: 'pickles',
      sizes: ['250g'],
      sizePricing: [],
      images: [],
      isAvailable: true,
      isBestseller: false,
      isVegetarian: true,
      ingredients: '',
    });
    setEditingProduct(null);
  };

  const handleAutoGeneratePricing = () => {
    const baseSize = formData.sizes[0];
    const basePrice = parseFloat(formData.price);
    const baseDiscountPrice = formData.discountPrice ? parseFloat(formData.discountPrice) : null;

    if (!basePrice || !baseSize) {
      alert('Please enter a base price and at least one size first');
      return;
    }

    const sizeToGrams = (size) => {
      const match = size.match(/(\d+(?:\.\d+)?)(g|kg)/i);
      if (!match) return null;
      const value = parseFloat(match[1]);
      const unit = match[2].toLowerCase();
      return unit === 'kg' ? value * 1000 : value;
    };

    const calculatePrice = (base, baseS, targetS) => {
      const baseG = sizeToGrams(baseS);
      const targetG = sizeToGrams(targetS);
      if (!baseG || !targetG) return base;
      return Math.round(base * (targetG / baseG) * 100) / 100;
    };

    const newPricing = formData.sizes.map(size => ({
      size,
      price: calculatePrice(basePrice, baseSize, size),
      discountPrice: baseDiscountPrice ? calculatePrice(baseDiscountPrice, baseSize, size) : undefined,
    }));

    setFormData({ ...formData, sizePricing: newPricing });
  };

  const removeImage = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Product Management</h1>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-primary hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          Add Product
        </button>
      </div>

      {}
      <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
            {products.map((product) => (
              <tr key={product._id}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={product.images?.[0]?.url || 'https://via.placeholder.com/50'}
                      alt={product.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <div className="font-medium text-neutral-900 dark:text-white">{product.name}</div>
                      <div className="text-sm text-neutral-500 dark:text-neutral-400">
                        {product.sizes?.join(', ')}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-neutral-900 dark:text-white capitalize">
                  {product.category}
                </td>
                <td className="px-6 py-4 text-sm text-neutral-900 dark:text-white">
                  ₹{product.discountPrice || product.price}
                  {product.discountPrice && (
                    <span className="ml-2 text-neutral-500 line-through">₹{product.price}</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      product.isAvailable
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}
                  >
                    {product.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                  {product.isBestseller && (
                    <span className="ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                      Bestseller
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="text-primary hover:text-orange-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-neutral-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={3}
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Price * (for first size)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Discount Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.discountPrice}
                    onChange={(e) => {
                      const discountValue = parseFloat(e.target.value);
                      const priceValue = parseFloat(formData.price);
                      if (discountValue && priceValue && discountValue > priceValue) {
                        alert('Discount price must be less than or equal to price');
                        return;
                      }
                      setFormData({ ...formData, discountPrice: e.target.value });
                    }}
                    className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                >
                  <option value="pickles">Pickles</option>
                  <option value="podis">Podis</option>
                  <option value="spices">Spices</option>
                  <option value="snacks">Snacks</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Sizes (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.sizes.join(', ')}
                  onChange={(e) =>
                    setFormData({ ...formData, sizes: e.target.value.split(',').map((s) => s.trim()) })
                  }
                  placeholder="250g, 500g, 1kg"
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                />
              </div>

              {}
              <div className="border border-neutral-300 dark:border-neutral-600 rounded-lg p-4 bg-neutral-50 dark:bg-neutral-900">
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Size-Specific Pricing (Optional)
                  </label>
                  <button
                    type="button"
                    onClick={handleAutoGeneratePricing}
                    className="text-xs bg-primary hover:bg-orange-600 text-white px-3 py-1 rounded font-semibold"
                  >
                    Auto-Generate
                  </button>
                </div>
                
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-3">
                  Set individual prices for each size. Click "Auto-Generate" to calculate proportional prices based on the first size.
                </p>

                {formData.sizes.length > 0 && formData.sizes[0] ? (
                  <div className="space-y-2">
                    <div className="grid grid-cols-3 gap-2 text-xs font-semibold text-neutral-600 dark:text-neutral-400 px-2">
                      <div>Size</div>
                      <div>Price</div>
                      <div>Discount Price</div>
                    </div>
                    {formData.sizes.map((size, index) => {
                      const sizePriceData = formData.sizePricing.find(sp => sp.size === size) || {};
                      return (
                        <div key={index} className="grid grid-cols-3 gap-2 items-center bg-white dark:bg-neutral-800 p-2 rounded">
                          <div className="font-medium text-sm text-neutral-700 dark:text-neutral-300">
                            {size}
                          </div>
                          <input
                            type="number"
                            step="0.01"
                            placeholder="Price"
                            value={sizePriceData.price || ''}
                            onChange={(e) => {
                              const newPricing = formData.sizePricing.filter(sp => sp.size !== size);
                              if (e.target.value || sizePriceData.discountPrice) {
                                newPricing.push({
                                  size,
                                  price: parseFloat(e.target.value) || 0,
                                  discountPrice: sizePriceData.discountPrice
                                });
                              }
                              setFormData({ ...formData, sizePricing: newPricing });
                            }}
                            className="w-full px-2 py-1 text-sm border border-neutral-300 dark:border-neutral-600 rounded bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                          />
                          <input
                            type="number"
                            step="0.01"
                            placeholder="Discount"
                            value={sizePriceData.discountPrice || ''}
                            onChange={(e) => {
                              const newPricing = formData.sizePricing.filter(sp => sp.size !== size);
                              if (e.target.value || sizePriceData.price) {
                                newPricing.push({
                                  size,
                                  price: sizePriceData.price || 0,
                                  discountPrice: e.target.value ? parseFloat(e.target.value) : undefined
                                });
                              }
                              setFormData({ ...formData, sizePricing: newPricing });
                            }}
                            className="w-full px-2 py-1 text-sm border border-neutral-300 dark:border-neutral-600 rounded bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                          />
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Add sizes first to set pricing</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Ingredients
                </label>
                <textarea
                  value={formData.ingredients}
                  onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Product Images
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                />
                {uploading && <p className="text-sm text-neutral-500 mt-2">Uploading...</p>}
                
                <div className="grid grid-cols-4 gap-2 mt-3">
                  {formData.images.map((img, index) => (
                    <div key={index} className="relative">
                      <img src={img.url} alt="" className="w-full h-20 object-cover rounded" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isAvailable}
                    onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                    className="w-4 h-4 text-primary"
                  />
                  <span className="text-sm text-neutral-700 dark:text-neutral-300">Available</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isBestseller}
                    onChange={(e) => setFormData({ ...formData, isBestseller: e.target.checked })}
                    className="w-4 h-4 text-primary"
                  />
                  <span className="text-sm text-neutral-700 dark:text-neutral-300">Bestseller</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isVegetarian}
                    onChange={(e) => setFormData({ ...formData, isVegetarian: e.target.checked })}
                    className="w-4 h-4 text-primary"
                  />
                  <span className="text-sm text-neutral-700 dark:text-neutral-300">Vegetarian</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-6 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary hover:bg-orange-600 text-white rounded-lg font-semibold"
                >
                  {editingProduct ? 'Update' : 'Create'} Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
