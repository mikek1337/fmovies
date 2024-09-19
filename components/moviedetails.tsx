import { movieDetail } from "@/lib/tmd"
import Image from "next/image"
import { FC } from "react"
interface MovieDetailsProps{
    id:number,
}
const MovieDetails:FC<MovieDetailsProps> = async({id})=>{
    const movieDetails = await (await movieDetail(id)).data;
    
    return(
        <div className="grid grid-cols-4 justify-between   gap-2 border">
            <div className="w-fit">
                    <Image src={`http://image.tmdb.org/t/p/w500${movieDetails.poster_path}`} className='object-contain w-[200px] h-[300px]   rounded-md' width={500} height={500} alt={movieDetails.name}/>
                </div>
            <div className="col-span-3 w-full">
                <span className="font-semibold flex items-center gap-2 text-3xl">{movieDetails.title} 
                <span className="text-xs font-bold bg-indigo-600 text-white rounded-full px-3">Movie</span>
                </span>
                <p className="max-w-[500px] text-xs">{movieDetails.overview}</p>
                <div className=" my-3 grid grid-cols-2 items-center gap-2">
                    <div className="text-xs">
                        <span className="grid grid-flow-col-dense items-center gap-2">Gener: {movieDetails.genres.map((gener)=>(
                            <span className="bg-zinc-200 rounded-full px-2" key={gener.id}>{gener.name}</span>
                        ))}</span>
                        <span className="grid grid-flow-col-dense items-center gap-2">Production: {movieDetails.production_companies.map(prod=>(
                            <span className="bg-zinc-200 rounded-full  px-2" key={prod.id}>{prod.name}</span>
                        ))}</span>
                        <span className="grid grid-flow-col-dense items-center gap-2">Country: {movieDetails.production_countries.map(country=>(
                            <span className="bg-zinc-200 rounded-full px-2" key={country.id}>{country.name}</span>
                        ))}</span>
                    </div>
                    <div className="flex flex-col text-xs">
                        <span>Release Date: {movieDetails.release_date}</span>
                        <span>Runtime: {(movieDetails.runtime/60).toString().split('.').join(" ")}</span>
                        <span>Rating: {movieDetails.vote_average.toFixed(1)}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MovieDetails;