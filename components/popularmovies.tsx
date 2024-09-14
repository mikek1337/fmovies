import { MovieResponse } from '@/app/types/moviedbresponse';
import MovieList from '@/components/movielist';
import { popularMovies } from '@/lib/tmd';
const PopularMovies = async ()=>{
    const popular:MovieResponse = await (await popularMovies()).data
    return(
        <div className='px-10 my-10'>
            <div className="text-4xl font-semibold my-10">Popular Movies</div>
            <MovieList movies={popular}/>
        </div>
    )
}

export default PopularMovies;