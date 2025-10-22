import { Router } from "express";
import { getAllCampaigns, getCampaign, createCampaign, deleteCampaign, updateCampaign } from "../controllers/campaign.controller.js";
import { checkAuth } from "../middleware/auth.middleware.js";

const campaignRouter = Router()

campaignRouter.get("/", checkAuth, getAllCampaigns) //get all campaigns

campaignRouter.get("/:id",checkAuth, getCampaign) // get specific campaign

campaignRouter.post("/create",checkAuth, createCampaign) // create campaign

campaignRouter.put("/:id/update",checkAuth, updateCampaign) //update campaign

campaignRouter.delete("/:id/delete",checkAuth, deleteCampaign) // delete campaign

export default campaignRouter