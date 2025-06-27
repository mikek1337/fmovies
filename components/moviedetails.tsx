"use client"
import { movieDetail } from "@/lib/tmd"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Loader2, Star } from "lucide-react"
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
        queryKey:["movie"],
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
    },[])

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
        <div className="flex md:flex-row flex-col  justify-between  rounded-md bg-white mb-6 ">
            <div className=" border  mx-auto md:mx-0 relative bg-gray-600 rounded-md max-h-[600px]">
                    <span className="text-white bg-indigo-500 absolute px-2 rounded-full left-1 text-sm top-1">{movieDetails.genres[0].name}</span>
                    <Image src={`http://image.tmdb.org/t/p/w500${movieDetails.poster_path}`} className=' h-full rounded-md object-cover' width={400} height={900} alt={movieDetails.name!}/>
            </div>
            <div className="flex flex-col gap-2  md:px-4 md:max-w-[70%] ">
                <div className="flex items-center justify-between flex-wrap">
                    <div className="flex flex-col gap-2">
                        <span className="text-4xl font-bold text-gray-900 leading-tight">{movieDetails.title}</span>
                        <span className="text-sm  font-semibold bg-indigo-100 text-indigo-600 rounded-full px-3 w-fit">Movie</span>
                    </div>
                        <MediaOptions mediaId={movieDetails.id} mediaType="movie" poster_url={movieDetails.poster_path} title={movieDetails.title}/>
                </div>
                <div className="flex flex-col  ">
                <div className="mb-10">
                    <p className="text-gray-700 text-base leading-relaxed mb-6">{movieDetails.overview}</p>
                </div>
                    <div className="grid  md:grid-cols-2 text-gray-600 ">
                        <div className="flex flex-col gap-2">
                            <div className="flex w-fit items-center space-x-2">
                                <span className="font-semibold text-gray-800 text-sm md:text-base">Gener:</span>
                                <div className="space-x-2  items-center">
                                {movieDetails.genres.map((gener)=>(
                                <span className="bg-gray-200 text-gray-700 rounded-full px-2 text-xs font-medium " key={gener.id}>{gener.name}</span>
                            ))}</div></div>
                            <div className="flex  w-full items-center space-x-2">
                                <span className="font-semibold text-gray-800 text-sm md:text-base">Country:</span>
                                <div className="flex flex-wrap space-x-2  items-center">
                                {movieDetails.production_countries.map(country=>(
                                <span className="rounded-full px-2 text-xs" key={country.iso_3166_1}>{country.name}</span>
                            ))}</div></div>
                            <div className="flex items-center space-x-2">
                                <span className="font-semibold text-gray-800 text-sm md:text-base">Runtime:</span>
                                <span className="text-start text-xs">
                                {`${movieDetails.runtime} min`}
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex  w-full items-center space-x-2 ">
                                <span className="font-semibold text-gray-800 text-sm md:text-base">Production:</span>
                                <div className="flex flex-wrap gap-2  items-center">
                                {movieDetails.production_companies.map(prod=>(
                                <span className=" px-2 text-xs" key={prod.id}>{prod.name}</span>
                            ))}</div>

                                </div>

                                <div className="flex items-center space-x-2">
                            <span className="font-semibold text-gray-800 text-sm md:text-base">Release Date:</span>
                            <span className="text-start text-xs">
                            {new Date(movieDetails.release_date!).toDateString()}
                            </span> 

                            </div>
                            
                            <div className="flex items-center space-x-2">
                                <span className="font-semibold text-gray-800">Rating:</span> 
                                <span className="flex items-center gap-1 text-xs">
                                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                                {movieDetails.vote_average.toFixed(1)}/10
                                </span>
                            </div>
                            
                        </div>

                    </div>
                </div>
            </div>
        </div>
        
       
    )
}

export default MovieDetails;