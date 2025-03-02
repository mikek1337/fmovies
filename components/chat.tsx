"use client";
import { useMutation } from "@tanstack/react-query";
import { FC, useEffect, useRef, useState } from "react"
import { Input } from "./ui/input";
import type { Chat} from "@prisma/client";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { cn } from "@/lib/utils";
import {  ChatResponseWithoutCreatedAt } from "@/app/types/chat";
import { socket } from "@/app/socket";
import { nanoid } from "nanoid";
import { useToast } from "@/hooks/use-toast";
import { leaveRoom, updateRoomParticipant } from "@/app/actions";
type ChatProps = {
    room:string
    oldMessages: ChatResponseWithoutCreatedAt[],
    mediaId: string
}

const Chat:FC<ChatProps> = ({room , oldMessages, mediaId})=>{
    const {data:session} = useSession();
    const {toast} = useToast();
    const [message, setMessage] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const [messageCollection, setMessageCollection] = useState<ChatResponseWithoutCreatedAt[]>(oldMessages);
    const {mutate} = useMutation({
        mutationKey: ['chat'],
        mutationFn: async (message:ChatResponseWithoutCreatedAt)=>{
            const res = await fetch(`/api/movies/chat`, {
                method: 'POST',
                body: JSON.stringify(message),
                headers:{
                    'Content-Type':'application/json'
                }
            });
            return await res.json()
        }

    })
   useEffect(()=>{
    socket.emit('join', room);
    socket.on('userdisconnect',(id:string)=>{
        toast({
            title:'User disconnected',
            description: 'User has left the room',
            variant: 'default'
        })
        leaveRoom(room, mediaId);
    });
    socket.on('joined', ()=>{
        toast({
            title:'User disconnected',
            description: 'User has left the room',
            variant: 'default'
        })
        updateRoomParticipant(room, mediaId);
    })
    socket.on('sendmessage',(data)=>{
        console.log(data, 'new message');
        setMessageCollection((prev)=>[...prev, data]);
    })
    return ()=> {socket.off('sendmessage')};
   },[])
   

    const send = async ()=>{
        const message = inputRef.current?.value || '';
         const chatMessage:ChatResponseWithoutCreatedAt = {
            id: nanoid(),
            message,
            roomId: room,
            userId: session?.user?.id || '1',
            user:{
                email: session?.user?.email || 'test',
                image: session?.user?.image || 'test',
                username: session?.user?.name || 'test',
            }
         }
         
            // adding optimistic update
            mutate(chatMessage);
            setMessageCollection((prev)=>[...prev, chatMessage]);
            socket.emit('message',chatMessage);            
        
        setMessage('');
        //addOptimistic([...optimisticState || [], newChat]);
    }
    return(
    <div className="shadow-lg rounded-md w-full relative h-full border ">
       
        <div className="w-full h-[700px] overflow-y-auto">
            {messageCollection && messageCollection?.length == 0 && <div className="text-zinc-500 text-center">No messages</div>}
            {messageCollection && messageCollection?.length > 0 && messageCollection?.map((message)=>(
                <div key={nanoid()} className="p-5 h-10 ">
                    <div className="flex items-start gap-4">
                        <Avatar className="border w-8 h-8">
                            <AvatarImage src={message?.user?.image} alt={message?.user?.username} />
                            <AvatarFallback>{message?.user?.username}</AvatarFallback>
                        </Avatar>
                    <div className="rounded-md  h-fit flex gap-3 overflow-hidden items-center">
                        <span className={cn("font-bold text-sm text-zinc-600 h-fit p-2 rounded-md", {"text-purple-500":message?.userId == session?.user.id})}>{message?.user?.username}</span>
                        <span className="text-sm break-words text-neutral-800 w-[300px] ">{message?.message}</span>
                    </div>
                    </div>
                </div>
            ))}
           
        </div>
        <div className="p-2 bottom-0 absolute w-full bg-white dark:bg-slate-950">
            <Input placeholder="Type a message" className="w-full" onKeyDown={(e)=>e.code == "Enter"?send():null} ref={inputRef}/>
        </div>
    </div>
    )
}

export default Chat;
