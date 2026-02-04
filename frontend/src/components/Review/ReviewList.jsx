import React, { useState } from 'react';
import { reviewService } from '../../services/reviewService';
import { useAuth } from '../../context/AuthContext';

const ReviewList = ({ reviews, onReviewsUpdated }) => {
  const { user } = useAuth();
  const [editingReview, setEditingReview] = useState(null);

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;

    try {
      await reviewService.deleteReview(reviewId);
      onReviewsUpdated?.();
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Failed to delete review');
    }
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (date) => {
    const now = new Date();
    const reviewDate = new Date(date);
    const diffInSeconds = Math.floor((now - reviewDate) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;

    return reviewDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (reviews.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-[#8a6e60] dark:text-[#a89085]">No reviews yet. Be the first to review!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div
          key={review._id}
          className="bg-white dark:bg-[#2f221c] p-6 rounded-xl border border-[#e6e0dd] dark:border-[#3a2d25]"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 flex items-center justify-center font-bold text-sm">
                {getInitials(review.user?.name || 'Anonymous')}
              </div>
              <div>
                <h4 className="font-bold text-[#181311] dark:text-white text-sm">
                  {review.user?.name || 'Anonymous'}
                </h4>
                <span className="text-xs text-[#8a6e60] dark:text-[#a89085]">
                  {review.verified && ' Verified Buyer • '}
                  {formatDate(review.createdAt)}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex text-[#f59e0b] text-[16px]">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`material-symbols-outlined ${star <= review.rating ? 'filled' : ''}`}
                  >
                    star
                  </span>
                ))}
              </div>
              {user && user._id === review.user?._id && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingReview(review)}
                    className="text-sm text-primary hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(review._id)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
          {review.title && (
            <h5 className="font-bold text-[#181311] dark:text-white mb-2">{review.title}</h5>
          )}
          <p className="text-[#4e423d] dark:text-[#d1c7c2] text-sm">{review.comment}</p>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
