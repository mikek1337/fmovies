import { MovieResponse } from '../types/moviedbresponse';
import Image from 'next/image';
import { latestMovies } from '@/lib/tmd';
import { ChevronLeft, Play, Stars } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import Hero from '@/components/hero';

const Page = async ()=>{
    const movies:MovieResponse = await (await latestMovies()).data
    return(
       <Hero movies={movies}/>
    )
}

export default Page;