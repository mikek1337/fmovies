import { tmdb } from "@/lib/tmdb";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const searchParams = url.searchParams;
  const id = searchParams.get("id");
  const pageParam = searchParams.get("page");
  const page = pageParam ? parseInt(pageParam, 10) : 1;
  const language = searchParams.get("language") || undefined;

  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const seriesId = parseInt(id, 10);
  if (isNaN(seriesId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  try {
    const response = await tmdb.tv.recommendations(seriesId, { page, language });
    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to connect to API";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
