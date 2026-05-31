'use client'
import { MovieResponse } from "@/app/types/moviedbresponse";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { Play, Star, Calendar } from "lucide-react";

interface HeroProps {
    movies: MovieResponse
}

const Hero: FC<HeroProps> = ({ movies }) => {
    const [movieIndex, setMovieIndex] = useState(0);
    const [movie, setMovie] = useState(movies.results[movieIndex]);

    useEffect(() => {
        let index = movieIndex;
        const interval = setInterval(() => {
            if (movies.results[index]?.media_type === "person") {
                index++;
            }
            loadMovieSlide(index);
            index++;
            if (index > 6) {
                index = 0;
            }
        }, 10000);
        return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadMovieSlide = (index: number) => {
        setMovie(movies.results[index]);
        setMovieIndex(index);
    };

    if (!movie) return null;

    const title = movie.title || movie.name || "";
    const date = movie.release_date || movie.first_air_date || "";
    const media_type = movie.media_type || "movie";

    return (
        <section className="relative overflow-hidden rounded-2xl mb-16 mt-6 group">
            <div className="absolute inset-0 bg-formovies-deeper/60 z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-formovies-dark via-formovies-dark/60 to-transparent z-10" />

            <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-1000 scale-105 group-hover:scale-100"
                style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${movie?.backdrop_path})` }}
            />

            <div className="relative z-20 flex flex-col justify-end min-h-[500px] md:min-h-[600px] p-8 md:p-16">
                <div className="max-w-2xl animate-fade-in-up">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wider bg-formovies-gold/20 text-formovies-gold border border-formovies-gold/30">
                            {media_type === "tv" ? "Series" : "Movie"}
                        </span>
                        {date && (
                            <span className="flex items-center gap-1.5 text-xs text-white/50">
                                <Calendar className="size-3.5" />
                                {new Date(date).toDateString()}
                            </span>
                        )}
                        {movie?.vote_average && (
                            <span className="flex items-center gap-1 text-xs text-white/50">
                                <Star className="size-3.5 text-formovies-gold fill-formovies-gold" />
                                {movie.vote_average.toFixed(1)}
                            </span>
                        )}
                    </div>

                    <h1 className="font-display text-5xl md:text-7xl tracking-wide text-white mb-4 leading-tight">
                        {title}
                    </h1>

                    <p className="text-white/60 text-sm md:text-base leading-relaxed line-clamp-2 mb-8 max-w-xl">
                        {movie?.overview}
                    </p>

                    <div className="flex items-center gap-4">
                        <Link
                            href={`/home/watch/${media_type === "tv" ? "series" : "movie"}/${movie?.id}`}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-formovies-gold text-formovies-dark font-semibold text-sm hover:bg-formovies-amber transition-all duration-300"
                        >
                            <Play className="size-4 fill-current" />
                            Watch Now
                        </Link>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                {Array.from({ length: 7 }).map((_, index) => (
                    <button
                        key={`dot-${index}`}
                        onClick={() => loadMovieSlide(index)}
                        className={cn(
                            "h-1.5 rounded-full transition-all duration-300",
                            movieIndex === index
                                ? "w-8 bg-formovies-gold"
                                : "w-1.5 bg-white/30 hover:bg-white/50"
                        )}
                    />
                ))}
            </div>
        </section>
    );
};

export default Hero;
