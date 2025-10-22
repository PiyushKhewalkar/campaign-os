// src/utils/platforms.ts
import xIcon from "@/assets/x.svg"
import instagramIcon from "@/assets/instagram.svg"
import linkedinIcon from "@/assets/linkedin.svg"
import redditIcon from "@/assets/reddit.svg"

export const PLATFORM_CONFIG: Record<string, { name: string; icon: string }> = {
  x: { name: "X (Twitter)", icon: xIcon },
  instagram: { name: "Instagram", icon: instagramIcon },
  linkedin: { name: "LinkedIn", icon: linkedinIcon },
  reddit: { name: "Reddit", icon: redditIcon },
}
