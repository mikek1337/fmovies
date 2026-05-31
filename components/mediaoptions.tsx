"use client"
import { Bookmark, Loader2 } from "lucide-react";
import { Button } from "./ui/button"
import { useQuery } from "@tanstack/react-query";
import { FC } from "react";
import axios from "axios";
import { cn } from "@/lib/utils";
import useWatchList from "@/hooks/use-watchlist";

interface MediaOptionsProps {
    mediaId: number;
    title: string;
    poster_url: string;
    mediaType: string;
}

const MediaOptions: FC<MediaOptionsProps> = ({ mediaId, title, poster_url, mediaType }) => {
    const { data, isLoading, refetch } = useQuery({
        queryKey: ["favorite"],
        queryFn: async () => {
            const data = (await axios.get(`/api/favorite?mediaId=${mediaId}`)).data;
            return data
        },
    })

    const { AddWatchList, isPending } = useWatchList({
        onSuccess: () => refetch()
    })

    const addFavorite = () => {
        AddWatchList({
            mediaId: mediaId.toString(),
            poster_url: poster_url,
            MediaType: mediaType,
            title: title
        });
    }

    return (
        <div className="flex items-center gap-2">
            <Button
                variant="outline"
                size="sm"
                className={cn(
                    "border-white/10 hover:bg-white/5",
                    data?.favorite ? "text-formovies-gold border-formovies-gold/30" : "text-white/60"
                )}
                onClick={addFavorite}
                disabled={isLoading || isPending}
            >
                <Bookmark className={cn("size-4", data?.favorite ? "fill-formovies-gold" : "")} />
                <span className="text-xs">{data?.favorite ? "Saved" : "Watchlist"}</span>
                {(isLoading || isPending) && <Loader2 className="size-3 animate-spin" />}
            </Button>
        </div>
    )
}

export default MediaOptions;
