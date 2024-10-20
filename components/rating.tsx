import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loader2, ThumbsDown, ThumbsUp } from "lucide-react"
import { FC } from "react";
interface RatingProps{
    id: string;
}
const Rating:FC<RatingProps> = ({id})=>{
    const {data, isLoading} = useQuery({
        queryKey:["rating", id],
        queryFn: async()=>{
            return await (await axios.get(`/api/rating?objectId=${id}`)).data
        },
    })
    return(
        <div className="flex items-center gap-3 text-zinc-700">
        <div className="flex items-center gap-2">
            <ThumbsUp className="w-4 h-4 "/>
            {isLoading && <Loader2 className="w-5 h-5 animate-spin"/>}
            {!isLoading && <span className="text-sm">{data.upVote || 0}</span>}
        </div>
        <div className="flex items-center gap-2">
            <ThumbsDown className="w-4 h-4 "/>
            {isLoading && <Loader2 className="w-5 h-5 animate-spin"/>}
            {!isLoading && <span className="text-sm">{data.downVote || 0}</span>}
        </div>
    </div>
    )
}

export default Rating