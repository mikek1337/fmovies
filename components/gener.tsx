import { geners, tmdb, FALLBACK_MOVIE_GENRES, FALLBACK_TV_GENRES } from "@/lib/tmd";
import { FC } from "react";
import Link from "next/link";
import { Film, Tv } from "lucide-react";

const Gener: FC = async () => {
    let movieGenres = FALLBACK_MOVIE_GENRES;
    let tvGenres = FALLBACK_TV_GENRES;

    try {
        const [movieRes, tvRes] = await Promise.allSettled([
            geners(),
            tmdb.genres.tvList(),
        ]);

        if (movieRes.status === "fulfilled" && movieRes.value?.data?.genres?.length) {
            movieGenres = movieRes.value.data.genres;
        }

        if (tvRes.status === "fulfilled" && tvRes.value?.data?.genres?.length) {
            tvGenres = tvRes.value.data.genres;
        }
    } catch (err) {
        console.warn("Unable to fetch live genres from TMDB, using fallback genres:", err);
    }

    return (
        <div className="p-4 w-[420px] sm:w-[540px] md:w-[620px]">
            <div className="grid grid-cols-2 gap-6">
                <div>
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-formovies-gold border-b border-white/10 pb-2 mb-3">
                        <Film className="size-3.5" />
                        <span>Movie Genres</span>
                    </div>
                    <ul className="grid grid-cols-2 gap-1 max-h-[320px] overflow-y-auto scrollbar-thin pr-1">
                        {movieGenres.map((genre) => (
                            <li key={`movie-${genre.id}`}>
                                <Link
                                    href={`/home/movies?genre=${genre.id}`}
                                    className="block px-2.5 py-1.5 text-xs text-white/60 hover:text-formovies-gold hover:bg-white/5 rounded-md transition-all duration-200 font-medium truncate"
                                >
                                    {genre.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-formovies-gold border-b border-white/10 pb-2 mb-3">
                        <Tv className="size-3.5" />
                        <span>TV Series Genres</span>
                    </div>
                    <ul className="grid grid-cols-2 gap-1 max-h-[320px] overflow-y-auto scrollbar-thin pr-1">
                        {tvGenres.map((genre) => (
                            <li key={`tv-${genre.id}`}>
                                <Link
                                    href={`/home/series?genre=${genre.id}`}
                                    className="block px-2.5 py-1.5 text-xs text-white/60 hover:text-formovies-gold hover:bg-white/5 rounded-md transition-all duration-200 font-medium truncate"
                                >
                                    {genre.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Gener;
