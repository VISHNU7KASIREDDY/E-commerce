const express =require('express');
const cors =require('cors');
const session = require('express-session');
const dotenv=require("dotenv")
dotenv.config()
require('./config/passport');
const passport = require('passport');
const userRoutes=require("./routes/userRoutes")
const productRoutes=require("./routes/productRoutes")
const cartRoutes=require("./routes/cartRoutes")
const checkoutRoutes=require("./routes/checkoutRoutes")
const orderRoutes=require("./routes/orderRoutes")
const uploadRoutes=require("./routes/uploadRoutes")
const adminRoutes=require("./routes/adminRoutes")
const productAdminRoutes=require("./routes/productAdminRoutes")
const orderAdminRoutes=require("./routes/orderAdminRoutes")
const wishlistRoutes=require("./routes/wishlistRoutes")
const reviewRoutes=require("./routes/reviewRoutes")
const authRoutes=require("./routes/authRoutes")
const app=express();
const connectDB=require('./config/db')
const User=require('./models/user')

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://e-commerce-spiceroute.vercel.app',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Session needed temporarily for OAuth redirect/callback flow only
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 5 * 60 * 1000, // 5 minutes — just long enough for OAuth flow
  },
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.json())

const PORT=process.env.PORT||3000;

// Seed demo accounts on startup
const seedDemoAccounts = async () => {
  const demos = [
    { name: 'Demo User', email: 'demo_user@example.com', password: 'demo1234', role: 'customer' },
    { name: 'Demo Admin', email: 'demo_admin@example.com', password: 'demo1234', role: 'admin' },
  ];

  for (const demo of demos) {
    const exists = await User.findOne({ email: demo.email });
    if (!exists) {
      await User.create(demo);
      console.log(`Seeded demo account: ${demo.email}`);
    }
  }
};

connectDB().then(() => seedDemoAccounts().catch(err => console.error('Demo seed error:', err)))

app.use("/api/auth",authRoutes);

app.use("/api/users",userRoutes);

app.use("/api/products",productRoutes)

app.use("/api/cart",cartRoutes)

app.use("/api/checkout",checkoutRoutes)

app.use("/api/orders",orderRoutes)

app.use("/api/upload",uploadRoutes)

app.use("/api/admin/users",adminRoutes)

app.use("/api/admin/products",productAdminRoutes)

app.use("/api/admin/orders",orderAdminRoutes)

app.use("/api/wishlist",wishlistRoutes)

app.use("/api/reviews",reviewRoutes)


app.listen(PORT,()=>{
  console.log(`Server running on port ${PORT}`)
})
