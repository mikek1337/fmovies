"use client"
import { MovieResponse } from "@/app/types/moviedbresponse";
import axios from "axios";
import { FC, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Loader, SearchIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
const SearchDialog:FC = ()=>{
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

    const onSelect = (routeUrl:string)=>{
        setIsOpen(false);
        router.push(routeUrl);
    }
    useEffect(() => {
      if (query != "") {
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
    return(
        <Dialog open={isOpen} onOpenChange={(open)=>setIsOpen(open)}>
            <DialogTrigger>
                <SearchIcon className="w-6 h-6 cursor-pointer rounded-full p-1 hover:shadow-md" />
            </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Search Movies
  
            </DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Search movies or series...."
            className="w-full"
            onChange={(e) => search(e.target.value)}
          />
          {loading && <Loader className="w-5 h-5 animate-spin mx-auto " />}
          {!loading && (
            <div className=" w-full shadow-md max-h-[300px] overflow-auto scroll-m-0 bg-white">
              {movies?.results.map((movie) => (
                  <div className="flex items-center w-full border gap-2 cursor-pointer" key={movie.id} onClick={()=>onSelect(`/home/watch/${
                    movie.media_type === "tv" ? "series" : "movie"
                  }/${movie.id}`)}>
                    <div className="">
                      <Image
                        src={`http://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        className="w-[50px] h-[100px] object-contain"
                        width={500}
                        height={500}
                        alt="poster pic"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="font-bold text-xs">
                        {movie.media_type === "movie"
                          ? movie.title
                          : movie.name}
                      </span>
                      <div className="flex items-center gap-2 w-full">
                        <span className="bg-indigo-500 text-white text-xs rounded-full px-3">
                          {movie.media_type}
                        </span>
                        <span className="bg-zinc-300 rounded-full px-2 text-xs">
                          {movie.vote_average
                            ? movie.vote_average.toFixed(1)
                            : 0.0}
                        </span>
                        <span className="border rounded-full px-2 text-xs">
                          {movie.media_type === "movie"
                            ? new Date(movie.release_date).toDateString()
                            : new Date(movie.first_air_date).toDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    )
}

export default SearchDialog;