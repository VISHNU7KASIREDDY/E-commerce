const express=require('express')
const { protect, admin } = require("../middlewares/authMiddleware")
const Product=require("../models/product")

const router=express.Router()

router.get("/",protect,admin,async (req,res)=>{
  try {
    const products=await Product.find()
    res.json(products)
  } catch (error) {
    console.error(err)
    res.status(500).json({message:"Server Error"})
  }
})

router.post('/',protect,admin,async (req,res)=>{
  try{
    const {name,description,price,discountPrice,category,sizes,images,isAvailable,isBestseller,
      ingredients,sizePricing,isVegetarian
    }=req.body

    // Validate discount price
    if (discountPrice && discountPrice > price) {
      return res.status(400).json({ 
        message: 'Discount price must be less than or equal to price' 
      });
    }

    // Validate sizePricing array
    if (sizePricing && sizePricing.length > 0) {
      for (let sp of sizePricing) {
        if (sp.discountPrice && sp.discountPrice > sp.price) {
          return res.status(400).json({ 
            message: `Discount price for ${sp.size} must be less than or equal to price` 
          });
        }
      }
    }

    const product=new Product({
      name,description,price,discountPrice,category,sizes,images,isAvailable,isBestseller,
      ingredients,sizePricing,isVegetarian,user:req.user._id
    })

    const createdProduct=await product.save()
    res.status(201).json(createdProduct)
  }catch(err){
    console.error(err);
    res.status(500).send('Server Error')
  }
})

router.put('/:id',protect,admin,async (req,res)=>{
  try{
    const {name,description,price,discountPrice,category,sizes,images,isAvailable,isBestseller,
      ingredients,sizePricing,isVegetarian
    }=req.body

    const product=await Product.findById(req.params.id);

    if (product){
      // Validate discount price
      const newPrice = price || product.price;
      const newDiscountPrice = discountPrice !== undefined ? discountPrice : product.discountPrice;
      
      if (newDiscountPrice && newDiscountPrice > newPrice) {
        return res.status(400).json({ 
          message: 'Discount price must be less than or equal to price' 
        });
      }

      // Validate sizePricing array
      if (sizePricing && sizePricing.length > 0) {
        for (let sp of sizePricing) {
          if (sp.discountPrice && sp.discountPrice > sp.price) {
            return res.status(400).json({ 
              message: `Discount price for ${sp.size} must be less than or equal to price` 
            });
          }
        }
      }

      product.name=name || product.name;
      product.description=description || product.description;
      product.price=price || product.price;
      product.discountPrice=discountPrice !== undefined ? discountPrice : product.discountPrice;
      product.category=category || product.category;
      product.sizes=sizes || product.sizes;
      product.images=images || product.images;
      product.isAvailable=isAvailable !==undefined?isAvailable: product.isAvailable

      product.isBestseller=isBestseller !==undefined?isBestseller: product.isBestseller
      product.ingredients=ingredients || product.ingredients
      product.sizePricing=sizePricing || product.sizePricing
      product.isVegetarian=isVegetarian !== undefined ? isVegetarian : product.isVegetarian

    
    const updatedProduct=await product.save()

    res.status(201).json(updatedProduct)
    }else{
      res.status(404).json({message:"Product not found"})
  }
  }catch(err){
    console.error(err);
    res.status(500).send("Server Error")
  }
})

router.delete('/:id',protect,admin,async (req,res)=>{
  try{
    const id=req.params.id
    const product=await Product.findById(id);
    if (product){
      await product.deleteOne()
      res.json({message:"Product Removed"})
    }else{
      res.status(404).json({message:"Product Not Found"})
    }
  }catch(err){
    console.error(err);
    res.status(500).send("Server Error")
  }
})

module.exports=router