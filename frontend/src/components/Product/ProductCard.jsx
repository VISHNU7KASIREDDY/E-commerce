import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';
import WishlistButton from '../Wishlist/WishlistButton';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '250g');

  const rating = product.rating || 0;
  const numReviews = product.numReviews || 0;

  const handleAddToCart = () => {
    addToCart(product._id, 1, selectedSize);
  };

  const isVeg = product.isVegetarian !== false;

  return (
    <div className="group relative flex flex-col bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-transparent hover:border-[#f5f1f0] hover:shadow-lg dark:hover:border-gray-700 transition-all duration-300 overflow-hidden">
      
      <div className={`absolute top-3 left-3 z-10 bg-white/90 dark:bg-black/60 backdrop-blur px-1.5 py-1 rounded border border-${isVeg ? 'green' : 'red'}-600/30 shadow-sm`} title={isVeg ? "Vegetarian" : "Non-Vegetarian"}>
        <div className={`size-3 border border-${isVeg ? 'green' : 'red'}-600 p-[1px] flex items-center justify-center rounded-[2px]`}>
          <span className={`size-1.5 bg-${isVeg ? 'green' : 'red'}-600 rounded-full`}></span>
        </div>
      </div>

      <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all">
        <WishlistButton productId={product._id} className="!size-10 !rounded-full bg-white/80 dark:bg-black/50 hover:bg-white dark:hover:bg-gray-800" />
      </div>

      <Link to={`/product/${product._id}`} className="block aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-800 relative">
        <img
          src={product.images?.[0]?.url || 'https://via.placeholder.com/300'}
          alt={product.name}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
        />
        
        <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center pb-6 bg-gradient-to-t from-black/50 to-transparent">
          <button className="bg-white text-gray-900 text-xs font-bold py-2 px-4 rounded-full shadow-lg hover:bg-primary hover:text-white transition-colors">
            Quick View
          </button>
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <div className="mb-1 flex items-center gap-1 text-yellow-500 text-[12px]">
          {[...Array(5)].map((_, i) => {
            const starValue = i + 1;
            const isFilled = starValue <= Math.floor(rating);
            const isHalf = !isFilled && starValue - 0.5 <= rating;
            
            return (
              <span key={i} className="material-symbols-outlined text-[16px] fill-current">
                {isFilled ? 'star' : isHalf ? 'star_half' : 'star'}
              </span>
            );
          })}
          {numReviews > 0 && (
            <span className="text-gray-400 dark:text-gray-500 ml-1">({numReviews})</span>
          )}
        </div>

        <Link to={`/product/${product._id}`}>
            <h3 className="text-lg font-bold text-[#181311] dark:text-white mb-1 group-hover:text-primary transition-colors cursor-pointer">
            {product.name}
            </h3>
        </Link>

        {/* Description/Tags */}
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 truncate">
          {product.description || 'Authentic • Homemade • Spicy'}
        </p>

        {/* Size Selector */}
        <div className="flex gap-2 mb-4">
          <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider self-center mr-1">Size:</span>
          {product.sizes?.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`px-2 py-1 text-[10px] font-medium border rounded ${
                selectedSize === size
                  ? 'border-primary text-primary bg-primary/5'
                  : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-400'
              }`}
            >
              {size}
            </button>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between gap-3">
          <div className="flex flex-col">
            {product.discountPrice && (
                <span className="text-xs text-gray-400 line-through">₹{product.price}</span>
            )}
            <span className="text-xl font-bold text-primary">
              ₹{product.discountPrice || product.price}
            </span>
          </div>
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-primary hover:bg-primary/90 text-white text-sm font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md shadow-primary/20"
          >
            <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
