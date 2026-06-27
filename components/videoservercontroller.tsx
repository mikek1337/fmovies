'use client'
import { FC, useState, useRef, useCallback, useEffect } from "react";
import VideoPlayer, { VideoPlayerHandle } from "./videoplayer";
import ServerControl from "./servercontrol";
import WatchTogetherButton from "./watch-together/watch-together-button";
import WatchTogetherPanel from "./watch-together/watch-together-panel";
import { useWatchTogether } from "@/hooks/useWatchTogether";
import { useWatchTogetherChat } from "@/hooks/useWatchTogetherChat";
import { useSession } from "@/lib/auth-client";
import { PlayerEventData } from "@/lib/postmessage-player";
import { Clapperboard } from "lucide-react";

interface VideoServerControllerProps {
    mediaType?: string;
    additionalParams?: string;
    initialRoomId?: string;
}

type ServerConfig = {
  moviePath: string;
  tvPath: string;
  suffix?: string;
};

const serverConfigs: Record<string, ServerConfig> = {
  "vidsrc.ru": { moviePath: "/movie/", tvPath: "/tv/", suffix: "?parameters" },
  "vidlink.pro": { moviePath: "/movie/", tvPath: "/tv/" },
  "vidfast.pro": { moviePath: "/movie/", tvPath: "/tv/" },
  "vidsrc.icu": { moviePath: "/embed/movie/", tvPath: "/embed/tv/" },
  "vidsrc-embed.ru": { moviePath: "/embed/movie/", tvPath: "/embed/tv/" },
};

function parseAdditionalParams(mediaType: string | undefined, params: string | undefined): {
  mediaId: string; season?: number; episode?: number
} {
  if (!params) return { mediaId: "" };
  if (mediaType === "tv") {
    const parts = params.split("/");
    return { mediaId: parts[0], season: parts[1] ? parseInt(parts[1]) : undefined, episode: parts[2] ? parseInt(parts[2]) : undefined };
  }
  return { mediaId: params };
}

const VideoServerController: FC<VideoServerControllerProps> = ({ mediaType, additionalParams, initialRoomId }) => {
    const session = useSession();
    const userId = session.data?.user?.id;
    const playerRef = useRef<VideoPlayerHandle | null>(null);
    const lastSyncRef = useRef(0);

    const [domain, setDomain] = useState<string>("vidsrc.ru");
    const [roomId, setRoomId] = useState<string | null>(initialRoomId || null);
    const [panelOpen, setPanelOpen] = useState(!!initialRoomId);

    const {
      room,
      isHost,
      isConnected,
      createRoom,
      joinRoom,
      leaveRoom,
      emitHostAction,
    } = useWatchTogether(userId);

    const { messages, sendMessage } = useWatchTogetherChat(room?.roomId ?? null, userId);

    const selectServer = (serverUrl: string) => {
        setDomain(serverUrl);
    }
    const config = serverConfigs[domain] ?? serverConfigs["vidsrc.ru"];
    const path = mediaType === "tv" ? config.tvPath : config.moviePath;
    const videoUrl = `https://${domain}${path}${additionalParams}${config.suffix ?? ""}`;

    const { mediaId, season, episode } = parseAdditionalParams(mediaType, additionalParams);

    const handleToggle = useCallback(() => {
      setPanelOpen((prev) => !prev);
    }, []);

    const handleRoomChange = useCallback((rid: string | null) => {
      setRoomId(rid);
    }, []);

    useEffect(() => {
      if (initialRoomId && userId && !room) {
        joinRoom(initialRoomId);
      }
    }, [initialRoomId, userId]);

    const handlePlayerEvent = useCallback(
      (event: PlayerEventData) => {
        if (!isHost || !room?.roomId) return;
        const now = Date.now();
        if (now - lastSyncRef.current < 2000) return;
        lastSyncRef.current = now;
        const action = event.event === "play" ? "play" : event.event === "pause" ? "pause" : "seek";
        emitHostAction(action, event.currentTime);
      },
      [isHost, room?.roomId, emitHostAction]
    );

    const handleHostPlay = useCallback(() => {
      const iframe = playerRef.current?.getIframe();
      if (iframe) {
        iframe.contentWindow?.postMessage({ command: "play" }, "*");
      }
      emitHostAction("play", room?.currentTime ?? 0);
    }, [emitHostAction, room?.currentTime]);

    const handleHostPause = useCallback(() => {
      const iframe = playerRef.current?.getIframe();
      if (iframe) {
        iframe.contentWindow?.postMessage({ command: "pause" }, "*");
      }
      emitHostAction("pause", room?.currentTime ?? 0);
    }, [emitHostAction, room?.currentTime]);

    const handleCreateRoom = useCallback(async () => {
      const id = await createRoom(mediaId, mediaType || "movie", season, episode);
      if (id) {
        setPanelOpen(true);
      }
    }, [createRoom, mediaId, mediaType, season, episode]);

    const handleClose = useCallback(() => {
      setPanelOpen(false);
      leaveRoom();
      handleRoomChange(null);
    }, [leaveRoom, handleRoomChange]);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clapperboard className="size-5 text-formovies-gold" />
                <h2 className="font-display text-2xl tracking-wider text-white">Watch Now</h2>
              </div>
              <WatchTogetherButton
                isInRoom={!!room}
                isActive={panelOpen}
                onClick={panelOpen ? handleToggle : handleCreateRoom}
              />
            </div>
            <div className="rounded-xl overflow-hidden formovies-card">
                <div className="relative aspect-video bg-formovies-deeper">
                    <VideoPlayer ref={playerRef} videoUrl={videoUrl} onPlayerEvent={handlePlayerEvent} />
                </div>
            </div>
            <ServerControl selectServer={selectServer} />

            {panelOpen && (
              <WatchTogetherPanel
                roomId={room?.roomId ?? null}
                userId={userId}
                isHost={isHost}
                isConnected={isConnected}
                room={room}
                messages={messages}
                onSendMessage={sendMessage}
                onHostPlay={handleHostPlay}
                onHostPause={handleHostPause}
                onClose={handleClose}
              />
            )}
        </div>
    )
}

export default VideoServerController;
