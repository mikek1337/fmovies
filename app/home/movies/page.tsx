"use client";

import { MovieResponse } from "@/app/types/moviedbresponse";
import CustomCard from "@/components/customcard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const Page = () => {
  //const [movies, setMovies] = useState<MovieResponse>();
  const [page, setPage] = useState(1);
  const {isPending:isLoading, data:popularMovies} = useQuery({
    queryKey: ['movies', page],
    queryFn: async ()=>{
      return await (await axios.get<MovieResponse>(`/api/movies/popular?page=${page}`)).data; 
    }
  })
  return(
    <div className="container mx-auto my-5  ">
      <div className="flex items-center gap-2 max-w-[500px] justify-center my-3">
        <Input type="text" placeholder="Search Movies"/>
        <Button variant="outline" className="flex items-center gap-2 bg-indigo-600 text-white" onClick={()=>toast({title: "Search not implemented yet", description: "This feature is coming soon!"})}>
          Search
          <Search className="w-5 h-5"/>
        </Button>
      </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-5">
       {
        popularMovies?.results.map((movie)=>(
          <Link href={`/home/watch/movie/${movie.id}`} key={movie.id}>
            <CustomCard mediaType="movie" title={movie.title} overview={movie.overview} id={movie.id} key={movie.id} image={`http://image.tmdb.org/t/p/original${movie.poster_path}`}/>
          </Link>
        ))
       }
      </div>
      <div className="flex flex-wrap items-center gap-2 justify-center my-3">
        <Button variant="ghost" className="flex items-center gap-2" onClick={()=>page > 0?setPage(prev=>prev - 1):page}>
        <ChevronLeft className="w-5 h-5"/>
        Prev
        </Button>
        <span className="text-sm text-zinc-400">{page}</span>
        <Button variant="ghost" className="flex items-center gap-2" onClick={()=>popularMovies && popularMovies?.total_pages >= page?setPage(prev=>prev + 1):page}>
        <ChevronRight className="w-5 h-5"/>
        Next
        </Button>
        </div>
      
  </div>);
}

export default Page;
