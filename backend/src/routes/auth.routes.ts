import { Router } from "express";
import { signUp, signIn, verifyEmail } from "../controllers/auth.controller.js";

const authRouter = Router()

authRouter.post("/signup", signUp)
authRouter.post("/signin", signIn)
authRouter.post("/verify-email", verifyEmail)

export default authRouter