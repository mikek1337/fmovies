import { tmdb } from "@/lib/tmdb";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  const pageParam = url.searchParams.get("page");
  const page = pageParam ? parseInt(pageParam, 10) : 1;
  const language = url.searchParams.get("language") || undefined;

  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const movieId = parseInt(id, 10);
  if (isNaN(movieId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  try {
    const response = await tmdb.movies.recommendations(movieId, { page, language });
    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to connect to API";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
