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
            <div className="w-full col-span-1">
                <Image src={`http://image.tmdb.org/t/p/w500${movieDetails.poster_path}`} className='object-contain w-[400px] h-[500px]   rounded-md' width={500} height={500} alt={movieDetails.title}/>
            </div>
            <div className="col-span-3 w-full">
                <span className="font-semibold">{movieDetails.title}</span>
                <p className="max-w-[500px]">{movieDetails.overview}</p>
                <div className="grid grid-cols-2 items-center gap-2">
                    <div>
                        <span className="flex items-center gap-2">Gener: {movieDetails.genres.map(gener=>(
                            <span>{gener.name},</span>
                        ))}</span>
                        <span className="flex items-center gap-1">Production: {movieDetails.production_companies.map(prod=>(
                            <span>{prod.name},</span>
                        ))}</span>
                        <span className="flex items-center gap-1">Country: {movieDetails.production_countries.map(country=>(
                            <span>{country.name},</span>
                        ))}</span>
                    </div>
                    <div className="flex flex-col">
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