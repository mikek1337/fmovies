import MovieDetails from "@/components/moviedetails";
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
    }
}

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    return (
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-8">
            <div className="flex flex-col gap-10">
                <MovieDetails id={parseInt(id)} />
                <VideoServerController mediaType="movie" additionalParams={id} />
                <Comment id={parseInt(id)} />
                <Recommendation id={parseInt(id)} />
            </div>
        </div>
    )
}

export default Page;
