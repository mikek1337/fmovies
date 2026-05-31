import Series from "@/components/series";
import { seriesDetail } from "@/lib/tmd";
import { Metadata } from "next";

type props = {
    params: {
        id: string
    }
}

export async function generateMetadata(params: props): Promise<Metadata> {
    if (!params.params.id) {
        return {
            title: "Series Not Found",
            description: "The series you are looking for does not exist.",
        };
    }
    const movie = await seriesDetail(parseInt(params.params.id));
    return {
        title: `${movie.data.name} - Watch Series`,
        description: movie.data.overview,
        openGraph: {
            title: `${movie.data.name} - Watch Series`,
            description: movie.data.overview,
            images: [
                {
                    url: `https://image.tmdb.org/t/p/w500${movie.data.poster_path}`,
                    width: 800,
                    height: 600,
                    alt: movie.data.name,
                },
            ],
        }
    }
}

const Page = ({ params }: { params: { id: string } }) => {
    return (
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-8">
            <Series id={parseInt(params.id)} />
        </div>
    )
}

export default Page;
