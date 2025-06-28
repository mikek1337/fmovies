import { MovieResponse } from "@/app/types/moviedbresponse"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { FC } from "react"
interface MovieListProps{
    movies: MovieResponse,
    mediaType?: string,
}
const MovieList:FC<MovieListProps> = ({movies, mediaType}) => {
    return(
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">

            {movies.results?.map((movie)=>(
                <Link href={`/home/watch/${mediaType==='tv'?'series':'movie'}/${movie.id}`} key={movie.id}>
                <div className="bg-gray-100 rounded-lg shadow-xl overflow-hidden transform hover:scale-105 transition duration-300 group">
                    <div className="relative w-full h-64 md:h-72 lg:h-80">
                        <Image src={`http://image.tmdb.org/t/p/original${ movie?.poster_path}`} alt={ mediaType==='movie'?movie?.title:movie.name} className="w-full h-full object-cover" width={300} height={500}/>
                        <span className={cn("absolute top-2 left-2 bg-indigo-500 text-white text-xs font-semibold px-2 py-1 rounded-full ",{'capitalize':mediaType==='movie'})}>{mediaType==="tv"?"TV Show":movie.media_type}</span>
                    </div>
                    <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition duration-300">{mediaType==='movie'?movie?.title:movie.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{movie?.geners?.join(',')}</p>
                    </div>
                </div>
                </Link>

            ))}
        </div>
    )

}

export default MovieList