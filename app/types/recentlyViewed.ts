import {z} from 'zod';

export const RecentlyViewedSchema = z.object({
    id: z.string(),
    title: z.string(),
    poster_path: z.string(),
    media_type: z.string()
})

export type RecentlyViewedType = z.infer<typeof RecentlyViewedSchema>