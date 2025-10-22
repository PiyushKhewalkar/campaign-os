import { Router } from "express";
import { checkAuth } from "../middleware/auth.middleware.js";
import { getAllPosts, getPost, generatePosts, deletePost } from "../controllers/post.controller.js";

const postRouter = Router()

postRouter.get("/:campaignId", checkAuth, getAllPosts) // get all posts under the campaign

postRouter.get("/:id", checkAuth, getPost) // get a specific post

postRouter.get("/:campaignId/generate", checkAuth, generatePosts) // generate posts

postRouter.delete("/:id/delete", checkAuth, deletePost) //delete post

export default postRouter