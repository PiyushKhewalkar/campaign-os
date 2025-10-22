import { Router } from "express";
import { checkAuth } from "../middleware/auth.middleware.js";
import { getAllPosts, getPost, generatePosts, deletePost, getAllScheduledPosts, schedulePost } from "../controllers/post.controller.js";

const postRouter = Router()

postRouter.get("/scheduled/all", checkAuth, getAllScheduledPosts) // get all scheduled posts for the user

postRouter.get("/:campaignId", checkAuth, getAllPosts) // get all posts under the campaign

// Use a distinct path segment to avoid conflict with "/:campaignId"
postRouter.get("/id/:id", checkAuth, getPost) // get a specific post

postRouter.get("/:campaignId/generate", checkAuth, generatePosts) // generate posts

postRouter.delete("/:id/delete", checkAuth, deletePost) //delete post

postRouter.put("/:id/schedule", checkAuth, schedulePost) // schedule post

export default postRouter