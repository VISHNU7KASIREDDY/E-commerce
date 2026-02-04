import React, { useState } from 'react';
import { reviewService } from '../../services/reviewService';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ReviewForm = ({ productId, existingReview, onReviewSubmitted, onCancel }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState(existingReview?.title || '');
  const [comment, setComment] = useState(existingReview?.comment || '');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    try {
      setSubmitting(true);
      const reviewData = {
        productId,
        rating,
        title,
        comment,
      };

      if (existingReview) {
        await reviewService.updateReview(existingReview._id, reviewData);
      } else {
        await reviewService.createReview(reviewData);
      }

      setRating(0);
      setTitle('');
      setComment('');
      onReviewSubmitted?.();
    } catch (error) {
      console.error('Error submitting review:', error);
      alert(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-[#2f221c] p-6 rounded-xl border border-[#e6e0dd] dark:border-[#3a2d25]">
      <h3 className="text-xl font-bold text-[#181311] dark:text-white mb-4">
        {existingReview ? 'Edit Your Review' : 'Write a Review'}
      </h3>

      {}
      <div className="mb-4">
        <label className="block text-sm font-medium text-[#181311] dark:text-white mb-2">
          Rating *
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="text-3xl transition-colors"
            >
              <span
                className={`material-symbols-outlined ${
                  star <= (hoverRating || rating) ? 'filled text-[#f59e0b]' : 'text-[#e6e0dd]'
                }`}
              >
                star
              </span>
            </button>
          ))}
        </div>
      </div>

      {}
      <div className="mb-4">
        <label className="block text-sm font-medium text-[#181311] dark:text-white mb-2">
          Review Title (Optional)
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Excellent Product!"
          maxLength={100}
          className="w-full px-4 py-2 border border-[#e6e0dd] dark:border-[#3a2d25] rounded-lg bg-white dark:bg-[#181311] text-[#181311] dark:text-white"
        />
      </div>

      {}
      <div className="mb-4">
        <label className="block text-sm font-medium text-[#181311] dark:text-white mb-2">
          Your Review *
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your thoughts about this product..."
          required
          rows={4}
          className="w-full px-4 py-2 border border-[#e6e0dd] dark:border-[#3a2d25] rounded-lg bg-white dark:bg-[#181311] text-[#181311] dark:text-white resize-none"
        />
      </div>

      {}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 bg-primary hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : existingReview ? 'Update Review' : 'Submit Review'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-[#e6e0dd] dark:border-[#3a2d25] rounded-lg text-[#181311] dark:text-white hover:bg-[#f5f1f0] dark:hover:bg-[#2f221c] transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default ReviewForm;
