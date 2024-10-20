import { FC } from "react";
import type { RecentlyViewed } from "@prisma/client";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";
import Image from "next/image";
import { Button } from "./ui/button";
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
                <div className="">
                    <Carousel>
                        <CarouselContent>
                            {recentlyViewed.map((veiwed)=>(
                                <CarouselItem key={veiwed.id}>
                                    <div className="relative">
                                        <div className=" ">
                                            <h1 className="text-2xl font-extrabold text-white">{veiwed.title}</h1>
                                            
                                        </div>
                                        <div className="">
                                            <Image src={`http://image.tmdb.org/t/p/original${veiwed.poster_path}`} alt={veiwed.title} width={500} height={100}/>
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