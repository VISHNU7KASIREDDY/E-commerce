const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const User = require('../models/user');
const Product = require('../models/product');

const router = express.Router();

// @route   GET /api/wishlist
// @desc    Get user's wishlist
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    // Initialize wishlist if it doesn't exist (for existing users)
    if (!user.wishlist) {
      user.wishlist = [];
      await user.save();
    }
    res.json(user.wishlist || []);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST /api/wishlist/:productId
// @desc    Add product to wishlist
// @access  Private
router.post('/:productId', protect, async (req, res) => {
  try {
    const { productId } = req.params;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const user = await User.findById(req.user._id);

    // Initialize wishlist if it doesn't exist (for existing users)
    if (!user.wishlist) {
      user.wishlist = [];
    }

    // Check if product already in wishlist
    if (user.wishlist.includes(productId)) {
      return res.status(400).json({ message: 'Product already in wishlist' });
    }

    user.wishlist.push(productId);
    await user.save();

    const updatedUser = await User.findById(req.user._id).populate('wishlist');
    res.json(updatedUser.wishlist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   DELETE /api/wishlist/:productId
// @desc    Remove product from wishlist
// @access  Private
router.delete('/:productId', protect, async (req, res) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user._id);

    // Initialize wishlist if it doesn't exist (for existing users)
    if (!user.wishlist) {
      user.wishlist = [];
    }

    // Remove product from wishlist
    user.wishlist = user.wishlist.filter(
      (item) => item.toString() !== productId
    );

    await user.save();

    const updatedUser = await User.findById(req.user._id).populate('wishlist');
    res.json(updatedUser.wishlist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
