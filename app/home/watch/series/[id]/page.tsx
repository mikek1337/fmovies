import Series from "@/components/series";
import { seriesDetail } from "@/lib/tmd";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    if (!id) {
        return {
            title: "Series Not Found",
            description: "The series you are looking for does not exist.",
        };
    }
    const movie = await seriesDetail(parseInt(id));
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

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    return (
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-8">
            <Series id={parseInt(id)} />
        </div>
    )
}

export default Page;
