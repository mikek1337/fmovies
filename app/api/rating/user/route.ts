import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: Request){
    const url = new URL(req.url);
    const objectId = url.searchParams.get("objectId");
    const userSession = await getAuthSession();
    if(objectId == null){
        return new Response("Bad Request", {status:400});
    }
    if(userSession !== null){
        const ratings = await db.rating.findFirst({
            where:{
                object:objectId,
                user:{
                    email: userSession.user?.email
                }
            }
        })
        console.log(ratings);
        return new Response(JSON.stringify(ratings), {status:200});
    }
    
}