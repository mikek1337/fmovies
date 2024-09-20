import { movieDetail } from "@/lib/tmd"
import Image from "next/image"
import { FC } from "react"
interface MovieDetailsProps{
    id:number,
}
const MovieDetails:FC<MovieDetailsProps> = async({id})=>{
    const movieDetails = await (await movieDetail(id)).data;
    
    return(
        <div className="flex md:flex-row flex-col gap-2 w-full border px-1">
            <div className="w-fit h-fit border mx-auto ">
                    <Image src={`http://image.tmdb.org/t/p/w500${movieDetails.poster_path}`} className='object-contain w-[200px] md:h-[300px]   rounded-md' width={500} height={500} alt={movieDetails.name}/>
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
                            {movieDetails.genres.map((gener)=>(
                            <span className="bg-zinc-200 rounded-full px-2" key={gener.id}>{gener.name}</span>
                        ))}</div>
                        <div className="grid grid-cols-4   w-full items-center gap-2 border">
                            <span className="col-span-1">Production:</span>
                            {movieDetails.production_companies.map(prod=>(
                            <span className="bg-zinc-200 rounded-full w-fit  px-2" key={prod.id}>{prod.name}</span>
                        ))}</div>
                        <div className="flex w-fit items-center gap-2">
                            <span>Country:</span>
                            {movieDetails.production_countries.map(country=>(
                            <span className="bg-zinc-200 rounded-full px-2" key={country.id}>{country.name}</span>
                        ))}</div>
                    </div>
                    <div className="flex flex-col text-xs">
                        <span>Release Date: {new Date(movieDetails.release_date).toDateString()}</span>
                        <span>Runtime: {(movieDetails.runtime/60).toString().split('.').join(" ")}</span>
                        <span>Rating: {movieDetails.vote_average.toFixed(1)}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MovieDetails;