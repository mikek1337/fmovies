import { tmdb } from "@/lib/tmdb";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  const appendToResponse = url.searchParams.get("append_to_response") || undefined;
  const language = url.searchParams.get("language") || undefined;

  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const movieId = parseInt(id, 10);
  if (isNaN(movieId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  try {
    const response = await tmdb.movies.details(movieId, {
      append_to_response: appendToResponse,
      language,
    });
    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to connect to API";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
