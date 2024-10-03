import { CommentSchema } from "@/app/types/commentschema";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { nanoid } from "nanoid";

export async function POST(req: Request) {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (!id) {
        return new Response('Bad Request', { status: 400 });
    }
    const user = await getAuthSession();
    if (user) {
        const newComment = CommentSchema.parse(await req.json());
        const comment = await db.comment.findUnique({
            where:{
                id: id
            }
        });
        console.log(id)
        if(!comment){
            return new Response('Comment not found', {status: 404});
        }
        
        const reply = await db.comment.create({
            data: {
                id: nanoid(),
                parentId: comment.id,
                content: newComment.content,
                userId: user?.user.id,
                postId: id,


            }
        });
        return new Response(JSON.stringify(reply), { status: 200 });
    }
    return new Response('Unauthorized', { status: 401 });
}