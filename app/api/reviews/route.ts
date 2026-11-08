import { tmdb } from "@/lib/tmdb";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const idParam = url.searchParams.get("id");
  const type = url.searchParams.get("type") || "movie";
  const pageParam = url.searchParams.get("page");
  const page = pageParam ? parseInt(pageParam, 10) : 1;
  const language = url.searchParams.get("language") || undefined;

  if (!idParam) {
    return NextResponse.json({ error: "id parameter is required" }, { status: 400 });
  }

  const id = parseInt(idParam, 10);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  try {
    const res =
      type === "tv"
        ? await tmdb.tv.reviews(id, { page, language })
        : await tmdb.movies.reviews(id, { page, language });

    return NextResponse.json(res.data, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to fetch reviews";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
