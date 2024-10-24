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
        <div className="h-[50%] overflow-auto">
            <div className="my-2">
                <h1 className="text-xl font-extrabold">Casts</h1>
            </div>
            <Carousel  opts={{
                align: "start",
            }}
            className="w-full ">
                <CarouselContent>
            <div className="w-full flex  max-h-full ">
                {
                    data?.cast?.map((castMember)=>(
                        <CarouselItem key={castMember.id} className="md:basis-1/2 basis-1/3">
                        <div >
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
                        </CarouselItem>
                    ))

                }
            </div>
            <CarouselNext/>
            <CarouselPrevious/>
            </CarouselContent>
        </Carousel>
        </div>
    )

}

export default Credits;