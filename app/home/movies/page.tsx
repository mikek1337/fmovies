"use client";

import { MovieResponse } from "@/app/types/moviedbresponse";
import CustomCard from "@/components/customcard";
import SelectGener from "@/components/selectgener";
import SelectYear from "@/components/selectyear";
import SelectSort, { SORT_OPTIONS } from "@/components/selectsort";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import axios from "axios";
import { ChevronLeft, ChevronRight, Search, Film, Loader2, X, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import { FALLBACK_MOVIE_GENRES } from "@/lib/tmdb";

function MoviesContent() {
  const searchParams = useSearchParams();
  const initialGenre = searchParams.get("genre") || "";
  const initialYear = searchParams.get("year") || "";
  const initialQuery = searchParams.get("query") || "";
  const initialSort = searchParams.get("sort") || searchParams.get("sort_by") || "popularity.desc";

  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState(initialQuery);
  const [activeQuery, setActiveQuery] = useState(initialQuery);
  const [selectedGenre, setSelectedGenre] = useState(initialGenre);
  const [selectedYear, setSelectedYear] = useState(initialYear);
  const [selectedSort, setSelectedSort] = useState(initialSort);
  const [movies, setMovies] = useState<MovieResponse>();
  const [loading, setLoading] = useState(false);

  // Sync state if URL query param changes
  useEffect(() => {
    const genreParam = searchParams.get("genre") || "";
    setSelectedGenre((prev) => {
      if (genreParam !== prev) {
        setPage(1);
        return genreParam;
      }
      return prev;
    });
  }, [searchParams]);

  const hasActiveFilters = Boolean(
    activeQuery.trim() !== "" ||
      selectedGenre !== "" ||
      selectedYear !== "" ||
      (selectedSort && selectedSort !== "popularity.desc")
  );

  const fetchMovies = useCallback(() => {
    setLoading(true);

    if (!hasActiveFilters) {
      axios
        .get<MovieResponse>(`/api/movies/popular?page=${page}`)
        .then((res) => {
          setMovies(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    } else {
      const params = new URLSearchParams();
      if (activeQuery.trim()) params.set("query", activeQuery.trim());
      if (selectedGenre) params.set("genre", selectedGenre);
      if (selectedYear) params.set("year", selectedYear);
      if (selectedSort && selectedSort !== "popularity.desc")
        params.set("sort_by", selectedSort);
      if (page) params.set("page", page.toString());

      axios
        .get<MovieResponse>(`/api/movies/filter?${params.toString()}`)
        .then((res) => {
          setMovies(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [page, activeQuery, selectedGenre, selectedYear, selectedSort, hasActiveFilters]);

  useEffect(() => {
    fetchMovies();
  }, [page, activeQuery, selectedGenre, selectedYear, selectedSort, fetchMovies]);

  const handleSearch = () => {
    setActiveQuery(searchInput.trim());
    setPage(1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleClearFilters = () => {
    setSearchInput("");
    setActiveQuery("");
    setSelectedGenre("");
    setSelectedYear("");
    setSelectedSort("popularity.desc");
    setPage(1);
  };

  const activeGenreName = FALLBACK_MOVIE_GENRES.find(
    (g) => g.id.toString() === selectedGenre
  )?.name;

  return (
    <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Film className="size-6 text-formovies-gold" />
        <h1 className="font-display text-4xl tracking-wider text-white">Movies</h1>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-12 gap-3 mb-6 p-5 rounded-xl bg-white/[0.03] border border-white/5">
        <div className="col-span-12 md:col-span-4 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/30" />
          <Input
            type="text"
            placeholder="Search movies..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-formovies-gold/50"
          />
        </div>

        <div className="col-span-6 sm:col-span-4 md:col-span-2">
          <SelectGener
            type="movie"
            value={selectedGenre || "all"}
            onValueChange={(val) => {
              setSelectedGenre(val);
              setPage(1);
            }}
            placeholder="Filter by Genre"
            className="w-full"
          />
        </div>

        <div className="col-span-6 sm:col-span-4 md:col-span-2">
          <SelectYear
            value={selectedYear || "all"}
            onValueChange={(val) => {
              setSelectedYear(val);
              setPage(1);
            }}
            placeholder="Filter by Year"
            className="w-full"
          />
        </div>

        <div className="col-span-6 sm:col-span-4 md:col-span-2">
          <SelectSort
            type="movie"
            value={selectedSort}
            onValueChange={(val) => {
              setSelectedSort(val);
              setPage(1);
            }}
            placeholder="Sort by"
            className="w-full"
          />
        </div>

        <div className="col-span-6 sm:col-span-12 md:col-span-2 flex gap-2">
          <Button
            onClick={handleSearch}
            className="flex-1 bg-formovies-gold text-formovies-dark hover:bg-formovies-amber font-semibold"
          >
            <Search className="size-4" />
            Filter
          </Button>
          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={handleClearFilters}
              className="border-white/10 text-white/70 hover:bg-white/5"
              title="Reset all filters"
            >
              <X className="size-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Active Filter Badges */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <span className="text-xs text-white/40 flex items-center gap-1">
            <SlidersHorizontal className="size-3" /> Active Filters:
          </span>
          {activeQuery && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-formovies-gold/10 text-formovies-gold border border-formovies-gold/20">
              Query: &ldquo;{activeQuery}&rdquo;
              <button
                onClick={() => {
                  setSearchInput("");
                  setActiveQuery("");
                  setPage(1);
                }}
                className="hover:text-white"
              >
                <X className="size-3" />
              </button>
            </span>
          )}
          {activeGenreName && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-formovies-gold/10 text-formovies-gold border border-formovies-gold/20">
              Genre: {activeGenreName}
              <button
                onClick={() => {
                  setSelectedGenre("");
                  setPage(1);
                }}
                className="hover:text-white"
              >
                <X className="size-3" />
              </button>
            </span>
          )}
          {selectedYear && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-formovies-gold/10 text-formovies-gold border border-formovies-gold/20">
              Year: {selectedYear}
              <button
                onClick={() => {
                  setSelectedYear("");
                  setPage(1);
                }}
                className="hover:text-white"
              >
                <X className="size-3" />
              </button>
            </span>
          )}
          {selectedSort && selectedSort !== "popularity.desc" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-formovies-gold/10 text-formovies-gold border border-formovies-gold/20">
              Sort: {SORT_OPTIONS.find((s) => s.id === selectedSort)?.label || selectedSort}
              <button
                onClick={() => {
                  setSelectedSort("popularity.desc");
                  setPage(1);
                }}
                className="hover:text-white"
              >
                <X className="size-3" />
              </button>
            </span>
          )}
          <button
            onClick={handleClearFilters}
            className="text-xs text-white/40 hover:text-white underline ml-2"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Movie Grid */}
      <div className={cn("w-full", { "min-h-[50vh] flex items-center justify-center": loading })}>
        {loading && <Loader2 className="size-8 animate-spin text-formovies-gold" />}

        {!loading && movies && (
          <>
            {movies.results.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                {movies.results.map((movie) => (
                  <Link href={`/home/watch/movie/${movie.id}`} key={movie.id}>
                    <CustomCard
                      mediaType="movie"
                      title={movie.title || movie.name || ""}
                      overview={movie.overview}
                      id={movie.id.toString()}
                      image={
                        movie.poster_path
                          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                          : "/movieposter.webp"
                      }
                    />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-white/50">
                No movies found matching the selected filters.
              </div>
            )}

            {movies.total_pages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-10">
                <Button
                  variant="outline"
                  className="border-white/10 text-white/70 hover:bg-white/5"
                  onClick={() => page > 1 && setPage(page - 1)}
                  disabled={page <= 1}
                >
                  <ChevronLeft className="size-4" />
                  Previous
                </Button>
                <span className="text-sm text-white/40 font-medium">
                  {page} / {movies.total_pages}
                </span>
                <Button
                  variant="outline"
                  className="border-white/10 text-white/70 hover:bg-white/5"
                  onClick={() =>
                    movies.total_pages && page < movies.total_pages && setPage(page + 1)
                  }
                  disabled={!movies.total_pages || page >= movies.total_pages}
                >
                  Next
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-8 flex items-center justify-center min-h-[50vh]">
          <Loader2 className="size-8 animate-spin text-formovies-gold" />
        </div>
      }
    >
      <MoviesContent />
    </Suspense>
  );
}
