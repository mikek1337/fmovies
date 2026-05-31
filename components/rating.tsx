"use client"
import { RatingType } from "@/app/types/ratingschema";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ThumbsDown, ThumbsUp } from "lucide-react"
import { FC } from "react";

interface RatingProps {
    id: string;
}

const Rating: FC<RatingProps> = ({ id }) => {
    const { data, isLoading } = useQuery({
        queryKey: ["rating", id],
        queryFn: async () => {
            return await (await axios.get(`/api/rating?objectId=${id}`)).data
        },
    });

    const { data: userRating, refetch: userRatingRefetch } = useQuery({
        queryKey: ["userRating", id],
        queryFn: async () => {
            return await (await axios.get(`/api/rating/user?objectId=${id}`)).data
        },
    });

    const { mutate } = useMutation({
        mutationFn: async (ratingData: RatingType) => {
            return await axios.post(`/api/rating?objectId=${id}`, ratingData);
        },
        onSuccess: () => {
            userRatingRefetch();
        }
    })

    const upVote = () => {
        mutate({ object: id, upVote: 1, downVote: 0 });
    }

    const downVote = () => {
        mutate({ object: id, upVote: 0, downVote: 1 });
    }

    return (
        <div className="flex items-center gap-3">
            <button
                className={cn(
                    "flex items-center gap-1 text-xs transition-colors duration-200",
                    userRating?.upVote === 1 ? "text-formovies-gold" : "text-white/40 hover:text-white/70"
                )}
                onClick={upVote}
                disabled={isLoading}
            >
                <ThumbsUp className={cn("size-3.5", userRating?.upVote === 1 && "fill-formovies-gold")} />
                <span>{isLoading ? "..." : (data?.upVote || 0)}</span>
            </button>
            <button
                className={cn(
                    "flex items-center gap-1 text-xs transition-colors duration-200",
                    userRating?.downVote === 1 ? "text-formovies-rose" : "text-white/40 hover:text-white/70"
                )}
                onClick={downVote}
                disabled={isLoading}
            >
                <ThumbsDown className={cn("size-3.5", userRating?.downVote === 1 && "fill-formovies-rose")} />
                <span>{isLoading ? "..." : (data?.downVote || 0)}</span>
            </button>
        </div>
    )
}

export default Rating
