import React from 'react';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const WishlistButton = ({ productId, className = '' }) => {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const inWishlist = isInWishlist(productId);

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      if (inWishlist) {
        await removeFromWishlist(productId);
      } else {
        await addToWishlist(productId);
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
      alert(error.response?.data?.message || 'Failed to update wishlist');
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`size-12 rounded-lg border border-[#e6e0dd] dark:border-[#3a2d25] flex items-center justify-center ${
        inWishlist
          ? 'text-red-500 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
          : 'text-[#181311] dark:text-white hover:bg-[#f5f1f0] dark:hover:bg-[#2f221c]'
      } transition-colors ${className}`}
      title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <span className={`material-symbols-outlined ${inWishlist ? 'filled' : ''}`}>
        favorite
      </span>
    </button>
  );
};

export default WishlistButton;
