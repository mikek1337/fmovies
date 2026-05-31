'use client'
import { FC, useState } from "react";
import VideoPlayer from "./videoplayer";
import ServerControl from "./servercontrol";
import { Clapperboard } from "lucide-react";

interface VideoServerControllerProps {
    mediaType?: string;
    additionalParams?: string;
}

type ServerConfig = {
  moviePath: string;
  tvPath: string;
  suffix?: string;
};

const serverConfigs: Record<string, ServerConfig> = {
  "vidsrc.ru": { moviePath: "/movie/", tvPath: "/tv/", suffix: "?parameters" },
  "vidlink.pro": { moviePath: "/movie/", tvPath: "/tv/" },
  "vidsrc.icu": { moviePath: "/embed/movie/", tvPath: "/embed/tv/" },
  "2embed.org": { moviePath: "/embed/movie/", tvPath: "/embed/tv/" },
};

const VideoServerController: FC<VideoServerControllerProps> = ({ mediaType, additionalParams }) => {
    const [domain, setDomain] = useState<string>("vidsrc.ru");
    const selectServer = (serverUrl: string) => {
        setDomain(serverUrl);
    }
    const config = serverConfigs[domain] ?? serverConfigs["vidsrc.ru"];
    const path = mediaType === "tv" ? config.tvPath : config.moviePath;
    const videoUrl = `https://${domain}${path}${additionalParams}${config.suffix ?? ""}`;

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
                <Clapperboard className="size-5 text-formovies-gold" />
                <h2 className="font-display text-2xl tracking-wider text-white">Watch Now</h2>
            </div>
            <div className="rounded-xl overflow-hidden formovies-card">
                <div className="relative aspect-video bg-formovies-deeper">
                    <VideoPlayer videoUrl={videoUrl} />
                </div>
            </div>
            <ServerControl selectServer={selectServer} />
        </div>
    )
}

export default VideoServerController;
