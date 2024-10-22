import { FC } from "react";
interface VideoPlayerProps{
    videoUrl:string
}
const VideoPlayer:FC<VideoPlayerProps> = ({videoUrl})=>{
    return(
        <div >
            <div className="w-full h-full">
                <iframe src={videoUrl} className="w-full md:h-[600px] h-[500px]"  allow="autoplay; encrypted-media" allowFullScreen ></iframe>
            </div>
        </div>
    )
}

export default VideoPlayer;