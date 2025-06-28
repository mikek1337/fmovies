'use client'
import { FC, useState } from "react";
import VideoPlayer from "./videoplayer";
import ServerControl from "./servercontrol";
interface VideoServerControllerProps{
    mediaType?: string,
    additionalParams?: string,
}
const VideoServerController:FC<VideoServerControllerProps> = ({mediaType, additionalParams})=>{
    const [domain, setDomain] = useState<string>("vidsrc.icu");
    const selectServer = (serverUrl:string)=>{
        setDomain(serverUrl);
        
    }
    let videoUrl = `https://${domain}/embed`;
    if(mediaType ==="tv"){
        videoUrl += `/tv/${additionalParams}`;
    }
    else{
        videoUrl += `/movie/${additionalParams}`;
    }
    return(
        <div>
            <div className=" rounded-md h-fit">
                <h2 className="text-3xl font-bold text-indigo-900 mb-4">Watch Now</h2>
                <VideoPlayer videoUrl={videoUrl}/>
            </div>
                <ServerControl selectServer={selectServer}/>

        </div>
    )
}

export default VideoServerController;