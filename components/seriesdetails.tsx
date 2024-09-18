import { MovieDetail } from "@/app/types/moviedbresponse"
import { movieDetail } from "@/lib/tmd"
import Image from "next/image"
import { FC, useState } from "react"
interface MovieDetailsProps{
    seriesDetails:MovieDetail,
}
const SeriesDetails:FC<MovieDetailsProps> = ({seriesDetails})=>{
 
    return(
        <div className="flex w-screen gap-2justify-evenly p-10 my-10 shadow-md ">
            <div className="flex gap-10 w-full">
                <div className="w-fit">
                    <Image src={`http://image.tmdb.org/t/p/w500${seriesDetails.poster_path}`} className='object-contain w-[200px] h-[300px]   rounded-md' width={500} height={500} alt={seriesDetails.name}/>
                </div>
                <div className="w-fit">
                    <span className="font-semibold">{seriesDetails.name}</span>
                    <p className="max-w-[500px]">{seriesDetails.overview}</p>
                    <div className="flex justify-between gap-2">
                        <div>
                            <span className="grid grid-cols-3 items-center gap-2">Gener: {seriesDetails.genres.map(gener=>(
                                <span>{gener.name},</span>
                            ))}</span>
                            <span className="grid grid-cols-3 items-center gap-1">Production: {seriesDetails.production_companies.map(prod=>(
                                <span>{prod.name},</span>
                            ))}</span>
                            <span className="flex items-center gap-1">Country: {seriesDetails.production_countries.map(country=>(
                                <span>{country.name},</span>
                            ))}</span>
                        </div>
                    </div>
                </div>
            </div>
                    <div className="flex flex-col self-end">
                        <span>Release Date: {seriesDetails.first_air_date}</span>
                        <span>Runtime: {(seriesDetails.runtime/60).toString().split('.').join(" ")}</span>
                        <span>Rating: {seriesDetails.vote_average.toFixed(1)}</span>
                    </div>
        </div>
    )
}

export default SeriesDetails;