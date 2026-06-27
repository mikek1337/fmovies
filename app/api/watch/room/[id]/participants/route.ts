import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const participants = await db.watchRoomParticipant.findMany({
    where: { roomId: id },
    include: { user: { select: { id: true, name: true, image: true } } },
  });

  return NextResponse.json(participants);
}
