// src/utils/platforms.ts
import xIcon from "@/assets/react.svg"
import instagramIcon from "@/assets/react.svg"
import linkedinIcon from "@/assets/react.svg"
import redditIcon from "@/assets/react.svg"

export const PLATFORM_CONFIG: Record<string, { name: string; icon: string }> = {
  x: { name: "X (Twitter)", icon: xIcon },
  instagram: { name: "Instagram", icon: instagramIcon },
  linkedin: { name: "LinkedIn", icon: linkedinIcon },
  reddit: { name: "Reddit", icon: redditIcon },
}
