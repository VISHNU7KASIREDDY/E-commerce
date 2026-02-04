const express=require('express')
const Product=require('../models/product')
const {protect,admin}=require('../middlewares/authMiddleware')

const router=express.Router();

router.get('/:id',async(req,res)=>{
  try{
    const {id}=req.params
    const product=await Product.findById(id)
    if (!product){
      return res.status(404).json({message:"Product not found"})
    }
    res.status(200).json(product)
  }catch(err){
    console.error(err);
    res.status(500).send('Server Error')
  }
})

router.get('/',async(req,res)=>{
  try{
    const {category}=req.query

    const query = category ? {category: category} : {};
    const products=await Product.find(query)
    res.status(200).json(products)
  }catch(err){
    console.error(err);
    res.status(500).send('Server Error')
  }
})

module.exports=router;