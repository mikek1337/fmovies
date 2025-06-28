"use client"
import { FC, useEffect, useState } from "react"
import { MovieDetail } from "@/app/types/moviedbresponse"
import axios from "axios"
import SeriesDetails from "./seriesdetails"
import { cn } from "@/lib/utils"
import Recommendation from "./recommendation"
import { useMutation, useQuery } from "@tanstack/react-query"
import { RecentlyViewedType } from "@/app/types/recentlyViewed"
import { useSession } from "next-auth/react"
import VideoServerController from "./videoservercontroller"
type prevView = {
    id:number,
    season:number,
    episode:number
}
interface SeriesProps{
    id:number
}
const Series:FC<SeriesProps> = ({id}) =>{
    const session = useSession()
    const [season,setSeason] = useState(1)
    const [episode, setEpisode] = useState(1)
   
    const [seasonEpisodes, setSeasonEpisodes] = useState<number>(0);
    const changeSeason = (newSeason:number)=>{
        setSeason(newSeason);
        console.log(newSeason);
        setEpisode(1);
        seriesReminder(newSeason, 1);
    }
    const changeEpisode = (newEpisode:number)=>{
        setEpisode(newEpisode);
        seriesReminder(season, newEpisode);
    }
    const {data:series, isLoading} = useQuery({
        queryKey:['series'+id],
        queryFn: async ()=>{
            const res = await axios.get<MovieDetail>(`/api/series/detail?id=${id}`)
            setSeasonEpisodes(res.data.seasons.filter(seasonValue=>seasonValue.season_number ===season)[0].episode_count)
            return res.data as MovieDetail;
        }
    })
    useEffect(()=>{
       if(session.data?.user){
           if(series){
               mutate({
                   id: series?.id.toString(),
                   title: series?.name,
                   media_type: "tv",
                   poster_path: series?.poster_path,
               })
               
           }

       }

    },[series, session.data?.user]);
    useEffect(()=>{
        const pervPlay = JSON.parse(localStorage.getItem('previous') || '[]') as prevView[];
        const currentSeries = pervPlay.filter((prev:prevView)=>prev.id===id);
        if(currentSeries && currentSeries.length > 0){
            console.log(currentSeries, 'clear')
            setSeason(currentSeries[0].season);
            setEpisode(currentSeries[0].episode)
        }
    },[])
    const seriesReminder = (season:number, episode:number)=>{
        const pervPlay = JSON.parse(localStorage.getItem('previous') || '[]') as prevView[];
        console.log(pervPlay, 'pervplay')
        const currentSeries = pervPlay.filter((prev:prevView)=>prev.id===id);
        if(currentSeries.length > 0){
            currentSeries[0].episode = episode;
            currentSeries[0].season = season;
            const newPlay = pervPlay.filter((prev:prevView)=> prev.id !== id)
            newPlay.push(currentSeries[0])
            localStorage.setItem('previous', JSON.stringify(newPlay));
        }else{
            const play:prevView = {
                id,
                episode,
                season
            }
            pervPlay.push(play)
            localStorage.setItem('previous', JSON.stringify(pervPlay))
        }
    }
    const {mutate} = useMutation({
        mutationFn: async(recentlyViewed:RecentlyViewedType)=>{
            const res = await axios.post('/api/movies/recentlyviewed/post', recentlyViewed) 
            return res.data;
        },
       
    });

    return(
        <div className="md:max-w-[80%] mx-auto p-10">
            <section className="mt-10">
                {
                    !isLoading && series && (
                        <SeriesDetails seriesDetails={series}/>
                    )
                }
            </section>
            <section>
                <VideoServerController mediaType="tv" additionalParams={`${id}/${season}/${episode}`}/>
            </section>
               <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-indigo-800 mb-4">Seasons & Episodes</h2>
            <div className="bg-gray-100 rounded-xl shadow-lg p-6 md:p-8">

                <div className="mb-6 flex flex-wrap gap-3">
                    {
                        series?.seasons.map((seasonValue)=>(
                            <button className={cn(" font-semibold px-5 py-2 rounded-full shadow-md hover:bg-indigo-700 hover:text-white transition duration-300",{"bg-indigo-600 text-white":season===seasonValue.season_number})} onClick={()=>changeSeason(seasonValue.season_number)}>Season {seasonValue.season_number}</button>
                        ))
                    }
                    
                </div>

                <div className="space-y-4 overflow-auto max-h-96">
                    {
                        Array.from({ length: seasonEpisodes}).map((_, index)=>(
                        <div className={cn("flex items-center bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition duration-300 cursor-pointer",{"bg-indigo-300":episode===index+1})} onClick={()=>changeEpisode(index+1)}>
                            <div className="flex-shrink-0 w-24 h-16 rounded-md overflow-hidden mr-4">
                                <img src={`https://placehold.co/150x100/e5e7eb/6366f1?text=S${season}E${index+1}`} alt="Episode 1 Thumbnail" className="w-full h-full object-cover"/>
                            </div>
                            <div className="flex-grow">
                                <h3 className="font-semibold text-lg text-indigo-700">Episode: {index+1}</h3>
                                <p className="text-gray-600 text-sm">{series?.seasons[season!==0?season - 1:season].overview}</p>
                                <p className="text-gray-500 text-xs mt-1">Runtime: {series?.last_episode_to_air.runtime} min | Aired: {new Date(series?.first_air_date || '').toDateString()}</p>
                            </div>
                            <button className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full transition duration-300 ml-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>

                        ))
                    }

                    
                </div>
            </div>
        </section>
        <section>
            <Recommendation mediaType="tv" id={id}/>
        </section>
        </div>
    )
}

export default Series