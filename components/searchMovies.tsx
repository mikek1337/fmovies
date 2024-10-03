"use client"
import { FC, useEffect, useState } from "react";
import { CommandDialog, CommandEmpty, CommandInput, CommandItem } from "./ui/command";
import { MovieResponse } from "@/app/types/moviedbresponse";
import Image from "next/image";
import { Calendar, Loader, Stars } from "lucide-react";
import Link from "next/link";
import axios from "axios";
interface SearchMoviesProps{
    isOpen?:boolean;
    onOpenChange?:()=>void;

}
const SearchMovies:FC<SearchMoviesProps> =({isOpen, onOpenChange})=>{
  const [query, setQuery] = useState<string>("");
  const [movies, setMovies] = useState<MovieResponse>();
  const [loading, setLoading] = useState<boolean>(false);
  const search = (queryString:string)=>{
    if(queryString){
        setQuery(queryString);
        setLoading(true);
   
    }
  }
  useEffect(()=>{
    if(query != ""){
        setLoading(true);
        axios.get<MovieResponse>(`/api/movies/search?query=${query}`).then((res)=>{
            setMovies(res.data);
            setLoading(false);
        }
        ).catch((err)=>{
            console.log(err);
            setLoading(false);
        })
    }
  },[query])
    return (
        <CommandDialog open={isOpen} onOpenChange={onOpenChange}>
            <CommandInput placeholder="Search Movies, Tv series...." onValueChange={search} />
            {loading && <Loader className="w-4 h-4 animate-spin"/>}
            
                {
                    movies?.results.length === 0 && (
                        <CommandEmpty>No Movies or Series found</CommandEmpty>
                    )
                }
                
                    
                    {movies?.results.map((movie)=>(
                        <CommandItem key={movie?.id}>
                            <Link href={`/home/watch/${movie.media_type==='tv'?'series':'movie'}/${movie.id}`} className="flex gap-2">
                            <Image src={`http://image.tmdb.org/t/p/w500${movie?.poster_path}`} className="w-[50px] h-[50px] rounded-lg" width={500} height={500} alt={movie?.title}/>
                            <div className="flex flex-col gap-2">
                                <span className="text-xs font-semibold">{movie?.media_type=="tv"?movie?.name:movie?.title}</span>
                                <div className="flex items-center gap-4">
                                    <span className="flex items-center gap-2 text-xs font-semibold">
                                        <Stars className="w-4 h-4 fill-yellow-500"/>
                                        {movie?.vote_average}
                                    </span>
                                    <span className="flex items-center gap-2 text-xs font-semibold">
                                        <Calendar className="w-4 h-4"/>
                                        {new Date(movie?.media_type=="movie"?movie?.release_date:movie?.first_air_date).toDateString()}
                                    </span>
                                    <span className="text-xs rounded-full px-2 bg-indigo-600 text-white capitalize font-semibold">{movie?.media_type}</span>
                                </div>
                            </div>
                            </Link>
                        </CommandItem>
                    ))}
                
            
        </CommandDialog>
    )
}

export default SearchMovies;