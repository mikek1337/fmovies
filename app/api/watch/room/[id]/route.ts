import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const room = await db.watchRoom.findUnique({
    where: { id },
    include: {
      host: { select: { id: true, name: true, image: true } },
      participants: {
        include: { user: { select: { id: true, name: true, image: true } } },
      },
    },
  });

  if (!room || !room.isActive) {
    return NextResponse.json({ error: "Room not found or inactive" }, { status: 404 });
  }

  return NextResponse.json(room);
}

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const room = await db.watchRoom.findUnique({ where: { id } });
  if (!room || !room.isActive) {
    return NextResponse.json({ error: "Room not found or inactive" }, { status: 404 });
  }

  const existing = await db.watchRoomParticipant.findUnique({
    where: { roomId_userId: { roomId: id, userId: session.user.id } },
  });

  if (!existing) {
    await db.watchRoomParticipant.create({
      data: { roomId: id, userId: session.user.id },
    });
  }

  return NextResponse.json({ success: true });
}
