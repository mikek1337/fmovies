"use client"
import { movieDetail } from "@/lib/tmd"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Loader2, Star, Clock, MapPin, Calendar } from "lucide-react"
import Image from "next/image"
import { FC, useEffect } from "react"
import MediaOptions from "./mediaoptions"
import { RecentlyViewedType } from "@/app/types/recentlyViewed"
import axios from "axios"

interface MovieDetailsProps {
    id: number,
}

const MovieDetails: FC<MovieDetailsProps> = ({ id }) => {
    const { data: movieDetails, isLoading } = useQuery({
        queryKey: ["movie", id],
        queryFn: async () => {
            return await (await movieDetail(id)).data
        },
        retry: true,
    });

    const { mutate } = useMutation({
        mutationKey: ["moviemutate", id],
        mutationFn: async (recentlyViewed: RecentlyViewedType) => {
            return (await axios.post('/api/movies/recentlyviewed/post', recentlyViewed)).data;
        },
    })

    useEffect(() => {
        if (movieDetails) {
            mutate({
                id: movieDetails.id.toString(),
                title: movieDetails.title,
                media_type: "movie",
                poster_path: movieDetails.poster_path,
            })
        }
    }, [id, movieDetails, mutate])

    if (isLoading && !movieDetails) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="size-8 animate-spin text-formovies-gold" />
            </div>
        )
    }

    if (!movieDetails) {
        return (
            <div className="flex items-center justify-center py-20">
                <h1 className="text-xl text-white/50 font-body">Movie Not Found</h1>
            </div>
        )
    }

    return (
        <div className="grid md:grid-cols-[300px_1fr] gap-8">
            <div className="relative aspect-[2/3] rounded-xl overflow-hidden formovies-card">
                <Image
                    src={`https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`}
                    alt={movieDetails.title}
                    fill
                    className="object-cover"
                    sizes="300px"
                />
                <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-formovies-gold/20 text-formovies-gold border border-formovies-gold/30 backdrop-blur-sm">
                        {movieDetails.genres[0]?.name || "Movie"}
                    </span>
                </div>
            </div>

            <div className="flex flex-col gap-5">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-[200px]">
                        <h1 className="font-display text-4xl md:text-5xl tracking-wide text-white leading-tight">
                            {movieDetails.title}
                        </h1>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-white/10 text-white/70 border border-white/10">
                                Movie
                            </span>
                            <span className="flex items-center gap-1 text-xs text-white/40">
                                <Star className="size-3.5 text-formovies-gold fill-formovies-gold" />
                                {movieDetails.vote_average.toFixed(1)}/10
                            </span>
                        </div>
                    </div>
                    <MediaOptions mediaId={movieDetails.id} mediaType="movie" poster_url={movieDetails.poster_path} title={movieDetails.title} />
                </div>

                <p className="text-white/60 text-sm leading-relaxed">
                    {movieDetails.overview}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/5">
                    <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-white/30 mb-1">Genres</p>
                        <div className="flex flex-wrap gap-1.5">
                            {movieDetails.genres.map((gen) => (
                                <span key={gen.id} className="px-2 py-0.5 rounded-md text-xs text-white/60 bg-white/5">
                                    {gen.name}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-white/30 mb-1">Duration</p>
                        <p className="flex items-center gap-1.5 text-xs text-white/60">
                            <Clock className="size-3 text-white/30" />
                            {movieDetails.runtime} min
                        </p>
                    </div>
                    <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-white/30 mb-1">Release</p>
                        <p className="flex items-center gap-1.5 text-xs text-white/60">
                            <Calendar className="size-3 text-white/30" />
                            {new Date(movieDetails.release_date!).toDateString()}
                        </p>
                    </div>
                    {movieDetails.production_countries?.length > 0 && (
                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-white/30 mb-1">Country</p>
                            <p className="flex items-center gap-1.5 text-xs text-white/60">
                                <MapPin className="size-3 text-white/30" />
                                {movieDetails.production_countries.map(c => c.name).join(", ")}
                            </p>
                        </div>
                    )}
                    {movieDetails.production_companies?.length > 0 && (
                        <div className="col-span-2">
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-white/30 mb-1">Production</p>
                            <p className="text-xs text-white/60">
                                {movieDetails.production_companies.map(p => p.name).join(", ")}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default MovieDetails;
