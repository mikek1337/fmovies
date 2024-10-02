import { db } from "@/lib/db";

export async function GET(req:Request){
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    const seasonId = url.searchParams.get('season');
    const episodeId = url.searchParams.get('episode');
    if(!id || !seasonId || !episodeId){
        return new Response('Bad Request', {status:400});
    }
    const comments = await db.seriesComment.findMany({
        where:{
            seriesId: id,
            seasonId: seasonId,
            episodeId: episodeId
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