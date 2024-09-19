import { MovieResponse } from '../types/moviedbresponse';
import { latestMovies} from '@/lib/tmd';
import Hero from '@/components/hero';
import { Suspense } from 'react';
import PopularMovies from '@/components/popularmovies';
import PopularTvSeries from '@/components/populartvseries';

const Page = async ()=>{
    const movies:MovieResponse = await (await latestMovies()).data
    return(
        <div className='my-1'>
            <Hero movies={movies}/>
            <Suspense fallback={<div>Loading...</div>}>
                <PopularMovies/>
            </Suspense>
            <Suspense fallback={<div>Loading...</div>}>
                <PopularTvSeries/>
            </Suspense>
        </div>
    )
}

export default Page;