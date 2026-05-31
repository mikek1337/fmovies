import { MovieDetail } from "@/app/types/moviedbresponse"
import Image from "next/image"
import { FC } from "react"
import MediaOptions from "./mediaoptions"
import { Star, Clock, Calendar, MapPin, Tv } from "lucide-react"

interface MovieDetailsProps {
    seriesDetails: MovieDetail,
}

const SeriesDetails: FC<MovieDetailsProps> = ({ seriesDetails }) => {
    return (
        <div className="grid md:grid-cols-[300px_1fr] gap-8">
            <div className="relative aspect-[2/3] rounded-xl overflow-hidden formovies-card">
                <Image
                    src={`https://image.tmdb.org/t/p/w500${seriesDetails.poster_path}`}
                    alt={seriesDetails.name || ""}
                    fill
                    className="object-cover"
                    sizes="300px"
                />
                <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-formovies-gold/20 text-formovies-gold border border-formovies-gold/30 backdrop-blur-sm">
                        {seriesDetails.genres[0]?.name || "Series"}
                    </span>
                </div>
            </div>

            <div className="flex flex-col gap-5">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-[200px]">
                        <h1 className="font-display text-4xl md:text-5xl tracking-wide text-white leading-tight">
                            {seriesDetails.name}
                        </h1>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-white/10 text-white/70 border border-white/10">
                                <Tv className="size-3 inline mr-1" />
                                TV Series
                            </span>
                            <span className="flex items-center gap-1 text-xs text-white/40">
                                <Star className="size-3.5 text-formovies-gold fill-formovies-gold" />
                                {seriesDetails.vote_average.toFixed(1)}/10
                            </span>
                        </div>
                    </div>
                    <MediaOptions mediaId={seriesDetails.id} mediaType="tv" poster_url={seriesDetails.poster_path} title={seriesDetails.title} />
                </div>

                <p className="text-white/60 text-sm leading-relaxed">
                    {seriesDetails.overview}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/5">
                    <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-white/30 mb-1">Genres</p>
                        <div className="flex flex-wrap gap-1.5">
                            {seriesDetails.genres.map((gen) => (
                                <span key={gen.id} className="px-2 py-0.5 rounded-md text-xs text-white/60 bg-white/5">
                                    {gen.name}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-white/30 mb-1">Runtime</p>
                        <p className="flex items-center gap-1.5 text-xs text-white/60">
                            <Clock className="size-3 text-white/30" />
                            {seriesDetails.last_episode_to_air?.runtime || "N/A"} min
                        </p>
                    </div>
                    <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-white/30 mb-1">First Aired</p>
                        <p className="flex items-center gap-1.5 text-xs text-white/60">
                            <Calendar className="size-3 text-white/30" />
                            {seriesDetails.first_air_date ? new Date(seriesDetails.first_air_date).toDateString() : "N/A"}
                        </p>
                    </div>
                    {seriesDetails.production_countries?.length > 0 && (
                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-white/30 mb-1">Country</p>
                            <p className="flex items-center gap-1.5 text-xs text-white/60">
                                <MapPin className="size-3 text-white/30" />
                                {seriesDetails.production_countries.map(c => c.name).join(", ")}
                            </p>
                        </div>
                    )}
                    {seriesDetails.production_companies?.length > 0 && (
                        <div className="col-span-2">
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-white/30 mb-1">Production</p>
                            <p className="text-xs text-white/60">
                                {seriesDetails.production_companies.map(p => p.name).join(", ")}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default SeriesDetails;
