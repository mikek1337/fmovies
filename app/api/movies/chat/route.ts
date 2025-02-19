import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import socket from '@/lib/socket';
import { Chat } from "@prisma/client";
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
    const session = await getAuthSession();
    if(!session?.user)
        return new Response('Unauthorized', {status: 401});
    const body = await req.json() as Chat;
    const {roomId, message, id} = body;
    const chat = await db.chat.create({
        data: {
            message: message,
            id: id,
            roomId: roomId,
            user:{
                connect:{
                    email: session.user.email!
                }
            }
        }
    });
    socket.emit('chatmessage', chat);

    return new Response(JSON.stringify(chat), {status: 200});
}