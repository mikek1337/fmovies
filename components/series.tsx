"use client"
import { Loader } from "lucide-react"
import VideoPlayer from "./videoplayer"
import { FC, useEffect, useState } from "react"
import { MovieDetail } from "@/app/types/moviedbresponse"
import axios from "axios"
import SeriesDetails from "./seriesdetails"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { ScrollArea, ScrollBar } from "./ui/scroll-area"
import Recommendation from "./recommendation"
import Comment from "./comment"
import { useMutation, useQuery } from "@tanstack/react-query"
import { RecentlyViewedType } from "@/app/types/recentlyViewed"
import { useSession } from "next-auth/react"
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
   
    const [videoUrl, setVideoUrl] = useState(`https://vidsrc.icu/embed/tv/${id}/${season}/${episode}`);
    const [seasonEpisodes, setSeasonEpisodes] = useState<number>(0);
    const changeSeason = (newSeason:number)=>{
        
        setSeason(newSeason);
        console.log(newSeason);
        setEpisode(1);
        seriesReminder(newSeason, 1);
        setVideoUrl(`https://vidsrc.icu/embed/tv/${id}/${newSeason}/${episode}`);
    }
    const changeEpisode = (newEpisode:number)=>{
        setEpisode(newEpisode);
        seriesReminder(season, newEpisode);
        setVideoUrl(`https://vidsrc.icu/embed/tv/${id}/${season}/${newEpisode}`);
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
            changeSeason(currentSeries[0].season);
            changeEpisode(currentSeries[0].episode)
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
        <>
        <div className="relative  grid grid-cols-12 w-full h-fit  my-4 border px-5 ">
            <div className="md:relative hidden md:block absolute md:col-span-2 md:w-auto w-5/12  overflow-auto bg-white h-full">
                <span className="font-bold flex justify-center w-full my-10">{series?.seasons.filter(seasonValue=>seasonValue.season_number ===season).map((res)=>(
                    res.name
                ))}</span>
                <div className="h-[300px]">
                    {
                        Array.from({length: seasonEpisodes}).fill(0).map((_,index)=>(
                            <div className={cn("px-1 py-2 border cursor-pointer", {"font-extrabold":(index + 1)===episode})} onClick={()=>{changeEpisode(index + 1)}} key={`ep${index}`}>
                                <span>{`Episode ${index + 1}`}</span>
                            </div>
                        ))
                    }

                
                </div>
            </div>

            <div className="md:col-span-10 col-span-12 ">
            <VideoPlayer videoUrl={videoUrl}/>
            </div>
        </div>
        <div className="md:hidden my-10 px-1">
                <span className="font-bold text-lg">{series?.seasons.filter(seasonValue=>season===seasonValue.season_number).map(res=>(
                    res.name
                ))}</span>
            <div className="grid grid-cols-8 ">
                    {
                        Array.from({length: seasonEpisodes}).fill(0).map((_,index)=>(
                            <div className={cn("px-1 py-2  cursor-pointer w-8 h-8 flex items-center justify-center", {"bg-indigo-700 text-white rounded-md font-semibold":(index + 1)===episode})} onClick={()=>{changeEpisode(index + 1)}} key={`ep${index}`}>
                                <span>{`${index + 1}`}</span>
                            </div>
                        ))
                    }

                
                </div>
            </div>
        <div className=" my-10 flex justify-center  border">
            <div className="flex items-start  w-full">
                {
                    isLoading && (<Loader className="w-5 h-5 animate-spin"/>)
                }
                {
                    !isLoading && series && (
                        <SeriesDetails seriesDetails={series}/>
                    )
                }
            </div>            
            
        </div>
        <ScrollArea className="whitespace-nowrap rounded-md border w-fit">
        <div className="md:flex grid grid-flow-row-dense items-center gap-3 mx-5 w-full border">
            {
                series?.seasons.map(seasonValue=>(
                <div className={cn("flex  justify-center items-center relative rounded-lg border  cursor-pointer bg-black/30 bg-blend-darken", {"border-indigo-600 border-2":seasonValue.season_number===season})} key={seasonValue.id} onClick={()=>changeSeason(seasonValue.season_number)}>
                    <span className={cn("absolute text-2xl text-white font-extrabold p-1 z-10  ",{"text-indigo-300":season===seasonValue.season_number})}>{seasonValue.name}</span>
                    <Image src={`http://image.tmdb.org/t/p/w500${seasonValue.poster_path}`} alt="" width={500} height={500} className="object-cover w-[300px] h-[200px]"/>
                    <div className="absolute bg-blend-darken w-full h-full bg-black/50 top-0"></div>
                </div>
                ))
            }
        </div>
        <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <Comment id={id} season={season} episode={episode}/>
        <Recommendation id={id} mediaType="tv"/>
        </>
    )
}

export default Series