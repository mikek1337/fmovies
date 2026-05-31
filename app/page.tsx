import { buttonVariants } from "@/components/ui/button";
import { latestMovies } from "@/lib/tmd";
import { cn } from "@/lib/utils";
import { ArrowRight, Clapperboard } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  const movies = await (await latestMovies()).data;

  return (
    <div className="min-h-screen bg-formovies-dark flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-formovies-gold/5 via-formovies-dark to-formovies-deeper" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-formovies-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-formovies-rose/5 rounded-full blur-3xl" />

      <div className="relative z-10 flex flex-col items-center gap-8 px-4 max-w-2xl text-center">
        <div className="flex items-center gap-3 mb-2">
          <Clapperboard className="size-10 text-formovies-gold" />
          <span className="font-display text-5xl tracking-[0.2em] text-white">ForMovies</span>
        </div>
        <p className="text-white/40 text-sm md:text-base font-body">
          Discover, watch, and enjoy thousands of movies and TV series. Your ForMovies experience awaits.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2 max-w-xl mb-4">
          {movies.results.slice(0, 8).map((movie) => (
            <Link
              key={movie.id}
              href={`/home/watch/movie/${movie.id}`}
              className="px-3 py-1.5 rounded-lg text-xs text-white/40 hover:text-formovies-gold hover:bg-white/5 transition-all duration-200"
            >
              {movie.title}
            </Link>
          ))}
        </div>

        <Link
          href="/home"
          className={cn(
            buttonVariants({ variant: "default" }),
            "bg-formovies-gold text-formovies-dark hover:bg-formovies-amber font-semibold px-8 py-6 text-base gap-2"
          )}
        >
          Enter ForMovies
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}
