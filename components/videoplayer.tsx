import { FC } from "react";
interface VideoPlayerProps{
    videoUrl:string
}
const VideoPlayer:FC<VideoPlayerProps> = ({videoUrl})=>{
    return(
        <div className="w-full">
            <div className="w-full h-full">
                <iframe src={videoUrl} className="w-full  md:h-[600px] h-[300px] rounded-md"  allow="autoplay; encrypted-media" allowFullScreen ></iframe>
            </div>
        </div>
    )
}

export default VideoPlayer;