"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader, Lock, MessageSquare } from "lucide-react";
import { FC, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { CommentSchemaType } from "@/app/types/commentschema";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "./ui/textarea";
import { useSession } from "@/lib/auth-client";
import Comments from "./comments";

interface CommentProps {
    id: number;
    season?: number;
    episode?: number;
}

const CommentSection: FC<CommentProps> = ({ id, season, episode }) => {
    const [userComment, setUserComment] = useState<string>("");
    const { toast } = useToast();
    const { data: sessionData } = useSession();
    const { isPending: submitting, mutate } = useMutation({
        mutationFn: async (comment: CommentSchemaType) => {
            if (season) {
                return await fetch(`/api/series/comments/post?id=${id}&seasonId=${season}&episodeId=${episode}`, {
                    method: "POST",
                    body: JSON.stringify(comment)
                })
            } else {
                return await fetch(`/api/movies/comments/post?id=${id}`, {
                    method: "POST",
                    body: JSON.stringify(comment)
                });
            }
        },
        onSuccess: (data) => {
            if (data.status === 200) {
                setUserComment("");
                refetch();
            }
            if (data.status === 401) {
                toast({
                    title: "Error",
                    description: "You need to login to comment",
                    variant: "destructive"
                })
            }
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive"
            })
        },
        throwOnError(error) {
            if (error.message == "Unauthorized") {
                toast({
                    title: "Error",
                    description: "You need to login to comment",
                    variant: "destructive"
                })
            }
            return false;
        },
    })

    const { isPending, data, refetch } = useQuery({
        queryKey: ["comments", id, season, episode],
        queryFn: async () => {
            if (season)
                return await (await fetch(`/api/series/comments?id=${id}&season=${season}&episode=${episode}`)).json()
            return await (await fetch(`/api/movies/comments?id=${id}`)).json()
        },
    });

    const uploadComment = async () => {
        if (!sessionData) {
            toast({
                description: "You need to login to comment",
                variant: "destructive"
            })
            return;
        }
        let comment: CommentSchemaType
        if (season && episode) {
            comment = {
                content: userComment,
                episodeId: episode.toString(),
                seasonId: season.toString(),
                seriesId: id.toString(),
                movieId: "",
                parentId: ""
            };
        } else {
            comment = {
                content: userComment,
                movieId: id.toString(),
                parentId: ""
            };
        }
        mutate(comment);
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
                <MessageSquare className="size-5 text-formovies-gold" />
                <h2 className="section-title !mb-0">
                    Comments <span className="text-white/30 font-body text-sm">({data?.length || 0})</span>
                </h2>
            </div>

            {isPending && <Loader className="size-5 animate-spin mx-auto text-formovies-gold" />}

            <div className="formovies-card p-6">
                {sessionData && (
                    <div className="flex items-center gap-3 mb-4">
                        <Avatar className="size-8">
                            <AvatarImage src={sessionData?.user?.image || ""} alt={sessionData?.user?.name || "User"} />
                            <AvatarFallback className="bg-formovies-gold/10 text-formovies-gold text-xs font-semibold">
                                {sessionData?.user?.name?.[0] || "U"}
                            </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium text-white/80">
                            {sessionData?.user?.name || "User"} <span className="text-white/30">(You)</span>
                        </span>
                    </div>
                )}
                <Textarea
                    placeholder="Share your thoughts..."
                    rows={4}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus-visible:ring-formovies-gold/50 resize-none"
                    onChange={(e) => setUserComment(e.target.value)}
                    value={userComment}
                />
                <div className="flex justify-end mt-4">
                    <Button
                        onClick={() => uploadComment()}
                        size="lg"
                        disabled={submitting || !userComment.trim()}
                        className="bg-formovies-gold text-formovies-dark hover:bg-formovies-amber font-semibold"
                    >
                        {!sessionData && <Lock className="size-4" />}
                        Post Comment
                    </Button>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {data?.map((comment: any) => (
                    <div key={comment.id}>
                        <Comments comment={comment.comment} id={comment.id} />
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {comment.comment.replies?.map((reply: any) => (
                            <Comments comment={reply} id={reply.id} isReply={true} key={reply.id} />
                        ))}
                    </div>
                ))}
                {data?.length === 0 && (
                    <p className="text-center text-white/30 text-sm py-8">No comments yet. Be the first to share your thoughts!</p>
                )}
            </div>
        </div>
    )
}

export default CommentSection;
