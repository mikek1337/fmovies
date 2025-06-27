"use client"
import { FC, useState } from "react";
import { Button } from "./ui/button";
import { useMutation } from "@tanstack/react-query";
import { CommentSchemaType } from "@/app/types/commentschema";
import { cn } from "@/lib/utils";
import { Textarea } from "./ui/textarea";

interface CastReplyProps{
    commentId:string;
    castReply?:boolean;
}
const CastReply:FC<CastReplyProps> = ({commentId, castReply})=>{
    const [comment, setComment] = useState<string>("");
    
    console.log(castReply)
    const {isPending, mutate} = useMutation({
        mutationFn: async (comment:CommentSchemaType)=>{
            return await fetch(`/api/comments/reply?id=${commentId}`,{
                method:"POST",
                body:JSON.stringify(comment)
            })
        }
    })
    const uploadComment = ()=>{
        const commentContent: CommentSchemaType = {
            content: comment,
            parentId: commentId,
            episodeId:"",
            movieId:"",
            seasonId:"",
            seriesId:""
        }
        console.log(commentContent);
        mutate(commentContent);
        
        setComment("");
    }
    if(castReply)
    return(
        <div className="my-5">
            
            <div className={cn("space-y-4")}>
                <Textarea placeholder="Share your thoughts on this movie... " rows={4} className="w-full p-4 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" onChange={(e) => setComment(e.target.value)} />
                <div className="flex gap-2 text-right justify-end">
                    <Button variant="outline">Cancle</Button>
                    <Button variant="ghost"  onClick={()=>uploadComment()} className="w-fit bg-indigo-500 text-white" disabled={isPending}>Post Comment</Button>
                </div>
            </div>
        </div>
    )
}

export default CastReply;