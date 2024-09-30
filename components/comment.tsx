"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { FC, useState } from "react";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import type { Comment } from "@prisma/client";
import { Comments, CommentSchemaType } from "@/app/types/commentschema";
import { Button } from "./ui/button";
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
            let comments:Comments[] = [];
            if(season){
                comments = await (await fetch(`/api/series/comments?id=${id}&season=${season}&episode=${episode}`)).json()
                return comments;
            }
            comments = await (await fetch(`/api/movies/comments?id=${id}`)).json()
            console.log(comments);
            return comments;
        }
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
                    <div>
                        {!isPending && data?.map((comment)=>(
                            <>
                            <div key={comment.id}>
                            {comment.user && (
                                <div  className="flex items-center gap-2 px-2 py-2 border-b">
                                    <Avatar>
                                        <AvatarImage src={comment.user?.image} alt={comment.user?.username}/>
                                        <AvatarFallback>{comment.user?.username[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col gap-2">
                                        <span className="text-sm font-semibold">{comment.user?.username}</span>
                                        <p className="text-xs">{comment.content}</p>
                                    </div>
                                </div>
                            )}
                            </div>
                            {comment.replies.length !== 0 && comment.replies.map((reply)=>(
                                <div key={reply.id} className="flex items-center gap-2 px-2 py-2 border-b">
                                    <Avatar>
                                        <AvatarImage src={reply.user.image} alt={reply.user.username}/>
                                        <AvatarFallback>{comment.user?.username[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col gap-2">
                                        <span className="text-sm font-semibold">{reply.user.username}</span>
                                        <p className="text-xs">{reply.content}</p>
                                    </div>
                                </div>
                            ))}
                            </>
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