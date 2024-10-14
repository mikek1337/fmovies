'use client'
import { MovieResponse } from "@/app/types/moviedbresponse";
import { cn } from "@/lib/utils";
import { Play, Stars } from "lucide-react";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { buttonVariants } from "./ui/button";
import Image from "next/image";
import BlurFade from "./magicui/blur-fade";
interface HeroProps{
    movies: MovieResponse
}
const Hero:FC<HeroProps> = ({movies})=>{
    const [movieIndex, setMovieIndex] = useState(0);
    const [movie, setMovie]= useState(movies.results[movieIndex]);
    useEffect(()=>{
        let index = movieIndex;
     
        const interval = setInterval(()=>{
            if(movies.results[index].media_type == "person")
            {
                index++;
            }
            loadMovieSilde(index)
            index++;
            if(index > 6)
            {
                index = 0
            }
        }, 10000);
        return ()=>clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    const loadMovieSilde  = (index:number)=>{
        setMovie(movies.results[index]);
        setMovieIndex(index);
    }
    return(
        <div className="flex justify-between broder border-y-emerald-700 w-full ">
        <div className='w-full'>
        <div className=' rounded-2xl   '>
                <BlurFade inView key={movie?.id}>
                    <div  className={cn('relative  w-full justify-center md:flex  md:px-2')}>
                        <div className="w-full">
                            <div className='absolute   md:relative w-full h-full md:bg-none  bg-gradient-to-r from-indigo-500'>

                                <div className=' px-5 flex items-center w-full h-full'>
                                    <div className='flex flex-col gap-2 px-10'>
                                        <span className='md:text-5xl text-2xl font-extrabold md:text-black  text-white'>{movie?.media_type=="movie"?movie?.title:movie?.name}</span>
                                        <p className='text-sm max-w-[500px]  md:line-clamp-4 line-clamp-2  md:text-black  text-white'>{movie?.overview}</p>
                                        <div className='flex items-center gap-5 md:flex-nowrap flex-wrap'>
                                            <Link className={cn(buttonVariants({variant:'default'}),'flex items-center gap-2 w-fit')} href={movie?.media_type=='movie'?`home/watch/movie/${movie?.id}`:`home/watch/series/${movie?.id}`}>
                                            <Play className='w-5 h-5 fill-white'/>
                                            Watch now
                                            </Link>
                                            <span className='text-xs font-semibold rounded-lg p-1 bg-indigo-900 text-white'>{new Date(movie?.media_type=="tv" ? movie?.first_air_date: movie?.release_date).toDateString()}</span>
                                            <span className='flex items-center gap-1 text-sm font-semibold md:text-black text-white'><Stars className='text-yellow-400 fill-yellow-400 w-5 h-5'/>{movie.vote_average?movie.vote_average.toFixed(1):0.0}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='md:h-[400px] '>
                            <Image src={`http://image.tmdb.org/t/p/original${movie?.backdrop_path}`} className='object-cover md:max-h-[650px] w-full  rounded-md' width={1200} height={500} alt={movie?.title}/>
                        </div>
                    </div>
                    </BlurFade>
             
        </div>
        <div className='flex justify-center my-5'>
                <div className='flex  gap-2'>
                    <span className='p-2 rounded-full bg-indigo-300' onClick={()=>loadMovieSilde(0)}></span>
                    <span className='p-2 rounded-full bg-indigo-300' onClick={()=>loadMovieSilde(1)}></span>
                    <span className='p-2 rounded-full bg-indigo-300' onClick={()=>loadMovieSilde(2)}></span>
                    <span className='p-2 rounded-full bg-indigo-300' onClick={()=>loadMovieSilde(3)}></span>
                    <span className='p-2 rounded-full bg-indigo-300' onClick={()=>loadMovieSilde(4)}></span>
                </div>
        </div>
    </div>
    </div>
    )
}

export default Hero;