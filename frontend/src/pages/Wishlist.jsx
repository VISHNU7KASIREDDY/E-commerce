import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import WishlistButton from '../components/Wishlist/WishlistButton';

const Wishlist = () => {
  const { wishlist, loading } = useWishlist();
  const { addToCart } = useCart();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="bg-background-light dark:bg-background-dark min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <span className="material-symbols-outlined text-[80px] text-[#e6e0dd] dark:text-[#3a2d25] mb-4">
              favorite_border
            </span>
            <h2 className="text-2xl font-bold text-[#181311] dark:text-white mb-4">
              Your wishlist is empty
            </h2>
            <p className="text-[#8a6e60] dark:text-[#a89085] mb-8">
              Start adding products you love to your wishlist!
            </p>
            <Link
              to="/shop"
              className="inline-block bg-primary hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-lg transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#181311] dark:text-white mb-2">
            My Wishlist
          </h1>
          <p className="text-[#8a6e60] dark:text-[#a89085]">
            {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <div
              key={product._id}
              className="bg-white dark:bg-[#2f221c] rounded-xl border border-[#e6e0dd] dark:border-[#3a2d25] overflow-hidden group"
            >
              <Link to={`/product/${product._id}`}>
                <div className="aspect-square overflow-hidden bg-[#f8f6f5] dark:bg-[#181311]">
                  <img
                    src={product.images?.[0]?.url || 'https://via.placeholder.com/300'}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              </Link>

              <div className="p-4">
                <Link to={`/product/${product._id}`}>
                  <h3 className="font-bold text-[#181311] dark:text-white mb-2 line-clamp-2 hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                </Link>

                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg font-bold text-primary">
                    ₹{product.discountPrice || product.price}
                  </span>
                  {product.discountPrice && (
                    <span className="text-sm text-[#8a6e60] line-through">
                      ₹{product.price}
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => addToCart(product._id, 1, product.sizes?.[0])}
                    className="flex-1 bg-primary hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
                  >
                    Add to Cart
                  </button>
                  <WishlistButton productId={product._id} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
