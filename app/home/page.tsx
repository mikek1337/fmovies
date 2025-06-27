'use client'

import { latestMovies} from '@/lib/tmd';
import Hero from '@/components/hero';
import { Suspense } from 'react';
import PopularMovies from '@/components/popularmovies';
import PopularTvSeries from '@/components/populartvseries';
import { useQuery } from '@tanstack/react-query';


const Page = ()=>{
    const {data, isPending} = useQuery({
        queryKey:["latest"],
        queryFn: async ()=>{
            return await(await latestMovies()).data
        }
    })
    return(
        <div className='my-1 w-full'>
            {!isPending && data && <Hero movies={data}/>}
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