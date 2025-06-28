import { newSeries } from "@/lib/tmd";
import { FC } from "react";
import MovieList from "./movielist";

const PopularTvSeries:FC = async() =>{
    const tvSeries = await(await newSeries()).data
    return(
        <div className="px-10 my-4 space-y-5">
            <h2 className="text-3xl md:text-4xl font-bold text-indigo-600 mb-6 drop-shadow-md">Trending TV Shows</h2>
            <MovieList movies={tvSeries} mediaType="tv"/>
        </div>
    )
}

export default PopularTvSeries;