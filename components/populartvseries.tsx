import { newSeries } from "@/lib/tmd";
import { FC } from "react";
import MovieList from "./movielist";

const PopularTvSeries:FC = async() =>{
    const tvSeries = await(await newSeries()).data
    return(
        <div className="px-10 my-4">
            <div className="text-3xl font-semibold">TV Series</div>
            <MovieList movies={tvSeries} mediaType="tv"/>
        </div>
    )
}

export default PopularTvSeries;