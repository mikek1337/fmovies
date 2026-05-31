"use client"
import { FC, useState } from "react";
import { Button } from "./ui/button";
import { useMutation } from "@tanstack/react-query";
import { CommentSchemaType } from "@/app/types/commentschema";
import { Textarea } from "./ui/textarea";

interface CastReplyProps {
    commentId: string;
    castReply?: boolean;
    castReplyFor?: string;
}

const CastReply: FC<CastReplyProps> = ({ commentId, castReply, castReplyFor }) => {
    const [comment, setComment] = useState<string>("");

    const { isPending, mutate } = useMutation({
        mutationFn: async (comment: CommentSchemaType) => {
            return await fetch(`/api/comments/reply?id=${commentId}`, {
                method: "POST",
                body: JSON.stringify(comment)
            })
        }
    })

    const uploadComment = () => {
        const commentContent: CommentSchemaType = {
            content: comment,
            parentId: commentId,
            episodeId: "",
            movieId: "",
            seasonId: "",
            seriesId: ""
        }
        mutate(commentContent);
        setComment("");
    }

    if (castReply && castReplyFor === commentId) {
        return (
            <div className="mt-3 ml-11">
                <Textarea
                    placeholder="Write a reply..."
                    rows={3}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus-visible:ring-formovies-gold/50 resize-none text-sm"
                    onChange={(e) => setComment(e.target.value)}
                    value={comment}
                />
                <div className="flex justify-end gap-2 mt-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-white/50 hover:text-white"
                    >
                        Cancel
                    </Button>
                    <Button
                        size="sm"
                        onClick={uploadComment}
                        className="bg-formovies-gold text-formovies-dark hover:bg-formovies-amber font-semibold"
                        disabled={isPending || !comment.trim()}
                    >
                        Reply
                    </Button>
                </div>
            </div>
        )
    }
    return null;
}

export default CastReply;
