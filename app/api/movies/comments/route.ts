import { db } from "@/lib/db";

export async function GET(req:Request){
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if(!id){
        return new Response('Bad Request', {status:400});
    }
    const comments = await db.movieComment.findMany({
        where:{
            movieId: id,
        },
        include:{
            comment:{
                include:{
                    replies:true,
                    user:true
                }
            }
        }
    });
    
    return new Response(JSON.stringify(comments), {status:200});
}