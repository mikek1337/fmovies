import { cn } from "@/lib/utils"
import Link from "next/link"
import { buttonVariants } from "./ui/button"
import { Play, Stars } from "lucide-react"
import { FC } from "react";
import { movieDetail, seriesDetail } from "@/lib/tmd";
interface GetMediaDetailProps{
    id:string;
    media_type:string;
}
const GetMediaDetail:FC<GetMediaDetailProps> = async({id, media_type})=>{
    let movie = null
    if(media_type == "movie"){
        movie = await(await movieDetail(parseInt(id))).data
    } else {
        movie = await(await seriesDetail(parseInt(id))).data
    }
    return(
        <div className="w-full">
        <div className='absolute   md:relative w-full h-full md:bg-none  bg-gradient-to-r from-indigo-500'>

            <div className=' px-5 flex items-center w-full h-full'>
                <div className='flex flex-col gap-2 px-10'>
                    <span className='md:text-5xl text-2xl font-extrabold md:text-black  text-white'>{media_type=="movie"?movie?.title:movie?.name}</span>
                    <p className='text-sm max-w-[500px]  md:line-clamp-4 line-clamp-2  md:text-black  text-white'>{movie?.overview}</p>
                    <div className='flex items-center gap-5 md:flex-nowrap flex-wrap'>
                        <Link className={cn(buttonVariants({variant:'default'}),'flex items-center gap-2 w-fit')} href={media_type=='movie'?`home/watch/movie/${movie?.id}`:`home/watch/series/${movie?.id}`}>
                        <Play className='w-5 h-5 fill-white'/>
                        Watch now
                        </Link>
                        <span className='text-xs font-semibold rounded-lg p-1 bg-indigo-900 text-white'>{new Date(media_type=="tv" ? movie?.first_air_date: movie?.release_date).toDateString()}</span>
                        <span className='flex items-center gap-1 text-sm font-semibold md:text-black text-white'><Stars className='text-yellow-400 fill-yellow-400 w-5 h-5'/>{movie.vote_average?movie.vote_average.toFixed(1):0.0}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
}

export default GetMediaDetail