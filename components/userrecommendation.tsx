"use client"
import { MovieResponse } from "@/app/types/moviedbresponse";
import { FC, Fragment, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Play, Check, Star } from "lucide-react";
import useWatchList from "@/hooks/use-watchlist";

type UserTrendingProps = {
  media: MovieResponse;
};

const UserTrending: FC<UserTrendingProps> = ({ media }) => {
  const { AddWatchList } = useWatchList();
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  const addToList = (id: string, mediaType: string, poster: string, title: string) => {
    AddWatchList({ mediaId: id, MediaType: mediaType, poster_url: poster, title });
    setAddedIds(prev => new Set(prev).add(id));
  };

  const items = media?.results?.filter(c => c.media_type !== "person") || [];

  if (items.length === 0) return null;

  return (
    <div className="relative">
      <div className="flex gap-5 overflow-x-auto scrollbar-thin pb-4 -mx-2 px-2 snap-x snap-mandatory">
        {items.map((content, i) => {
          const id = content.id.toString();
          const title = content.media_type === "tv" ? content.name : content.title;
          const isAdded = addedIds.has(id);

          return (
            <div
              key={`trending-${id}`}
              className="group formovies-card w-[260px] shrink-0 snap-start animate-fade-in-up overflow-visible"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="aspect-[2/3] relative overflow-hidden rounded-xl">
                <Image
                  src={`https://image.tmdb.org/t/p/w500${content.poster_path}`}
                  alt={title || ""}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="260px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-formovies-dark/80 via-transparent to-transparent" />

                <div className="absolute top-3 left-3">
                  <span className="px-2 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-white/10 text-white/80 border border-white/20 backdrop-blur-sm">
                    {content.media_type === "tv" ? "Series" : "Movie"}
                  </span>
                </div>

                {content.vote_average && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-md bg-formovies-gold/20 backdrop-blur-sm border border-formovies-gold/30">
                    <Star className="w-3 h-3 text-formovies-gold fill-formovies-gold" />
                    <span className="text-[11px] font-semibold text-formovies-gold">
                      {content.vote_average.toFixed(1)}
                    </span>
                  </div>
                )}

                <div className="absolute bottom-3 left-3 right-3 flex gap-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400">
                  <button
                    onClick={() => addToList(id, content.media_type, content.poster_path, title)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                      isAdded
                        ? "bg-formovies-gold text-formovies-dark"
                        : "bg-white/10 text-white hover:bg-formovies-gold hover:text-formovies-dark"
                    }`}
                  >
                    {isAdded ? (
                      <><Check className="w-3.5 h-3.5" /> Added</>
                    ) : (
                      <><Plus className="w-3.5 h-3.5" /> Watchlist</>
                    )}
                  </button>
                  <Link
                    href={`/home/watch/${content.media_type === "tv" ? "series" : "movie"}/${id}`}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider bg-formovies-gold text-formovies-dark transition-all duration-300 hover:bg-formovies-amber"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" /> Play
                  </Link>
                </div>
              </div>

              <div className="p-3.5">
                <h3 className="font-body text-sm font-semibold text-white/90 line-clamp-1 group-hover:text-formovies-gold transition-colors duration-300">
                  {title}
                </h3>
                {content.overview && (
                  <p className="text-[11px] text-white/40 line-clamp-2 mt-1.5 leading-relaxed">
                    {content.overview}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserTrending;
