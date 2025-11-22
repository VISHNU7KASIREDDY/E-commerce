const express=require('express')
const Checkout=require('../models/checkout')
const Cart=require('../models/cart')
const Product=require('../models/product')
const Order=require('../models/order')
const {protect}=require("../middlewares/authMiddleware")

const router=express.Router()

router.post('/',protect,async (req,res)=>{
  const {checkoutItems,shippingAddress,paymentMethod,totalPrice}=req.body

  if (!checkoutItems|| checkoutItems.length==0){
    return res.status(400).json({message:"no items in checkout"})
  }

  try{
    const newCheckout=await Checkout.create({
      user:req.user.id,
      checkoutItems:checkoutItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      paymentStatus:"Pending",
      isPaid:false
    })
    console.log(`Checkout created for user :${req.user.id}`)
    res.status(201).json(newCheckout)
  }catch(err){
    console.error(err)
    res.status(500).json({message:"Server Error"})
  }
})

router.put('/:id/pay',protect,async (req,res)=>{
  const {paymentStatus,paymentDetails}=req.body

  try{
    const checkout=await Checkout.findById(req.params.id)

    if (!checkout){
      return res.status(404).json({message:"Checkout not found"})
    }
    if (paymentStatus==="paid"){
      checkout.isPaid=true
      checkout.paymentStatus=paymentStatus
      checkout.paymentDetails=paymentDetails
      checkout.paidAt=Date.now()
      await checkout.save()
      res.status(200).json(checkout)
    }else{
      res.status(400).json({message:"Invalid Payment Status"})
    }
  }catch(err){
    console.error(err)
    res.status(500).json({message:"Server Error"})
  }
})

router.post('/:id/finalize',protect,async(req,res)=>{
  try{
    const checkout=await Checkout.findById(req.params.id)
    if (!checkout){
      return res.status(404).json({message:"Checkout not found"})
    }

    if (checkout.isPaid && !checkout.isFinalised){
      const finalOrder=await Order.create({
        user:checkout.user,
        orderItems:checkout.orderItems,
        shippingAddress:checkout.shippingAddress,
        paymentMethod:checkout.paymentMethod,
        totalprice:checkout.totalprice,
        isPaid:true,
        paidAt:checkout.isPaid,
        isDelivered:false,
        paymentStatus:"paid",
        paymentDetails:checkout.paymentDetails
      })

      checkout.isFinalised=true
      checkout.finalisedAt=Date.now()
      await checkout.save()

      await Cart.findOneAndDelete({user:checkout.user})
      res.status(201).json(finalOrder)
    }else if(checkout.isFinalised){
      res.status(400).json({message:"Checkout already finalised"})
    }else{
      res.status(400).json({message:"Checkout is not paid"})
    }
  }catch(err){
    console.error(err)
    res.status(500).json({message:"Server Error"})
  }
})
module.exports=router