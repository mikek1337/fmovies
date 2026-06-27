"use client";
import { useState, useEffect, useCallback } from "react";
import { getSocket } from "@/lib/socket";

export interface ChatMessage {
  userId: string;
  userName: string;
  userImage: string | null;
  message: string;
  timestamp: number;
}

export function useWatchTogetherChat(roomId: string | null, userId: string | undefined) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    if (!roomId) return;

    const socket = getSocket();

    const handler = (data: ChatMessage) => {
      setMessages((prev) => [...prev, data]);
    };

    socket.on("chat-message", handler);
    return () => {
      socket.off("chat-message", handler);
    };
  }, [roomId]);

  const sendMessage = useCallback(
    (message: string) => {
      if (!roomId || !userId || !message.trim()) return;
      const socket = getSocket();
      socket.emit("chat-message", { roomId, message: message.trim(), userId });
    },
    [roomId, userId]
  );

  return { messages, sendMessage };
}
