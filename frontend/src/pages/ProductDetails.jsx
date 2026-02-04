import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productService } from '../services/productService';
import { reviewService } from '../services/reviewService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/Product/ProductCard';
import WishlistButton from '../components/Wishlist/WishlistButton';
import ReviewForm from '../components/Review/ReviewForm';
import ReviewList from '../components/Review/ReviewList';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const { addToCart } = useCart();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const data = await productService.getProductById(id);
      setProduct(data);
      setMainImage(data.images?.[0]?.url || '');
      setSelectedSize(data.sizes?.[0] || '250g');

      try {
        const allProducts = await productService.getProducts();
        setRelatedProducts(allProducts.filter(p => p._id !== id).slice(0, 4));
      } catch (err) {
        console.error('Error fetching related products:', err);
      }

      await fetchReviews();
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const reviewsData = await reviewService.getProductReviews(id);
      setReviews(reviewsData);

      if (reviewsData.length > 0) {
        const avg = reviewsData.reduce((sum, r) => sum + r.rating, 0) / reviewsData.length;
        setAverageRating(Math.round(avg * 10) / 10);
      } else {
        setAverageRating(0);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleReviewSubmitted = () => {
    setShowReviewForm(false);
    fetchReviews();
  };

  const handleQuantityChange = (type) => {
    if (type === 'inc') setQuantity(prev => prev + 1);
    else if (type === 'dec' && quantity > 1) setQuantity(prev => prev - 1);
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product._id, quantity, selectedSize);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <Link to="/shop" className="text-primary hover:underline">Return to Shop</Link>
      </div>
    );
  }

  const isVeg = product.isVegetarian !== false;

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        {}
        <div className="flex flex-wrap items-center gap-2 py-4 text-sm mb-6">
          <Link to="/" className="text-[#8a6e60] dark:text-[#a89085] hover:text-primary font-medium">Home</Link>
          <span className="material-symbols-outlined text-[16px] text-[#8a6e60]">chevron_right</span>
          <Link to="/shop" className="text-[#8a6e60] dark:text-[#a89085] hover:text-primary font-medium">Shop</Link>
          <span className="material-symbols-outlined text-[16px] text-[#8a6e60]">chevron_right</span>
          <span className="text-[#181311] dark:text-white font-semibold">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {}
          <div className="flex flex-col gap-4">
            <div className="w-full aspect-square md:aspect-[4/3] rounded-xl overflow-hidden bg-white dark:bg-[#2f221c] border border-[#e6e0dd] dark:border-[#3a2d25]">
              <img 
                src={mainImage || 'https://via.placeholder.com/600'} 
                alt={product.name}
                className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
              />
            </div>
            {product.images?.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setMainImage(img.url)}
                    className={`min-w-24 w-24 h-24 rounded-lg overflow-hidden border-2 cursor-pointer ${
                      mainImage === img.url ? 'border-primary' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {}
          <div className="flex flex-col gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {product.isBestseller && (
                  <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">Bestseller</span>
                )}
                <span className="flex items-center text-[#f59e0b] text-sm font-bold">
                  <span className="material-symbols-outlined text-[18px] filled">star</span>
                  <span className="ml-1">{averageRating > 0 ? averageRating : 'No ratings'}</span>
                  {reviews.length > 0 && (
                    <span className="text-[#8a6e60] dark:text-[#a89085] font-normal ml-1 underline cursor-pointer">
                      ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                    </span>
                  )}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#181311] dark:text-white leading-tight">{product.name}</h1>
              <p className="text-[#8a6e60] dark:text-[#a89085] text-lg font-medium mt-2">{product.category} • Authentic Recipe</p>
            </div>

            <div className="flex items-end gap-3 border-b border-[#e6e0dd] dark:border-[#3a2d25] pb-6">
              <span className="text-3xl font-bold text-primary">₹{product.discountPrice || product.price}</span>
              {product.discountPrice && (
                <span className="text-xl text-[#8a6e60] line-through mb-1">₹{product.price}</span>
              )}
              <span className="text-sm text-green-600 font-bold mb-2 ml-auto">In Stock</span>
            </div>

            <div className="prose prose-stone dark:prose-invert">
              <p className="text-[#4e423d] dark:text-[#d1c7c2] leading-relaxed">
                {product.description}
              </p>
            </div>

            {}
            <div className="flex flex-col gap-3">
              <span className="text-sm font-bold text-[#181311] dark:text-white uppercase tracking-wider">Select Size</span>
              <div className="flex flex-wrap gap-3">
                {product.sizes?.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-6 py-2 rounded-full border transition-colors ${
                      selectedSize === size
                        ? 'border-primary bg-primary/5 text-primary font-bold border-2'
                        : 'border-[#e6e0dd] dark:border-[#3a2d25] text-[#181311] dark:text-white hover:border-primary hover:text-primary'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <div className="flex items-center border border-[#e6e0dd] dark:border-[#3a2d25] rounded-lg h-12 w-32 bg-white dark:bg-[#2f221c]">
                <button 
                  onClick={() => handleQuantityChange('dec')}
                  className="w-10 h-full flex items-center justify-center text-[#181311] dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-l-lg"
                >
                  <span className="material-symbols-outlined text-[18px]">remove</span>
                </button>
                <input 
                  className="w-full h-full text-center border-none focus:ring-0 p-0 bg-transparent text-[#181311] dark:text-white font-bold" 
                  readOnly 
                  type="text" 
                  value={quantity}
                />
                <button 
                  onClick={() => handleQuantityChange('inc')}
                  className="w-10 h-full flex items-center justify-center text-[#181311] dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-r-lg"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                </button>
              </div>
              <button 
                onClick={handleAddToCart}
                className="flex-1 bg-primary hover:bg-orange-600 text-white font-bold rounded-lg h-12 flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30 transition-all active:scale-95"
              >
                <span className="material-symbols-outlined">shopping_bag</span>
                Add to Cart
              </button>
              <WishlistButton productId={product._id} />
            </div>

            {}
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="size-10 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 flex items-center justify-center">
                  <span className="material-symbols-outlined">eco</span>
                </div>
                <span className="text-xs font-medium text-[#4e423d] dark:text-[#d1c7c2]">100% Natural</span>
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="size-10 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 flex items-center justify-center">
                  <span className="material-symbols-outlined">no_food</span>
                </div>
                <span className="text-xs font-medium text-[#4e423d] dark:text-[#d1c7c2]">No Preservatives</span>
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="size-10 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 flex items-center justify-center">
                  <span className="material-symbols-outlined">local_shipping</span>
                </div>
                <span className="text-xs font-medium text-[#4e423d] dark:text-[#d1c7c2]">Fast Shipping</span>
              </div>
            </div>
          </div>
        </div>

        {}
        <div className="mt-20">
          <div className="border-b border-[#e6e0dd] dark:border-[#3a2d25]">
            <div className="flex gap-8 overflow-x-auto no-scrollbar">
              {['Description', 'Ingredients', 'Shipping Policy'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase())}
                  className={`pb-4 border-b-2 font-medium whitespace-nowrap px-2 transition-colors ${
                    activeTab === tab.toLowerCase()
                      ? 'border-primary text-primary font-bold'
                      : 'border-transparent text-[#8a6e60] dark:text-[#a89085] hover:text-primary'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <div className="py-8">
            {activeTab === 'description' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-[#4e423d] dark:text-[#d1c7c2]">
                <div className="md:col-span-2 space-y-4">
                  <h3 className="text-xl font-bold text-[#181311] dark:text-white">A Tradition in Every Jar</h3>
                  <p>{product.description}</p>
                  <p>Made with authentic {isVeg ? 'vegetarian' : 'non-vegetarian'} ingredients.</p>
                </div>
                <div className="bg-white dark:bg-[#2f221c] p-6 rounded-xl border border-[#e6e0dd] dark:border-[#3a2d25]">
                  <h4 className="font-bold text-[#181311] dark:text-white mb-4">Key Ingredients</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.ingredients?.split(',').slice(0, 6).map((ing, i) => (
                      <span key={i} className="bg-[#f8f6f5] dark:bg-white/5 px-3 py-1 rounded-full text-sm">
                        {ing.trim()}
                      </span>
                    )) || <span className="text-sm">Ingredients list coming soon...</span>}
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'ingredients' && (
              <div className="max-w-4xl">
                <h3 className="text-xl font-bold text-[#181311] dark:text-white mb-6">Full Ingredients List</h3>
                {product.ingredients ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {product.ingredients.split(',').map((ing, i) => (
                      <div key={i} className="bg-white dark:bg-[#2f221c] px-4 py-3 rounded-lg border border-[#e6e0dd] dark:border-[#3a2d25] text-center">
                        <span className="text-sm font-medium text-[#181311] dark:text-white">
                          {ing.trim()}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[#8a6e60] dark:text-[#a89085]">Ingredients list coming soon...</p>
                )}
              </div>
            )}
            
            {activeTab === 'shipping policy' && (
              <div className="max-w-3xl space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-[#181311] dark:text-white mb-4">Shipping Information</h3>
                  <div className="space-y-4 text-[#4e423d] dark:text-[#d1c7c2]">
                    <div>
                      <h4 className="font-semibold text-[#181311] dark:text-white mb-2">Delivery Time</h4>
                      <p>Standard shipping: 5-7 business days</p>
                      <p>Express shipping: 2-3 business days</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#181311] dark:text-white mb-2">Shipping Charges</h4>
                      <p>Orders above ₹500: Free shipping</p>
                      <p>Orders below ₹500: ₹50 flat rate</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#181311] dark:text-white mb-2">Packaging</h4>
                      <p>All products are carefully packaged to ensure freshness and prevent damage during transit. We use eco-friendly materials wherever possible.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#181311] dark:text-white mb-2">Order Tracking</h4>
                      <p>You will receive a tracking number via email once your order ships. Track your package in real-time through our carrier partners.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {}
        <div className="mt-12 py-10 border-t border-[#e6e0dd] dark:border-[#3a2d25]">
          <div className="flex flex-col md:flex-row gap-10 items-start">
            <div className="w-full md:w-1/3">
              <h2 className="text-2xl font-bold text-[#181311] dark:text-white mb-4">Customer Reviews</h2>
              <div className="flex items-center gap-4 mb-2">
                <span className="text-5xl font-bold text-[#181311] dark:text-white">
                  {averageRating > 0 ? averageRating : 'N/A'}
                </span>
                {averageRating > 0 && (
                  <div className="flex flex-col">
                    <div className="flex text-[#f59e0b]">
                      {[1,2,3,4,5].map(i => (
                        <span key={i} className={`material-symbols-outlined ${i <= Math.round(averageRating) ? 'filled' : ''} text-[16px]`}>star</span>
                      ))}
                    </div>
                    <span className="text-sm text-[#8a6e60] dark:text-[#a89085]">
                      Based on {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                    </span>
                  </div>
                )}
              </div>
              {isAuthenticated ? (
                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="mt-6 w-full py-3 border border-[#181311] dark:border-white text-[#181311] dark:text-white font-bold rounded-lg hover:bg-[#181311] hover:text-white dark:hover:bg-white dark:hover:text-[#181311] transition-colors"
                >
                  {showReviewForm ? 'Cancel' : 'Write a Review'}
                </button>
              ) : (
                <Link
                  to="/login"
                  className="mt-6 w-full py-3 border border-[#181311] dark:border-white text-[#181311] dark:text-white font-bold rounded-lg hover:bg-[#181311] hover:text-white dark:hover:bg-white dark:hover:text-[#181311] transition-colors text-center block"
                >
                  Login to Write a Review
                </Link>
              )}
            </div>
            
            {}
            <div className="flex-1 w-full space-y-6">
              {showReviewForm && (
                <div className="mb-6">
                  <ReviewForm
                    productId={id}
                    onReviewSubmitted={handleReviewSubmitted}
                    onCancel={() => setShowReviewForm(false)}
                  />
                </div>
              )}
              <ReviewList reviews={reviews} onReviewsUpdated={fetchReviews} />
            </div>
          </div>
        </div>

        {}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-[#181311] dark:text-white mb-6">You might also like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
