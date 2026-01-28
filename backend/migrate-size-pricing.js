const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/product.js');

dotenv.config();

// Convert size string to grams for calculation
const sizeToGrams = (size) => {
  const match = size.match(/(\d+(?:\.\d+)?)(g|kg)/i);
  if (!match) return null;
  
  const value = parseFloat(match[1]);
  const unit = match[2].toLowerCase();
  
  return unit === 'kg' ? value * 1000 : value;
};

// Calculate proportional price based on size
const calculatePriceForSize = (basePrice, baseSize, targetSize) => {
  const baseGrams = sizeToGrams(baseSize);
  const targetGrams = sizeToGrams(targetSize);
  
  if (!baseGrams || !targetGrams) return basePrice;
  
  const ratio = targetGrams / baseGrams;
  return Math.round(basePrice * ratio * 100) / 100; // Round to 2 decimal places
};

const migrateSizePricing = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    const products = await Product.find({});
    console.log(`\n📦 Found ${products.length} products to migrate\n`);

    for (const product of products) {
      if (!product.sizes || product.sizes.length === 0) {
        console.log(`⏭️  Skipping ${product.name} - no sizes defined`);
        continue;
      }

      // Use the first size as the base size
      const baseSize = product.sizes[0];
      const basePrice = product.price;
      const baseDiscountPrice = product.discountPrice;

      // Generate sizePricing array
      const sizePricing = product.sizes.map(size => {
        const price = calculatePriceForSize(basePrice, baseSize, size);
        const discountPrice = baseDiscountPrice 
          ? calculatePriceForSize(baseDiscountPrice, baseSize, size)
          : undefined;

        return {
          size,
          price,
          discountPrice
        };
      });

      product.sizePricing = sizePricing;
      await product.save();

      console.log(`✅ Updated ${product.name}:`);
      console.log(`   Base: ${baseSize} @ ₹${basePrice}`);
      sizePricing.forEach(sp => {
        const displayPrice = sp.discountPrice ? `₹${sp.discountPrice} (was ₹${sp.price})` : `₹${sp.price}`;
        console.log(`   - ${sp.size}: ${displayPrice}`);
      });
      console.log('');
    }

    console.log('🎉 Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during migration:', error);
    process.exit(1);
  }
};

migrateSizePricing();
