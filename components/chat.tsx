"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FC, useOptimistic, useState } from "react"
import { Input } from "./ui/input";
import type { Chat, Chat as ChatMessage } from "@prisma/client";
import { nanoid } from "nanoid";
import { useSession } from "next-auth/react";
import socket from "@/lib/socket";

type ChatProps = {
    room:string
}
const Chat:FC<ChatProps> = ({room})=>{
    const {data} = useSession();
    const [message, setMessage] = useState('');
    const {isPending, data:oldMessage} = useQuery({
        queryKey: ['chat', room],
        queryFn: async ()=>{
            const res = await fetch(`/api/movies/chat?room=${room}`);
            return await res.json();
        },
    });
    const {mutate} = useMutation({
        mutationFn: async (message:ChatMessage)=>{
            const res = await fetch(`/api/movies/chat`,{
                method: 'POST',
                body: JSON.stringify(message),
            });
            return await res.json();
        }
    })
    const [optimisticState, addOptimistic] = useOptimistic<ChatMessage[]>(oldMessage,(state, message:ChatMessage)=>{
        return [...state, message];
    });

    

    

    const sendMessage = async (message:string)=>{
        const newChat:ChatMessage ={
            id: nanoid(),
            message: message,
            roomId: room,
            userId: data?.user?.id,
            createdAt: new Date(),
        }
        socket.on(newChat.roomId, (data:Chat)=>{
            if(data.userId == newChat.userId) return;
            addOptimistic(data);
        })   
        addOptimistic(newChat);
        mutate(newChat);
    }
    return(
    <div className="shadow-md rounded-md w-full relative h-full">
        <div className="w-full h-full">
            {optimisticState?.length > 0 && optimisticState?.map((message)=>(
                <div key={message.id} className="">
                    <div className="flex items-center gap-10">
                        <span className="font-semibold italic">{message.userId}</span>
                        <span className="text-sm text-slate-500">{message.createdAt.toDateString()}</span>
                    </div>
                    <span className="bg-blue-600 text-white italic">{message.message}</span>
                </div>
            ))}
        </div>
        <div className="p-2 bottom-0 absolute w-full">
            <Input placeholder="Type a message" className="w-full" onKeyDown={(e)=>e.code == "Enter"?sendMessage(message):null} onChange={(e)=>setMessage(e.target.value)}/>
        </div>
    </div>
    )
}

export default Chat;