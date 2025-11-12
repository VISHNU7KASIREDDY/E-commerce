const mongoose=require('mongoose')

const dotenv=require('dotenv')
const Product=require("./models/product")
const User=require("./models/user")
const Cart=require("./models/cart")
const products=require("./data/products")

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const seedData=async ()=>{
  try{
    await Product.deleteMany();
    await User.deleteMany()
    await Cart.deleteMany()

    const createdUser=await User.create({
      name:"Vishnu",
      email:"vishnukasireddy28@gmail.com",
      password:"123456",
      role:"admin"
    })

    const userId=createdUser._id

    const sampleProducts=products.map((product)=>{
      return {...product,userId}
    })

    await Product.insertMany(sampleProducts)
  }catch(err){
    console.log("Error in seeding the data")
  }
}