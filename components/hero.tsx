'use client'
import { MovieResponse } from "@/app/types/moviedbresponse";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
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
          <section className="relative bg-gray-100 rounded-xl overflow-hidden shadow-2xl mb-12 flex flex-col lg:flex-row items-center mt-10">
            <div className=" w-full h-1/2 lg:h-96">
                <img src={`http://image.tmdb.org/t/p/original${ movie?.backdrop_path}`} alt={movie?.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-6 md:p-8 lg:absolute lg:bottom-0 lg:left-0 lg:w-1/2 bg-gradient-to-t lg:bg-gradient-to-r from-gray-100 to-transparent lg:from-gray-100 lg:via-gray-100/80 lg:to-transparent lg:rounded-r-xl z-10">
                <h1 className="text-3xl md:text-5xl font-bold text-indigo-600 mb-4 drop-shadow-lg">{movie?.title}</h1>
                <p className="text-gray-800 text-base md:text-lg leading-relaxed mb-6 line-clamp-2 max-h-1/4">{movie?.overview}</p>
                <div className="flex flex-wrap items-center space-x-4 mb-6">
                    
                    <Link href={movie?.media_type === 'movie'?`home/watch/movie/${movie?.id}`:`home/watch/series/${movie?.id}`} className={cn("bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-full flex items-center shadow-lg transform hover:scale-105 transition duration-300")}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
                        </svg>
                        Watch now
                    </Link>
                    
                    <span className="text-gray-800 text-sm md:text-base bg-white px-4 py-2 rounded-full border border-indigo-600 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h.01M12 11h.01M15 11h.01M7 15h.01M11 15h.01M15 15h.01M17 19H7a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v12a2 2 0 01-2 2z" />
                        </svg>
                        {new Date(movie?.media_type === 'movie'?movie?.release_date:movie?.first_air_date).toDateString()}
                    </span>
                    <span className="text-gray-800 text-sm md:text-base flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                        </svg>
                        {movie?.vote_average.toFixed(1)}
                    </span>
                </div>
            </div>
            
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
                {
                    Array.from({length: 7}).map((_,index)=>(
                        <span className={cn("h-3 w-3 bg-indigo-300 rounded-full", {"bg-indigo-600":movieIndex == index})} key={`top${index}`} onClick={()=>loadMovieSilde(index)}></span>
                        
                    ))
                }
                
            </div>
        </section>
    )
}

export default Hero;