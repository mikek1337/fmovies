"use client";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { FC } from "react";
import { Input } from "./ui/input";
import { Avatar, AvatarImage } from "./ui/avatar";
import type { Comment } from "@prisma/client";
interface CommentProps{
    id:number;
    season?:number;
    episode?:number;
}
const Comment:FC<CommentProps> = ({id, season, episode})=>{
    const {isPending, data} = useQuery({
        queryKey:["comments", id, season, episode],
        queryFn:async()=>{
            let comments:Comment[] = [];
            if(season){
                comments = await (await fetch(`/api/series/comments?id=${id}&season=${season}&episode=${episode}`)).json()
                return comments;
            }
            comments = await (await fetch(`/api/movies/comments?id=${id}`)).json()
            console.log(comments);
            return comments;
        }
    });
    
    return(
        <div className="w-full p-1 my-10 ">
            <h2 className="text-2xl font-extrabold">Comments</h2>
            {isPending && <Loader className="w-5 h-5 animate-spin mx-auto"/>}
            <div className="max-w-[500px] border">
                <div>
                    {!data && (<span className="text-center text-zinc-300 text-sm">No Comments</span>)}
                </div>
                <div>
                    <Input placeholder="Add a comment" className="w-full"/>
                </div>
              
            </div>

        </div>
    )
}

export default Comment;