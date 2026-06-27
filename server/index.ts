import { Server as HTTPServer } from "http";
import { Server } from "socket.io";
import { createServer } from "http";

const PORT = parseInt(process.env.WS_PORT || "3001", 10);
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3000";

interface RoomState {
  hostId: string;
  media: { mediaId: string; mediaType: string; season?: number; episode?: number };
  currentTime: number;
  isPlaying: boolean;
  lastUpdate: number;
}

interface User {
  userId: string;
  userName: string;
  userImage: string | null;
}

const rooms = new Map<string, { state: RoomState; users: Map<string, User> }>();

const httpServer: HTTPServer = createServer();
const io = new Server(httpServer, {
  cors: { origin: CORS_ORIGIN, methods: ["GET", "POST"] },
});

io.on("connection", (socket) => {
  let currentRoom: string | null = null;

  socket.on("join-room", ({ roomId, userId, userName, mediaId, mediaType, season, episode }) => {
    socket.join(roomId);
    currentRoom = roomId;

    if (!rooms.has(roomId)) {
      rooms.set(roomId, {
        state: {
          hostId: userId,
          media: { mediaId, mediaType, season, episode },
          currentTime: 0,
          isPlaying: false,
          lastUpdate: Date.now(),
        },
        users: new Map(),
      });
    }

    const room = rooms.get(roomId)!;
    const displayName = userName || `User-${userId.slice(0, 6)}`;
    const user: User = { userId, userName: displayName, userImage: null };
    room.users.set(socket.id, user);

    io.to(roomId).emit("user-joined", user);

    const roomState = room.state;
    socket.emit("room-state", {
      users: Array.from(room.users.values()),
      hostId: roomState.hostId,
      media: roomState.media,
      currentTime: roomState.currentTime,
      isPlaying: roomState.isPlaying,
    });
  });

  socket.on("leave-room", ({ roomId, userId }) => {
    handleLeave(roomId, userId);
  });

  socket.on("host-action", ({ roomId, action, time }) => {
    const room = rooms.get(roomId);
    if (!room) return;

    room.state.currentTime = time;
    room.state.lastUpdate = Date.now();

    if (action === "play" || action === "pause") {
      room.state.isPlaying = action === "play";
    }

    socket.to(roomId).emit("sync", { action, time, timestamp: Date.now() });
  });

  socket.on("chat-message", ({ roomId, message, userId }) => {
    const room = rooms.get(roomId);
    if (!room) return;

    const user = Array.from(room.users.values()).find((u) => u.userId === userId);
    if (!user) return;

    io.to(roomId).emit("chat-message", {
      userId: user.userId,
      userName: user.userName,
      userImage: user.userImage,
      message,
      timestamp: Date.now(),
    });
  });

  socket.on("disconnect", () => {
    if (currentRoom) {
      const room = rooms.get(currentRoom);
      if (room) {
        const user = room.users.get(socket.id);
        if (user) {
          room.users.delete(socket.id);
          io.to(currentRoom).emit("user-left", { userId: user.userId });

          if (room.users.size === 0) {
            rooms.delete(currentRoom);
          } else if (room.state.hostId === user.userId) {
            const nextHost = Array.from(room.users.values())[0];
            if (nextHost) {
              room.state.hostId = nextHost.userId;
              io.to(currentRoom).emit("host-changed", { userId: nextHost.userId });
            }
          }
        }
      }
    }
  });

  function handleLeave(roomId: string, userId: string) {
    const room = rooms.get(roomId);
    if (!room) return;

    for (const [sockId, u] of room.users) {
      if (u.userId === userId) {
        room.users.delete(sockId);
        break;
      }
    }

    socket.leave(roomId);
    io.to(roomId).emit("user-left", { userId });

    if (room.users.size === 0) {
      rooms.delete(roomId);
    } else if (room.state.hostId === userId) {
      const nextHost = Array.from(room.users.values())[0];
      if (nextHost) {
        room.state.hostId = nextHost.userId;
        io.to(roomId).emit("host-changed", { userId: nextHost.userId });
      }
    }

    currentRoom = null;
  }
});

httpServer.listen(PORT, () => {
  console.log(`Watch Together WS server running on port ${PORT}`);
});
