const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/user');

dotenv.config();

const connectDB = require('./config/db');

// Migration script to add wishlist field to existing users
const migrateWishlist = async () => {
  try {
    await connectDB();
    console.log('Connected to database...');

    // Update all users without wishlist field
    const result = await User.updateMany(
      { wishlist: { $exists: false } },
      { $set: { wishlist: [] } }
    );

    console.log(`✅ Migration complete: ${result.modifiedCount} users updated`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

migrateWishlist();
