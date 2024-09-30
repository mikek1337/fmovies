import type { Comment, User } from "@prisma/client"
import { z } from "zod"
export interface Comments extends Comment{
    user:User,
    replies:Comments[],
}

export interface MovieComments{
    comment:Comments[]   
}

export interface SeriesComments{
    comment:Comments[]   
}

export const CommentSchema = z.object({
    content:z.string(),
    parentId: z.string().optional(),
    movieId: z.string().optional(),
    seriesId: z.string().optional(),
    seasonId: z.string().optional(),
    episodeId: z.string().optional(),
})

export type CommentSchemaType = z.infer<typeof CommentSchema>