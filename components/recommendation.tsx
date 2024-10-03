
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
    }, [id])
    return(
        <div className="px-2 my-20">
            <h1 className="font-extrabold my-3 md:text-5xl text-3xl">Recommendations</h1>
            <hr className="my-10"/>
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