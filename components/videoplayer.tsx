import { FC } from "react";
interface VideoPlayerProps{
    videoUrl:string
}
const VideoPlayer:FC<VideoPlayerProps> = ({videoUrl})=>{
    return(
        <div className="flex justify-center w-full">
            <div className="flex w-full h-fit bg-zinc-900">
                <iframe src={videoUrl} className="md:w-[1200px] md:h-[700px] w-full h-[500px] rounded-md mx-auto " allow="autoplay; encrypted-media" allowFullScreen></iframe>
            </div>
        </div>
    )
}

export default VideoPlayer;