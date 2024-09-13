import { MovieResponse } from '../types/moviedbresponse';
import Image from 'next/image';
import { latestMovies } from '@/lib/tmd';
import { Play, Stars } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

const Page = async ()=>{
    const movies:MovieResponse = await (await latestMovies()).data
    return(
        <div>
            <div className='w-full border flex'>
                {
                    movies?.results.map((movie)=>(
                        <div key={movie.id} className='relative h-[500px]  w-full justify-center '>
                            <div >
                                <div className='absolute w-full h-full  bg-gradient-to-r from-indigo-500'>
                                    <div className=' px-10 flex items-center w-full border h-full'>
                                        <div className='flex flex-col gap-2 px-10'>
                                            <span className='text-5xl font-extrabold  '>{movie.title}</span>
                                            <p className='text-sm max-w-[500px]  line-clamp-4'>{movie.overview}</p>
                                            <div className='flex items-center gap-5'>
                                                <Link className={cn(buttonVariants({variant:'default'}),'flex items-center gap-2 w-fit')} href="#">
                                                <Play className='w-5 h-5 fill-white'/>
                                                Watch now
                                                </Link>
                                                <span className='text-xs font-semibold rounded-lg p-1 bg-indigo-900 text-white'>{new Date(movie.release_date=="" ? movies.dates.minimum: movie.release_date).toDateString()}</span>
                                                <span className='flex items-center gap-1 text-sm font-semibold'><Stars className='text-yellow-400 fill-yellow-400 w-5 h-5'/>{movie.vote_average.toFixed(1)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div >
                                <Image src={`http://image.tmdb.org/t/p/original${movie.backdrop_path}`} className='object-contain' width={1200} height={100} alt={movie.title}/>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default Page;