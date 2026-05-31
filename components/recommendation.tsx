"use client";
import { FC, useEffect, useState } from "react";
import MovieList from "./movielist";
import { Loader, Sparkles } from "lucide-react";
import axios from "axios";
import { MovieResponse } from "@/app/types/moviedbresponse";

interface RecommendationProps {
    id: number;
    mediaType?: string;
}

const Recommendation: FC<RecommendationProps> = ({ id, mediaType }) => {
    const [recommendations, setRecommendations] = useState<MovieResponse>();
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        setLoading(true);
        if (!mediaType) {
            axios.get<MovieResponse>(`/api/movies/recommendations?id=${id}`).then((res) => {
                setRecommendations(res.data);
                setLoading(false);
            });
        } else {
            axios.get<MovieResponse>(`/api/series/recommendations?id=${id}`).then((res) => {
                setRecommendations(res.data);
                setLoading(false);
            });
        }
    }, [id, mediaType])

    return (
        <div>
            <div className="flex items-center gap-3 mb-6">
                <Sparkles className="size-5 text-formovies-gold" />
                <h2 className="section-title !mb-0">More Like This</h2>
            </div>
            {loading && <Loader className="size-5 animate-spin mx-auto text-formovies-gold" />}
            {!loading && recommendations && <MovieList movies={recommendations} mediaType={mediaType} />}
        </div>
    )
}

export default Recommendation;
