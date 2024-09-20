
'use client'

import { MovieResponse } from "@/app/types/moviedbresponse";
import MovieList from "@/components/movielist";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";

const Page = () =>{
    const [page, setPage] = useState<number>(1);
    const [query, setQuery] = useState<string>('');
    const [primaryReleaseYear, setPrimaryReleaseYear] = useState<number>(2021);
    const [movies, setMovies] = useState<MovieResponse>();
    const [loading, setLoading] = useState<boolean>(false);
    useEffect(()=>{
        setLoading(true);
        if(query === "" || !query){
            axios.get<MovieResponse>(`/api/series/popular?page=${page}`).then((res)=>{
                setMovies(res.data);
                setLoading(false);
            }).catch((err)=>{
                console.log(err);
                setLoading(false);
            })
        }
    },[query, page])
    const search = ()=>{
        if(query){
            setLoading(true);
            // search movies
            axios.get<MovieResponse>(`/api/series/filter?query=${query}&page=${page}&primaryReleaseYear=${primaryReleaseYear}`).then((res)=>{
                setMovies(res.data);
                setLoading(false);
            }).catch((err)=>{
                console.log(err);
                setLoading(false);
            })
        }
    }
    return(
       <div>
              <div className="flex justify-center items-center">
                <Input type="text" placeholder="Search series" className="w-1/2 p-2 border-2 border-gray-200 rounded-lg" onChange={(e)=>setQuery(e.target.value)}/>
                <Button onClick={()=>search}>Search</Button>
              </div>
              <div className="my-10">
                <h1 className="font-extrabold">Series</h1>
              </div>
              <hr className="my-5"/>
              <div className="w-full">
                {
                    loading && <Loader className="w-5 h-5 animate-spin mx-auto"/>
                }
                {
                    !loading && movies && <MovieList movies={movies} mediaType="tv"/>
                }
                <div className="flex items-center justify-center gap-2 my-2">
                    <Button onClick={()=>page < 1 ? setPage(page-1):-1} className="bg-indigo-700 text-white">Previous</Button>
                    <span>{page}/{movies?.total_pages}</span>
                    <Button onClick={()=>page < movies?.total_pages?setPage(page+1):-1} className="bg-indigo-700 text-white">Next</Button>
                </div>
              </div>
       </div>
    )
}

export default Page;