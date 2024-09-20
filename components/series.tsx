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
interface SeriesProps{
    id:number
}
const Series:FC<SeriesProps> = ({id}) =>{
    const [season,setSeason] = useState(1)
    const [episode, setEpisode] = useState(1)
    const [videoUrl, setVideoUrl] = useState(`https://vidsrc.icu/embed/tv/${id}/${season}/${episode}`);
    const [series, setSeries] = useState<MovieDetail>();
    const [loading, setLoading] = useState<boolean>(false);
    const [seasonEpisodes, setSeasonEpisodes] = useState<number>(0);
    const changeSeason = (newSeason:number)=>{
        
        setSeason(newSeason);
        console.log(newSeason);
        setEpisode(1);
        setVideoUrl(`https://vidsrc.icu/embed/tv/${id}/${newSeason}/${episode}`);
    }
    const changeEpisode = (newEpisode:number)=>{
        setEpisode(newEpisode);
        setVideoUrl(`https://vidsrc.icu/embed/tv/${id}/${season}/${newEpisode}`);
    }
    useEffect(()=>{
        setLoading(true);
        axios.get<MovieDetail>(`/api/series/detail?id=${id}`).then((res)=>{
            setSeries(res.data);
            setSeasonEpisodes(res.data.seasons.filter(seasonValue=>seasonValue.season_number ===season)[0].episode_count)
            console.log(series);
            setLoading(false);
        }).catch(err=>{
            console.log(err);
            setLoading(false);
        })

    },[id, season])
    return(
        <>
        <div className="grid grid-cols-12 w-full h-fit  my-4 border px-5 ">
            <div className="col-span-2 overflow-auto">
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
            <div className="col-span-10 ">
            <VideoPlayer videoUrl={videoUrl}/>
            </div>
        </div>
        <div className=" my-10 flex justify-center  border">
            <div className="flex items-start justify-between w-full">
                {
                    loading && (<Loader className="w-5 h-5 animate-spin"/>)
                }
                {
                    !loading && series && (
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
        </>
    )
}

export default Series