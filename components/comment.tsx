"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Loader,
  Lock,
  MessageSquare,
  Star,
  ExternalLink,
  Award,
  Sparkles,
} from "lucide-react";
import { FC, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { CommentSchemaType } from "@/app/types/commentschema";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "./ui/textarea";
import { useSession } from "@/lib/auth-client";
import Comments from "./comments";
import { ReviewsResponse, ReviewItem } from "@/app/types/tmdb";
import { cn } from "@/lib/utils";
import axios from "axios";

interface CommentProps {
  id: number;
  season?: number;
  episode?: number;
  mediaType?: "movie" | "tv";
  voteAverage?: number;
  voteCount?: number;
}

function getAvatarUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith("/http")) return path.slice(1);
  if (path.startsWith("http")) return path;
  return `https://image.tmdb.org/t/p/w185${path}`;
}

const ReviewCard: FC<{ review: ReviewItem }> = ({ review }) => {
  const [expanded, setExpanded] = useState(false);
  const isLong = review.content.length > 350;
  const avatarUrl = getAvatarUrl(review.author_details?.avatar_path);
  const initials = review.author?.[0]?.toUpperCase() || "R";

  return (
    <div className="formovies-card p-5 transition-all duration-200 hover:border-white/15">
      <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
        <div className="flex items-center gap-3">
          <Avatar className="size-9 border border-white/10">
            <AvatarImage src={avatarUrl || ""} alt={review.author} />
            <AvatarFallback className="bg-formovies-gold/15 text-formovies-gold text-xs font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-white/90">
                {review.author_details?.name || review.author}
              </span>
              {review.author_details?.username && review.author_details?.name && (
                <span className="text-xs text-white/40">
                  @{review.author_details.username}
                </span>
              )}
            </div>
            <p className="text-[11px] text-white/40 mt-0.5">
              {new Date(review.created_at).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {review.author_details?.rating !== null &&
            review.author_details?.rating !== undefined && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-formovies-gold/15 text-formovies-gold border border-formovies-gold/30">
                <Star className="size-3 fill-formovies-gold" />
                {review.author_details.rating}/10
              </span>
            )}
          {review.url && (
            <a
              href={review.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/30 hover:text-white/70 p-1 transition-colors"
              title="View on TMDB"
            >
              <ExternalLink className="size-3.5" />
            </a>
          )}
        </div>
      </div>

      <div className="text-sm text-white/70 leading-relaxed font-body whitespace-pre-line">
        {isLong && !expanded
          ? `${review.content.slice(0, 350)}...`
          : review.content}
      </div>

      {isLong && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="mt-3 text-xs font-semibold text-formovies-gold hover:text-formovies-amber transition-colors flex items-center gap-1"
        >
          {expanded ? "Show less" : "Read full review"}
        </button>
      )}
    </div>
  );
};

