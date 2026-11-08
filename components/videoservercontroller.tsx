"use client";

import { FC, useState, useRef } from "react";
import VideoPlayer from "./videoplayer";
import ServerControl from "./servercontrol";
import {
  Clapperboard,
  Maximize2,
  Minimize2,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Info,
  Tv,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface VideoServerControllerProps {
  mediaType?: "movie" | "tv" | string;
  additionalParams?: string;
  title?: string;
  // TV Episode Stepper
  season?: number;
  episode?: number;
  hasPrevEpisode?: boolean;
  hasNextEpisode?: boolean;
  onPrevEpisode?: () => void;
  onNextEpisode?: () => void;
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
  "vidsrc-embed.ru": { moviePath: "/embed/movie/", tvPath: "/embed/tv/" },
  "embed.su": { moviePath: "/embed/movie/", tvPath: "/embed/tv/" },
};

const VideoServerController: FC<VideoServerControllerProps> = ({
  mediaType = "movie",
  additionalParams,
  title,
  season,
  episode,
  hasPrevEpisode,
  hasNextEpisode,
  onPrevEpisode,
  onNextEpisode,
}) => {
  const [domain, setDomain] = useState<string>("vidsrc.ru");
  const [isTheaterMode, setIsTheaterMode] = useState<boolean>(false);
  const [reloadKey, setReloadKey] = useState<number>(0);
  const playerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const selectServer = (serverUrl: string) => {
    setDomain(serverUrl);
  };

  const toggleTheaterMode = () => {
    const nextState = !isTheaterMode;
    setIsTheaterMode(nextState);

    if (nextState) {
      setTimeout(() => {
        playerRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);
    }
  };

  const handleReload = () => {
    setReloadKey((prev) => prev + 1);
    toast({
      description: "Reloading video stream...",
    });
  };

  const config = serverConfigs[domain] ?? serverConfigs["vidsrc.ru"];
  const path = mediaType === "tv" ? config.tvPath : config.moviePath;
  const videoUrl = `https://${domain}${path}${additionalParams}${config.suffix ?? ""}`;

  return (
    <div
      ref={playerRef}
      className={cn(
        "flex flex-col gap-4 transition-all duration-500",
        isTheaterMode
          ? "w-screen relative left-1/2 -translate-x-1/2 max-w-none px-4 sm:px-8 lg:px-16 bg-[#06070a]/95 py-6 my-4 border-y border-white/10 shadow-[0_20px_80px_rgba(0,0,0,0.95)]"
          : "w-full"
      )}
    >
      <div className={cn(isTheaterMode ? "max-w-[1700px] w-full mx-auto" : "w-full")}>
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-formovies-gold/15 border border-formovies-gold/30 flex items-center justify-center text-formovies-gold">
              {mediaType === "tv" ? (
                <Tv className="size-4" />
              ) : (
                <Clapperboard className="size-4" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-2xl tracking-wide text-white leading-none">
                  {mediaType === "tv" ? "Watch Series" : "Watch Movie"}
                </h2>
                {mediaType === "tv" && season && episode && (
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-formovies-gold/20 text-formovies-gold border border-formovies-gold/30">
                    S{season} E{episode}
                  </span>
                )}
              </div>
              {title && (
                <p className="text-xs text-white/50 truncate max-w-md mt-0.5">
                  {title}
                </p>
              )}
            </div>
          </div>

          {/* Quick Actions (Episode stepper & Player tools) */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* TV Episode Quick Stepper */}
            {mediaType === "tv" && (onPrevEpisode || onNextEpisode) && (
              <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/10 mr-1">
                <button
                  type="button"
                  onClick={onPrevEpisode}
                  disabled={!hasPrevEpisode}
                  title="Previous Episode"
                  className={cn(
                    "flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors",
                    hasPrevEpisode
                      ? "text-white/80 hover:text-white hover:bg-white/10"
                      : "text-white/20 cursor-not-allowed"
                  )}
                >
                  <ChevronLeft className="size-3.5" />
                  <span className="hidden sm:inline">Prev</span>
                </button>

                <span className="text-xs font-semibold text-white/60 px-2">
                  S{season} E{episode}
                </span>

                <button
                  type="button"
                  onClick={onNextEpisode}
                  disabled={!hasNextEpisode}
                  title="Next Episode"
                  className={cn(
                    "flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors",
                    hasNextEpisode
                      ? "text-white/80 hover:text-white hover:bg-white/10"
                      : "text-white/20 cursor-not-allowed"
                  )}
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="size-3.5" />
                </button>
              </div>
            )}

            {/* Refresh Stream Button */}
            <button
              type="button"
              onClick={handleReload}
              title="Reload Stream"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 text-xs font-medium transition-all"
            >
              <RotateCw className="size-3.5" />
              <span className="hidden sm:inline">Reload</span>
            </button>

            {/* Theater Mode Toggle */}
            <button
              type="button"
              onClick={toggleTheaterMode}
              title={isTheaterMode ? "Exit Theater Mode" : "Enter Theater Mode"}
              className={cn(
                "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 border",
                isTheaterMode
                  ? "bg-formovies-gold text-formovies-dark font-semibold border-formovies-gold shadow-md shadow-formovies-gold/20"
                  : "bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border-white/10"
              )}
            >
              {isTheaterMode ? (
                <>
                  <Minimize2 className="size-3.5" />
                  <span>Exit Theater</span>
                </>
              ) : (
                <>
                  <Maximize2 className="size-3.5" />
                  <span>Theater Mode</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Video Player Container */}
        <div
          className={cn(
            "rounded-2xl overflow-hidden formovies-card shadow-2xl relative transition-all duration-500",
            isTheaterMode
              ? "aspect-video max-h-[82vh] border-formovies-gold/30 shadow-[0_0_80px_rgba(0,0,0,0.8)]"
              : "aspect-video"
          )}
        >
          <VideoPlayer videoUrl={videoUrl} reloadKey={reloadKey} />
        </div>

        {/* Server Controls & Troubleshooting Info */}
        <div className="mt-4 flex flex-col gap-3">
          <ServerControl selectServer={selectServer} currentServer={domain} />

          <div className="flex items-center gap-2 text-[11px] text-white/40 px-2">
            <Info className="size-3 text-formovies-gold shrink-0" />
            <p>
              Experiencing slow playback or ads? Try switching to Server 2 (VidLink) or Server 5 (EmbedSu), or click Reload.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoServerController;
