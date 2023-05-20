const mongoose=require('mongoose')

mongoose.connect("mongodb://127.0.0.1:27017/UserProfile").then((res)=>{
  console.log("connected to db")
}).catch((e)=>{
    console.log("error occured during conn to db")
})