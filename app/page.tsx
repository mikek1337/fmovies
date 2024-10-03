import ToolTip from "@/components/tooltip";
import { buttonVariants } from "@/components/ui/button";
import { latestMovies } from "@/lib/tmd";
import { cn } from "@/lib/utils";
import { HomeIcon } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  const movies = await (await latestMovies()).data;
 
  return (
    <div className="bg-home-background">
      <div className="flex flex-col mx-auto w-full items-center justify-center gap-3 h-screen bg-black/35">
      <div className="bg-white rounded-md">
            <div className="my-2">
              <h1 className="md:text-5xl text-center text-2xl font-extrabold text-indigo-400">Movies</h1>
            </div>
            <div className="flex flex-wrap gap-1 items-center justify-center max-w-[700px] shadow-md rounded-md p-1 ">
              {
                movies.results.map((movie)=>(
                  <ToolTip text={movie.title} key={movie.id}>
                  <span  className=" line-clamp-1 text-sm text-zinc-300 max-w-[100px]  w-fit">
                    <Link href={`/home/watch/${movie.id}`} className="hover:text-indigo-500">
                      {movie.title}
                    </Link>
                  </span>
                  </ToolTip>
                ))
              }
              <div className="w-full my-10 px-10">
                <Link href="/home" className={cn(buttonVariants({variant:'ghost'}), "flex items-center gap-2 bg-indigo-500 text-white font-semibold w-full")}>
                  <HomeIcon className="w-5 h-5 fill-white"/>
                  Home
                </Link>
              </div>
            </div>
      </div>
      </div>
    </div>
  );
}
