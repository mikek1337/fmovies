import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:3001";

export interface ServerEvents {
  "user-joined": (data: { userId: string; userName: string; userImage: string | null }) => void;
  "user-left": (data: { userId: string }) => void;
  sync: (data: { action: "play" | "pause" | "seek"; time: number; timestamp: number }) => void;
  "host-changed": (data: { userId: string }) => void;
  "chat-message": (data: {
    userId: string;
    userName: string;
    userImage: string | null;
    message: string;
    timestamp: number;
  }) => void;
  "room-state": (data: {
    users: { userId: string; userName: string; userImage: string | null }[];
    hostId: string;
    media: { mediaId: string; mediaType: string; season?: number; episode?: number };
    currentTime: number;
    isPlaying: boolean;
  }) => void;
  error: (data: { message: string }) => void;
}

export interface ClientEvents {
  "join-room": (data: {
    roomId: string;
    userId: string;
    userName?: string;
    mediaId: string;
    mediaType: string;
    season?: number;
    episode?: number;
  }) => void;
  "leave-room": (data: { roomId: string; userId: string }) => void;
  "host-action": (data: { roomId: string; action: "play" | "pause" | "seek"; time: number }) => void;
  "chat-message": (data: { roomId: string; message: string; userId: string }) => void;
}

export function getSocket(): Socket<ServerEvents, ClientEvents> {
  if (!socket) {
    socket = io(WS_URL, {
      autoConnect: false,
      transports: ["websocket", "polling"],
    });
  }
  return socket as Socket<ServerEvents, ClientEvents>;
}

export function connectSocket(): Socket<ServerEvents, ClientEvents> {
  const s = getSocket();
  if (!s.connected) {
    s.connect();
  }
  return s;
}

export function disconnectSocket(): void {
  if (socket?.connected) {
    socket.disconnect();
  }
}
