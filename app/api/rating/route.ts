import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: Request){
    const url = new URL(req.url);
    const objectId = url.searchParams.get("objectId");
    if(objectId == null){
        return new Response("Bad Request", {status:400});
    }
    const ratings = await db.rating.aggregate({
        _sum:{
            downVote:true,
            upVote:true
        },
        where:{
            object:objectId
        }
    });
    console.log(ratings);
    return new Response(JSON.stringify(ratings._sum), {status:200});
}