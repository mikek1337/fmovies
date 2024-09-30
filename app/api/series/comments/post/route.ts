import { CommentSchema } from "@/app/types/commentschema";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { nanoid } from "nanoid";
export async function POST(req:Request){
    const comment = CommentSchema.parse(await req.json());
    const user = await getAuthSession();
    if(!comment)
    {
        return new Response('Bad Request', {status:400});
    }
    if(!user)
    {
        return new Response('Unauthorized', {status:401});
    }
    const newComment = await db.comment.create({
        data:{
            id: nanoid(),
            content: comment.content,
            postId: comment.seriesId,
            userId: user.user?.id,
            SeriesComment:{
                create:{
                    id: nanoid(),
                    seriesId: comment.seriesId,
                    seasonId: comment.seasonId,
                    episodeId: comment.episodeId,
                }
            }

        }
    });
    return new Response(JSON.stringify(newComment), {status:200});
}