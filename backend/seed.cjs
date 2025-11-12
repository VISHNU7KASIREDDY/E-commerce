const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/user.js');
const Product = require('./models/product.js');

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

    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@spiceroute.com',
      password: hashedPassword,
      role: 'admin',
    });
    console.log('Admin user created:', adminUser.email);

    const customerPassword = await bcrypt.hash('customer123', 10);
    const customerUser = await User.create({
      name: 'John Doe',
      email: 'customer@example.com',
      password: customerPassword,
      role: 'customer',
    });
    console.log('Customer user created:', customerUser.email);

    const products = [
      {name: 'Andhra Avakaya Pickle', description: 'Spicy mango pickle made with traditional Andhra recipe.', price: 12.99, discountPrice: 10.99, category: 'pickles', sizes: ['250g', '500g', '1kg'], images: [{url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxc9w35cA8TRr52fyCKAB0gYLD4W2aiNQFCB2XhqgROeUD0VSqRH17Bx0wDwrByXWjebIVQ2VPOP0p6tLYb0A8BfFNwygfMJRKly1YHiiCDiJQtCTu2lvXUyo_IpJa8PPxC5zP0j18JYWoq6iw2oYUQJRc58n_pFGQZSljYQo5z-C2uQibxbtQRbEBF-zY8ZjwJGr2TPx3cVglBlta0qAlHf531PKriqt7ajcYfOhflZCpt_2V95iCGBGq-zJRNPVdeBV3-V6nOUg'}], isAvailable: true, isBestseller: true, ingredients: 'Raw Mango, Red Chili, Salt, Mustard, Oil', user: adminUser._id},
      {name: 'Lemon Pickle', description: 'Tangy and spicy lemon pickle.', price: 9.99, category: 'pickles', sizes: ['250g', '500g'], images: [{url: 'https://images.unsplash.com/photo-1599909533730-f9d7e4f2f6d5?w=500'}], isAvailable: true, isBestseller: true, ingredients: 'Lemon, Chili, Salt, Turmeric, Oil', user: adminUser._id},
      {name: 'Mixed Vegetable Pickle', description: 'Mix of carrots, cauliflower, and chilies.', price: 11.99, category: 'pickles', sizes: ['250g', '500g'], images: [{url: 'https://images.unsplash.com/photo-1596040033229-a0b3b9b82f4c?w=500'}], isAvailable: true, isBestseller: false, ingredients: 'Carrot, Cauliflower, Chili, Spices', user: adminUser._id},
      {name: 'Idli Podi', description: 'Classic South Indian spice powder.', price: 7.99, category: 'podis', sizes: ['100g', '250g'], images: [{url: 'https://images.unsplash.com/photo-1596040033229-a0b3b9b82f4c?w=500'}], isAvailable: true, isBestseller: true, ingredients: 'Urad Dal, Chana Dal, Chili, Curry Leaves', user: adminUser._id},
      {name: 'Curry Leaves Podi', description: 'Aromatic curry leaves powder.', price: 8.99, category: 'podis', sizes: ['100g', '250g'], images: [{url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500'}], isAvailable: true, isBestseller: true, ingredients: 'Curry Leaves, Urad Dal, Chili, Garlic', user: adminUser._id},
      {name: 'Flaxseed Podi', description: 'Healthy flaxseed powder.', price: 10.99, category: 'podis', sizes: ['100g', '250g'], images: [{url: 'https://images.unsplash.com/photo-1596040033229-a0b3b9b82f4c?w=500'}], isAvailable: true, isBestseller: false, ingredients: 'Flaxseeds, Sesame, Chili, Cumin', user: adminUser._id},
      {name: 'Garam Masala', description: 'Premium aromatic spice blend.', price: 6.99, category: 'spices', sizes: ['50g', '100g'], images: [{url: 'https://images.unsplash.com/photo-1596040033229-a0b3b9b82f4c?w=500'}], isAvailable: true, isBestseller: true, ingredients: 'Coriander, Cumin, Cardamom, Cinnamon, Cloves', user: adminUser._id},
      {name: 'Sambar Powder', description: 'Authentic sambar powder.', price: 7.99, category: 'spices', sizes: ['100g', '250g'], images: [{url: 'https://images.unsplash.com/photo-1596040033229-a0b3b9b82f4c?w=500'}], isAvailable: true, isBestseller: true, ingredients: 'Coriander, Chana Dal, Toor Dal, Chili', user: adminUser._id},
      {name: 'Butter Murukku', description: 'Crispy buttery spiral snack.', price: 8.99, category: 'snacks', sizes: ['200g', '500g'], images: [{url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAkAp2K3bsMXx2GpcwimZglb1EvAPe3nkcc-lRoKTtK_ohNvWj8UvUrRdCopVGWCm5tJgOc94rzoDE_6sQDUI5fgRy_Blw6PyDDbTgWdJefZ3vbjX2VXLrTiaYLwJRWRNobyhMOA4hAj7kKKK9nE6VqkeGClyZOpztK7NZEmOOFI2CGpIDJVG9-mVWkOtLPp7W5KwNKVESGNbhSMis5z9IFRpBCA4CgRuLyQKXmgS-UZQsDFeUa1yTtZyRnkfd17zvcx4-4h81xzQQ'}], isAvailable: true, isBestseller: true, ingredients: 'Rice Flour, Butter, Cumin, Sesame', user: adminUser._id},
      {name: 'Ribbon Pakoda', description: 'Crispy ribbon snack.', price: 7.99, category: 'snacks', sizes: ['200g', '500g'], images: [{url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500'}], isAvailable: true, isBestseller: false, ingredients: 'Gram Flour, Rice Flour, Chili, Butter', user: adminUser._id},
      {name: 'Mixture', description: 'Traditional South Indian mixture.', price: 9.99, category: 'snacks', sizes: ['250g', '500g'], images: [{url: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=500'}], isAvailable: true, isBestseller: true, ingredients: 'Gram Flour, Peanuts, Curry Leaves, Cashews', user: adminUser._id},
      {name: 'Banana Chips', description: 'Crispy salted banana chips.', price: 6.99, category: 'snacks', sizes: ['200g', '500g'], images: [{url: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=500'}], isAvailable: true, isBestseller: false, ingredients: 'Raw Banana, Coconut Oil, Salt, Turmeric', user: adminUser._id},
    ];

    const createdProducts = await Product.insertMany(products);
    console.log(`Created ${createdProducts.length} products`);

    console.log('\n✅ Seed data created successfully!');
    console.log('\n📧 Admin: admin@spiceroute.com / admin123');
    console.log('📧 Customer: customer@example.com / customer123');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

seedData();
