import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  const session = await getAuthSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const commentId = url.searchParams.get("id");
  if (!commentId) {
    return NextResponse.json({ error: "Comment ID is required" }, { status: 400 });
  }

  try {
    const comment = await db.comment.findUnique({
      where: { id: commentId },
      include: { user: true },
    });

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    // Ensure the caller is the author of the comment
    if (comment.user.email !== session.user.email) {
      return NextResponse.json(
        { error: "Forbidden: You can only delete your own comments" },
        { status: 403 }
      );
    }

    // Delete associated linkages, ratings, child replies, and comment in a transaction
    await db.$transaction([
      db.rating.deleteMany({ where: { object: commentId } }),
      db.movieComment.deleteMany({ where: { commentId } }),
      db.seriesComment.deleteMany({ where: { commentId } }),
      db.comment.deleteMany({ where: { parentId: commentId } }),
      db.comment.delete({ where: { id: commentId } }),
    ]);

    return NextResponse.json({ success: true, deletedId: commentId }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete comment";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
