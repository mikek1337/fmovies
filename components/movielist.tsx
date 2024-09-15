import { MovieResponse } from "@/app/types/moviedbresponse"
import { Play } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { FC } from "react"
interface MovieListProps{
    movies: MovieResponse,
    mediaType?: string,
}
const MovieList:FC<MovieListProps> = ({movies, mediaType}) => {
    return(
        <div className="grid grid-cols-8 gap-5">
            {movies.results?.map((movie)=>(
                <Link href={`/home/watch/${movie.media_type==='tv'?'series':'movie'}/${movie.id}`} key={movie.id}>
                <div className="border h-fit">
                    <div className="relative rounded-md group w-full">
                        <Image src={`http://image.tmdb.org/t/p/w500${movie.poster_path}`} className='object-contain  rounded-md w-full' width={500} height={500} alt={movie.title}/>
                        <span className="absolute top-1 right-1 text-xs font-semibold bg-indigo-900 text-white rounded-lg px-1">{mediaType=='tv'?"TV":"Movie"}</span>
                        
                    </div>
                    <div className="flex items-center">
                        <span className="font-semibold">{mediaType=="tv"?movie.name:movie.title}</span>
                    </div>
                </div>
                </Link>

            ))}
        </div>
    )

}

export default MovieList