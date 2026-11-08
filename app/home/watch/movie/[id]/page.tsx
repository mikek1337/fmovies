import MovieDetails from "@/components/moviedetails";
import CastCrew from "@/components/castcrew";
import Recommendation from "@/components/recommendation";
import Comment from "@/components/comment"
import VideoServerController from "@/components/videoservercontroller";
import { Metadata } from "next";
import { movieDetail } from "@/lib/tmd";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    if (!id) {
        return {
            title: "Movie Not Found",
            description: "The movie you are looking for does not exist.",
        };
    }
    try {
        const movie = await movieDetail(parseInt(id));
        return {
            title: `${movie.data.title} - Watch Movie`,
            description: movie.data.overview,
            openGraph: {
                title: `${movie.data.title} - Watch Movie`,
                description: movie.data.overview,
                images: [
                    {
                        url: `https://image.tmdb.org/t/p/w500${movie.data.poster_path}`,
                        width: 800,
                        height: 600,
                        alt: movie.data.title,
                    },
                ],
            }
        };
    } catch {
        return {
            title: "Watch Movie",
            description: "Watch movie on ForMovies",
        };
    }
}

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    let movieData = null;
    try {
        movieData = (await movieDetail(parseInt(id))).data;
    } catch (err) {
        console.warn("Unable to fetch movie detail for watch page:", err);
    }

    return (
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-8">
            <div className="flex flex-col gap-10">
                <MovieDetails id={parseInt(id)} />
                <VideoServerController
                    mediaType="movie"
                    additionalParams={id}
                    title={movieData?.title}
                />
                <CastCrew id={parseInt(id)} mediaType="movie" />
                <Comment
                    id={parseInt(id)}
                    mediaType="movie"
                    voteAverage={movieData?.vote_average}
                    voteCount={movieData?.vote_count}
                />
                <Recommendation id={parseInt(id)} />
            </div>
        </div>
    )
}

export default Page;
