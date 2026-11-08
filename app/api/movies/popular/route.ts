import { tmdb } from "@/lib/tmdb";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const pageParam = url.searchParams.get("page");
    const page = pageParam ? parseInt(pageParam, 10) : 1;
    const language = url.searchParams.get("language") || undefined;
    const region = url.searchParams.get("region") || undefined;

    const movies = (await tmdb.movies.popular({ page, language, region })).data;
    return NextResponse.json(movies, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unable to connect to API";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
