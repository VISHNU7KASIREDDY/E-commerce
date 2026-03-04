const express=require('express')

const User=require('../models/user')
const jwt=require("jsonwebtoken");
const {OAuth2Client}=require("google-auth-library")
const {protect}=require("../middlewares/authMiddleware")
const router=express.Router()

if (!process.env.GOOGLE_CLIENT_ID) {
  console.error('GOOGLE_CLIENT_ID is missing from environment variables. Google login will not work.');
}
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

router.post("/google-login", async (req, res) => {
  const { credential } = req.body;

  if (!credential) {
    return res.status(400).json({ message: "No Google credential provided" });
  }

  try {
    // Verify the Google ID token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { sub: googleId, email, name } = ticket.getPayload();

    // Find existing user or create a new one
    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (user && !user.googleId) {
      user.googleId = googleId;
      user.authProvider = "google";
      await user.save();
    }

    if (!user) {
      user = new User({
        name,
        email,
        googleId,
        authProvider: "google",
        role: "customer",
      });
      await user.save();
    }

    // Sign JWT as a promise so errors stay inside this try/catch
    const token = await new Promise((resolve, reject) => {
      jwt.sign(
        { user: { id: user._id, role: user.role } },
        process.env.JWT_SECRET,
        { expiresIn: "48h" },
        (err, token) => (err ? reject(err) : resolve(token))
      );
    });

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    console.error("Google login error:", err.message);
    res.status(401).json({ message: err.message || "Google authentication failed" });
  }
})

router.get("/profile",protect,async (req,res)=>{
  res.json(req.user)
})

module.exports=router;