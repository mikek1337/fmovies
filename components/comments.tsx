"use client";

import { FC, useState } from "react";
import CastReply from "./castreply";
import { Reply, Trash2, CornerDownRight, Loader2 } from "lucide-react";
import Rating from "./rating";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { cn, formatTimeToNow } from "@/lib/utils";
import { useSession } from "@/lib/auth-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

export interface CommentUser {
  id?: string;
  name?: string | null;
  username?: string | null;
  image?: string | null;
  email?: string | null;
}

export interface ReplyItem {
  id: string;
  content: string;
  createdAt: Date | string;
  userId?: string;
  user?: CommentUser;
}

export interface CommentData {
  id: string;
  content: string;
  createdAt: Date | string;
  userId?: string;
  user?: CommentUser;
  replies?: ReplyItem[];
}

interface CommentsProps {
  id: string;
  comment: CommentData;
  isReply?: boolean;
  refetchKey?: unknown[];
}

const Comments: FC<CommentsProps> = ({
  comment,
  isReply = false,
  refetchKey,
}) => {
  const [replying, setReplying] = useState<boolean>(false);
  const { data: session } = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutate: deleteComment, isPending: isDeleting } = useMutation({
    mutationFn: async (targetId: string) => {
      return await axios.delete(`/api/comments?id=${targetId}`);
    },
    onSuccess: () => {
      toast({
        title: "Comment deleted",
        description: "Your comment has been removed.",
      });
      if (refetchKey) {
        queryClient.invalidateQueries({ queryKey: refetchKey });
      }
    },
    onError: () => {
      toast({
        title: "Delete failed",
        description: "Could not delete comment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const displayName =
    comment.user?.username || comment.user?.name || "Viewer";
  const initials = displayName?.[0]?.toUpperCase() || "U";

  // Check if current user is the author
  const isAuthor =
    session?.user?.id && comment.userId
      ? session.user.id === comment.userId
      : session?.user?.email && comment.user?.email
      ? session.user.email === comment.user.email
      : false;

  const replies = comment.replies || [];

  return (
    <div
      className={cn(
        "formovies-card p-4 transition-all duration-200 hover:border-white/10",
        isReply ? "ml-6 sm:ml-10 border-l-2 border-l-formovies-gold/40" : ""
      )}
      key={comment.id}
    >
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-3">
          <Avatar className="size-8 ring-1 ring-white/10">
            <AvatarImage
              src={comment.user?.image || ""}
              alt={displayName}
            />
            <AvatarFallback className="bg-formovies-gold/15 text-formovies-gold text-xs font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs sm:text-sm font-semibold text-white/90">
              {displayName}
            </span>
            <span className="text-[11px] text-white/40">
              {formatTimeToNow(new Date(comment.createdAt))}
            </span>
          </div>
        </div>

        {/* Delete option for the author */}
        {isAuthor && (
          <button
            type="button"
            disabled={isDeleting}
            onClick={() => deleteComment(comment.id)}
            className="text-white/20 hover:text-red-400 p-1 rounded-md transition-colors"
            title="Delete your comment"
            aria-label="Delete comment"
          >
            {isDeleting ? (
              <Loader2 className="size-3.5 animate-spin text-white/40" />
            ) : (
              <Trash2 className="size-3.5" />
            )}
          </button>
        )}
      </div>

      <p className="text-xs sm:text-sm text-white/75 leading-relaxed ml-11 whitespace-pre-line">
        {comment.content}
      </p>

      {/* Upvote, Downvote, and Reply Actions */}
      <div className="flex items-center gap-3 mt-3 ml-11">
        <Rating id={comment.id} />
        {!isReply && (
          <button
            type="button"
            className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs text-white/40 hover:text-formovies-gold hover:bg-white/5 transition-colors"
            onClick={() => setReplying((prev) => !prev)}
          >
            <Reply className="size-3.5" />
            <span>Reply</span>
          </button>
        )}
      </div>

      {/* Reply input box */}
      {!isReply && (
        <CastReply
          commentId={comment.id}
          castReply={replying}
          castReplyFor={comment.id}
          onCancel={() => setReplying(false)}
          refetchKey={refetchKey}
        />
      )}

      {/* Nested Replies Rendering */}
      {!isReply && replies.length > 0 && (
        <div className="mt-4 pt-3 border-t border-white/5 space-y-3">
          <div className="flex items-center gap-1.5 text-[11px] text-white/40 font-semibold mb-2 ml-4">
            <CornerDownRight className="size-3 text-formovies-gold" />
            <span>
              {replies.length} {replies.length === 1 ? "Reply" : "Replies"}
            </span>
          </div>
          {replies.map((reply) => {
            const replyDisplayName =
              reply.user?.username || reply.user?.name || "Viewer";
            const replyInitials = replyDisplayName?.[0]?.toUpperCase() || "U";
            const isReplyAuthor =
              session?.user?.id && reply.userId
                ? session.user.id === reply.userId
                : session?.user?.email && reply.user?.email
                ? session.user.email === reply.user.email
                : false;

            return (
              <div
                key={`reply-${reply.id}`}
                className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 ml-4 sm:ml-6"
              >
                <div className="flex items-center justify-between gap-3 mb-1.5">
                  <div className="flex items-center gap-2.5">
                    <Avatar className="size-6 ring-1 ring-white/10">
                      <AvatarImage
                        src={reply.user?.image || ""}
                        alt={replyDisplayName}
                      />
                      <AvatarFallback className="bg-formovies-gold/15 text-formovies-gold text-[10px] font-semibold">
                        {replyInitials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-semibold text-white/90">
                      {replyDisplayName}
                    </span>
                    <span className="text-[10px] text-white/40">
                      {formatTimeToNow(new Date(reply.createdAt))}
                    </span>
                  </div>

                  {isReplyAuthor && (
                    <button
                      type="button"
                      disabled={isDeleting}
                      onClick={() => deleteComment(reply.id)}
                      className="text-white/20 hover:text-red-400 p-1 rounded-md transition-colors"
                      title="Delete your reply"
                      aria-label="Delete reply"
                    >
                      {isDeleting ? (
                        <Loader2 className="size-3 animate-spin text-white/40" />
                      ) : (
                        <Trash2 className="size-3" />
                      )}
                    </button>
                  )}
                </div>

                <p className="text-xs text-white/70 leading-relaxed ml-8 whitespace-pre-line">
                  {reply.content}
                </p>

                <div className="flex items-center gap-2 mt-2 ml-8">
                  <Rating id={reply.id} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Comments;
