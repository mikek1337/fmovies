import { MovieDetail } from "@/app/types/moviedbresponse"
import Image from "next/image"
import { FC } from "react"
import MediaOptions from "./mediaoptions"
import { Star } from "lucide-react"
interface MovieDetailsProps{
    seriesDetails:MovieDetail,
}
const SeriesDetails:FC<MovieDetailsProps> = ({seriesDetails})=>{
 
    return(
        <div className="flex md:flex-row flex-col rounded-md bg-white mb-6 p-10">
            <div className=" border  mx-auto md:mx-0 relative bg-gray-600 rounded-md max-h-[600px]">
                    <span className="text-white bg-indigo-500 absolute px-2 rounded-full left-1 text-sm top-1">{seriesDetails.genres[0].name}</span>
                    <Image src={`http://image.tmdb.org/t/p/w500${seriesDetails.poster_path}`} className=' h-full rounded-md object-cover' width={400} height={400} alt={seriesDetails.name!}/>
            </div>
            <div className="flex flex-col gap-2  md:px-4 md:max-w-[60%] ">
                <div className="flex items-center justify-between flex-wrap">
                    <div className="flex flex-col gap-2">
                        <span className="text-4xl font-bold text-gray-900 leading-tight">{seriesDetails.name}</span>
                        <span className="text-sm  font-semibold bg-indigo-100 text-indigo-600 rounded-full px-3 w-fit">TV Show</span>
                    </div>
                        <MediaOptions mediaId={seriesDetails.id} mediaType="movie" poster_url={seriesDetails.poster_path} title={seriesDetails.title}/>
                </div>
                <div className="flex flex-col  ">
                <div className="mb-10">
                    <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-6">{seriesDetails.overview}</p>
                </div>
                    <div className="grid  md:grid-cols-2 text-gray-600 ">
                        <div className="flex flex-col gap-2">
                            <div className="flex w-fit items-center space-x-2">
                                <span className="font-semibold text-gray-800 text-sm md:text-base">Gener:</span>
                                <div className="space-x-2  items-center">
                                {seriesDetails.genres.map((gener)=>(
                                <span className="bg-gray-200 text-gray-700 rounded-full px-2 text-xs font-medium " key={gener.id}>{gener.name}</span>
                            ))}</div></div>
                            <div className="flex  w-full items-center space-x-2">
                                <span className="font-semibold text-gray-800 text-sm md:text-base">Country:</span>
                                <div className="flex flex-wrap space-x-2  items-center">
                                {seriesDetails.production_countries.map(country=>(
                                <span className="rounded-full px-2 text-xs" key={country.iso_3166_1}>{country.name}</span>
                            ))}</div></div>
                            <div className="flex items-center space-x-2">
                                <span className="font-semibold text-gray-800 text-sm md:text-base">Runtime:</span>
                                <span className="text-start text-xs">
                                {`${seriesDetails.last_episode_to_air.runtime!} min`}
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex  w-full items-center space-x-2 ">
                                <span className="font-semibold text-gray-800 text-sm md:text-base">Production:</span>
                                <div className="flex flex-wrap gap-2  items-center">
                                {seriesDetails.production_companies.map(prod=>(
                                <span className=" px-2 text-xs" key={prod.id}>{prod.name}</span>
                            ))}</div>

                                </div>

                                <div className="flex items-center space-x-2">
                            <span className="font-semibold text-gray-800 text-sm md:text-base">Release Date:</span>
                            <span className="text-start text-xs">
                            {new Date(seriesDetails.first_air_date!).toDateString()}
                            </span> 

                            </div>
                            
                            <div className="flex items-center space-x-2">
                                <span className="font-semibold text-gray-800">Rating:</span> 
                                <span className="flex items-center gap-1 text-xs">
                                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                                {seriesDetails.vote_average.toFixed(1)}/10
                                </span>
                            </div>
                            
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default SeriesDetails;