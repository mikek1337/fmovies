import { MovieResponse } from '@/app/types/moviedbresponse';
import MovieList from '@/components/movielist';
import { latestMovies } from '@/lib/tmd';
const PopularMovies = async () => {
    const popular: MovieResponse = await (await latestMovies()).data
    return (
        <MovieList movies={popular} />
    )
}

export default PopularMovies;
