
"use client";
import { FC, useEffect, useState } from "react";
import MovieList from "./movielist";
import { Loader } from "lucide-react";
import axios from "axios";
import { MovieResponse } from "@/app/types/moviedbresponse";
interface RecommendationProps{
    id: number
    mediaType?: string
}
const Recommendation:FC<RecommendationProps> = ({id, mediaType})=>{
    const [recommendations, setRecommendations] = useState<MovieResponse>();
    const [loading, setLoading] = useState<boolean>(false);
    useEffect(()=>{
        setLoading(true);
        if(!mediaType){
        axios.get<MovieResponse>(`/api/movies/recommendations?id=${id}`).then((res)=>{
            setRecommendations(res.data);
            setLoading(false);
        });
    }
    else{
        axios.get<MovieResponse>(`/api/series/recommendations?id=${id}`).then((res)=>{
            setRecommendations(res.data);
            setLoading(false);
        });
    }
    }, [id, mediaType])
    return(
        <div className="px-2 space-y-7 ">
            <h1 className="font-semibold  md:text-4xl text-3xl text-indigo-700">More like this</h1>
            {
                loading && <Loader className="w-5 h-5 animate-spin mx-auto"/>
            }
            {
                !loading && recommendations && <MovieList movies={recommendations} mediaType={mediaType}/>
            }
        </div>
    )
}

export default Recommendation;