const CommentSection: FC<CommentProps> = ({
  id,
  season,
  episode,
  mediaType,
  voteAverage,
  voteCount,
}) => {
  const type = mediaType || (season ? "tv" : "movie");
  const [activeTab, setActiveTab] = useState<"comments" | "reviews">("comments");
  const [userComment, setUserComment] = useState<string>("");
  const { toast } = useToast();
  const { data: sessionData } = useSession();

  const { isPending: submitting, mutate } = useMutation({
    mutationFn: async (comment: CommentSchemaType) => {
      if (season) {
        return await fetch(
          `/api/series/comments/post?id=${id}&seasonId=${season}&episodeId=${episode}`,
          {
            method: "POST",
            body: JSON.stringify(comment),
          }
        );
      } else {
        return await fetch(`/api/movies/comments/post?id=${id}`, {
          method: "POST",
          body: JSON.stringify(comment),
        });
      }
    },
    onSuccess: (data) => {
      if (data.status === 200) {
        setUserComment("");
        refetch();
        toast({
          title: "Comment published",
          description: "Your comment has been added to the discussion.",
        });
      }
      if (data.status === 401) {
        toast({
          title: "Error",
          description: "You need to login to comment",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
    throwOnError(error) {
      if (error.message == "Unauthorized") {
        toast({
          title: "Error",
          description: "You need to login to comment",
          variant: "destructive",
        });
      }
      return false;
    },
  });

  // Local site user comments
  const { isPending: commentsLoading, data, refetch } = useQuery({
    queryKey: ["comments", id, season, episode],
    queryFn: async () => {
      if (season)
        return await (
          await fetch(`/api/series/comments?id=${id}&season=${season}&episode=${episode}`)
        ).json();
      return await (await fetch(`/api/movies/comments?id=${id}`)).json();
    },
  });

  // TMDB Community Reviews
  const { data: reviewsData, isPending: reviewsLoading } = useQuery<ReviewsResponse>({
    queryKey: ["tmdb-reviews", id, type],
    queryFn: async () => {
      const res = await axios.get<ReviewsResponse>(
        `/api/reviews?id=${id}&type=${type}`
      );
      return res.data;
    },
  });

  const uploadComment = async () => {
    if (!sessionData) {
      toast({
        description: "You need to login to comment",
        variant: "destructive",
      });
      return;
    }
    let comment: CommentSchemaType;
    if (season && episode) {
      comment = {
        content: userComment,
        episodeId: episode.toString(),
        seasonId: season.toString(),
        seriesId: id.toString(),
        movieId: "",
        parentId: "",
      };
    } else {
      comment = {
        content: userComment,
        movieId: id.toString(),
        parentId: "",
      };
    }
    mutate(comment);
  };

  const scorePercent = voteAverage ? Math.round(voteAverage * 10) : null;
  const reviewsCount = reviewsData?.total_results || 0;
  const commentsCount = data?.length || 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Metascore & Rating Breakdown Summary Card */}
      {voteAverage !== undefined && voteAverage > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/5 items-center">
          <div className="flex items-center gap-3.5">
            <div className="size-14 rounded-xl bg-formovies-gold/15 border border-formovies-gold/30 flex flex-col items-center justify-center shrink-0 shadow-lg shadow-formovies-gold/10">
              <span className="font-display text-2xl text-formovies-gold leading-none">
                {voteAverage.toFixed(1)}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-formovies-gold/70 font-semibold mt-0.5">
                Score
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1 text-formovies-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "size-3.5",
                      i < Math.round(voteAverage / 2)
                        ? "fill-formovies-gold text-formovies-gold"
                        : "text-white/20"
                    )}
                  />
                ))}
              </div>
              <p className="text-xs text-white/50 mt-1">
                {voteCount
                  ? `${voteCount.toLocaleString()} community ratings`
                  : "Community rating"}
              </p>
            </div>
          </div>

          <div className="sm:border-x sm:border-white/5 sm:px-4">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-white/50">Community Approval</span>
              <span className="font-semibold text-white/90">{scorePercent}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-formovies-gold to-formovies-amber rounded-full"
                style={{ width: `${scorePercent}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-start sm:justify-end gap-2.5 text-xs">
            <div className="px-3 py-1.5 rounded-lg bg-white/5 text-white/70 border border-white/10 flex items-center gap-1.5">
              <Award className="size-3.5 text-formovies-gold" />
              <span>
                <strong className="text-white font-semibold">{reviewsCount}</strong> Reviews
              </span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-white/5 text-white/70 border border-white/10 flex items-center gap-1.5">
              <MessageSquare className="size-3.5 text-formovies-gold" />
              <span>
                <strong className="text-white font-semibold">{commentsCount}</strong> Comments
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Header and Tab Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <MessageSquare className="size-5 text-formovies-gold" />
          <h2 className="section-title !mb-0">Discussion & Reviews</h2>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-white/[0.04] border border-white/10">
          <button
            type="button"
            onClick={() => setActiveTab("comments")}
            className={cn(
              "flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200",
              activeTab === "comments"
                ? "bg-formovies-gold text-formovies-dark shadow-sm"
                : "text-white/60 hover:text-white"
            )}
          >
            <span>Comments</span>
            <span
              className={cn(
                "text-[10px] px-1.5 py-0.2 rounded-full",
                activeTab === "comments"
                  ? "bg-black/20 text-formovies-dark font-bold"
                  : "bg-white/10 text-white/50"
              )}
            >
              {commentsCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("reviews")}
            className={cn(
              "flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200",
              activeTab === "reviews"
                ? "bg-formovies-gold text-formovies-dark shadow-sm"
                : "text-white/60 hover:text-white"
            )}
          >
            <span>TMDB Reviews</span>
            <span
              className={cn(
                "text-[10px] px-1.5 py-0.2 rounded-full",
                activeTab === "reviews"
                  ? "bg-black/20 text-formovies-dark font-bold"
                  : "bg-white/10 text-white/50"
              )}
            >
              {reviewsCount}
            </span>
          </button>
        </div>
      </div>

      {/* TAB 1: User Comments */}
      {activeTab === "comments" && (
        <div className="flex flex-col gap-6">
          <div className="formovies-card p-6">
            {sessionData && (
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="size-8">
                  <AvatarImage
                    src={sessionData?.user?.image || ""}
                    alt={sessionData?.user?.name || "User"}
                  />
                  <AvatarFallback className="bg-formovies-gold/10 text-formovies-gold text-xs font-semibold">
                    {sessionData?.user?.name?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-white/80">
                  {sessionData?.user?.name || "User"}{" "}
                  <span className="text-white/30">(You)</span>
                </span>
              </div>
            )}
            <Textarea
              placeholder="Share your thoughts on this title..."
              rows={4}
              maxLength={1000}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus-visible:ring-formovies-gold/50 resize-none text-sm"
              onChange={(e) => setUserComment(e.target.value)}
              value={userComment}
            />
            <div className="flex items-center justify-between gap-3 mt-3">
              <span className="text-[11px] text-white/30">
                {userComment.length}/1000
              </span>
              <Button
                onClick={() => uploadComment()}
                disabled={submitting || !userComment.trim()}
                className="bg-formovies-gold text-formovies-dark hover:bg-formovies-amber font-semibold text-xs h-9 px-5"
              >
                {submitting ? (
                  <Loader className="size-3.5 animate-spin mr-1.5" />
                ) : !sessionData ? (
                  <Lock className="size-3.5 mr-1.5" />
                ) : null}
                Post Comment
              </Button>
            </div>
          </div>

          {commentsLoading && (
            <Loader className="size-5 animate-spin mx-auto text-formovies-gold" />
          )}

          <div className="flex flex-col gap-4">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {data?.map((comment: any) => (
              <Comments
                key={comment.id}
                id={comment.id}
                comment={comment.comment}
                refetchKey={["comments", id, season, episode]}
              />
            ))}
            {!commentsLoading && (!data || data.length === 0) && (
              <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
                <MessageSquare className="size-8 text-white/20 mx-auto mb-2" />
                <p className="text-sm text-white/50 font-medium">
                  No comments yet.
                </p>
                <p className="text-xs text-white/30 mt-1">
                  Be the first to share your thoughts on this title!
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: TMDB Critic & Community Reviews */}
      {activeTab === "reviews" && (
        <div className="flex flex-col gap-4">
          {reviewsLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader className="size-6 animate-spin text-formovies-gold" />
            </div>
          )}

          {!reviewsLoading &&
            reviewsData?.results &&
            reviewsData.results.length > 0 && (
              <div className="flex flex-col gap-4">
                {reviewsData.results.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            )}

          {!reviewsLoading &&
            (!reviewsData?.results || reviewsData.results.length === 0) && (
              <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
                <Sparkles className="size-8 text-white/20 mx-auto mb-2" />
                <p className="text-sm text-white/50 font-medium">
                  No TMDB community reviews found for this title yet.
                </p>
                <p className="text-xs text-white/30 mt-1">
                  You can still post a local comment under the Comments tab!
                </p>
              </div>
            )}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
