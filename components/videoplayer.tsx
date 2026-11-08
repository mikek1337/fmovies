"use client";

import { FC, useState } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoPlayerProps {
  videoUrl: string;
  className?: string;
  reloadKey?: number;
}

const VideoPlayer: FC<VideoPlayerProps> = ({ videoUrl, className, reloadKey = 0 }) => {
  const [loading, setLoading] = useState(true);

  return (
    <div className={cn("relative w-full h-full aspect-video bg-black flex items-center justify-center overflow-hidden", className)}>
      {loading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-formovies-deeper/90 gap-3">
          <Loader2 className="size-8 animate-spin text-formovies-gold" />
          <p className="text-xs font-medium text-white/50 animate-pulse">
            Connecting to secure streaming server...
          </p>
        </div>
      )}

      <iframe
        key={`${videoUrl}-${reloadKey}`}
        src={videoUrl}
        className="w-full h-full border-0 relative z-20"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        allowFullScreen
        onLoad={() => setLoading(false)}
      />
    </div>
  );
};

export default VideoPlayer;
