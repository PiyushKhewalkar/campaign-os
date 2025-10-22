import OpenAI from "openai";
import dotenv from "dotenv";
import { 
  x_post_format, 
  linkedin_post_format, 
  instagram_post_format, 
  reddit_post_format 
} from "../utils/responseformats.js";

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
      return x_post_format; // Default to X format
  }
};

// Helper function to get platform-specific prompt instructions
const getPlatformInstructions = (platform: string) => {
  switch (platform) {
    case "x":
      return "Create engaging Twitter/X posts with concise text (280 characters max). Focus on trending topics, hashtags, and viral content.";
    case "linkedin":
      return "Create professional LinkedIn posts with valuable insights, industry knowledge, and professional networking content. Include both text and media descriptions.";
    case "instagram":
      return "Create Instagram posts with engaging captions and visual descriptions. Focus on storytelling, aesthetics, and visual appeal.";
    case "reddit":
      return "Create Reddit posts with compelling titles and detailed body content. Focus on community engagement, discussions, and valuable information.";
    default:
      return "Create engaging social media content.";
  }
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
      const platformFormat = getPlatformFormat(platform);
      const platformInstructions = getPlatformInstructions(platform);
      console.log(`Generating posts for ${platform}...`);
      
      // Generate posts for this platform
      for (let i = 0; i < postsPerPlatform; i++) {
        try {
          console.log(`Generating ${platform} post ${i + 1}/${postsPerPlatform}`);
          const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content: `You are a social media content creator specializing in ${platform} posts. 
                
                ${platformInstructions}
                
                Create content based on the campaign information provided. Make sure the content is:
                - Engaging and relevant to the target audience
                - Appropriate for the ${platform} platform
                - Aligned with the campaign goals
                - Original and creative
                
                Return your response as a valid JSON object following the exact format requirements for ${platform} posts.`,
              },
              {
                role: "user",
                content: `Campaign Information:
                Title: ${campaign.title}
                Description: ${campaign.description}
                Start Date: ${campaign.startDate}
                End Date: ${campaign.endDate}
                Platforms: ${campaign.platforms.join(", ")}
                
                Create a ${platform} post for this campaign. Make it engaging and platform-appropriate.
                
                Return the response as a JSON object with the following structure:
                ${platform === "x" ? '{"text": "your post content here"}' : 
                 platform === "linkedin" ? '{"text": "your post content", "media_description": "description of media"}' :
                 platform === "instagram" ? '{"caption": "your caption", "media_description": "description of media"}' :
                 platform === "reddit" ? '{"title": "your title", "body": "your post body", "media_description": "description of media"}' :
                 '{"text": "your post content"}'}`,
              },
            ],
            response_format: { type: "json_object" },
          });

          const content = response.choices[0]?.message?.content;
          if (content) {
            try {
              const result = JSON.parse(content);
              // Validate the result against the platform format
              const validationResult = platformFormat.safeParse(result);
              if (validationResult.success) {
                posts.push({
                  platform: platform,
                  script: validationResult.data
                });
                console.log(`Successfully generated ${platform} post ${i + 1}`);
              } else {
                console.error(`Invalid format for ${platform} post:`, validationResult.error);
              }
            } catch (parseError) {
              console.error(`Failed to parse JSON for ${platform} post:`, parseError);
            }
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