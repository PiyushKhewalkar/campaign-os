import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import dotenv from "dotenv";
import { 
  x_post_format, 
  linkedin_post_format, 
  instagram_post_format, 
  reddit_post_format 
} from "../utils/responseformats.js";
import { getPlatformInstructions, getSystemPrompt, getUserPrompt } from "../utils/prompts.js";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface PostIdea {
  platform: string;
  script: any;
}

// Helper function to get the appropriate format for each platform
const getPlatformFormat = (platform: string) => {
  switch (platform) {
    case "x":
      return x_post_format;
    case "linkedin":
      return linkedin_post_format;
    case "instagram":
      return instagram_post_format;
    case "reddit":
      return reddit_post_format;
    default:
      return x_post_format;
  }
};

// Helper function to generate a single post for a platform
const generateSinglePost = async (
  campaign: any,
  platform: string
): Promise<any> => {
  const platformInstructions = getPlatformInstructions(platform);
  const platformFormat = getPlatformFormat(platform);
  
  const response = await openai.responses.parse({
    model: "gpt-4o-mini",
    input: [
      {
        role: "system",
        content: getSystemPrompt(platform, platformInstructions),
      },
      {
        role: "user",
        content: getUserPrompt(campaign, platform),
      },
    ],
    text: {
      format: zodTextFormat(platformFormat, "post"),
    },
  });

  return response.output_parsed;
};

export const generatePostsService = async (
  campaign: any,
  platforms: string[],
  numberOfPosts: number
): Promise<PostIdea[]> => {
  try {
    console.log(`Generating ${numberOfPosts} posts for platforms: ${platforms.join(", ")}`);
    const posts: PostIdea[] = [];
    
    // Calculate posts per platform
    const postsPerPlatform = Math.ceil(numberOfPosts / platforms.length);
    console.log(`Posts per platform: ${postsPerPlatform}`);
    
    for (const platform of platforms) {
      console.log(`Generating posts for ${platform}...`);
      
      // Generate posts for this platform
      for (let i = 0; i < postsPerPlatform; i++) {
        try {
          console.log(`Generating ${platform} post ${i + 1}/${postsPerPlatform}`);
          
          const result = await generateSinglePost(campaign, platform);
          
          if (result) {
            posts.push({
              platform: platform,
              script: result
            });
            console.log(`Successfully generated ${platform} post ${i + 1}`);
          }
        } catch (error) {
          console.error(`Error generating ${platform} post:`, error);
          // Continue with other platforms even if one fails
        }
      }
    }
    
    console.log(`Successfully generated ${posts.length} posts total`);
    return posts;
  } catch (error) {
    console.error("Error in generatePostsService:", error);
    throw error;
  }
};
