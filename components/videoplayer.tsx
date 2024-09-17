import { FC } from "react";
interface VideoPlayerProps{
    videoUrl:string
}
const VideoPlayer:FC<VideoPlayerProps> = ({videoUrl})=>{
    return(
        <div className="flex justify-center w-full">
            <div className="w-full h-fit bg-zinc-900">
                <iframe src={videoUrl} className="w-[1200px] h-[700px] rounded-md mx-auto backdrop-hue-rotate-180" frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen></iframe>
            </div>
        </div>
    )
}

export default VideoPlayer;