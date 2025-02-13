import { db } from "@/lib/db";

export async function GET(req:Request){
    const url = new URL(req.url);
    const id = url.searchParams.get('room');

    if(!id) return new Response('Bad Request', {status: 400});

    const chat = await db.chat.findMany({
        where:{
            roomId: id,
        },
        include:{
            user:true
        },
        orderBy:{
            createdAt:'asc'
        }
    });
    return new Response(JSON.stringify(chat), {status: 200});

}