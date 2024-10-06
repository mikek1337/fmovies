import MovieDetails from "@/components/moviedetails";
import Recommendation from "@/components/recommendation";
import VideoPlayer from "@/components/videoplayer";
import { Suspense } from "react";
import Comment from "@/components/comment"
const Page = async({params}:{params:{id:string}})=>{
    const videoUrl = `https://vidsrc.icu/embed/movie/${params.id}`
    return(
        <>
        <div className="">
            <VideoPlayer videoUrl={videoUrl}/>
        </div>
        <div className=" my-10 ">
            
            <Suspense fallback={<div>Loading...</div>}>
            <MovieDetails id={parseInt(params.id)}/>
            </Suspense>
            
        </div>
      {  <div>
            <Comment id={parseInt(params.id)}/>
        </div>}
        <div>
            <Suspense fallback={<div>Loading...</div>}>
            <Recommendation id={parseInt(params.id)}/>
            </Suspense>
        </div>
        </>
    )
}

export default Page;