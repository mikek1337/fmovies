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
        console.log(newComment);
        
        //const comments = await db.comment.findMany();
        
        const comment = await db.comment.findUnique({
            where:{
                id: id
            }
        });
        /*eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain*/
        const userData = await db.user.findUnique({
            where:{
                email: user?.user?.email!
            }
        });
        console.log(comment);
        if(!userData){
            return new Response('User not found', {status: 404});
        }
        if(!comment){
            return new Response('Comment not found', {status: 404});
        }
        
        const reply = await db.comment.create({
            data: {
                id: nanoid(),
                parentId: comment.id,
                content: newComment.content,
                userId: userData.id,
                postId: id,


            }
        });
        return new Response(JSON.stringify(reply), { status: 200 });
    }
    return new Response('Unauthorized', { status: 401 });
}