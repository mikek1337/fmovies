"use client"
import { FC, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useMutation } from "@tanstack/react-query";
import { CommentSchemaType } from "@/app/types/commentschema";
import { cn } from "@/lib/utils";
import { MessageSquareText } from "lucide-react";

interface CastReplyProps{
    commentId:string;
}
const CastReply:FC<CastReplyProps> = ({commentId})=>{
    const [comment, setComment] = useState<string>("");
    const [replying, setReplying] = useState<boolean>(false);
    const {isPending, mutate} = useMutation({
        mutationFn: async (comment:CommentSchemaType)=>{
            await fetch(`/api/comments/reply?id=${commentId}`,{
                method:"POST",
                body:JSON.stringify(comment)
            })
        }
    })
    const uploadComment = async ()=>{
        mutate({
            content: comment,
            parentId: commentId

        })
        setReplying(false);
    }
    return(
        <div>
            <span className="flex items-center gap-2 cursor-pointer hover:underline text-xs" aria-disabled={replying} onClick={()=>setReplying(prev=>!prev)}>
                <MessageSquareText className="w-5 h-5 text-zinc-700"/>
                Reply
            </span>
            <div className={cn("flex items-center gap-2",{"hidden":!replying})}>
                <Input placeholder="Reply to comment" onChange={(e)=>setComment(e.target.value)} className="w-full"/>
                <Button variant="ghost"  onClick={()=>uploadComment()} className="w-fit" disabled={isPending}>Post</Button>
            </div>
        </div>
    )
}

export default CastReply;