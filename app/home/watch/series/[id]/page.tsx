import Series from "@/components/series";
import { seriesDetail } from "@/lib/tmd";
import { Metadata } from "next";
type props={
    params:{
        id:string
    }
}
export async function generateMetadata(params:props):Promise<Metadata> {
    
    if(!params.params.id) {
        return {
            title: "Movie Not Found",
            description: "The movie you are looking for does not exist.",
        };
    }
    const movie = await await seriesDetail(parseInt(params.params.id));
    return{
        title: `${movie.data.name} - Watch Series`,
        description: movie.data.overview,
        openGraph:{
            title: `${movie.data.name} - Watch Series`,
            description: movie.data.overview,
            images: [
                {
                    url: `http://image.tmdb.org/t/p/w500${movie.data.poster_path}`,
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
        <>
            <Series id={parseInt(params.id)} />

        </>)
}

export default Page;