
'use client'

import { MovieResponse } from "@/app/types/moviedbresponse";
import MovieList from "@/components/movielist";
import SelectGener from "@/components/selectgener";
import SelectYear from "@/components/selectyear";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import axios from "axios";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";

const Page = () =>{
    const [page, setPage] = useState<number>(1);
    const [query, setQuery] = useState<string>('');
    const [primaryReleaseYear, setPrimaryReleaseYear] = useState<string[]>();
    const [movies, setMovies] = useState<MovieResponse>();
    const [loading, setLoading] = useState<boolean>(false);
    const [gener, setGener] = useState<string[]>([]);
    const getSelectedGener = (value:string[])=>{
        setGener(value);
        console.log(value);
    }
    const getSelectedYear = (value:string[])=>{
        setPrimaryReleaseYear(value);
    }
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
        console.log(gener)
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
              <div className="flex  items-center my-5 gap-2 flex-wrap">
                <Input type="text" placeholder="Search series" className="w-1/5 p-2 border-2 border-gray-200 rounded-lg" onChange={(e)=>setQuery(e.target.value)}/>
                <SelectGener onValueChange={getSelectedGener}/>
                <SelectYear onValueChange={getSelectedYear}/>
                <Button onClick={()=>search}>Search</Button>
              </div>
              
              <hr className="my-5"/>
              <div className={cn("w-full px-3", {"min-h-screen":loading})}>
                {
                    loading && <Loader className="w-5 h-5 animate-spin mx-auto"/>
                }
                {
                    !loading && movies && (
                    <>
                        <MovieList movies={movies} mediaType="tv"/>
                    <div className="flex items-center justify-center gap-2 my-2">
                        <Button onClick={()=>page < 1 ? setPage(page-1):-1} className="bg-indigo-700 text-white">Previous</Button>
                        <span>{page}/{movies?.total_pages}</span>
                        <Button onClick={()=>movies?.total_pages && page < movies?.total_pages?setPage(page+1):-1} className="bg-indigo-700 text-white">Next</Button>
                    </div>
                    </>
                )
                }
              </div>
       </div>
    )
}

export default Page;