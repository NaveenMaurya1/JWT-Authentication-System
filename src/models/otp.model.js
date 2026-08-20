import mongoose from "mongoose";


const otpScheme = new mongoose.Schema({
    email:{
        type:String,
        required: [ true, "Email is required" ]
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required: [ true, "OTP is required" ]
    },
    otpHash:{
        type:String,
        required: [ true, "OTP is required" ]
    }
},{
    timestamps:true
})

const otpModel = mongoose.model("otps",otpScheme)

export default otpModel