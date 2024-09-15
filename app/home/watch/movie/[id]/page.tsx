import MovieDetails from "@/components/moviedetails";
import Recommendation from "@/components/recommendation";
import VideoPlayer from "@/components/videoplayer";
import { movieDetail } from "@/lib/tmd";
import { Suspense } from "react";

const Page = async({params}:{params:{id:string}})=>{
    //const movieDetails = await (await movieDetail(parseInt(params.id))).data;
    const videoUrl = `https://vidsrc.icu/embed/movie/${params.id}`
    return(
        <>
        <div className="w-full my-4">
            <VideoPlayer videoUrl={videoUrl}/>
        </div>
        <div className=" my-10 flex justify-center">
            
            <Suspense fallback={<div>Loading...</div>}>
            <MovieDetails id={parseInt(params.id)}/>
            </Suspense>
            
        </div>
        <div>
            <Suspense fallback={<div>Loading...</div>}>
            <Recommendation id={parseInt(params.id)}/>
            </Suspense>
        </div>
        </>
    )
}

export default Page;