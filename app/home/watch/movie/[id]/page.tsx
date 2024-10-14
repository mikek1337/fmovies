import MovieDetails from "@/components/moviedetails";
import Recommendation from "@/components/recommendation";
import VideoPlayer from "@/components/videoplayer";
import { Suspense } from "react";
import Comment from "@/components/comment"
import ServerControl from "@/components/servercontrol";

const Page = async({params}:{params:{id:string}})=>{
    var domain = "vidsrc.icu"
    const selectServer = async (serverUrl:string)=>{
        "use server"
        domain = serverUrl
    }
    const videoUrl = `https://${domain}/embed/movie/${params.id}`
    return(
        <>
        <div className="px-5 h-fit">
            <VideoPlayer videoUrl={videoUrl}/>
           <ServerControl selectServer={selectServer}/>
        </div>
        <div className=" my-10 ">
            
           
            <MovieDetails id={parseInt(params.id)}/>
            
            
        </div>
      <div>
            <Comment id={parseInt(params.id)}/>
        </div>
        <div>
            
            <Recommendation id={parseInt(params.id)}/>
       
        </div>
        </>
    )
}

export default Page;