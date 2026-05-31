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

const Comments: FC<CommentType> = ({ comment, isReply }) => {
    const [replying, setReplying] = useState<boolean>(false);
    const [replyingFor, setReplyingFor] = useState<string>("");

    const openReplyCast = (commentId: string) => {
        setReplying(prev => !prev);
        setReplyingFor(commentId);
    }

    const initials = comment.user?.username?.[0]?.toUpperCase() || "U";

    return (
        <div className={cn("formovies-card p-4", { "ml-8": isReply })} key={comment.id}>
            <div className="flex items-center gap-3 mb-2">
                <Avatar className="size-8">
                    <AvatarImage src={comment.user?.image || ''} alt={comment.user?.username} />
                    <AvatarFallback className="bg-formovies-gold/10 text-formovies-gold text-xs font-semibold">
                        {initials}
                    </AvatarFallback>
                </Avatar>
                <span className="text-sm font-semibold text-white/80">{comment.user?.username}</span>
                <span className="text-[11px] text-white/40">{formatTimeToNow(comment.createdAt)}</span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed ml-11">{comment?.content}</p>
            <div className="flex items-center gap-4 mt-3 ml-11">
                <Rating id={comment?.id} />
                <button
                    className="flex items-center gap-1.5 text-xs text-white/40 hover:text-formovies-gold transition-colors duration-200"
                    onClick={() => openReplyCast(comment?.id)}
                >
                    <Reply className="size-3.5" />
                    Reply
                </button>
            </div>
            <CastReply commentId={comment?.id} castReply={replying} castReplyFor={replyingFor} />
        </div>
    )
}

export default Comments;
