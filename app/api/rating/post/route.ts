import { RatingSchema } from "@/app/types/ratingschema";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const url = new URL(req.url);
  const objectId = url.searchParams.get("objectId");
  const userSession = await getAuthSession();
  const body = RatingSchema.parse(await req.json());

  if (!body || !objectId) {
    return NextResponse.json({ error: "Bad Request" }, { status: 400 });
  }

  if (!userSession?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rating = await db.rating.findFirst({
    where: {
      AND: [
        { object: objectId },
        { user: { email: userSession.user.email } },
      ],
    },
  });

  if (rating) {
    const isSameUp = body.upVote === 1 && rating.upVote === 1;
    const isSameDown = body.downVote === 1 && rating.downVote === 1;

    const updated = await db.rating.update({
      where: { id: rating.id },
      data: {
        upVote: isSameUp ? 0 : body.upVote,
        downVote: isSameDown ? 0 : body.downVote,
      },
    });
    return NextResponse.json(updated, { status: 200 });
  }

  const created = await db.rating.create({
    data: {
      id: nanoid(),
      object: objectId,
      user: {
        connect: {
          email: userSession.user.email,
        },
      },
      upVote: body.upVote,
      downVote: body.downVote,
    },
  });

  return NextResponse.json(created, { status: 200 });
}
