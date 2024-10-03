"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import CloseModal from "@/components/closemodal";
import { MovieResponse } from "@/app/types/moviedbresponse";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";
import Link from "next/link";
import axios from "axios";
const Page = () => {
  const [query, setQuery] = useState<string>("");
  const [movies, setMovies] = useState<MovieResponse>();
  const [loading, setLoading] = useState<boolean>(false);
  const search = (queryString: string) => {
    if (queryString) {
      setQuery(queryString);
      setLoading(true);
    }
  };
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
  return (
    <>
 
    <div className="fixed inset-0 bg-zinc-900/20 z-10 ">
      <div className="container flex items-center h-full max-w-lg mx-auto">
        <div className="relative bg-white w-full h-fit py-20 px-2 rounded-lg">
          <div className="flex items-center justify-between w-full px-2 absolute top-4 -right-0 ">
            <h1 className="text-2xl font-bold">Search Movies</h1>
            <CloseModal />
          </div>

          <div className="relative w-full">
            <Input
              placeholder="Search movies or series...."
              className="w-full"
              onChange={(e) => search(e.target.value)}
            />
            {loading && <Loader className="w-5 h-5 animate-spin mx-auto " />}
            {!loading && (
              <div className=" w-full shadow-md max-h-[300px] overflow-auto scroll-m-0 bg-white">
                {movies?.results.map((movie) => (
                  <Link
                    href={`/home/watch/${
                      movie.media_type === "tv" ? "series" : "movie"
                    }/${movie.id}`}
                    key={movie.id}
                    className="flex items-center gap-2"
                  >
                    <div className="flex items-center w-full border gap-2">
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
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Page;
