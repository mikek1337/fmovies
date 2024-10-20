import { FC } from "react";
import type { RecentlyViewed } from "@prisma/client";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";
import Image from "next/image";
import { Button } from "./ui/button";
import GetMediaDetail from "./getmediadetail";
interface RecentlyViewedProps  {
    recentlyViewed:RecentlyViewed[]
    
}
const RecentlyViewed:FC<RecentlyViewedProps> = ({recentlyViewed}) =>{
    return(
        <div className="my-2   w-full h-full">
            <h1 className="text-xl font-extrabold">Recently Viewed</h1>
            <div className="mx-auto w-full">
                {
                    recentlyViewed.length == 0 && <h1 className="text-center">No Recently Viewed</h1>
                }
                <div className="max-w-[700px] mx-auto">
                    <Carousel opts={{
        align: "start",
      }}
     >
                        <CarouselContent>
                            {recentlyViewed.map((veiwed)=>(
                                 <CarouselItem key={veiwed.id} >
                                    <div className="flex justify-center  gap-2 max-w-[1200px]">
                                        <GetMediaDetail id={veiwed.mediaId} media_type={veiwed.MediaType}/>
                                        <div className="">
                                            <Image src={`http://image.tmdb.org/t/p/original${veiwed.poster_path}`} alt={veiwed.title} width={300} height={300}/>
                                        </div>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselNext/>
                        <CarouselPrevious/>
                    </Carousel>
                </div>
            </div>
        </div>
    )
}

export default RecentlyViewed;