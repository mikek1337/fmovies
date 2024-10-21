import { z } from "zod";

export const RatingSchema = z.object({
    object: z.string(),
    upVote: z.number(),
    downVote: z.number(),
});

export type RatingType = z.infer<typeof RatingSchema>;