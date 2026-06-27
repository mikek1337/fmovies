"use client";
import { FC } from "react";
import { Play, Pause, Maximize, Crown } from "lucide-react";

interface WatchTogetherControlsProps {
  isHost: boolean;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
}

const WatchTogetherControls: FC<WatchTogetherControlsProps> = ({
  isHost,
  isPlaying,
  onPlay,
  onPause,
}) => {
  if (!isHost) return null;

  return (
    <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
      <Crown className="size-3.5 text-formovies-gold" />
      <span className="text-[11px] font-semibold uppercase tracking-wider text-formovies-gold mr-2">
        Host Controls
      </span>
      <button
        onClick={isPlaying ? onPause : onPlay}
        className="size-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
        title={isPlaying ? "Pause for everyone" : "Play for everyone"}
      >
        {isPlaying ? <Pause className="size-4 text-white" /> : <Play className="size-4 text-white" />}
      </button>
      <button
        className="size-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors ml-auto"
        title="Fullscreen"
      >
        <Maximize className="size-3.5 text-white/50" />
      </button>
    </div>
  );
};

export default WatchTogetherControls;
