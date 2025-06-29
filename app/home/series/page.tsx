
'use client'

import { MovieResponse } from "@/app/types/moviedbresponse";
import CustomCard from "@/components/customcard";
import SelectGener from "@/components/selectgener";
import SelectYear from "@/components/selectyear";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import axios from "axios";
import { Loader, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const Page = () =>{
    const [page, setPage] = useState<number>(1);
    const [query, setQuery] = useState<string>('');
    const [primaryReleaseYear, setPrimaryReleaseYear] = useState<string[]>();
    const [movies, setMovies] = useState<MovieResponse>();
    const [loading, setLoading] = useState<boolean>(false);
    const [gener, setGener] = useState<string[]>([]);
    const getSelectedGener = (value:string)=>{
        setGener([value]);
        console.log(value);
    }
    const getSelectedYear = (value:string)=>{
        setPrimaryReleaseYear([value]);
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
    },[page])
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
       <div className="container mx-auto my-5 ">
              <div className="grid grid-cols-12 items-center  my-5 gap-2 shadow-md rounded-md bg-white p-5 flex-wrap">
                <Input type="text" placeholder="Search series..." className="col-span-4  border-2 border-gray-200 rounded-lg p-5 placeholder:text-base font-medium" onChange={(e)=>setQuery(e.target.value)}/>
                <SelectGener onValueChange={getSelectedGener} className="col-span-3 w-full" />
                <SelectYear onValueChange={getSelectedYear} className="col-span-3 w-full"/>
                <Button onClick={()=>search()} className="bg-indigo-600 text-white gap-2 col-2 ">Search <Search className="w-5 h-5"/></Button>
              </div>
              <div className={cn("w-full px-3", {"min-h-screen":loading})}>
                {
                    loading && <Loader className="w-5 h-5 animate-spin m-auto"/>
                }
                {
                    !loading && movies && (
                    <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-5">
                        {movies.results.map((movie)=>(
                            <Link href={`/home/watch/series/${movie.id}`} key={movie.id}>
                                <CustomCard title={movie.name} overview={movie.overview} image={`http://image.tmdb.org/t/p/w500${movie.poster_path}`} id={movie.id} mediaType="tv"/>
                            </Link>
                        ))}
                    </div>
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