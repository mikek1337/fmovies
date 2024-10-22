import { FavoriteSchema } from "@/app/types/favoriteschema";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { nanoid } from "nanoid";

export async function POST(req:Request){
    const session = await getAuthSession();
    const body = FavoriteSchema.parse(await req.json());
    if(session && session.user){
            const favorite = await db.favorite.findFirst({
                where:{
                    AND:[
                        {user:{
                            email:session.user.email
                        }},
                        {
                            mediaId:body.mediaId
                        }
                    ]
                }
            });
            if(favorite){
                await db.favorite.delete({
                    where:{
                        id:favorite.id
                    }
                });
                return new Response(JSON.stringify({favorite:false}), {status:200});
            } else {
                await db.favorite.create({
                    data:{
                        id: nanoid(),
                        user:{
                            connect:{
                                email:session.user.email!
                            }
                        },
                        poster_path: body.poster_url,
                        mediaId: body.mediaId,
                        MediaType: body.MediaType,
                        title: body.title
                    }
                });
                return new Response(JSON.stringify({favorite:true}), {status:200});
            }
        }
        return new Response(JSON.stringify({error:"Unauthorized"}), {status:401})
    
}