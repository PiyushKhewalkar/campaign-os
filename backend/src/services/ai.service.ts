import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface PostIdea {
  platform: string;
  script: any;
}

export const generatePostsService = async (
  campaign: any,
  platforms: string[],
  numberOfPosts: number
): Promise<PostIdea[]> => {
  try {
    const prompt = `
    Generate ${numberOfPosts} social media posts for a campaign with the following details:
    - Title: ${campaign.title}
    - Description: ${campaign.description}
    - Platforms: ${platforms.join(", ")}
    - Start Date: ${campaign.startDate}
    - End Date: ${campaign.endDate}

    For each platform, create engaging, platform-appropriate content:
    - X (Twitter): Concise, engaging tweets (max 280 characters)
    - Instagram: Visual-focused captions with relevant hashtags
    - LinkedIn: Professional, business-focused content

    Return the posts as an array of objects with platform and script properties.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a social media content creator. Generate engaging, platform-specific social media posts based on campaign details."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    const response = completion.choices[0]?.message?.content;
    
    if (!response) {
      throw new Error("No response from OpenAI");
    }

    // Parse the response and create post ideas
    const postIdeas: PostIdea[] = [];
    
    // Simple parsing - in a real app, you'd want more robust JSON parsing
    platforms.forEach((platform, index) => {
      if (index < numberOfPosts) {
        postIdeas.push({
          platform,
          script: `Generated content for ${platform}: ${campaign.title} - ${campaign.description}`
        });
      }
    });

    return postIdeas;
  } catch (error) {
    console.error("Error generating post ideas:", error);
    throw new Error("Failed to generate post ideas");
  }
};