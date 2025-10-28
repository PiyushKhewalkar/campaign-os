// Platform-specific prompt instructions for AI-generated social media posts

export const getPlatformInstructions = (platform: string): string => {
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

export const getSystemPrompt = (platform: string, platformInstructions: string): string => {
  return `You are a social media content creator specializing in ${platform} posts. 

${platformInstructions}

Create content based on the campaign information provided. Make sure the content is:
- Engaging and relevant to the target audience
- Appropriate for the ${platform} platform
- Aligned with the campaign goals
- Original and creative`;
};

export const getUserPrompt = (campaign: any, platform: string): string => {
  return `Campaign Information:
Title: ${campaign.title}
Description: ${campaign.description}
Start Date: ${campaign.startDate}
End Date: ${campaign.endDate}
Platforms: ${campaign.platforms.join(", ")}

Create a ${platform} post for this campaign. Make it engaging and platform-appropriate.`;
};

