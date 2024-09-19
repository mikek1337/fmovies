import { FC } from "react";
interface VideoPlayerProps{
    videoUrl:string
}
const VideoPlayer:FC<VideoPlayerProps> = ({videoUrl})=>{
    return(
        <div className="flex justify-center max-w-full">
            <div className="max-w-full h-fit bg-zinc-900">
                <iframe src={videoUrl} className="w-[1200px] h-[700px] rounded-md mx-auto " allow="autoplay; encrypted-media" allowFullScreen></iframe>
            </div>
        </div>
    )
}

export default VideoPlayer;