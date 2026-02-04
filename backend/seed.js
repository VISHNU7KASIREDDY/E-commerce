const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/user.js');
const Product = require('./models/product.js');
const path = require('path');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing data');

    const adminUser = await User.create({
      name: 'Vishnu',
      email: 'vishnukasireddy28@gmail.com',
      password: '123456', 
      role: 'admin',
    });
    console.log('Admin user created:', adminUser.email);

    const customerUser = await User.create({
      name: 'John Doe',
      email: 'customer@example.com',
      password: 'customer123',
      role: 'customer',
    });
    console.log('Admin user created:', adminUser.email);
    console.log('Customer user created:', customerUser.email);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
