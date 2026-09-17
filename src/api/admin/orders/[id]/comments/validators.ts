import { z } from "@medusajs/framework/zod"

export const PostAdminCreateOrderComment = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Comment cannot be empty")
    .max(5000, "Comment cannot exceed 5000 characters"),
})

export type PostAdminCreateOrderCommentType = z.infer<
  typeof PostAdminCreateOrderComment
>
