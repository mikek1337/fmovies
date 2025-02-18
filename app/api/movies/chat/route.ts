import { db } from "@/lib/db";
import socket from '@/lib/socket';
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

export async function POST(req:Request){
    const body = await req.json();
    const chat = await db.chat.create({
        data: body
    });
    socket.emit('chatmessage', chat);

    return new Response(JSON.stringify(chat), {status: 200});
}