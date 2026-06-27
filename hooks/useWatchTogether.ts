"use client";
import { useCallback, useEffect, useState, useRef } from "react";
import { connectSocket, disconnectSocket, getSocket } from "@/lib/socket";
import axios from "axios";

function generateGuestId(): string {
  return `guest_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export interface RoomUser {
  userId: string;
  userName: string;
  userImage: string | null;
}

export interface WatchRoomState {
  roomId: string;
  hostId: string;
  media: { mediaId: string; mediaType: string; season?: number; episode?: number };
  users: RoomUser[];
  currentTime: number;
  isPlaying: boolean;
}

export interface WatchTogetherActions {
  room: WatchRoomState | null;
  isHost: boolean;
  isConnected: boolean;
  createRoom: (mediaId: string, mediaType: string, season?: number, episode?: number) => Promise<string | null>;
  joinRoom: (roomId: string) => Promise<boolean>;
  leaveRoom: () => void;
  emitHostAction: (action: "play" | "pause" | "seek", time: number) => void;
}

export function useWatchTogether(userId: string | undefined): WatchTogetherActions {
  const [room, setRoom] = useState<WatchRoomState | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const roomIdRef = useRef<string | null>(null);
  const guestIdRef = useRef<string>(generateGuestId());

  useEffect(() => {
    const socket = getSocket();
    socket.on("connect", () => setIsConnected(true));
    socket.on("disconnect", () => setIsConnected(false));
    socket.on("user-joined", (data) => {
      setRoom((prev) => {
        if (!prev) return prev;
        if (prev.users.some((u) => u.userId === data.userId)) return prev;
        return { ...prev, users: [...prev.users, data] };
      });
    });
    socket.on("user-left", (data) => {
      setRoom((prev) => {
        if (!prev) return prev;
        return { ...prev, users: prev.users.filter((u) => u.userId !== data.userId) };
      });
    });
    socket.on("host-changed", (data) => {
      setRoom((prev) => (prev ? { ...prev, hostId: data.userId } : prev));
    });
    socket.on("room-state", (data) => {
      setRoom({
        roomId: roomIdRef.current || "",
        hostId: data.hostId,
        media: data.media,
        users: data.users,
        currentTime: data.currentTime,
        isPlaying: data.isPlaying,
      });
    });
    socket.on("error", (data) => {
      console.error("WatchTogether error:", data.message);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("user-joined");
      socket.off("user-left");
      socket.off("host-changed");
      socket.off("room-state");
      socket.off("error");
    };
  }, []);

  const createRoom = useCallback(
    async (mediaId: string, mediaType: string, season?: number, episode?: number) => {
      if (!userId) return null;
      try {
        const res = await axios.post("/api/watch/room", { mediaId, mediaType, season, episode });
        const roomData = res.data as { id: string };
        roomIdRef.current = roomData.id;
        const socket = connectSocket();
        socket.emit("join-room", { roomId: roomData.id, userId, mediaId, mediaType, season, episode });
        return roomData.id;
      } catch (err) {
        console.error("Failed to create room:", err);
        return null;
      }
    },
    [userId]
  );

  const joinRoom = useCallback(
    async (roomId: string) => {
      const effectiveUserId = userId || guestIdRef.current;
      const displayName = userId ? undefined : `Guest-${effectiveUserId.slice(-6)}`;

      try {
        const res = await axios.get(`/api/watch/room/${roomId}`);
        const roomData = res.data as {
          id: string;
          hostId: string;
          mediaId: string;
          mediaType: string;
          season: number | null;
          episode: number | null;
        };

        try {
          await axios.post(`/api/watch/room/${roomId}`);
        } catch {
          // best-effort: DB tracking not critical for guests
        }

        roomIdRef.current = roomId;
        const socket = connectSocket();
        socket.emit("join-room", {
          roomId,
          userId: effectiveUserId,
          userName: displayName,
          mediaId: roomData.mediaId,
          mediaType: roomData.mediaType,
          season: roomData.season ?? undefined,
          episode: roomData.episode ?? undefined,
        });

        return true;
      } catch (err) {
        console.error("Failed to join room:", err);
        return false;
      }
    },
    [userId]
  );

  const leaveRoom = useCallback(() => {
    if (roomIdRef.current) {
      const socket = getSocket();
      const lid = userId || guestIdRef.current;
      socket.emit("leave-room", { roomId: roomIdRef.current, userId: lid });
    }
    roomIdRef.current = null;
    setRoom(null);
    disconnectSocket();
  }, [userId]);

  const emitHostAction = useCallback(
    (action: "play" | "pause" | "seek", time: number) => {
      if (!roomIdRef.current) return;
      const socket = getSocket();
      socket.emit("host-action", { roomId: roomIdRef.current, action, time });
    },
    []
  );

  return {
    room,
    isHost: room ? room.hostId === userId : false,
    isConnected,
    createRoom,
    joinRoom,
    leaveRoom,
    emitHostAction,
  };
}
