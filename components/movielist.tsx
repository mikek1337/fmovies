import { MovieResponse } from "@/app/types/moviedbresponse"
import Image from "next/image"
import Link from "next/link"
import { FC } from "react"
import { Star } from "lucide-react"

interface MovieListProps {
    movies: MovieResponse
    mediaType?: string
}

const MovieList: FC<MovieListProps> = ({ movies, mediaType }) => {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {movies.results?.map((movie) => {
                const title = mediaType === "tv" ? movie.name : movie.title;
                const date = movie.release_date || movie.first_air_date || "";
                const type = mediaType || movie.media_type || "movie";

                return (
                    <Link
                        href={`/home/watch/${type === "tv" ? "series" : "movie"}/${movie.id}`}
                        key={movie.id}
                        className="group"
                    >
                        <div className="formovies-card">
                            <div className="aspect-[2/3] relative overflow-hidden">
                                <Image
                                    src={`https://image.tmdb.org/t/p/w500${movie?.poster_path}`}
                                    alt={title || ""}
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    fill
                                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-formovies-dark via-transparent to-transparent" />
                                <span className="absolute top-2 left-2 px-2 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-formovies-gold/20 text-formovies-gold border border-formovies-gold/30 backdrop-blur-sm">
                                    {type === "tv" ? "Series" : "Movie"}
                                </span>
                                {movie.vote_average && (
                                    <span className="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-black/40 backdrop-blur-sm text-[10px] font-semibold text-formovies-gold">
                                        <Star className="size-3 fill-formovies-gold" />
                                        {movie.vote_average.toFixed(1)}
                                    </span>
                                )}
                            </div>
                            <div className="p-3">
                                <h3 className="font-body text-sm font-semibold text-white/90 line-clamp-1 group-hover:text-formovies-gold transition-colors duration-300">
                                    {title}
                                </h3>
                                {date && (
                                    <p className="text-[11px] text-white/40 mt-1">
                                        {new Date(date).toDateString().slice(4, 10)}
                                    </p>
                                )}
                            </div>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
};

export default MovieList;
