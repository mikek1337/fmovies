"use client"
import GetMediaDetail from "@/components/getmediadetail";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { Suspense } from "react";
import type { Favorite } from "@prisma/client";
import Credits from "@/components/credits";
const Page = ()=>{
    const {data, isLoading} = useQuery({
        queryKey:["favorites"],
        queryFn: async()=>{
            return (await axios.get("/api/movies/favorites")).data
        }
    })
    
    return(
        <div className="w-full   border">
            {
                data && (

                    <Carousel className="w-full h-fit " opts={{loop: false, active:true, align:"start", duration:3}}>
                        <CarouselContent>
                            {
                                data?.map((fav:Favorite)=>(
                                <CarouselItem key={fav.id} >
                                    <div className="md:flex items-center  group ">
                                        <div className="w-[80%]  z-[99999]  h-full ">
                                            <Suspense fallback={<Loader2 className="w-5 h-5 animate-spin"/>}>
                                                <GetMediaDetail id={fav.mediaId} media_type={fav.MediaType}/>
                                            </Suspense>
                                        </div>
                                        <div className="w-full">   
                                            <Image src={`http://image.tmdb.org/t/p/original${fav.poster_path}`} width={1200} height={350} alt={fav.title}/>
                                        </div>
                                    </div>
                                    <div>
                                        <Credits mediaId={parseInt(fav.mediaId)} mediaType={fav.MediaType}/>
                                    </div>
                                </CarouselItem>

                                ))
                            }
                        </CarouselContent>
                       
                    </Carousel>
                )
            }
            {!data && <div>No Favorites</div>}
            {isLoading && <Loader2 className="w-10 h-10 animate-spin"/>}
        </div>
    )
}

export default Page;
