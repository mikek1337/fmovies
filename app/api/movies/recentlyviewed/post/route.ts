import { RecentlyViewedSchema } from "@/app/types/recentlyViewed";
import { getAuthSession } from "@/lib/auth";
import { nanoid } from "nanoid";
import { db } from "@/lib/db";

export async function POST(req: Request) {
    const session = await getAuthSession();
    if (!session?.user)
        return new Response("Unauthorized", { status: 401 });
    const { poster_path, title, id, media_type } = RecentlyViewedSchema.parse(await req.json());
    const existing = await db.recentlyViewed.findFirst({
        where: {
            user: {
                email: session.user.email
            },
            mediaId: id
        }
    });
    if (!existing) {
        const recentlyViewed = await db.recentlyViewed.create({
            data: {
                id: nanoid(),
                poster_path: poster_path,
                title: title,
                mediaId: id,
                user:{
                    connect:{
                        email:session.user.email!
                    }
                },
                MediaType: media_type,
                createdAt: new Date()
            }
        });
        return new Response(JSON.stringify(recentlyViewed), { status: 200 });
    }
    return new Response("Already exists", { status: 400 });
}