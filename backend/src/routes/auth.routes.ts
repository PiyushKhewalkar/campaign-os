import { Router } from "express";
import { signUp, signIn, verifyEmail, signInWithGoogle } from "../controllers/auth.controller.js";

const authRouter = Router()

authRouter.post("/signup", signUp)
authRouter.post("/signin", signIn)
authRouter.post("/verify-email", verifyEmail)
authRouter.post("/google", signInWithGoogle)

export default authRouter