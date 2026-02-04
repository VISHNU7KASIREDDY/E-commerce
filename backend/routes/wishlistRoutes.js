const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const User = require('../models/user');
const Product = require('../models/product');

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');

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

router.post('/:productId', protect, async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const user = await User.findById(req.user._id);

    if (!user.wishlist) {
      user.wishlist = [];
    }

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

router.delete('/:productId', protect, async (req, res) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user._id);

    if (!user.wishlist) {
      user.wishlist = [];
    }

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
