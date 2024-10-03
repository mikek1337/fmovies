import { MovieResponse } from '@/app/types/moviedbresponse';
import MovieList from '@/components/movielist';
import { latestMovies } from '@/lib/tmd';
const PopularMovies = async ()=>{
    const popular:MovieResponse = await (await latestMovies()).data
    return(
        <div className='px-10 my-10'>
            <div className="text-4xl font-semibold my-10">Popular Movies</div>
            <MovieList movies={popular}/>
        </div>
    )
}

export default PopularMovies;