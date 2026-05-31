"use client"
import { MovieResponse } from "@/app/types/moviedbresponse";
import axios from "axios";
import { FC, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Loader, Search, Star } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const SearchDialog: FC = () => {
    const router = useRouter();
    const [query, setQuery] = useState<string>("");
    const [movies, setMovies] = useState<MovieResponse>();
    const [loading, setLoading] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const search = (queryString: string) => {
      if (queryString) {
        setQuery(queryString);
        setLoading(true);
      }
    };

    const onSelect = (routeUrl: string) => {
        setIsOpen(false);
        setQuery("");
        router.push(routeUrl);
    }

    useEffect(() => {
      if (query !== "") {
        setLoading(true);
        axios
          .get<MovieResponse>(`/api/movies/search?query=${query}`)
          .then((res) => {
            setMovies(res.data);
            setLoading(false);
          })
          .catch((err) => {
            console.log(err);
            setLoading(false);
          });
      }
    }, [query]);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
            <DialogTrigger asChild>
                <button className="size-9 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/5 transition-all duration-200">
                    <Search className="size-5" />
                </button>
            </DialogTrigger>
        <DialogContent className="bg-formovies-surface border-white/10 text-white sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="font-display text-xl tracking-wider text-white">
              Search
            </DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Search movies or series..."
            className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-formovies-gold/50"
            onChange={(e) => search(e.target.value)}
            autoFocus
          />
          {loading && <Loader className="size-5 animate-spin mx-auto text-formovies-gold" />}
          {!loading && (
            <div className="max-h-[350px] overflow-y-auto scrollbar-thin">
              {movies?.results.map((movie) => (
                  <div
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-all duration-200"
                    key={movie.id}
                    onClick={() => onSelect(`/home/watch/${movie.media_type === "tv" ? "series" : "movie"}/${movie.id}`)}
                  >
                    <div className="shrink-0">
                      <Image
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        className="size-14 object-cover rounded-md"
                        width={56}
                        height={84}
                        alt={movie.title || movie.name || ""}
                      />
                    </div>
                    <div className="flex flex-col gap-1 min-w-0">
                      <span className="font-medium text-sm text-white/90 truncate">
                        {movie.media_type === "movie" ? movie.title : movie.name}
                      </span>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="bg-formovies-gold/20 text-formovies-gold text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
                          {movie.media_type}
                        </span>
                        {movie.vote_average && (
                          <span className="flex items-center gap-1 text-[11px] text-white/50">
                            <Star className="size-3 text-formovies-gold fill-formovies-gold" />
                            {movie.vote_average.toFixed(1)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
              ))}
              {query && movies?.results?.length === 0 && (
                <p className="text-white/40 text-sm text-center py-8">No results found</p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    )
}

export default SearchDialog;
