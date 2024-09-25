import { db } from "@/lib/db";

export async function GET(req:Request){
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    const seasonId = url.searchParams.get('seasonId');
    const episodeId = url.searchParams.get('episodeId');
    if(!id && !seasonId && !episodeId){
        return new Response('Bad Request', {status:400});
    }
    const comments = db.seriesComment.findMany({
        where:{
            seriesId: id,
            season: seasonId,
            episode: episodeId
        },
        include:{
            comment:{
                include:{
                    replies:true
                }
            }
        }
    });
    return new Response(JSON.stringify(comments), {status:200});
}