'use client'

import { latestMovies} from '@/lib/tmd';
import Hero from '@/components/hero';
import { Suspense } from 'react';
import PopularMovies from '@/components/popularmovies';
import PopularTvSeries from '@/components/populartvseries';
import { useQuery } from '@tanstack/react-query';
import { Compass } from 'lucide-react';

const Page = () => {
    const { data, isPending } = useQuery({
        queryKey: ["latest"],
        queryFn: async () => {
            return await (await latestMovies()).data;
        }
    });

    return (
        <div className="max-w-[1600px] mx-auto px-4 md:px-8">
            {!isPending && data && <Hero movies={data} />}

            <div className="flex items-center gap-3 mb-8">
                <Compass className="size-5 text-formovies-gold" />
                <h2 className="section-title !mb-0">What&apos;s Popular</h2>
            </div>

            <Suspense fallback={
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className="aspect-[2/3] rounded-xl bg-white/5 animate-pulse" />
                    ))}
                </div>
            }>
                <PopularMovies />
            </Suspense>

            <div className="flex items-center gap-3 mb-8 mt-16">
                <Compass className="size-5 text-formovies-gold" />
                <h2 className="section-title !mb-0">Trending TV Shows</h2>
            </div>

            <Suspense fallback={
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className="aspect-[2/3] rounded-xl bg-white/5 animate-pulse" />
                    ))}
                </div>
            }>
                <PopularTvSeries />
            </Suspense>
        </div>
    );
};

export default Page;
