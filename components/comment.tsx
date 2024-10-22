"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { FC, useState } from "react";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import type { Comment } from "@prisma/client";
import { CommentSchemaType } from "@/app/types/commentschema";
import { Button } from "./ui/button";
import { formatTimeToNow } from "@/lib/utils";
import CastReply from "./castreply";
import { useToast } from "@/hooks/use-toast";
import Rating from "./rating";
interface CommentProps{
    id:number;
    season?:number;
    episode?:number;
}
const Comment:FC<CommentProps> = ({id, season, episode})=>{
    const [userComment, setUserComment] = useState<string>("");
    const {toast} = useToast();
    const {isPending:submitting, mutate} = useMutation({
        mutationFn: async (comment:CommentSchemaType)=>{
            if(season){
                return await fetch(`/api/series/comments/post?id=${id}&seasonId=${season}&episodeId=${episode}`,{
                    method:"POST",
                    body:JSON.stringify(comment)
                })
            } else {
                
                return await fetch(`/api/movies/comments/post?id=${id}`,{
                    method:"POST",
                    body:JSON.stringify(comment)
                });
            }
            refetch();
        },
        onSuccess: (data)=>{
            if(data.status === 200)
            {
                setUserComment("");
                refetch();
            }
            if(data.status === 401)
            {
                toast({
                    title: "Error",
                    description: "You need to login to comment",
                    variant: "destructive"
                })
            }
        },
       onError: (error)=>{
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive"
            })
       },
        throwOnError(error) {
            
            if(error.message == "Unauthorized")
            {
                toast({
                    title: "Error",
                    description: "You need to login to comment",
                    variant: "destructive"
                })
                //alert("You need to login to comment")
            }
            return false;
        },
    })
    const {isPending, data, refetch} = useQuery({
        queryKey:["comments", id, season, episode],
        queryFn:async()=>{
            
            if(season)
                return await (await fetch(`/api/series/comments?id=${id}&season=${season}&episode=${episode}`)).json()

            return await (await fetch(`/api/movies/comments?id=${id}`)).json()
            
        },
    });
    console.log(data);

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
        
    }
    else{
        comment = {
            content: userComment,
            movieId: id.toString(),
            parentId: ""
        };
    }
        mutate(comment);

    }
    
    return(
        <div className="w-full p-1 my-10 ">
            <h2 className="text-2xl font-extrabold">Comments</h2>
            {isPending && <Loader className="w-5 h-5 animate-spin mx-auto"/>}
            <div className="">
                
                <div className="w-full ">
                    <div className="flex items-center gap-2  w-full">
                        <Input placeholder="Add a comment" className="w-full" onChange={(e)=>setUserComment(e.target.value)}/>
                        <Button onClick={()=>uploadComment()} disabled={submitting} className="w-fit">Post</Button>
                    </div>
                    <div className="my-4">
                        {
                        /* eslint-disable @typescript-eslint/no-explicit-any */
                        data?.map((comment:any)=>(
                            <div key={comment.id} className="rounded-md p-2 ml-2">
                                
                                <div className="flex items-start gap-2 max-w-[500px] shadow-md">
                                    <div className="flex items-center gap-2">
                                        <Avatar className="border">
                                            <AvatarImage src={comment.comment.user?.image} alt={comment.comment.user?.username}/>
                                            <AvatarFallback>{comment.comment.user?.username[0]}</AvatarFallback>
                                        </Avatar>
                                        
                                    </div>
                                    <div className="w-full">
                                        <div className="flex items-center gap-2 w-full">
                                            <span className="font-semibold ">{comment.comment.user?.username}</span>
                                            <span className=" text-zinc-600">{formatTimeToNow(comment.comment.createdAt)}</span>
                                        </div>
                                        <div >
                                            <div className="flex items-center gap-3 my-2">
                                                <p className="text-sm max-w-500">{comment?.comment.content}</p>

                                            </div>
                                            <div className="flex items-center gap-2">
                                                
                                                    <CastReply commentId={comment?.comment.id}/>
                                            </div>
                                            
                                                    <Rating id={comment?.comment.id}/>
                                        </div>
                                    </div>
                                    
                                </div>
                                {
                                 /* eslint-disable @typescript-eslint/no-explicit-any */
                                comment.comment.replies.map((reply:any)=>(
                                    <div key={reply.id} className="ml-7 my-3 max-w-[500px] shadow-md">
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center gap-2">
                                                <Avatar>
                                                    <AvatarImage src={reply.user?.image} alt={reply.user?.username}/>
                                                    <AvatarFallback>{reply.user?.username[0]}</AvatarFallback>
                                                </Avatar>
                                                
                                            </div>
                                            <div className="w-full">
                                                <div className="flex justify-between">
                                                    <div>
                                                        <span className="font-semibold text-sm">{reply.user?.username}</span>
                                                        <p className="text-sm">{reply.content}</p>
                                                    </div>
                                                    <div>
                                                        <span className=" text-zinc-600">{formatTimeToNow(reply.createdAt)}</span>

                                                    </div>
                                                </div>
                                               <CastReply commentId={reply.id}/>
                                               <Rating id={reply.id}/>
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