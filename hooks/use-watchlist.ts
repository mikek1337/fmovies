import { FavoriteType } from "@/app/types/favoriteschema"
import { toast } from "./use-toast"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"

type UseWatchListOptions = {
    onSuccess?: (data: { favorite: boolean }) => void;
};

const useWatchList = (options?: UseWatchListOptions)=>{
    const {mutate, isPending} = useMutation({
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
            options?.onSuccess?.(data);
        },
        onError: (error)=>{
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                toast({
                    title: "Error",
                    description: "Please login or sign up to add to watchlist",
                    variant: "destructive"
                })
            } else {
                toast({
                    title: "Error",
                    description: "Something went wrong, please try again later.",
                    variant: "destructive"
                })
            }
        }
    })
    const AddWatchList = (fav:FavoriteType)=>{
        mutate(fav)
    }
    return {AddWatchList, isPending}
}

export default useWatchList