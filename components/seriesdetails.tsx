'use client'
import { MovieDetail } from "@/app/types/moviedbresponse"
import Image from "next/image"
import { FC, useEffect } from "react"
import MediaOptions from "./mediaoptions"
import { useMutation } from "@tanstack/react-query"
import { RecentlyViewedType } from "@/app/types/recentlyViewed"
import axios, {AxiosError} from "axios"
interface MovieDetailsProps{
    seriesDetails:MovieDetail,
}
const SeriesDetails:FC<MovieDetailsProps> = ({seriesDetails})=>{
    const {mutate} = useMutation({
        mutationKey:["seriesmutate", seriesDetails.id],
        mutationFn: async(recentlyViewed:RecentlyViewedType)=>{
            return (await axios.post('/api/movies/recentlyviewed/post', recentlyViewed));
        },
        onError: (error)=>{
            if(error instanceof AxiosError){
                if(error.status === 500){
                    console.log("Internal Server Error");
                }
            }
        }
    });

    useEffect(()=>{
        mutate({
            id: seriesDetails.id.toString(),
            media_type: "tv",
            poster_path: seriesDetails.backdrop_path,
            title: seriesDetails.original_name
        });
    }, [])

    return(
        <div className="flex shadow-md  p-2 md:flex-row flex-col" >
        <div className="flex md:flex-row flex-col gap-2 w-full max-w-[1200px]  px-1">
            <div className="md:w-fit md:h-fit border  ">
                
                    <Image src={`http://image.tmdb.org/t/p/w500${seriesDetails.poster_path}`} className='object-contain md:w-[200px] md:h-[300px]   rounded-md' width={500} height={500} alt={seriesDetails.name!}/>
                </div>
            <div className="w-fit">
                <span className="font-extrabold flex items-center gap-2 md:text-5xl text-3xl">{seriesDetails.original_name} 
                <span className="text-xs md:text-base font-bold bg-indigo-600 text-white rounded-full px-3">TV</span>
                </span>
                <p className="md:max-w-[700px] sm:max-w-[400px]  text-xs md:text-base ">{seriesDetails.overview}</p>
                <div className="flex flex-col ">
                    <div className="flex flex-col gap-1 text-xs my-1">
                        <div className="flex w-fit items-center gap-2">
                            <span>Gener:</span>
                            <div className="grid md:grid-cols-4 grid-cols-2 gap-2  items-center">
                            {seriesDetails.genres.map((gener)=>(
                            <span className="bg-zinc-200 rounded-full px-2" key={gener.id}>{gener.name}</span>
                        ))}</div></div>
                        <div className="flex  w-full items-center gap-2 ">
                            <span className="col-span-1">Production:</span>
                            <div className="flex flex-wrap gap-2  items-center">
                            {seriesDetails.production_companies.map(prod=>(
                            <span className="rounded-full w-fit   px-2" key={prod.id}>{prod.name}</span>
                        ))}</div>

                            </div>
                        <div className="flex  w-full items-center gap-2">
                            <span>Country:</span>
                            <div className="flex flex-wrap gap-2  items-center">
                            {seriesDetails.production_countries.map(country=>(
                            <span className="bg-zinc-200 rounded-full px-2" key={country.iso_3166_1}>{country.name}</span>
                        ))}</div></div>
                    </div>
                    <div className="flex flex-col text-xs px-1">
                        <div className="flex items-center ">
                        <span>Release Date:</span>
                        <span className="text-start">
                        {new Date(seriesDetails.first_air_date!).toDateString()}
                        </span> 

                        </div>
                        <div className="flex items-center ">
                            <span>Runtime:</span>
                            <span className="text-start">
                            {`40 min`}
                            </span>
                        </div>
                        <div className="flex items-center ">
                            <span>Rating:</span> 
                            <span>
                            {seriesDetails.vote_average.toFixed(1)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <MediaOptions mediaId={seriesDetails.id} mediaType="tv" poster_url={seriesDetails.backdrop_path} title={seriesDetails.title}/>
        </div>
    )
}

export default SeriesDetails;