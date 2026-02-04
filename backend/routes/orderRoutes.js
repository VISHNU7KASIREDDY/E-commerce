const express=require('express')
const Order=require("../models/order")
const {protect}=require("../middlewares/authMiddleware")

const router=express.Router()

router.post("/",protect,async(req,res)=>{
  try{
    const { orderItems, totalPrice, shippingAddress, paymentMethod } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    const orderNumber = 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();

    const order = await Order.create({
      user: req.user._id,
      orderNumber,
      orderItems,
      totalPrice,
      shippingAdress: shippingAddress || {
        address: "Not provided",
        city: "Not provided",
        postalCode: "000000",
        country: "India"
      },
      paymentMethod: paymentMethod || "COD"
    });

    res.status(201).json(order);
  }catch(err){
    console.error(err);
    res.status(500).json({message:"Server Error"})
  }
})

router.get("/my-orders",protect,async(req,res)=>{
  try{
    const orders=await Order.find({user:req.user._id}).sort({
      createdAt:-1
    });
    res.status(200).json(orders)
  }catch(err){
    console.error(err)
    res.status(500).json({message:"Server Error"})
  }
})

router.get("/:id",protect,async(req,res)=>{
  try{
    const order=await Order.findById(req.params.id).populate(
      "user",
      "name email"
    )

    if(!order){
      return res.status(404).json({message:"Order not found"})
    }

    res.status(200).json(order)
  }catch(err){
    console.error(err)
    res.status(500).json({message:"Server Error"})
  }
})

module.exports=router;