import { FC } from "react";
interface VideoPlayerProps{
    videoUrl:string
}
const VideoPlayer:FC<VideoPlayerProps> = ({videoUrl})=>{
    return(
        <div className="flex justify-center w-full">
            <div className="w-fit h-fit bg-black">
                <iframe src={videoUrl} className="w-[1200px] h-[700px] rounded-md" frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen></iframe>
            </div>
        </div>
    )
}

export default VideoPlayer;