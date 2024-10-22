import { z } from "zod";

export const FavoriteSchema = z.object({
    mediaId: z.string(),
    MediaType: z.string(),
    title: z.string(),
    poster_url: z.string(),
})

export type FavoriteType = z.infer<typeof FavoriteSchema>;