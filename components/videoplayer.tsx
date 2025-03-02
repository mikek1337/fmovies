'use client'
import { FC, useEffect, useRef } from "react";
interface VideoPlayerProps{
    videoUrl:string
}
const VideoPlayer:FC<VideoPlayerProps> = ({videoUrl})=>{
    const ref = useRef<HTMLIFrameElement>(null);
    useEffect(()=>{
        const btn = document.getElementById('pl_but');
        console.log(ref);
        if(btn){
            btn.click();
        }
        },[videoUrl])
   
    return(
        <div >
            <div className="w-full h-full">
                <iframe src={videoUrl} ref={ref} className="w-full md:h-[600px] h-[500px]"  allow="autoplay; encrypted-media" allowFullScreen ></iframe>
            </div>
        </div>
    )
}

export default VideoPlayer;