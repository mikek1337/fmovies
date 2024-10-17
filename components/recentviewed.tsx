import { FC } from "react";
import type { RecentlyViewed } from "@prisma/client";
import { Flip, FlipFront } from "./flip";
import { movieDetail, seriesDetail } from "@/lib/tmd";
interface RecentlyViewedProps  {
    recentlyViewed:RecentlyViewed[]
    
}
const RecentlyViewed:FC<RecentlyViewedProps> = ({recentlyViewed}) =>{
    return(
        <div className="my-2">
            <h1 className="text-xl font-extrabold">Recently Viewed</h1>
            <div className="mt-20 mx-auto w-full">
                {
                    recentlyViewed.length == 0 && <h1 className="text-center">No Recently Viewed</h1>
                }
                <Flip>
                    {recentlyViewed.map((media)=>(
                        <FlipFront title={media.title} image={`http://image.tmdb.org/t/p/w500${media.poster_path}`} key={media.id}/>
                    ))}
                   
                </Flip>
            </div>
        </div>
    )
}

export default RecentlyViewed;