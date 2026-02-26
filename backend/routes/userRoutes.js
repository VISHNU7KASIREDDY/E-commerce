const express=require('express')

const User=require('../models/user')
const jwt=require("jsonwebtoken");
const {OAuth2Client}=require("google-auth-library")
const {protect}=require("../middlewares/authMiddleware")
const router=express.Router()

const googleClient=new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

router.post('/register',async (req,res)=>{
  const {name,email,password}=req.body

  try{
    let user=await User.findOne({email});
    if (user){
      return res.status(400).json({message:"User already exists"})
    }
    user=new User({name,email,password})

    await user.save();
    
    const payload={user:{id:user._id,role:user.role}};

    jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"48h"},(err,token)=>{
      if (err) throw err

      res.status(201).json({
        user:{
          _id:user._id,
          name:user.name,
          email:user.email,
          role:user.role
        },
        token,
      })
    })
    
  }catch(err){
    console.log(err)
    res.status(500).send("Server Error");
  }
});

router.post("/login",async (req,res)=>{
  const {email,password}=req.body

  try{
    let user=await User.findOne({email})

    if (!user){
      return res.status(400).json({message:"Invalid Credentials"})
    }
    const isMatch=await user.matchPassword(password)

    if (!isMatch){
      return res.status(400).json({message:"Invalid Credentials"})
    }

    const payload={user:{id:user._id,role:user.role}};

    jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"48h"},(err,token)=>{
      if (err) throw err

      res.json({
        user:{
          _id:user._id,
          name:user.name,
          email:user.email,
          role:user.role
        },
        token,
      })
    })
  }catch(err){
      console.error(err)
      res.status(500).send('Server error')
  }
})

router.post("/google-login",async (req,res)=>{
  const {credential}=req.body

  try{
    const ticket=await googleClient.verifyIdToken({
      idToken:credential,
      audience:process.env.GOOGLE_CLIENT_ID,
    })
    const {sub:googleId,email,name}=ticket.getPayload()

    let user=await User.findOne({$or:[{googleId},{email}]})

    if(user && !user.googleId){
      user.googleId=googleId
      user.authProvider="google"
      await user.save()
    }

    if(!user){
      user=new User({
        name,
        email,
        googleId,
        authProvider:"google",
        role:"customer",
      })
      await user.save()
    }

    const payload={user:{id:user._id,role:user.role}}

    jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"48h"},(err,token)=>{
      if(err) throw err

      res.json({
        user:{
          _id:user._id,
          name:user.name,
          email:user.email,
          role:user.role
        },
        token,
      })
    })
  }catch(err){
    console.error("Google login error:",err)
    res.status(401).json({message:"Google authentication failed"})
  }
})

router.get("/profile",protect,async (req,res)=>{
  res.json(req.user)
})

module.exports=router;