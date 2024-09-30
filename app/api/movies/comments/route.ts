import { db } from "@/lib/db";

export async function GET(req:Request){
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if(!id){
        return new Response('Bad Request', {status:400});
    }
    const comments = db.movieComment.findMany({
        where:{
            movieId:id
        },
        include:{
            comment:{
                select:{
                    parentId:true,
                },
                include:{
                    user:true,
                    replies:true
                }
            }
        }
    });
    
    return new Response(JSON.stringify(comments), {status:200});
}