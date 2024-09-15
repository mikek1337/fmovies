"use client"
import { FC, useEffect, useState } from "react";
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";
import { MovieResponse } from "@/app/types/moviedbresponse";
import { searchMulti } from "@/lib/tmd";
import Image from "next/image";
import { Calendar, Loader, Stars } from "lucide-react";
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
      /* setTimeout(()=>{
          searchMulti(query).then((res)=>{
              setMovies(res.data);
              setLoading(false);
          }).catch((err)=>{
              console.log(err);
              setLoading(false);
          })
      },2000) */
    }
  }
  useEffect(()=>{
    if(query != ""){
        setLoading(true);
        searchMulti(query).then((res)=>{
            setMovies(res.data);
            setLoading(false);
        }).catch((err)=>{
            console.log(err);
            setLoading(false);
        })
    }
  },[query])
    return (
        <CommandDialog open={isOpen} onOpenChange={onOpenChange}>
            <CommandInput placeholder="Search Movies, Tv series...." onValueChange={search}/>
            <CommandList>
                {
                    movies?.results.length === 0 && (
                        <CommandEmpty>No Movies or Series found</CommandEmpty>
                    )
                }
                <CommandGroup heading="Suggestions">
                    {loading && <CommandItem><Loader className="w-4 h-4 animate-spin"/></CommandItem>}
                    {movies?.results.map((movie)=>(
                        <CommandItem key={movie?.id} className="flex gap-2">
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
                        </CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    )
}

export default SearchMovies;