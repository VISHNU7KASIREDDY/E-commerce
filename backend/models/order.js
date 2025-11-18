const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    qty: { type: Number, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    orderItems: [orderItemSchema],
    shippingAdress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
  paymentMethod:{
    type:String,
    required:true
  },
  totalPrice:{
    type:Number,
    req:true
  },
  isPaid:{
    type:Boolean,
    default:false
  },
  paidAt:{
    type:Date
  },
  isDelivered:{
    type:Boolean,
    default:false
  },
  deliveredAt:{
    type:Date
  },
  paymentStatus:{
    type:String,
    default:"pending"
  },
  status:{
    type:String,
    enum:["Processing","Shipped","Delivered","Cancelled"],
    default:"Processing"
  }
},{timestamps:true})

module.exports=mongoose.model("order",orderSchema);