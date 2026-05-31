import { FC } from "react";

interface VideoPlayerProps {
    videoUrl: string
}

const VideoPlayer: FC<VideoPlayerProps> = ({ videoUrl }) => {
    return (
        <div className="w-full aspect-video">
            <iframe
                src={videoUrl}
                className="w-full h-full"
                allow="autoplay; encrypted-media"
                allowFullScreen
            />
        </div>
    )
}

export default VideoPlayer;
