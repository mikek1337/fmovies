import { newSeries } from "@/lib/tmd";
import { FC } from "react";
import MovieList from "./movielist";

const PopularTvSeries: FC = async () => {
    const tvSeries = await (await newSeries()).data
    return (
        <MovieList movies={tvSeries} mediaType="tv" />
    )
}

export default PopularTvSeries;
