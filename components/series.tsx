"use client"
import { FC, useEffect, useState } from "react"
import { MovieDetail } from "@/app/types/moviedbresponse"
import axios from "axios"
import SeriesDetails from "./seriesdetails"
import { cn } from "@/lib/utils"
import Recommendation from "./recommendation"
import { useMutation, useQuery } from "@tanstack/react-query"
import { RecentlyViewedType } from "@/app/types/recentlyViewed"
import { useSession } from "@/lib/auth-client"
import VideoServerController from "./videoservercontroller"
import { Play, Loader2 } from "lucide-react"

type prevView = {
    id: number,
    season: number,
    episode: number
}

interface SeriesProps {
    id: number
}

const Series: FC<SeriesProps> = ({ id }) => {
    const session = useSession()
    const [season, setSeason] = useState(1)
    const [episode, setEpisode] = useState(1)
    const [seasonEpisodes, setSeasonEpisodes] = useState<number>(0);

    const changeSeason = (newSeason: number) => {
        setSeason(newSeason);
        setEpisode(1);
        seriesReminder(newSeason, 1);
    }

    const changeEpisode = (newEpisode: number) => {
        setEpisode(newEpisode);
        seriesReminder(season, newEpisode);
    }

    const { data: series, isLoading } = useQuery({
        queryKey: ['series' + id],
        queryFn: async () => {
            const res = await axios.get<MovieDetail>(`/api/series/detail?id=${id}`)
            setSeasonEpisodes(res.data.seasons.filter(seasonValue => seasonValue.season_number === season)[0]?.episode_count || 0)
            return res.data as MovieDetail;
        }
    })

    useEffect(() => {
        if (session.data?.user && series) {
            mutate({
                id: series?.id.toString(),
                title: series?.name,
                media_type: "tv",
                poster_path: series?.poster_path,
            })
        }
    }, [series, session.data?.user]);

    useEffect(() => {
        const pervPlay = JSON.parse(localStorage.getItem('previous') || '[]') as prevView[];
        const currentSeries = pervPlay.filter((prev: prevView) => prev.id === id);
        if (currentSeries && currentSeries.length > 0) {
            setSeason(currentSeries[0].season);
            setEpisode(currentSeries[0].episode)
        }
    }, [])

    const seriesReminder = (season: number, episode: number) => {
        const pervPlay = JSON.parse(localStorage.getItem('previous') || '[]') as prevView[];
        const currentSeries = pervPlay.filter((prev: prevView) => prev.id === id);
        if (currentSeries.length > 0) {
            currentSeries[0].episode = episode;
            currentSeries[0].season = season;
            const newPlay = pervPlay.filter((prev: prevView) => prev.id !== id)
            newPlay.push(currentSeries[0])
            localStorage.setItem('previous', JSON.stringify(newPlay));
        } else {
            const play: prevView = {
                id,
                episode,
                season
            }
            pervPlay.push(play)
            localStorage.setItem('previous', JSON.stringify(pervPlay))
        }
    }

    const { mutate } = useMutation({
        mutationFn: async (recentlyViewed: RecentlyViewedType) => {
            const res = await axios.post('/api/movies/recentlyviewed/post', recentlyViewed)
            return res.data;
        },
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="size-8 animate-spin text-formovies-gold" />
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-10">
            <section>
                {series && <SeriesDetails seriesDetails={series} />}
            </section>

            <section>
                <VideoServerController mediaType="tv" additionalParams={`${id}/${season}/${episode}`} />
            </section>

            <section>
                <div className="flex items-center gap-3 mb-6">
                    <Play className="size-5 text-formovies-gold" />
                    <h2 className="section-title !mb-0">Seasons & Episodes</h2>
                </div>

                <div className="formovies-card p-6">
                    <div className="flex flex-wrap gap-2 mb-6">
                        {series?.seasons.map((seasonValue) => (
                            <button
                                className={cn(
                                    "px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200",
                                    season === seasonValue.season_number
                                        ? "bg-formovies-gold/20 text-formovies-gold border border-formovies-gold/30"
                                        : "bg-white/5 text-white/50 hover:text-white hover:bg-white/10 border border-transparent"
                                )}
                                key={seasonValue.id}
                                onClick={() => changeSeason(seasonValue.season_number)}
                            >
                                S{seasonValue.season_number}
                            </button>
                        ))}
                    </div>

                    <div className="flex flex-col gap-3 max-h-96 overflow-y-auto scrollbar-thin">
                        {Array.from({ length: seasonEpisodes }).map((_, index) => (
                            <div
                                className={cn(
                                    "flex items-center gap-4 p-3 rounded-xl transition-all duration-200 cursor-pointer",
                                    episode === index + 1
                                        ? "bg-formovies-gold/10 border border-formovies-gold/20"
                                        : "bg-white/[0.03] hover:bg-white/[0.06] border border-white/5"
                                )}
                                key={`epis${index}`}
                                onClick={() => changeEpisode(index + 1)}
                            >
                                <div className="shrink-0 w-24 aspect-video rounded-lg overflow-hidden bg-formovies-deeper flex items-center justify-center">
                                    <span className="font-display text-lg text-white/20">S{season}E{index + 1}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-body text-sm font-semibold text-white/90">
                                        Episode {index + 1}
                                    </h3>
                                    <p className="text-xs text-white/40 line-clamp-1 mt-0.5">
                                        {series?.seasons[season !== 0 ? season - 1 : season]?.overview || "No description"}
                                    </p>
                                    <p className="text-[11px] text-white/30 mt-1">
                                        {series?.first_air_date && new Date(series.first_air_date).toDateString()}
                                    </p>
                                </div>
                                <div className={cn(
                                    "size-9 rounded-full flex items-center justify-center transition-all duration-200",
                                    episode === index + 1
                                        ? "bg-formovies-gold text-formovies-dark"
                                        : "bg-white/10 text-white/50 hover:bg-formovies-gold/80 hover:text-formovies-dark"
                                )}>
                                    <Play className="size-4 fill-current" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section>
                <Recommendation mediaType="tv" id={id} />
            </section>
        </div>
    )
}

export default Series
