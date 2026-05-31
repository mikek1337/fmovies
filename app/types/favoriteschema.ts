import { z } from "zod";

export const FavoriteSchema = z.object({
    mediaId: z.string(),
    MediaType: z.string(),
    title: z.string(),
    poster_url: z.string(),
    season: z.number().optional(),
    episode: z.number().optional(),
})

export type FavoriteType = z.infer<typeof FavoriteSchema>;