import { RatingSchema } from "@/app/types/ratingschema";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { nanoid } from "nanoid";

export async function POST(req: Request){
    const url = new URL(req.url);
    const objectId = url.searchParams.get("objectId");
    const userSession = await getAuthSession();
    const body = RatingSchema.parse(await req.json());
    if(!body)
    {
        return new Response("Bad Request", {status:400});
    }
    if(objectId == null){
        return new Response("Bad Request", {status:400});
    }
    if(userSession)
    {
        const rating = await db.rating.findFirst({
            where:{
                AND:[
                    {
                        object: objectId
                    },
                    {
                        user: {
                            email: userSession.user?.email
                        }
                    }
                ]
            }
        });
        if(rating){
             await db.rating.update({
                where:{
                    id: rating.id
                },
                data:{
                    upVote: body.upVote,
                    downVote: body.downVote
                }
            });
        }
        else{
             await db.rating.create({
                data:{
                    id: nanoid(),
                    object: objectId,
                    user: {
                        connect: {
                            email: userSession.user?.email!
                        }
                    },
                    upVote: body.upVote,
                    downVote: body.downVote
                }
            });
        }
        return new Response(JSON.stringify(rating), {status:200});
    }
    return new Response("Unauthorized", {status:401});
}