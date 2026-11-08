import { tmdb } from "@/lib/tmdb";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const mediaType = url.searchParams.get("media_type") || "all";
    const timeWindowParam = url.searchParams.get("time_window");
    const timeWindow = timeWindowParam === "day" ? "day" : "week";
    const pageParam = url.searchParams.get("page");
    const page = pageParam ? parseInt(pageParam, 10) : 1;
    const language = url.searchParams.get("language") || undefined;

    let response;
    switch (mediaType) {
      case "movie":
        response = await tmdb.trending.movies(timeWindow, { page, language });
        break;
      case "tv":
        response = await tmdb.trending.tv(timeWindow, { page, language });
        break;
      case "person":
        response = await tmdb.trending.people(timeWindow, { page, language });
        break;
      case "all":
      default:
        response = await tmdb.trending.all(timeWindow, { page, language });
        break;
    }

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to connect to API";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
