import Post from "../models/post.model.js";
import Campaign from "../models/campaign.model.js";
import { generatePostsService } from "../services/ai.service.js";
import type { NextFunction, Request, Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import mongoose from "mongoose";


export const getAllPosts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { campaignId } = req.params
  
      if (!campaignId || !mongoose.Types.ObjectId.isValid(campaignId)) {
        return res.status(400).json({ message: "Invalid campaign ID" })
      }
  
      const posts = await Post.find({ campaignId })
  
      if (!posts || posts.length === 0) {
        return res.status(404).json({ message: "This campaign has no posts" })
      }
  
      return res.status(200).json({ success: true, posts })
    } catch (error) {
      next(error)
    }
  }

export const getPost = async(req: Request, res: Response, next: NextFunction) => {
    try {

        const {id} = req.params

        const post = await Post.findById(id)

        if (!post) return res.status(404).json({message: "Post not found"})

        return res.status(200).json({success: true, post})
        
    } catch (error) {
        next(error)
    }
}

export const generatePosts = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { campaignId } = req.params;
      const numberOfPosts = 3;
  
      // ✅ Corrected variable name: use campaignId
      const campaign = await Campaign.findById(campaignId);
  
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
  
      // ✅ Assuming you have a separate function `generatePostIdeas` (not recursively calling itself)
      const response = await generatePostsService(campaign, campaign.platforms, numberOfPosts);
  
      if (!response || response.length === 0) {
        return res.status(500).json({ message: "Error generating posts" });
      }
  
      // ✅ Save all generated posts to DB
      const postDocs = await Promise.all(
        response.map((post) =>
          Post.create({
            campaignId: campaign._id,
            platform: post.platform,
            script: post.script,
            scheduled_on: campaign.startDate ? new Date(new Date(campaign.startDate).setHours(0,0,0,0)) : undefined,
            userId: req.user?.id,
          })
        )
      );
  
      // ✅ Update campaign with new post IDs
      const postIds = postDocs.map((p) => p._id);
      campaign.postIds = [...(campaign.postIds || []), ...postIds];
      await campaign.save();
  
      // ✅ Return the result
      return res.status(201).json({
        message: "Posts generated successfully",
        posts: postDocs,
      });
    } catch (error) {
      console.error("Error generating posts:", error);
      next(error);
    }
  };
  
export const getAllScheduledPosts = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        // Get all campaigns for the user
        const campaigns = await Campaign.find({ userId });
        const campaignIds = campaigns.map(campaign => campaign._id);

        // Get all posts that have a scheduled date for these campaigns
        // Show on calendar regardless of current status
        const scheduledPosts = await Post.find({
            campaignId: { $in: campaignIds },
            scheduled_on: { $exists: true, $ne: null }
        }).sort({ scheduled_on: 1 });

        return res.status(200).json({ success: true, posts: scheduledPosts });
    } catch (error) {
        console.error("Error fetching scheduled posts:", error);
        next(error);
    }
};

export const deletePost = async(req: Request, res: Response, next: NextFunction) => {
    try {

        const {id} = req.params

        const deletedPost = await Post.findByIdAndDelete(id)

        if (!deletedPost) return res.status(404).json({message: "Post not found"})

        // delete the post from the campaign

        const campaign = await Campaign.findById(deletedPost.campaignId)

        if (!campaign) return res.status(404).json({message: "Campaign not found"})

        campaign.postIds = campaign.postIds.filter((postId) => postId.toString() !== id)

        await campaign.save()

        return res.status(200).json({success: true, campaign, deletedPost})

    } catch (error) {
        next(error)
    }
}

export const schedulePost = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params
        const { scheduledDate } = req.body as { scheduledDate?: string }

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid post ID" })
        }

        if (!scheduledDate) {
            return res.status(400).json({ message: "scheduledDate is required" })
        }

        const date = new Date(scheduledDate)
        if (isNaN(date.getTime())) {
            return res.status(400).json({ message: "Invalid scheduledDate" })
        }

        // normalize to start of day (no time)
        date.setHours(0, 0, 0, 0)

        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { scheduled_on: date, status: "scheduled" },
            { new: true }
        )

        if (!updatedPost) {
            return res.status(404).json({ message: "Post not found" })
        }

        return res.status(200).json({ success: true, post: updatedPost })
    } catch (error) {
        next(error)
    }
}