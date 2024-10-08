"use client";

import { MovieResponse } from "@/app/types/moviedbresponse";
import MovieList from "@/components/movielist";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
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
    <div>
      <div className="flex items-center gap-2 max-w-[500px] justify-center my-3">
        <Input type="text" placeholder="Search Movies"/>
        <Button variant="default" className="flex items-center gap-2">
          <Search className="w-5 h-5"/>
          Search
        </Button>
      </div>
    <div className="px-4">
        {
          !isLoading && popularMovies && (<MovieList movies={popularMovies}/>)
        }
      </div>
      <div className="flex flex-wrap items-center gap-2 justify-center my-3">
        <Button variant="ghost" className="flex items-center gap-2" onClick={()=>page > 0?setPage(prev=>prev - 1):page}>
        <ChevronLeft className="w-5 h-5"/>
        Prev
        </Button>
        <span className="text-sm text-zinc-400">{page}</span>
        <Button variant="ghost" className="flex items-center gap-2" onClick={()=>popularMovies?.total_pages >= page?setPage(prev=>prev + 1):page}>
        <ChevronRight className="w-5 h-5"/>
        Next
        </Button>
        </div>
      
  </div>);
}

export default Page;
