"use client";
import { forwardRef, useImperativeHandle, useRef, useEffect, useCallback } from "react";
import { sendCommandToPlayer, VidFastCommand, isPlayerEvent, isValidVidFastOrigin, PlayerEventData } from "@/lib/postmessage-player";

export interface VideoPlayerHandle {
  sendCommand: (cmd: VidFastCommand) => void;
  getIframe: () => HTMLIFrameElement | null;
}

interface VideoPlayerProps {
  videoUrl: string;
  onPlayerEvent?: (event: PlayerEventData) => void;
}

const VideoPlayer = forwardRef<VideoPlayerHandle, VideoPlayerProps>(
  ({ videoUrl, onPlayerEvent }, ref) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useImperativeHandle(ref, () => ({
      sendCommand: (cmd: VidFastCommand) => {
        sendCommandToPlayer(iframeRef.current, cmd);
      },
      getIframe: () => iframeRef.current,
    }));

    const handleMessage = useCallback(
      (event: MessageEvent) => {
        if (!isValidVidFastOrigin(event.origin)) return;
        if (isPlayerEvent(event.data) && onPlayerEvent) {
          onPlayerEvent(event.data.data);
        }
      },
      [onPlayerEvent]
    );

    useEffect(() => {
      window.addEventListener("message", handleMessage);
      return () => window.removeEventListener("message", handleMessage);
    }, [handleMessage]);

    return (
      <div className="w-full aspect-video">
        <iframe
          ref={iframeRef}
          src={videoUrl}
          className="w-full h-full"
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
      </div>
    );
  }
);

VideoPlayer.displayName = "VideoPlayer";

export default VideoPlayer;
