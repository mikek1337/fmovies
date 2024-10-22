import { RatingType } from "@/app/types/ratingschema";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loader2, ThumbsDown, ThumbsUp } from "lucide-react"
import { FC, useOptimistic } from "react";
interface RatingProps{
    id: string;
}
const Rating:FC<RatingProps> = ({id})=>{
    const {data, isLoading} = useQuery({
        queryKey:["rating", id],
        queryFn: async()=>{
            return await (await axios.get(`/api/rating?objectId=${id}`)).data
        },
    });
    const {data: userRating, refetch:userRatingRefetch} = useQuery({
        queryKey:["userRating", id],
        queryFn: async()=>{
            return await (await axios.get(`/api/rating/user?objectId=${id}`)).data
        },
    });

    const {mutate} = useMutation({
        mutationFn: async(ratingData:RatingType)=>{
            return await axios.post(`/api/rating?objectId=${id}`, ratingData);
        }
    })

    const upVote = ()=>{
        if(userRating?.downVote === 1){
            optimisticDownVoteUpdate({downVote: optimisticDownVote.downVote - 1});
        }
        optimisticUpVoteUpdate({upVote: optimisticUpVote.upVote + 1});
        mutate({object:id, upVote: 1, downVote: 0});
        userRatingRefetch();
    }
    const downVote = ()=>{
        if(userRating?.upVote === 1){
            optimisticUpVoteUpdate({upVote: optimisticUpVote.upVote - 1});
        }
        optimisticDownVoteUpdate({downVote: optimisticDownVote.downVote + 1});
        mutate({object:id, upVote: 0, downVote: 1});
        userRatingRefetch();
    }
    
    const [optimisticUpVote, optimisticUpVoteUpdate] = useOptimistic(data, (state, upVote)=>{
        return {...state, upVote: upVote}
    })
    const [optimisticDownVote, optimisticDownVoteUpdate] = useOptimistic(data, (state, downVote)=>{
        return {...state, downVote: downVote}
    })
    return(
        <div className="flex items-center gap-3 text-zinc-700">
        <div className="flex items-center gap-2">
            <ThumbsUp className={cn("w-4 h-4 ", {"text-green-500 fill-green-500":userRating?.upVote === 1})} onClick={()=>upVote()}/>
            {isLoading && <Loader2 className="w-5 h-5 animate-spin"/>}
            {!isLoading && <span className="text-sm">{data.upVote || 0}</span>}
        </div>
        <div className="flex items-center gap-2">
            <ThumbsDown className={cn("w-4 h-4 ", {"text-green-500 fill-green-500":userRating?.downVote === 1})} onClick={()=>downVote()}/>
            {isLoading && <Loader2 className="w-5 h-5 animate-spin"/>}
            {!isLoading && <span className="text-sm">{data.downVote || 0}</span>}
        </div>
    </div>
    )
}

export default Rating