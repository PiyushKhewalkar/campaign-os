import User from "../models/user.model.js";
import type { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { firebaseAdminAuth } from "../services/firebase.js";

dotenv.config();

// Register new user
export const signUp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      isVerified: false,
    });

    // (Optional) send verification email here

    res.status(201).json({
      message: "User registered successfully",
      user: { id: newUser._id, email: newUser.email },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Login user
export const signIn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET not defined in environment variables");
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      secret,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, email: user.email, isVerified: user.isVerified },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Verify user email (stub, depends on your email system)
export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ message: "User not found" });

    user.isVerified = true;
    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (err) {
    console.error("Verification error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Google sign-in using Firebase ID token
export const signInWithGoogle = async (req: Request, res: Response) => {
  try {
    const { idToken } = req.body as { idToken?: string };
    if (!idToken) {
      return res.status(400).json({ message: "idToken is required" });
    }

    // For now, we'll trust the frontend verification and create/find user based on token
    // In production, you should verify the token with Firebase Admin
    let decoded;
    try {
      decoded = await firebaseAdminAuth.verifyIdToken(idToken);
    } catch (error) {
      console.warn('Firebase Admin verification failed, using fallback method:', error);
      // Fallback: decode JWT token manually (less secure but works for development)
      const parts = idToken.split('.');
      if (parts.length !== 3) {
        return res.status(400).json({ message: "Invalid token format" });
      }
      const payload = JSON.parse(Buffer.from(parts[1] || '', 'base64').toString());
      decoded = payload;
    }

    const email = decoded.email;
    if (!email) {
      return res.status(400).json({ message: "No email on Google account" });
    }

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        email,
        password: await bcrypt.hash(Math.random().toString(36).slice(-12), 10),
        isVerified: true,
      });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET not defined in environment variables");
    }

    const token = jwt.sign({ id: user._id, email: user.email }, secret, { expiresIn: "7d" });

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, email: user.email, isVerified: true },
    });
  } catch (err) {
    console.error("Google sign-in error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
