
import MovieDetails from "@/components/moviedetails";
import Recommendation from "@/components/recommendation";
import Comment from "@/components/comment"
import VideoServerController from "@/components/videoservercontroller";
import { Metadata } from "next";
import { movieDetail } from "@/lib/tmd";
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
    const movie = await movieDetail(parseInt(params.params.id));
    return{
        title: movie.data.title,
        description: movie.data.overview,
        openGraph:{
            title: movie.data.title,
            description: movie.data.overview,
            images: [
                {
                    url: `http://image.tmdb.org/t/p/w500${movie.data.poster_path}`,
                    width: 800,
                    height: 600,
                    alt: movie.data.title,
                },
            ],
        }
    }


}
const Page = async ({params}:props)=>{
    
    return(
        <div className=" my-10 ">
        <div className="flex flex-col gap-5 max-w-6xl mx-auto bg-white rounded-md p-10">
            <MovieDetails id={parseInt(params.id)}/>
            <VideoServerController mediaType="movie" additionalParams={params.id}/>
            <div>
                <Comment id={parseInt(params.id)}/>
            </div>
            <div>    
                <Recommendation id={parseInt(params.id)}/>
            </div>
        </div>
        </div>
    )
}

export default Page;