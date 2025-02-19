"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FC, useOptimistic, useState } from "react"
import { Input } from "./ui/input";
import type { Chat, Chat as ChatMessage, User } from "@prisma/client";
import { nanoid } from "nanoid";
import { useSession } from "next-auth/react";
import socket from "@/lib/socket";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { cn } from "@/lib/utils";

type ChatProps = {
    room:string
}
type ChatResponse = ChatMessage &{
    user: {
        email: string,
        name: string,
        image?: string,
    }
};
const Chat:FC<ChatProps> = ({room})=>{
    const {data:session} = useSession();
    const [message, setMessage] = useState('');
    
    const {isPending, data:oldMessage} = useQuery({
        queryKey: ['chat', room],
        queryFn: async ()=>{
            const res = await fetch(`/api/movies/chat?room=${room}`);
            return await res.json() as ChatResponse[];
        },
    });
    const {mutate} = useMutation({
        mutationFn: async (message:ChatMessage)=>{
            const res = await fetch(`/api/movies/chat`,{
                method: 'POST',
                body: JSON.stringify(message),
            });
            if(!res.ok) throw new Error('Failed to send message');
            return await res.json();
        }
    })
    console.log(oldMessage)
    const [optimisticState, addOptimistic] = useOptimistic<ChatResponse[] | undefined>(oldMessage);

    

    socket.on('chatmessage', (data:ChatResponse)=>{
        console.log(data , 'emitted event');
        if(data.userId == session?.user?.id) return;
        if(optimisticState)
            addOptimistic([...optimisticState, data]);
    })

    const sendMessage = async (message:string)=>{
        const newChat:ChatResponse ={
            id: nanoid(),
            message: message,
            roomId: room,
            userId: '',
            user:{
                email: session?.user?.email || '',
                name: session?.user?.name || '',
                image: session?.user?.image || '',
            },
            createdAt: new Date(),
        }

        addOptimistic([...optimisticState || [], newChat]);
        mutate(newChat);
    }
    return(
    <div className="shadow-lg rounded-md w-full relative h-full border">
        <div className="w-full h-full">
            {isPending && <div>Loading...</div>}
            {optimisticState && optimisticState?.length == 0 && <div className="text-zinc-500 text-center">No messages</div>}
            {optimisticState && optimisticState?.length > 0 && optimisticState?.map((message)=>(
                <div key={message.id} className="p-5 h-10 ">
                    <div className="flex items-start gap-4">
                        <Avatar className="border w-8 h-8">
                            <AvatarImage src={message.user.image} alt={message.user.name} />
                            <AvatarFallback>{message.user.name}</AvatarFallback>
                        </Avatar>
                    <div className="rounded-md  h-fit flex gap-3 overflow-hidden">
                        <span className={cn("font-bold text-sm text-zinc-600 h-fit p-2 rounded-md", {"bg-purple-500 text-white":message.userId == session?.user.id})}>{message.user.name}</span>
                        <span className="text-sm break-words text-neutral-800 w-[300px] ">{message.message}</span>
                    </div>
                    </div>
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