import type { Request, Response, NextFunction } from "express";

export const createError = (statusCode: number, message: string) => {
    const error = new Error(message) as Error & { statusCode: number };
    error.statusCode = statusCode;
    return error;
  };
  
  // Centralized error handler middleware
  export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error("🔥 Error:", err);
  
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
  
    res.status(statusCode).json({
      success: false,
      message,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  };
  