import userModel from "../models/user.model.js";
import crypto from "crypto"   //  this is inbulit package in Node.js which used for password storing in the form of #.
import jwt from "jsonwebtoken";
import config from "../config/config.js";

export async function Register(req,res) {
    
const {username, email ,password} = req.body;

const isAlreadyRegistred = await userModel.findOne({

    $or:[
        {username},
        {email}
    ]
})

if(isAlreadyRegistred ){
    return res.status(409).json({
        message:"Usename or Email alredy exists."
    })
}

const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");

const user = await userModel.create({
    username,
    email,
    password: hashedPassword
})

const token = jwt.sign({
    id:user._id
},config.JWT_SECRET,{
    expiresIn:"1d"
})

res.status(201).json({
    message:"User registered successfully",
    user:{
        username:user.username,
        email:user.email,
        token
    }
})

}

export async function getMe(req,res) {
    const token = req.headers.authorization.split(" ") [ 1 ]

    if (!token) {
        return res.status(401).json({
            message:"Token not found"
        })
    }

    const decoded = jwt.verify(token,config.JWT_SECRET)

    const user = await userModel.findById(decoded.id)

    res.status(200).json({
        message:"User fetched successfully",
        user:{
            user:user.username,
            email:user.email
        }
    })
}