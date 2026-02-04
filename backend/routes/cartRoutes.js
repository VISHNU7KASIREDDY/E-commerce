const express=require('express')
const Cart=require('../models/cart')
const Product=require('../models/product')

const {protect}=require('../middlewares/authMiddleware')

const router=express.Router()

const getCart=async (userId,guestId)=>{
  if (userId){
    return Cart.findOne({user:userId})
  }else if (guestId){
    return Cart.findOne({guestId})
  }else{
    return null
  }
}

const getPriceForSize=(product,size)=>{

  if (product.sizePricing && product.sizePricing.length > 0) {
    const sizeData = product.sizePricing.find(sp => sp.size === size);
    if (sizeData) {
      return sizeData.discountPrice || sizeData.price;
    }
  }

  return product.discountPrice || product.price;
}

router.get('/',async (req,res)=>{
  const { userId, guestId } = req.query
  console.log('=== GET CART REQUEST ===');
  console.log('userId:', userId);
  console.log('guestId:', guestId);

  try{
    let cart=await getCart(userId,guestId)
    console.log('Cart found:', cart ? `Yes (${cart.products?.length} items)` : 'No');

    if(cart){
      console.log('Returning cart:', cart._id);
      res.status(200).json(cart)
    }else{
      console.log('No cart found, returning empty cart');

      return res.status(200).json({ products: [], totalPrice: 0 })
    }
  }catch(err){
    console.error('Error in GET /cart:', err);
    res.status(500).send('Server Error')
  }
})

router.post('/',async(req,res)=>{
  const {productId,quantity,size,category,guestId,userId}=req.body
  
  try{
    const product=await Product.findById(productId)
    if (!product){
      return res.status(404).json({message:"Product not found"})
    }
    
    let cart=await getCart(userId,guestId)

    if (cart){
      const productIndex=cart.products.findIndex(
        (p)=>
          p.productId.toString()===productId && 
          p.size===size &&
          p.category===category
        
      )
      if (productIndex>-1){
        cart.products[productIndex].quantity+=quantity

      }else{
        const itemPrice = getPriceForSize(product, size);
        
        cart.products.push({productId,
          name:product.name,
          image:product.images[0].url,
          price:itemPrice,
          size,
          category,
          quantity
        })
      }
      cart.totalPrice=cart.products.reduce((acc,item)=>acc+item.price*item.quantity,0)
      await cart.save()
      return res.status(200).json(cart)
    }
    else{
      const itemPrice = getPriceForSize(product, size);
      
      const newCart=await Cart.create({
        user:userId? userId:undefined,
        products:[
          {productId,
          name:product.name,
          image:product.images[0].url,
          price:itemPrice,
          size,
          category,
          quantity
        }
        ],
        totalPrice:itemPrice*quantity
      })
      return res.status(201).json(newCart)
    }

  }catch(err){
    console.error(err);
    res.status(500).send('Server Error')
  }
})

router.put('/',protect,async (req,res)=>{
  const {productId,size,category,userId,guestId,quantity}=req.body

  try{
    let cart=await getCart(userId,guestId)

    if(!cart){
      return res.status(404).json({message:"Cart not found"})
    }

    const productIndex=cart.products.findIndex(
      (p)=>
        p.productId.toString()===productId && 
        p.size===size &&
        p.category===category
      
    )
    if (productIndex>-1){
      if (quantity>0){

        const product = await Product.findById(productId);
        if (product) {
          const itemPrice = getPriceForSize(product, size);
          cart.products[productIndex].quantity = quantity;
          cart.products[productIndex].price = itemPrice;
        } else {
          cart.products[productIndex].quantity = quantity;
        }
      }else{
        cart.products.splice(productIndex,1)
      }
      
      cart.totalPrice=cart.products.reduce((acc,item)=>acc+item.price*item.quantity,0)
      await cart.save()
      return res.status(200).json(cart)
    }
    else{
      return res.status(404).json({message:"Product not found in cart"})
    }
  }catch(err){
    console.error(err);
    res.status(500).send('Server Error')
  }

})

router.delete('/',async (req,res)=>{
  const {productId,quantity,size,category,userId,guestId}=req.body

  try{
    let cart=await getCart(userId,guestId)

    if(!cart){
      return res.status(404).json({message:"Cart not found"})
    }

    const productIndex=cart.products.findIndex(
      (p)=>
        p.productId.toString()===productId && 
        p.size===size &&
        p.category===category
      
    )
    if (productIndex>-1){
        cart.products.splice(productIndex,1)
      
      cart.totalPrice=cart.products.reduce((acc,item)=>acc+item.price*item.quantity,0)
      await cart.save()
      return res.status(200).json(cart)
    }
    else{
      return res.status(404).json({message:"Product not found in cart"})
    }
  }catch(err){
    console.error(err);
    res.status(500).send('Server Error')
  }

})

router.post("/merge",protect,async(req,res)=>{
  const {guestId}=req.body
  try{
    const gusetCart= await Cart.findOne({guestId})

    const userCart=await Cart.findOne({user:req.user._id})

    if(gusetCart){
      if (gusetCart.products.length===0){
        return res.status(400).json({message:"Guest cart is empty"})
      }
      if (userCart){
        gusetCart.products.forEach((guestItem)=>{
          const productIndex=userCart.products.findIndex((item)=>{
            (item)=>
              item.productId.toString()===guestItem.productId.toString() && 
              item.size===guestItem.size &&
              item.category===guestItem.category
            
          });
        if (productIndex>-1){
          userCart.products[productIndex].quantity+=guestItem.quantity
        }else{
          userCart.products.push(guestItem)
        }
        })
        userCart.totalPrice=userCart.products.reduce((acc,item)=>acc+item.price*item.quantity,0)
        await userCart.save()
        res.status(200).json(userCart)
        try{
          await Cart.findOneAndDelete({guestId})
        }catch(err){
          console.error("Error deleting guest cart",err)
        }
      }
      else{
        gusetCart.user=req.user._id
        gusetCart.guestId=undefined
        await gusetCart.save()

        return res.status(200).json(gusetCart)
      }
    }
    else{
      if (userCart){
        return res.status(200).json(userCart)
      }
      else{
        return res.status(404).json({message:"Guest cart not found"})
      }
    }
  }catch(err){
    console.error(err);
    res.status(500).send('Server Error')
  }
})

module.exports=router;