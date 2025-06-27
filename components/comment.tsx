"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader, Lock, Reply } from "lucide-react";
import { FC, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import type { Comment } from "@prisma/client";
import { CommentSchemaType } from "@/app/types/commentschema";
import { Button } from "./ui/button";
import { formatTimeToNow } from "@/lib/utils";
import CastReply from "./castreply";
import { useToast } from "@/hooks/use-toast";
import Rating from "./rating";
import { Textarea } from "./ui/textarea";
import { useSession } from "next-auth/react";
interface CommentProps {
    id: number;
    season?: number;
    episode?: number;
}
const Comment: FC<CommentProps> = ({ id, season, episode }) => {
    const [userComment, setUserComment] = useState<string>("");
    const { toast } = useToast();
    const [replying, setReplying] = useState<boolean>(false);
    const session = useSession();
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
            refetch();
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
                //alert("You need to login to comment")
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
    console.log(data);

    const uploadComment = async () => {
        if (session.status === "unauthenticated") {
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

        }
        else {
            comment = {
                content: userComment,
                movieId: id.toString(),
                parentId: ""
            };
        }
        mutate(comment);

    }

    return (
        <div className="w-full p-1 ">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Comments (<span>{data?.length}</span>)</h2>
            {isPending && <Loader className="w-5 h-5 animate-spin mx-auto" />}
            <div className="">

                <div className="w-full bg-gray-50 mb-5">

                    <div className="w-full p-5 h-fit">
                        {session.status === "authenticated" && (
                            <div className="flex items-center gap-2  rounded-lg shadow-sm mb-4">
                                <Avatar className="border">
                                    <AvatarImage src={session.data?.user?.image || ""} alt={session.data?.user?.name || "User"} />
                                    <AvatarFallback>{session.data?.user?.name?.[0] || "U"}</AvatarFallback>
                                </Avatar>
                                <span className="text-gray-700 font-semibold">{session.data?.user?.name || "User"} (<span>You</span>)</span>
                            </div>
                        )}
                        <Textarea placeholder="Share your thoughts on this movie... " rows={4} className="w-full p-4 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" onChange={(e) => setUserComment(e.target.value)} />
                        <div className="text-right mt-5">
                            <Button onClick={() => uploadComment()} size={'lg'} disabled={submitting} className="gap-2 items-center bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-200 ease-in-out shadow-md">
                                {
                                    session.status === "unauthenticated" && (<Lock className="w-5 h-5 " />)
                                }

                                Post Comment
                            </Button>
                        </div>
                    </div>

                </div>
                <div className="space-y-4">
                    {
                        /* eslint-disable @typescript-eslint/no-explicit-any */
                        data?.map((comment: any) => (
                            <>
                                <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200" key={comment.id}>
                                    <div className="flex items-center mb-2">
                                        <div className="w-9 h-9 bg-green-200 rounded-full flex items-center justify-center text-green-800 font-bold mr-3 text-sm">
                                            <Avatar className="border">
                                                <AvatarImage src={comment.comment.user?.image} alt={comment.comment.user?.username} />
                                                <AvatarFallback>{comment.comment.user?.username[0]}</AvatarFallback>
                                            </Avatar>
                                        </div>
                                        <span className="font-semibold text-gray-800">{comment.comment.user?.username}</span>
                                        <span className="text-gray-500 text-xs ml-3">{formatTimeToNow(comment.comment.createdAt)}</span>
                                    </div>
                                    <p className="text-gray-700 leading-relaxed">{comment?.comment.content}</p>
                                    <div className="flex items-center text-gray-500 mt-3 space-x-4 text-sm">
                                        <Rating id={comment?.comment.id} />
                                        <span className="flex items-center gap-2 cursor-pointer hover:underline text-sm" aria-disabled={replying} onClick={() => setReplying(prev => !prev)}>
                                            <Reply className="w-5 h-5 text-zinc-700" />
                                            Reply
                                        </span>
                                    </div>
                                    <CastReply commentId={comment?.comment.id} castReply={replying} />
                                </div>
                                {
                                    comment.comment.replies.map((replay: any) => (
                                        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 ml-[10%]" key={replay.id}>
                                            <div className="flex items-center mb-2">
                                                <div className="w-9 h-9 bg-green-200 rounded-full flex items-center justify-center text-green-800 font-bold mr-3 text-sm">
                                                    <Avatar className="border">
                                                        <AvatarImage src={replay.user?.image} alt={comment.comment.user?.username} />
                                                        <AvatarFallback>{replay.user?.username[0]}</AvatarFallback>
                                                    </Avatar>
                                                </div>
                                                <span className="font-semibold text-gray-800">{replay.user?.username}</span>
                                                <span className="text-gray-500 text-xs ml-3">{formatTimeToNow(replay.createdAt)}</span>
                                            </div>
                                            <p className="text-gray-700 leading-relaxed">{replay.content}</p>
                                            <div className="flex items-center text-gray-500 mt-3 space-x-4 text-sm">
                                                <Rating id={replay.id} />
                                                <span className="flex items-center gap-2 cursor-pointer hover:underline text-sm" aria-disabled={replying} onClick={() => setReplying(prev => !prev)}>
                                                    <Reply className="w-5 h-5 text-zinc-700" />
                                                    Reply
                                                </span>
                                            </div>
                                            <CastReply commentId={replay.id} castReply={replying} />
                                        </div>
                                    ))
                                }
                            </>


                        ))}

                </div>
                <div>
                    {data?.length == 0 && (<span className="text-center text-zinc-300 text-sm">No Comments</span>)}
                </div>

            </div>

        </div >
    )
}

export default Comment;