import { newSeries } from "@/lib/tmd";
import { FC } from "react";
import MovieList from "./movielist";
import { MovieResponse } from "@/app/types/moviedbresponse";

const PopularTvSeries: FC = async () => {
    let tvSeries: MovieResponse = {
        page: 1,
        results: [],
        total_pages: 0,
        total_results: 0,
    };

    try {
        const res = await newSeries();
        if (res?.data) {
            tvSeries = res.data;
        }
    } catch (err) {
        console.warn("Unable to fetch trending TV series from TMDB:", err);
    }

    return (
        <MovieList movies={tvSeries} mediaType="tv" />
    );
};

export default PopularTvSeries;
