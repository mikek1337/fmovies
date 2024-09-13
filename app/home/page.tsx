import { MovieResponse } from '../types/moviedbresponse';
import { latestMovies } from '@/lib/tmd';
import Hero from '@/components/hero';

const Page = async ()=>{
    const movies:MovieResponse = await (await latestMovies()).data
    return(
        <div className='my-1'>
            <Hero movies={movies}/>
        </div>
    )
}

export default Page;