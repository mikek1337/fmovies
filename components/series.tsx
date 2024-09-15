"use client"
import { Loader } from "lucide-react"
import VideoPlayer from "./videoplayer"
import { FC, useEffect, useState } from "react"
import { MovieDetail } from "@/app/types/moviedbresponse"
import axios from "axios"
import SeriesDetails from "./seriesdetails"
interface SeriesProps{
    id:number
}
const Series:FC<SeriesProps> = ({id}) =>{
    const [season,setSeason] = useState(1)
    const [episode, setEpisode] = useState(1)
    const [videoUrl, setVideoUrl] = useState(`https://vidsrc.icu/embed/tv/${id}/${season}/${episode}`);
    const [series, setSeries] = useState<MovieDetail>();
    const [loading, setLoading] = useState<boolean>(false);
    
    useEffect(()=>{
        setLoading(true);
        axios.get<MovieDetail>(`${process.env.API_BASE_URL}tv/series_id=${id}?language=en-US`).then((res)=>{
            setSeries(res.data);
            setLoading(false);
        }).catch(err=>{
            console.log(err);
            setLoading(false);
        })

    },[id])
    return(
        <>
        <div className="w-full my-4">
            <VideoPlayer videoUrl={videoUrl}/>
        </div>
        <div className=" my-10 flex justify-center">
            <div className="flex items-start justify-between">
                {
                    loading && (<Loader className="w-5 h-5 animate-spin"/>)
                }
                {
                    series && (
                        <SeriesDetails seriesDetails={series}/>
                    )
                }
            </div>            
            
        </div>
        <div className="flex items-center gap-3">
            {
                series?.seasons.map(season=>(
                <div className="rounded-lg border border-indigo-600 w-[500px] h-[400px] cursor-pointer bg-black/30">
                    <span className="text-lg text-white font-extrabold p-1">{season.name}</span>
                </div>
                ))
            }
        </div>
        </>
    )
}

export default Series