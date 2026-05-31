"use client";

import { MovieResponse } from "@/app/types/moviedbresponse";
import CustomCard from "@/components/customcard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ChevronLeft, ChevronRight, Search, Film } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const Page = () => {
  const [page, setPage] = useState(1);
  const { data: popularMovies } = useQuery({
    queryKey: ['movies', page],
    queryFn: async () => {
      return await (await axios.get<MovieResponse>(`/api/movies/popular?page=${page}`)).data;
    }
  });

  return (
    <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Film className="size-6 text-formovies-gold" />
        <h1 className="font-display text-4xl tracking-wider text-white">Movies</h1>
      </div>

      <div className="flex items-center gap-3 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/30" />
          <Input
            type="text"
            placeholder="Search movies..."
            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-formovies-gold/50"
          />
        </div>
        <Button
          variant="outline"
          className="border-formovies-gold/30 text-formovies-gold hover:bg-formovies-gold/10"
          onClick={() => toast({ title: "Coming soon", description: "Search will be fully implemented soon!" })}
        >
          <Search className="size-4" />
          Search
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {popularMovies?.results.map((movie) => (
          <Link href={`/home/watch/movie/${movie.id}`} key={movie.id}>
            <CustomCard
              mediaType="movie"
              title={movie.title}
              overview={movie.overview}
              id={movie.id.toString()}
              image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            />
          </Link>
        ))}
      </div>

      <div className="flex items-center justify-center gap-4 mt-10">
        <Button
          variant="outline"
          className="border-white/10 text-white/70 hover:bg-white/5"
          onClick={() => page > 1 && setPage(prev => prev - 1)}
          disabled={page <= 1}
        >
          <ChevronLeft className="size-4" />
          Previous
        </Button>
        <span className="text-sm text-white/40 font-medium">{page}</span>
        <Button
          variant="outline"
          className="border-white/10 text-white/70 hover:bg-white/5"
          onClick={() => popularMovies && popularMovies.total_pages > page && setPage(prev => prev + 1)}
          disabled={!popularMovies || popularMovies.total_pages <= page}
        >
          Next
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
};

export default Page;
