const express =require('express');
const cors =require('cors');
const dotenv=require("dotenv")
dotenv.config()
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
const app=express();
const connectDB=require('./config/db')

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://e-commerce-spiceroute.vercel.app',
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (e.g. mobile apps, curl, Postman)
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
app.use(express.json())

const PORT=process.env.PORT||3000;

connectDB()

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
