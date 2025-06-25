"use client"
import { movieDetail } from "@/lib/tmd"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import Image from "next/image"
import { FC, useEffect } from "react"
import MediaOptions from "./mediaoptions"
import { RecentlyViewedType } from "@/app/types/recentlyViewed"
import axios from "axios"
interface MovieDetailsProps{
    id:number,
}
const MovieDetails:FC<MovieDetailsProps> = ({id})=>{
    
    const {data:movieDetails, isLoading} = useQuery({
        queryKey:["movie", id],
        queryFn: async()=>{
            return await(await movieDetail(id)).data
        },
        retry:true,
    });
    const {mutate} = useMutation({
        mutationKey:["moviemutate", id],
        mutationFn: async(recentlyViewed:RecentlyViewedType)=>{
            return (await axios.post('/api/movies/recentlyviewed/post', recentlyViewed)).data;
        },
    })
    useEffect(()=>{
        if(movieDetails){
            mutate({
                id:movieDetails.id.toString(),
                title:movieDetails.title,
                media_type:"movie",
                poster_path:movieDetails.poster_path,
            })
        }
    },[movieDetails])

    if(isLoading && !movieDetails)
    {
        return(
        <div className="max-w-[1200px] flex items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin"/>
        </div>)
    }
    if(!movieDetails)
    {
        return(
            <div className="max-w-[1200px] flex items-center justify-center">
                <h1 className="text-xl">No Movie Found</h1>
            </div>
        )
    }
    return(
        <div className="flex shadow-md  p-2 md:flex-row flex-col" >
        <div className="flex md:flex-row flex-col gap-2 w-full max-w-[1200px]  px-1">
            <div className="md:w-fit md:h-fit border  ">
                
                    <Image src={`http://image.tmdb.org/t/p/w500${movieDetails.poster_path}`} className='object-contain md:w-[200px] md:h-[300px]   rounded-md' width={500} height={500} alt={movieDetails.name!}/>
                </div>
            <div className="w-fit">
                <span className="font-extrabold flex items-center gap-2 md:text-5xl text-3xl">{movieDetails.title} 
                <span className="text-xs md:text-base font-bold bg-indigo-600 text-white rounded-full px-3">Movie</span>
                </span>
                <p className="md:max-w-[700px] sm:max-w-[400px]  text-xs md:text-base ">{movieDetails.overview}</p>
                <div className="flex flex-col ">
                    <div className="flex flex-col gap-1 text-xs my-1">
                        <div className="flex w-fit items-center gap-2">
                            <span>Gener:</span>
                            <div className="grid md:grid-cols-4 grid-cols-2 gap-2  items-center">
                            {movieDetails.genres.map((gener)=>(
                            <span className="bg-zinc-200 rounded-full px-2" key={gener.id}>{gener.name}</span>
                        ))}</div></div>
                        <div className="flex  w-full items-center gap-2 ">
                            <span className="col-span-1">Production:</span>
                            <div className="flex flex-wrap gap-2  items-center">
                            {movieDetails.production_companies.map(prod=>(
                            <span className="bg-zinc-200 rounded-full px-2" key={prod.id}>{prod.name}</span>
                        ))}</div>

                            </div>
                        <div className="flex  w-full items-center gap-2">
                            <span>Country:</span>
                            <div className="flex flex-wrap gap-2  items-center">
                            {movieDetails.production_countries.map(country=>(
                            <span className="bg-zinc-200 rounded-full px-2" key={country.iso_3166_1}>{country.name}</span>
                        ))}</div></div>
                    </div>
                    <div className="flex flex-col text-xs px-1">
                        <div className="flex items-center ">
                        <span>Release Date:</span>
                        <span className="text-start">
                        {new Date(movieDetails.release_date!).toDateString()}
                        </span> 

                        </div>
                        <div className="flex items-center ">
                            <span>Runtime:</span>
                            <span className="text-start">
                            {`${movieDetails.runtime} min`}
                            </span>
                        </div>
                        <div className="flex items-center ">
                            <span>Rating:</span> 
                            <span>
                            {movieDetails.vote_average.toFixed(1)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <MediaOptions mediaId={movieDetails.id} mediaType="movie" poster_url={movieDetails.poster_path} title={movieDetails.title}/>
        </div>
    )
}

export default MovieDetails;