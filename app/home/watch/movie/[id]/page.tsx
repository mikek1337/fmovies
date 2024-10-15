
import MovieDetails from "@/components/moviedetails";
import Recommendation from "@/components/recommendation";
import Comment from "@/components/comment"
import VideoServerController from "@/components/videoservercontroller";

const Page = ({params}:{params:{id:string}})=>{
    
    return(
        <>
        <VideoServerController mediaType="movie" additionalParams={params.id}/>
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