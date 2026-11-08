"use client";

import { FC } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "@/lib/auth-client";
import { useToast } from "@/hooks/use-toast";

interface RatingProps {
  id: string;
}

const Rating: FC<RatingProps> = ({ id }) => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const { toast } = useToast();

  const { data: ratingData, isLoading } = useQuery({
    queryKey: ["rating", id],
    queryFn: async () => {
      const res = await axios.get(`/api/rating?objectId=${id}`);
      return res.data;
    },
  });

  const { data: userRating } = useQuery({
    queryKey: ["userRating", id],
    queryFn: async () => {
      const res = await axios.get(`/api/rating/user?objectId=${id}`);
      return res.data;
    },
    enabled: !!session?.user,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: { upVote: number; downVote: number }) => {
      return await axios.post(`/api/rating/post?objectId=${id}`, {
        object: id,
        ...payload,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rating", id] });
      queryClient.invalidateQueries({ queryKey: ["userRating", id] });
    },
    onError: () => {
      toast({
        title: "Rating failed",
        description: "Could not save your vote. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleVote = (type: "up" | "down") => {
    if (!session?.user) {
      toast({
        title: "Sign in required",
        description: "You must be signed in to vote on comments.",
        variant: "destructive",
      });
      return;
    }

    if (type === "up") {
      mutate({ upVote: 1, downVote: 0 });
    } else {
      mutate({ upVote: 0, downVote: 1 });
    }
  };

  const isUpvoted = userRating?.upVote === 1;
  const isDownvoted = userRating?.downVote === 1;
  const upCount = ratingData?.upVote || 0;
  const downCount = ratingData?.downVote || 0;

  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        disabled={isPending}
        onClick={() => handleVote("up")}
        className={cn(
          "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium transition-all duration-200",
          isUpvoted
            ? "bg-formovies-gold/15 text-formovies-gold border border-formovies-gold/30"
            : "text-white/40 hover:text-white hover:bg-white/5 border border-transparent"
        )}
        title={isUpvoted ? "Remove upvote" : "Upvote"}
      >
        <ThumbsUp
          className={cn("size-3", isUpvoted && "fill-formovies-gold")}
        />
        <span>{isLoading ? "..." : upCount}</span>
      </button>

      <button
        type="button"
        disabled={isPending}
        onClick={() => handleVote("down")}
        className={cn(
          "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium transition-all duration-200",
          isDownvoted
            ? "bg-red-500/15 text-red-400 border border-red-500/30"
            : "text-white/40 hover:text-white hover:bg-white/5 border border-transparent"
        )}
        title={isDownvoted ? "Remove downvote" : "Downvote"}
      >
        <ThumbsDown
          className={cn("size-3", isDownvoted && "fill-red-400")}
        />
        <span>{isLoading ? "..." : downCount}</span>
      </button>
    </div>
  );
};

export default Rating;
