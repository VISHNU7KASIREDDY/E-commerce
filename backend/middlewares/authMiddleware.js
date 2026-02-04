const jwt=require('jsonwebtoken')

const User=require("../models/user")

const protect=async (req,res,next)=>{
  let token;
  let authHeader=req.headers.authorization
  if (authHeader &&authHeader.startsWith('Bearer') ){
    try{
      token=authHeader.split(" ")[1]
      const decoded=jwt.verify(token,process.env.JWT_SECRET )

      req.user=await User.findById(decoded.user.id).select('-password')
      next()
    }catch(err){
        console.error("Token verification failed",err)
        res.status(401).json({message:"Not authorized , token Failed"})
    }
  }else{
    res.status(401).json({message:"Not Authorized , no token provided"})
  }
}

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

module.exports={protect, admin};