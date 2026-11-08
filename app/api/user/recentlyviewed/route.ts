import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getAuthSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const items = await db.recentlyViewed.findMany({
      where: {
        user: {
          email: session.user.email,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ items, count: items.length }, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch recently viewed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getAuthSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  const clearAll = url.searchParams.get("all") === "true";

  try {
    if (clearAll) {
      await db.recentlyViewed.deleteMany({
        where: {
          user: {
            email: session.user.email,
          },
        },
      });
      return NextResponse.json({ success: true, cleared: true }, { status: 200 });
    }

    if (!id) {
      return NextResponse.json(
        { error: "id or all=true is required" },
        { status: 400 }
      );
    }

    await db.recentlyViewed.deleteMany({
      where: {
        id,
        user: {
          email: session.user.email,
        },
      },
    });

    return NextResponse.json({ success: true, removedId: id }, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to remove recently viewed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
