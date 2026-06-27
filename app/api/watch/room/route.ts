import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { mediaId, mediaType, season, episode } = await req.json();
  if (!mediaId || !mediaType) {
    return NextResponse.json({ error: "mediaId and mediaType required" }, { status: 400 });
  }

  const room = await db.watchRoom.create({
    data: {
      mediaId,
      mediaType,
      season: season ?? null,
      episode: episode ?? null,
      hostId: session.user.id,
    },
  });

  await db.watchRoomParticipant.create({
    data: {
      roomId: room.id,
      userId: session.user.id,
    },
  });

  return NextResponse.json(room, { status: 201 });
}
