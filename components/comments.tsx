'use client'
import { FC, useState } from "react";
import CastReply from "./castreply";
import { Reply } from "lucide-react";
import Rating from "./rating";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { cn, formatTimeToNow } from "@/lib/utils";
type CommentType = {
    id: string;
    comment: {
        id: string;
        content: string;
        createdAt: Date;
        user?: {
            username: string;
            image?: string | null;
        };
        
    };
    isReply?: boolean;
};
const Comments: FC<CommentType> = ({comment, isReply, id}) =>{
    const [replying, setReplying] = useState<boolean>(false);
    const [replyingFor, setReplyingFor] = useState<string>("");

    const openReplyCast = (commentId: string) =>{
        setReplying(prev => !prev);
        setReplyingFor(commentId);
    }
    return(
        <div className={cn("bg-white p-5 rounded-lg shadow-sm border border-gray-200", {"ml-10": isReply})} key={comment.id}>
                                    <div className="flex items-center mb-2">
                                        <div className="w-9 h-9 bg-green-200 rounded-full flex items-center justify-center text-green-800 font-bold mr-3 text-sm">
                                            <Avatar className="border">
                                                <AvatarImage src={comment.user?.image} alt={comment.user?.username} />
                                                <AvatarFallback>{comment.user?.username[0]}</AvatarFallback>
                                            </Avatar>
                                        </div>
                                        <span className="font-semibold text-gray-800">{comment.user?.username}</span>
                                        <span className="text-gray-500 text-xs ml-3">{formatTimeToNow(comment.createdAt)}</span>
                                    </div>
                                    <p className="text-gray-700 leading-relaxed">{comment?.content}</p>
                                    <div className="flex items-center text-gray-500 mt-3 space-x-4 text-sm">
                                        <Rating id={comment?.id} />
                                        <span className="flex items-center gap-2 cursor-pointer hover:underline text-sm" aria-disabled={replying} onClick={() => openReplyCast(comment?.id)}>
                                            <Reply className="w-5 h-5 text-zinc-700" />
                                            Reply
                                        </span>
                                    </div>
                                    <CastReply commentId={comment?.id} castReply={replying} castReplyFor={replyingFor}/>
                                </div>
    )
}

export default Comments;