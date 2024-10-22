import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req:Request){
    const session = await getAuthSession();
    const url = new URL(req.url);
    const mediaId = url.searchParams.get("mediaId");
    if(session && session.user){
        if(mediaId){
            const favorite = await db.favorite.findFirst({
                where:{
                    AND:[

                        {user:{
                            email:session.user.email
                        }
                    },
                    {
                        mediaId:mediaId
                    }
                    ]
                }
            });
            return new Response(JSON.stringify({favorite:favorite?true:false}), {status:200});
        }
        return new Response(JSON.stringify({error:"mediaId is required"}), {status:400})
    }
    return new Response(JSON.stringify({error:"Unauthorized"}), {status:401})
}