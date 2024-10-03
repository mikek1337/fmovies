"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader, ThumbsDown, ThumbsUp } from "lucide-react";
import { FC, useState } from "react";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import type { Comment } from "@prisma/client";
import { CommentSchemaType } from "@/app/types/commentschema";
import { Button } from "./ui/button";
import { formatTimeToNow } from "@/lib/utils";
import CastReply from "./castreply";
interface CommentProps{
    id:number;
    season?:number;
    episode?:number;
}
const Comment:FC<CommentProps> = ({id, season, episode})=>{
    const [userComment, setUserComment] = useState<string>("");
    const {isPending:submitting, mutate} = useMutation({
        mutationFn: async (comment:CommentSchemaType)=>{
            if(season){
                await fetch(`/api/series/comments/post?id=${id}&seasonId=${season}&episodeId=${episode}`,{
                    method:"POST",
                    body:JSON.stringify(comment)
                })
            } else {
                
                await fetch(`/api/movies/comments/post?id=${id}`,{
                    method:"POST",
                    body:JSON.stringify(comment)
                });
            }
        }
    })
    const {isPending, data} = useQuery({
        queryKey:["comments", id, season, episode],
        queryFn:async()=>{
            
            if(season)
                return await (await fetch(`/api/series/comments?id=${id}&season=${season}&episode=${episode}`)).json()

            return await (await fetch(`/api/movies/comments?id=${id}`)).json()
            
        },
    });

    const uploadComment = async ()=>{
        let comment:CommentSchemaType
        if(season && episode){
            comment = {
                content: userComment,
                episodeId: episode.toString(),
                seasonId: season.toString(),
                seriesId: id.toString(),
                movieId: "",
                parentId: ""
            };
            mutate(comment);
        }

    }
    
    return(
        <div className="w-full p-1 my-10 ">
            <h2 className="text-2xl font-extrabold">Comments</h2>
            {isPending && <Loader className="w-5 h-5 animate-spin mx-auto"/>}
            <div className="max-w-[500px]">
                
                <div>
                    <div className="flex items-center gap-2  w-full">
                        <Input placeholder="Add a comment" className="w-full" onChange={(e)=>setUserComment(e.target.value)}/>
                        <Button onClick={()=>uploadComment()} disabled={submitting} className="w-fit">Post</Button>
                    </div>
                    <div className="my-4">
                        {data?.map((comment:any)=>(
                            <div key={comment.id} className="shadow-md rounded-md p-2 ml-2">
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-2">
                                        <Avatar className="border">
                                            <AvatarImage src={comment.comment.user?.image} alt={comment.comment.user?.username}/>
                                            <AvatarFallback>{comment.comment.user?.username[0]}</AvatarFallback>
                                        </Avatar>
                                        
                                    </div>
                                    <div className="w-full">
                                        <div className="flex items-center justify-between w-full">
                                            <span className="font-semibold text-sm">{comment.comment.user?.username}</span>
                                            <span className="text-xs text-zinc-400">{formatTimeToNow(comment.comment.createdAt)}</span>
                                        </div>
                                        <div >
                                            <div className="flex items-center gap-3 justify-between">
                                                <p className="text-sm max-w-500">{comment?.comment.content}</p>
                                                <div className="flex items-center gap-1">
                                                    <ThumbsUp className="w-3 h-3 fill-teal-500 text-teal-500"/>
                                                    <ThumbsDown className="w-3 h-3 "/>
                                                </div>

                                            </div>
                                            <div className="flex items-center gap-2">
                                                <CastReply commentId={comment.id}/>
                                            </div>
                                            
                                        </div>
                                    </div>
                                    
                                </div>
                                {comment.comment.replies.map((reply:any)=>(
                                    <div key={reply.id} className="ml-5">
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center gap-2">
                                                <Avatar>
                                                    <AvatarImage src={reply.user?.image} alt={reply.user?.username}/>
                                                    <AvatarFallback>{reply.user?.username[0]}</AvatarFallback>
                                                </Avatar>
                                                
                                            </div>
                                            <div>
                                                <span className="font-semibold text-sm">{reply.user?.username}</span>
                                                <p className="text-sm">{reply.content}</p>
                                                <div className="flex items-center gap-2">
                                                    
                                                    <ThumbsUp className="w-4 h-4 fill-indigo-500"/>
                                                    <ThumbsDown className="w-4 h-4 "/>
                                                </div>
                                            </div>
                                            
                                        </div>
                                    </div>
                                ))}
                                
                            </div>

                        ))}
                    </div>
                </div>
                <div>
                    {data?.length==0 && (<span className="text-center text-zinc-300 text-sm">No Comments</span>)}
                </div>
              
            </div>

        </div>
    )
}

export default Comment;