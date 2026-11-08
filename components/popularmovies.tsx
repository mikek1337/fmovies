import { MovieResponse } from '@/app/types/moviedbresponse';
import MovieList from '@/components/movielist';
import { latestMovies } from '@/lib/tmd';

const PopularMovies = async () => {
    let popular: MovieResponse = {
        page: 1,
        results: [],
        total_pages: 0,
        total_results: 0,
    };

    try {
        const res = await latestMovies();
        if (res?.data) {
            popular = res.data;
        }
    } catch (err) {
        console.warn("Unable to fetch popular movies from TMDB:", err);
    }

    return (
        <MovieList movies={popular} />
    );
};

export default PopularMovies;
