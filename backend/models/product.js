const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: [true, 'Please add a product name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
      min: 0,
    },
    discountPrice: {
      type: Number,
      min: 0,
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
    },
    sizes: {
      type: [String],
      required: true,
    },
    images: {
      type: mongoose.Schema.Types.Mixed,
      default: [],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    isBestseller: {
      type: Boolean,
      default: false,
    },
    isVegetarian: {
      type: Boolean,
      default: true,
    },
    ingredients: {
      type: String,
    },
    sizePricing: [{
      size: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
        min: 0,
      },
      discountPrice: {
        type: Number,
        min: 0,
        validate: {
          validator: function(v) {
            return !v || v <= this.price;
          },
          message: 'Discount price must be less than or equal to price'
        }
      }
    }],
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
      min: 0,
    },
    countInStock: {
      type: Number,
      min: 0,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Product', productSchema);
