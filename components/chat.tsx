"use client";
import { useQuery } from "@tanstack/react-query";
import { FC, useEffect, useState } from "react"
import { Input } from "./ui/input";
import type { Chat as ChatMessage } from "@prisma/client";

type ChatProps = {
    room:string
}
const Chat:FC<ChatProps> = ({room})=>{
    const {isPending, data} = useQuery({
        queryKey: ['chat', room],
        queryFn: async ()=>{
            const res = await fetch(`/api/movies/chat?room=${room}`);
            return await res.json();
        },
    })
    const [messages, setMessages] = useState<ChatMessage[]>(data);
    return(
    <div className="shadow-md rounded-md w-full ">
        <div className="w-full h-full">
            {messages.length > 0 && messages.map((message)=>(
                <div key={message.id} className="">
                    <div>
                        <span>{message.userId}</span>
                        <span>{message.createdAt.toDateString()}</span>
                    </div>
                    <span className="bg-blue-600 text-white">{message.message}</span>
                </div>
            ))}
        </div>
        <div>
            <Input placeholder="Type a message" className="w-full"/>
        </div>
    </div>
    )
}

export default Chat;