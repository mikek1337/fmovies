"use client";
import { FC } from "react";
import { X, Wifi, WifiOff } from "lucide-react";
import { WatchRoomState } from "@/hooks/useWatchTogether";
import { ChatMessage } from "@/hooks/useWatchTogetherChat";
import WatchTogetherChat from "./watch-together-chat";
import WatchTogetherControls from "./watch-together-controls";
import WatchTogetherInvite from "./watch-together-invite";
import WatchTogetherUserList from "./watch-together-user-list";

interface WatchTogetherPanelProps {
  roomId: string | null;
  userId: string | undefined;
  isHost: boolean;
  isConnected: boolean;
  room: WatchRoomState | null;
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  onHostPlay: () => void;
  onHostPause: () => void;
  onClose: () => void;
}

const WatchTogetherPanel: FC<WatchTogetherPanelProps> = ({
  roomId,
  isHost,
  isConnected,
  room,
  messages,
  onSendMessage,
  onHostPlay,
  onHostPause,
  onClose,
}) => {
  return (
    <div className="fixed right-0 top-0 h-full w-80 z-50 bg-formovies-dark/95 backdrop-blur-xl border-l border-white/10 shadow-2xl">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white">Watch Party</span>
            {isConnected ? (
              <Wifi className="size-3.5 text-green-400" />
            ) : (
              <WifiOff className="size-3.5 text-red-400" />
            )}
          </div>
          <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
            <X className="size-4" />
          </button>
        </div>

        {roomId && <WatchTogetherInvite roomId={roomId} />}

        <WatchTogetherControls
          isHost={isHost}
          isPlaying={room?.isPlaying ?? false}
          onPlay={onHostPlay}
          onPause={onHostPause}
        />

        {room && room.users.length > 0 && (
          <WatchTogetherUserList users={room.users} hostId={room.hostId} />
        )}

        <div className="flex-1 min-h-0">
          <WatchTogetherChat messages={messages} onSendMessage={onSendMessage} />
        </div>
      </div>
    </div>
  );
};

export default WatchTogetherPanel;
