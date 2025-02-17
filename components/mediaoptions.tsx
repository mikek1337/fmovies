import { Heart, Loader2, PlayCircle } from "lucide-react";
import { Button, buttonVariants } from "./ui/button"
import { useMutation, useQuery } from "@tanstack/react-query";
import { FC } from "react";
import axios from "axios";
import { cn } from "@/lib/utils";
import { FavoriteType } from "@/app/types/favoriteschema";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";
import { nanoid } from "nanoid";
interface MediaOptionsProps{
    mediaId:number;
    title:string;
    poster_url:string;
    mediaType:string;
}
const MediaOptions:FC<MediaOptionsProps> = ({mediaId, title, poster_url, mediaType}) =>{
    const {data, isLoading, refetch} = useQuery({
        queryKey:["favorite", mediaId],
        queryFn: async()=>{
            const data = (await axios.get(`/api/favorite?mediaId=${mediaId}`)).data;
            
            return data
        },
    })
    const {mutate, isPending} = useMutation({
        mutationKey:["favorite", mediaId],
        mutationFn: async(fav:FavoriteType)=>{
            return (await axios.post(`/api/favorite/post`, fav)).data
        },
        onSuccess: (data)=>{
            if(data.favorite)
            {
                toast({
                    title: "Success",
                    description: "Added to Watchlist",
                    variant: "default"
                })
            } else {
                toast({
                    title: "Success",
                    description: "Removed from Watchlist",
                    variant: "default"
                })
            }
            refetch();
        },
        onError: (error)=>{
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive"
            })
        }
    })
    const addFavorite = ()=>{
        mutate({
            mediaId:mediaId.toString(),
            poster_url:poster_url,
            MediaType: mediaType,
            title:title
        });
        /* if(isFav){
            addFav(false);
        }
        else{
            addFav(true);
        } */
    }
/*     const [isFav, addFav] = useOptimistic(data?.favorite, (state, fav:boolean)=>{
        mutate({
            mediaId:mediaId.toString(),
            poster_url:poster_url,
            MediaType: mediaType,
            title:title
        })
        return fav;
    }) */
    return(
        <div className="flex flex-col gap-3 md:my-0 my-10">
            <Button variant={"ghost"} className="text-indigo-600 flex items-center gap-2 border md:border-0" onClick={addFavorite}>
                <Heart className={cn("w-5 h-5", {"text-indigo-600 fill-indigo-600":data?.favorite})}/>
                Add to Watchlist
                {(isLoading || isPending) && <Loader2 className="w-5 h-5 animate-spin"/>}
            </Button>
            <Link className={cn(buttonVariants({variant:'default'}),"bg-indigo-600 text-white flex items-center gap-2")} href={mediaType=="movie"?`${mediaId}/together/${nanoid()}`:''} >
                <PlayCircle className="w-5 h-5"/>
                Watch Together
            </Link>
        </div>
    )
}

export default MediaOptions;