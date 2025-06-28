import { MovieResponse } from '@/app/types/moviedbresponse';
import MovieList from '@/components/movielist';
import { latestMovies } from '@/lib/tmd';
const PopularMovies = async ()=>{
    const popular:MovieResponse = await (await latestMovies()).data
    return(
        <div className='px-10 my-10'>
            <h2 className="text-3xl md:text-4xl font-bold text-indigo-600 mb-6 drop-shadow-md">Popular Movies</h2>
            <MovieList movies={popular}/>
        </div>
    )
}

export default PopularMovies;