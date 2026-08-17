import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true,"Username is reuired"],
        unique:[true,"Username must be true"]
    },
    email:{
        type:String,
        required:[true,"Email is reuired"],
        unique:[true,"Email must be true"]
    },
    password:{
        type:String,
        required:[true,"Username is reuired"]
    }
})

const userModel = mongoose.model("user",userSchema)

export default userModel;