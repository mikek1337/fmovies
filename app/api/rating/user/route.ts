import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const objectId = url.searchParams.get("objectId");
  if (!objectId) {
    return NextResponse.json({ error: "objectId is required" }, { status: 400 });
  }

  const userSession = await getAuthSession();
  if (userSession?.user?.email) {
    const rating = await db.rating.findFirst({
      where: {
        object: objectId,
        user: {
          email: userSession.user.email,
        },
      },
    });
    return NextResponse.json(rating, { status: 200 });
  }

  return NextResponse.json(null, { status: 200 });
}
