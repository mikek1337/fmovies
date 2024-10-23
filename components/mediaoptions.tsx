import { Heart, Loader2, PlayCircle } from "lucide-react";
import { Button } from "./ui/button"
import { useMutation, useQuery } from "@tanstack/react-query";
import { FC, useOptimistic, useState } from "react";
import axios, { AxiosError } from "axios";
import { cn } from "@/lib/utils";
import { FavoriteType } from "@/app/types/favoriteschema";
import { toast } from "@/hooks/use-toast";
import { set } from "date-fns";
interface MediaOptionsProps{
    mediaId:number;
    title:string;
    poster_url:string;
    mediaType:string;
}
const MediaOptions:FC<MediaOptionsProps> = ({mediaId, title, poster_url, mediaType}) =>{
   
    const [isFav, setIsFav] = useState(false);
    const { isLoading, refetch} = useQuery({
        queryKey:["favorite", mediaId],
        queryFn: async()=>{
            const data = (await axios.get(`/api/favorite?mediaId=${mediaId}`)).data;
            setIsFav(data?.favorite);
            return data
        },
        retryDelay(failureCount, error) {
            return Math.min(1000 * 2 ** failureCount, 30000);
        },
      retry: false
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
            //refetch();
        },
        onError: (error)=>{
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive"
            });
            setIsFav(!isFav);
        }
    })
    const addFavorite = ()=>{
        setIsFav(!isFav);
        mutate({
            mediaId:mediaId.toString(),
            poster_url:poster_url,
            MediaType: mediaType,
            title:title
        });
        refetch();
    }
 /*    const [isFav, addFav] = useOptimistic(data?.favorite, (state:boolean, fav:boolean)=>{
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
                <Heart className={cn("w-5 h-5", {"text-indigo-600 fill-indigo-600":isFav})}/>
                Add to Watchlist
                {isLoading && <Loader2 className="w-5 h-5 animate-spin"/>}
            </Button>
            <Button className="bg-indigo-600 text-white flex items-center gap-2">
                <PlayCircle className="w-5 h-5"/>
                Watch Together
            </Button>
        </div>
    )
}

export default MediaOptions;