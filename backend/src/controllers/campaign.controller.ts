import Campaign from "../models/campaign.model.js";
import Post from "../models/post.model.js";
import type { NextFunction, Request, Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";

export const getAllCampaigns = async(req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        
        const userId = req.user?.id

        const campaigns = await Campaign.find({userId})

        if (!campaigns) return res.status(404).json({message: "no campaigns found for this user"})

        return res.status(200).json({success: true, campaigns})
        
    } catch (error) {
        next(error)
    }
}

export const getCampaign = async(req: AuthRequest, res: Response, next: NextFunction) => {
    try {

        const userId = req.user?.id

        const {id} = req.params

        const campaign = await Campaign.findOne({ _id: id, userId })

        if (!campaign) return res.status(404).json({message: "Campaign not found or not owned by user"})

        return res.status(200).json({success: true, campaign})

        
    } catch (error) {
        next(error)
    }
}

export const createCampaign = async(req: AuthRequest, res: Response, next: NextFunction) => {
    try {

        const {title, description, startDate, endDate, platforms} = req.body

        const newCampaign = new Campaign({
            title, description, startDate, endDate, platforms, userId: req.user?.id
        })

        await newCampaign.save()

        return res.status(201).json({success: true, newCampaign})
        
    } catch (error) {
        next(error)
    }
}

export const updateCampaign = async(req: AuthRequest, res: Response, next: NextFunction) => {
    try {

        const {title, description, startDate, endDate, platforms} = req.body
        const {id} = req.params
        const userId = req.user?.id

        const updatedCampaign = await Campaign.findOneAndUpdate(
            { _id: id, userId: userId }, 
            { title, description, startDate, endDate, platforms },
            { new: true }
        )

        if (!updatedCampaign) return res.status(404).json({message: "Campaign not found or not owned by user"})

        return res.status(200).json({success: true, updatedCampaign}) 
        
    } catch (error) {
        next(error)
    }
}

export const deleteCampaign = async(req: AuthRequest, res: Response, next: NextFunction) => {
    try {

        const {id} = req.params
        const userId = req.user?.id

        const deletedCampaign = await Campaign.findOneAndDelete({ _id: id, userId: userId })

        if (!deletedCampaign) return res.status(404).json({message: "Campaign not found or not owned by user"})

        // delete all the posts associated with it

        const posts = await Post.find({campaignId: id})

        if (posts.length > 0) {
            await Promise.all(posts.map((post) => post.deleteOne()))
        }

        return res.status(200).json({success: true, deletedCampaign}) 
        
    } catch (error) {
        next(error)
    }
}