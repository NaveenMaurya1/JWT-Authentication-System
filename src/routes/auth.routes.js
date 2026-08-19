import { Router } from "express";
import * as authController from "../controllers/auth.controller.js"

const authRouter = Router() 

// POST /api/auth/register
authRouter.post("/register",authController.Register)

//  Get /api/auth/get-me
authRouter.get("/get-me",authController.getMe)

//  Get /api/auth/refresh-token
authRouter.get("/refresh-token",authController.refreshToken)

//  Get /api/auth/logout
authRouter.get("/logout",authController.logout)

export default authRouter