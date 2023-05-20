const mongoose=require("mongoose")

const userSchema=mongoose.Schema({
    firstname:String,
    lastname:String,
    email:String,
    phone:String,
    password:String,
    profilepicpath:String,
    profilemimetype:String,
    profilepic:Buffer
},{timestamps:true})

const User=mongoose.model('User',userSchema)
module.exports=User