import { Bookmark, Loader2, PlayCircle } from "lucide-react";
import { Button } from "./ui/button"
import { useMutation, useQuery } from "@tanstack/react-query";
import { FC } from "react";
import axios from "axios";
import { cn } from "@/lib/utils";
import { FavoriteType } from "@/app/types/favoriteschema";
import { toast } from "@/hooks/use-toast";
interface MediaOptionsProps{
    mediaId:number;
    title:string;
    poster_url:string;
    mediaType:string;
}
const MediaOptions:FC<MediaOptionsProps> = ({mediaId, title, poster_url, mediaType}) =>{
    const {data, isLoading, refetch} = useQuery({
        queryKey:["favorite"],
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
            
            if(error.cause === "unauthenticated"){
                toast({
                    title: "Error",
                    description: "Please login to add to watchlist",
                    variant: "destructive"
                })
            } else{
                toast({
                    title: "Error",
                    description: "Something went wrong, please try again later.",
                    variant: "destructive"
                })
            }
        }
    })
    const addFavorite = ()=>{
        mutate({
            mediaId:mediaId.toString(),
            poster_url:poster_url,
            MediaType: mediaType,
            title:title
        });
    }
    return(
        <div className="grid grid-cols-2 gap-3 md:my-0 my-10">
            <Button variant={"outline"} className="text-indigo-600 flex items-center gap-2 border md:border-0 font-medium" onClick={addFavorite}>
                <Bookmark className={cn("w-5 h-5", {"text-indigo-600 fill-indigo-600":data?.favorite})}/>
                Add to Watchlist
                {(isLoading || isPending) && <Loader2 className="w-5 h-5 animate-spin"/>}
            </Button>
            <Button className="bg-indigo-600 text-white flex items-center gap-2 font-medium">
                <PlayCircle className="w-5 h-5"/>
                Watch Together
            </Button>
        </div>
    )
}

export default MediaOptions;