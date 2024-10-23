"use client"
import GetMediaDetail from "@/components/getmediadetail";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { Suspense } from "react";

const Page = ()=>{
    const {data, isLoading} = useQuery({
        queryKey:["favorites"],
        queryFn: async()=>{
            return (await axios.get("/api/movies/favorites")).data
        }
    })
    
    return(
        <div className="w-[80%] flex items-center justify-center">
            {
                data && (

                    <Carousel opts={{align: "start"}} className="w-full max-w-sm">
                        <CarouselContent>
                            {
                                data?.map((fav)=>(
                                <CarouselItem key={fav.id} className="md:basis-1/2 lg:basis-1/3 relative">
                                    <div className="flex items-center  group">
                                        <div className="w-full">
                                            
                                            <Image src={`http://image.tmdb.org/t/p/original${fav.poster_path}`} width={300} height={450} alt={fav.title}/>
                                        </div>
                                        <div className="absolute left-96  group-hover:block hidden w-full  z-[99999]  h-full ">
                                            <Suspense fallback={<Loader2 className="w-5 h-5 animate-spin"/>}>
                                                <GetMediaDetail id={fav.mediaId} media_type={fav.MediaType}/>
                                            </Suspense>
                                        </div>
                                    </div>
                                </CarouselItem>

                                ))
                            }
                        </CarouselContent>
                        <CarouselPrevious/>
                        <CarouselNext/>
                    </Carousel>
                )
            }
            {!data && <div>No Favorites</div>}
            {isLoading && <Loader2 className="w-10 h-10 animate-spin"/>}
        </div>
    )
}

export default Page;