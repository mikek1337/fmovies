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
            
            loadMovieSilde(index)
            index++;
            if(index > 4)
            {
                index = 0
            }
        }, 10000);
        return ()=>clearInterval(interval)
    },[])
    const loadMovieSilde  = (index:number)=>{
        setMovie(movies.results[index]);
        setMovieIndex(index);
    }
    return(
        <div className="flex justify-center broder border-y-emerald-700">
        <div className='w-fit '>
        <div className='w-fit rounded-2xl   '>
                <BlurFade inView key={movie.id}>
                    <div  className={cn('relative  w-full justify-center ')}>
                        <div >
                            <div className='absolute w-full h-full  bg-gradient-to-r from-indigo-500'>

                                <div className=' px-5 flex items-center w-full border h-full'>
                                    <div className='flex flex-col gap-2 px-10'>
                                        <span className='text-5xl font-extrabold  '>{movie.media_type=="movie"?movie.title:movie.name}</span>
                                        <p className='text-sm max-w-[500px]  line-clamp-4'>{movie.overview}</p>
                                        <div className='flex items-center gap-5'>
                                            <Link className={cn(buttonVariants({variant:'default'}),'flex items-center gap-2 w-fit')} href={movie.media_type=='movie'?`home/watch/movie/${movie.id}`:`home/watch/series/${movie.id}`}>
                                            <Play className='w-5 h-5 fill-white'/>
                                            Watch now
                                            </Link>
                                            <span className='text-xs font-semibold rounded-lg p-1 bg-indigo-900 text-white'>{new Date(movie.media_type=="tv" ? movie.first_air_date: movie.release_date).toDateString()}</span>
                                            <span className='flex items-center gap-1 text-sm font-semibold'><Stars className='text-yellow-400 fill-yellow-400 w-5 h-5'/>{movie.vote_average.toFixed(1)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='border border-red-600'>
                            <Image src={`http://image.tmdb.org/t/p/original${movie.backdrop_path}`} className='object-cover h-[600px]  rounded-md' width={1200} height={500} alt={movie.title}/>
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
                </div>
        </div>
    </div>
    </div>
    )
}

export default Hero;