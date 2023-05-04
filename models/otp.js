const mongoose=require('mongoose');

const otpModel= new mongoose.Schema({
    otp:{
        type:String
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    }
},{timestamps:true})

module.exports=mongoose.model("otp",otpModel)