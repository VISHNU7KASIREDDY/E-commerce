const mongoose=require('mongoose')
const bcrypt =require('bcryptjs')

const userSchema= new mongoose.Schema(
  {
    name:{
      type:String,
      required:true,
      trim:true,
    },
    email:{
      type:String,
      required:true,
      trim:true,
      unique:true,
      match :[/.+\@.+\..+/,"Please enter a valid email address"],
    },
    password:{
        type:String,
        minLength:6,
    },
    googleId:{
        type:String,
        unique:true,
        sparse:true,
    },
    authProvider:{
        type:String,
        enum:["local","google"],
        default:"local",
    },
    role:{
        type:String,
        enum:["customer","admin"],
        default:"customer",
    },
    wishlist: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }],
    },
    {timestamps:true}
)

userSchema.pre("validate", function (next) {
  if (this.authProvider === "local" && !this.password) {
    this.invalidate("password", "Password is required for local accounts");
  }
  next();
});

userSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword=async function (enteredPassword){
  return await bcrypt.compare(enteredPassword,this.password);
};

module.exports=mongoose.model("User",userSchema);