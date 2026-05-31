'use client'

import { MovieResponse } from "@/app/types/moviedbresponse";
import CustomCard from "@/components/customcard";
import SelectGener from "@/components/selectgener";
import SelectYear from "@/components/selectyear";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import axios from "axios";
import { Loader, Search, Tv } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const Page = () => {
    const [page, setPage] = useState<number>(1);
    const [query, setQuery] = useState<string>('');
    const [primaryReleaseYear, setPrimaryReleaseYear] = useState<string[]>();
    const [movies, setMovies] = useState<MovieResponse>();
    const [loading, setLoading] = useState<boolean>(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const getSelectedGener = (_value: string) => {
        // handle genre filter
    }

    const getSelectedYear = (value: string) => {
        setPrimaryReleaseYear([value]);
    }

    useEffect(() => {
        setLoading(true);
        if (query === "" || !query) {
            axios.get<MovieResponse>(`/api/series/popular?page=${page}`).then((res) => {
                setMovies(res.data);
                setLoading(false);
            }).catch((err) => {
                console.log(err);
                setLoading(false);
            })
        }
    }, [page, query])

    const search = () => {
        if (query) {
            setLoading(true);
            axios.get<MovieResponse>(`/api/series/filter?query=${query}&page=${page}&primaryReleaseYear=${primaryReleaseYear}`).then((res) => {
                setMovies(res.data);
                setLoading(false);
            }).catch((err) => {
                console.log(err);
                setLoading(false);
            })
        }
    }

    return (
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-8">
            <div className="flex items-center gap-4 mb-8">
                <Tv className="size-6 text-formovies-gold" />
                <h1 className="font-display text-4xl tracking-wider text-white">TV Series</h1>
            </div>

            <div className="grid grid-cols-12 gap-3 mb-8 p-5 rounded-xl bg-white/[0.03] border border-white/5">
                <Input
                    type="text"
                    placeholder="Search series..."
                    className="col-span-12 sm:col-span-4 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-formovies-gold/50"
                    onChange={(e) => setQuery(e.target.value)}
                />
                <div className="col-span-6 sm:col-span-3">
                    <SelectGener onValueChange={getSelectedGener} className="w-full" />
                </div>
                <div className="col-span-6 sm:col-span-3">
                    <SelectYear onValueChange={getSelectedYear} className="w-full" />
                </div>
                <Button
                    onClick={search}
                    className="col-span-12 sm:col-span-2 bg-formovies-gold text-formovies-dark hover:bg-formovies-amber font-semibold"
                >
                    <Search className="size-4" />
                    Search
                </Button>
            </div>

            <div className={cn("w-full", { "min-h-[50vh] flex items-center justify-center": loading })}>
                {loading && <Loader className="size-6 animate-spin text-formovies-gold" />}
                {!loading && movies && (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                            {movies.results.map((movie) => (
                                <Link href={`/home/watch/series/${movie.id}`} key={movie.id}>
                                    <CustomCard
                                        title={movie.name}
                                        overview={movie.overview}
                                        image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                        id={movie.id.toString()}
                                        mediaType="tv"
                                    />
                                </Link>
                            ))}
                        </div>
                        <div className="flex items-center justify-center gap-4 mt-10">
                            <Button
                                variant="outline"
                                className="border-white/10 text-white/70 hover:bg-white/5"
                                onClick={() => page > 1 && setPage(page - 1)}
                                disabled={page <= 1}
                            >
                                Previous
                            </Button>
                            <span className="text-sm text-white/40 font-medium">{page}/{movies?.total_pages}</span>
                            <Button
                                variant="outline"
                                className="border-white/10 text-white/70 hover:bg-white/5"
                                onClick={() => movies?.total_pages && page < movies?.total_pages && setPage(page + 1)}
                                disabled={!movies?.total_pages || page >= movies.total_pages}
                            >
                                Next
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default Page;
