// rs for X post
// rs for linkedin post
// rs for instagram post

import {z} from "zod"

export const x_post_format = z.object({
    text: z.string()
})

export const linkedin_post_format = z.object({
    text: z.string(),
    media_description: z.string()
})

export const instagram_post_format = z.object({
    caption: z.string(),
    media_description: z.string()
})

export const reddit_post_format = z.object({
    title: z.string(),
    body: z.string(),
    media_description: z.string()
})