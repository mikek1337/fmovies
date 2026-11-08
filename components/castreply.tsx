"use client";

import { FC, useState } from "react";
import { Button } from "./ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CommentSchemaType } from "@/app/types/commentschema";
import { Textarea } from "./ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
import axios from "axios";

interface CastReplyProps {
  commentId: string;
  castReply?: boolean;
  castReplyFor?: string;
  onCancel?: () => void;
  refetchKey?: unknown[];
}

const CastReply: FC<CastReplyProps> = ({
  commentId,
  castReply,
  castReplyFor,
  onCancel,
  refetchKey,
}) => {
  const [content, setContent] = useState<string>("");
  const { data: session } = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { isPending, mutate } = useMutation({
    mutationFn: async (payload: CommentSchemaType) => {
      return await axios.post(`/api/comments/reply?id=${commentId}`, payload);
    },
    onSuccess: () => {
      toast({
        title: "Reply posted",
        description: "Your reply has been added to the discussion.",
      });
      setContent("");
      onCancel?.();
      if (refetchKey) {
        queryClient.invalidateQueries({ queryKey: refetchKey });
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to post reply. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleReplySubmit = () => {
    if (!session?.user) {
      toast({
        title: "Sign in required",
        description: "You must be signed in to post a reply.",
        variant: "destructive",
      });
      return;
    }

    if (!content.trim()) return;

    const payload: CommentSchemaType = {
      content: content.trim(),
      parentId: commentId,
      episodeId: "",
      movieId: "",
      seasonId: "",
      seriesId: "",
    };

    mutate(payload);
  };

  if (!castReply || castReplyFor !== commentId) return null;

  return (
    <div className="mt-3 ml-6 sm:ml-10 p-3 rounded-xl bg-white/[0.02] border border-white/5 animate-fade-in-up">
      <Textarea
        placeholder="Write a constructive reply..."
        rows={3}
        maxLength={1000}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus-visible:ring-formovies-gold/50 resize-none text-xs sm:text-sm"
      />
      <div className="flex items-center justify-between gap-2 mt-2.5">
        <span className="text-[10px] text-white/30">
          {content.length}/1000
        </span>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="text-white/50 hover:text-white text-xs h-7 px-3"
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={isPending || !content.trim()}
            onClick={handleReplySubmit}
            className="bg-formovies-gold text-formovies-dark hover:bg-formovies-amber font-semibold text-xs h-7 px-3"
          >
            {isPending && <Loader2 className="size-3 animate-spin mr-1.5" />}
            Reply
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CastReply;
