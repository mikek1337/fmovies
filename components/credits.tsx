import { getMovieCredits, getSeriesCredits } from "@/lib/tmd";
import { FC } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";
import { useQuery } from "@tanstack/react-query";

interface CreditsProps{
    mediaId:number;
    mediaType:string;
}
const Credits:FC<CreditsProps> = ({mediaId, mediaType}) =>{
    const {data} = useQuery({
        queryKey:["credits", mediaId],
        queryFn: async()=>{
            if(mediaType === "movie"){
                return (await getMovieCredits(mediaId)).data
            }
            else{
                return (await getSeriesCredits(mediaId)).data
            }
        }
    })
   
    return (
        <div className="h-[70%] max-w-[700px] border">
            <div className="my-2">
                <h1 className="text-xl font-extrabold">Casts</h1>
            </div>
           
            <div className="w-fit grid grid-cols-3 gap-1  max-h-full ">
                {
                    data?.cast?.map((castMember)=>(
                       
                        <div key={castMember.id}>
                            <div className="flex items-center gap-2 w-full shadow-md rounded-md p-2">
                                <Avatar>
                                    <AvatarImage src={`http://image.tmdb.org/t/p/original${castMember.profile_path}`} className="object-contain"/>
                                    <AvatarFallback>{castMember.name}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h1 className="font-extralight italic">{castMember.name}</h1>
                                    <h2 className="text-zinc-400 italic">{castMember.character}</h2>
                                </div>
                            </div>
                        </div>
                        
                    ))

                }
            </div>
        </div>
    )

}

export default Credits;