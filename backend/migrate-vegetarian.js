const mongoose = require('mongoose');
const Product = require('./models/product');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

const updateProducts = async () => {
  try {
    console.log('🔄 Updating products with isVegetarian field...');
    
    // Update all products to set isVegetarian to true by default
    // (Assuming most Indian pickles, podis, and spices are vegetarian)
    const result = await Product.updateMany(
      { isVegetarian: { $exists: false } }, // Only update products without the field
      { $set: { isVegetarian: true } }
    );
    
    console.log(`✅ Updated ${result.modifiedCount} products`);
    console.log('📊 All products now have isVegetarian field set to true');
    console.log('💡 You can manually update specific products to non-vegetarian if needed');
    
    // Show sample of updated products
    const sampleProducts = await Product.find().limit(5).select('name isVegetarian');
    console.log('\n📦 Sample products:');
    sampleProducts.forEach(p => {
      console.log(`  - ${p.name}: isVegetarian = ${p.isVegetarian}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating products:', error);
    process.exit(1);
  }
};

updateProducts();
