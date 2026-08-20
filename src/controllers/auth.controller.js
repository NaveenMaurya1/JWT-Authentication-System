import userModel from "../models/user.model.js";
import crypto from "crypto"   //  this is inbulit package in Node.js which used for password storing in the form of #.
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import sessionModel from "../models/session.model.js";
import { sendEmail } from "../service/email.service.js";
import { generateOtp } from "../utils/utils.js";
import { getOtpHtml } from "../utils/utils.js";
import otpModel from "../models/otp.model.js";

export async function Register(req, res) {

    const { username, email, password } = req.body;

    const isAlreadyRegistred = await userModel.findOne({

        $or: [
            { username },
            { email }
        ]
    })

    if (isAlreadyRegistred) {
        return res.status(409).json({
            message: "Usename or Email alredy exists."
        })
    }

    const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");

    const user = await userModel.create({
        username,
        email,
        password: hashedPassword
    })

    




// we don't need that code while using opt verification 

    // const refreshToken = jwt.sign({
    //     id: user._id
    // }, config.JWT_SECRET,
    //     {
    //         expiresIn: "7d"
    //     })

    // const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex")

    // const session = await sessionModel.create({
    //     user: user._id,
    //     refreshToken: refreshTokenHash,
    //     ip: req.ip,
    //     userAgent: req.headers["user-agent"]
    // })

    // const accessToken = jwt.sign({
    //     id: user._id,
    //     session: session._id
    // }, config.JWT_SECRET,
    //     {
    //         expiresIn: "15m"
    //     })


    // res.cookie("refreshToken", refreshToken, {
    //     httpOnly: true,
    //     secure: false,
    //     sameSite: "strict",
    //     maxAge: 7 * 24 * 60 * 60 * 1000 // max 7days
    // })

    const otp = generateOtp()
    const html = getOtpHtml(otp)

    const otpHash = crypto.createHash("sha256").update(otp).digest("hex")
    await otpModel.create({
        email,
        user:user._id,
        otpHash
    }) 

    await sendEmail(email,"OTP Verification", `Your OTP code is ${otp}`, html)

    res.status(201).json({
        message: "User registered successfully",
        user: {
            username: user.username,
            email: user.email,
            verified:user.verfied,
        },
        // accessToken
    })

}

export async function login(req, res) {
    const { email, password } = req.body

    const user = await userModel.findOne({ email })
    if (!user) {
        return res.status(401).json({
            message: "Invalid email or password"
        })
    }
     
    if (!user.verified) {   // this will help to not generate access and refresh token untill user is verified
        return res.status(401).json({
            message:"Email not verified"
        })
    }

    const hashedPassword = crypto.createHash("sha256").update(password).digest("hex")
    const isPasswordValid = hashedPassword === user.password
    if (!isPasswordValid) {
        return res.status(401).json({
            message: "Invalid email or password"
        })
    }

    const refreshToken = jwt.sign({
        id: user._id,
    }, config.JWT_SECRET, {

        expiresIn: "7d"

    })

    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex")
    const session = await sessionModel.create({
        user: user._id,
        refreshToken: refreshTokenHash,
        ip: req.ip,
        userAgent: req.headers["user-agent"]
    })
    const accessToken = jwt.sign({
        id: user._id,
        sessionId: session._id
    }, config.JWT_SECRET, {

        expiresIn: "15m"

    })

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000 // max 7days
    })

    res.status(200).json({
        message:"Logged in successfully",
        user:{
            username:user.username,
            email:user.email
        },
        accessToken,
    })
}

export async function getMe(req, res) {
    const token = req.headers.authorization.split(" ")[1]

    if (!token) {
        return res.status(401).json({
            message: "Token not found"
        })
    }

    const decoded = jwt.verify(token, config.JWT_SECRET)

    const user = await userModel.findById(decoded.id)

    res.status(200).json({
        message: "User fetched successfully",
        user: {
            user: user.username,
            email: user.email
        }
    })
}

export async function refreshToken(req, res) {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({
            message: "Refresh Token not found"
        })
    }
    const decoded = jwt.verify(refreshToken, config.JWT_SECRET)

    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex")
    const session = await sessionModel.findOne({
        refreshToken: refreshTokenHash,
        revoked: false
    })
    if (!session) {
        return res.status(401).json({
            message: "Invalid refesh token"
        })
    }

    const accessToken = jwt.sign({
        id: decoded.id
    }, config.JWT_SECRET,
        {
            expiresIn: "15m"
        })

    const newRefreshToken = jwt.sign({
        id: decoded.id
    }, config.JWT_SECRET,
        {
            expiresIn: "7d"
        })

    const newRefreshTokenHash = crypto.createHash("sha256").update(newRefreshToken).digest("hex")
    session.refreshToken = newRefreshTokenHash

    await session.save()

    res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000 // max 7days
    })

    res.status(200).json({
        message: "Access Token refreshed successfully",
        accessToken
    })
}

export async function logout(req, res) {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) {
        return res.status(400).json({
            message: "Refresh token not found"
        })
    }
    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex")
    const session = await sessionModel.findOne({
        refreshToken: refreshTokenHash,
        revoked: false
    })
    if (!session) {
        return res.status(401).json({
            message: "Invalid refesh token"
        })
    }
    session.revoked = true
    await session.save()

    res.clearCookie("refreshToken")

    res.status(200).json({
        message: "Logged out successfully"
    })
}

export async function logoutAll(req, res) {     // it log out from all devies by doing access token blacklisting when refresh token get expire.

    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) {
        return res.status(400).json({
            message: "Refresh Token not found"
        })
    }

    const decoded = jwt.verify(refreshToken,config.JWT_SECRET)
    await sessionModel.updateMany({
        user: decoded.id,
        revoked: false
    }, {
        revoked: true
    })

    res.clearCookie("refreshToken")

    res.status(200).json({
        message: "Logged out from all devices successfully"
    })

}

export async function verifyEmail(req,res) {
    const {otp,email} = req.body

    const otpHash = crypto.createHash("sha256").update(otp).digest("hex")

    const otpDoc = await otpModel.findOne({
        email,
        otpHash
    })

    if(otpDoc){
        return res.status(400).json({
            message:"Invalid OTP"
        })
    }

    const user =  await userModel.findByIdAndUpdate(otpDoc.user,{
        verfied:true
    })

    await otpModel.deleteMany({
        user: otpDoc.user
    })
    

    return res.status(200).json({
        message:"Email verified succesfully",
        user:{
            username: user.username,
            email: user.email,
            verified: user.verfied 
        }
    })
}