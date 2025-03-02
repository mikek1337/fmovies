'use client'
import { FC, useState } from "react";
import VideoPlayer from "./videoplayer";
import ServerControl from "./servercontrol";
interface VideoServerControllerProps{
    mediaType?: string,
    additionalParams?: string,
    url?: string
}
const VideoServerController:FC<VideoServerControllerProps> = ({mediaType, additionalParams, url})=>{
    const [domain, setDomain] = useState<string>("vidsrc.icu");
    
    const selectServer = (serverUrl:string)=>{
        setDomain(serverUrl);
        
    }
    let videoUrl = url || `https://${domain}/embed`;
    if(!url || url===""){
        if(mediaType ==="tv"){
            videoUrl += `/tv/${additionalParams}`;
        }
        else{
            videoUrl += `/movie/${additionalParams}`;
        }
    }
    return(
        <div className="px-5 h-fit">
            <VideoPlayer videoUrl={videoUrl}/>
            <ServerControl selectServer={selectServer}/>
        </div>
    )
}

export default VideoServerController;