import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getAuthSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const items = await db.favorite.findMany({
      where: {
        user: {
          email: session.user.email,
        },
      },
    });

    return NextResponse.json({ items, count: items.length }, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch watchlist";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getAuthSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const mediaId = url.searchParams.get("mediaId");
  const id = url.searchParams.get("id");
  const clearAll = url.searchParams.get("all") === "true";

  try {
    if (clearAll) {
      await db.favorite.deleteMany({
        where: {
          user: {
            email: session.user.email,
          },
        },
      });
      return NextResponse.json({ success: true, cleared: true }, { status: 200 });
    }

    if (!mediaId && !id) {
      return NextResponse.json(
        { error: "mediaId, id, or all=true is required" },
        { status: 400 }
      );
    }

    if (id) {
      await db.favorite.deleteMany({
        where: {
          id,
          user: {
            email: session.user.email,
          },
        },
      });
    } else if (mediaId) {
      await db.favorite.deleteMany({
        where: {
          mediaId,
          user: {
            email: session.user.email,
          },
        },
      });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to remove from watchlist";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
