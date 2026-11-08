import { tmdb } from "@/lib/tmdb";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const query = url.searchParams.get("query");
  const pageParam = url.searchParams.get("page");
  const page = pageParam ? parseInt(pageParam, 10) : 1;
  const includeAdult = url.searchParams.get("include_adult") === "true";
  const language = url.searchParams.get("language") || undefined;
  const type = url.searchParams.get("type"); // "movie" | "tv" | "person" | "multi"
  const year = url.searchParams.get("year") || undefined;
  const primaryReleaseYear =
    url.searchParams.get("primary_release_year") || undefined;

  if (!query || !query.trim()) {
    return NextResponse.json({ error: "query is required" }, { status: 400 });
  }

  try {
    let response;
    if (type === "movie") {
      response = await tmdb.search.movie({
        query: query.trim(),
        page,
        include_adult: includeAdult,
        language,
        year,
        primary_release_year: primaryReleaseYear,
      });
    } else if (type === "tv") {
      response = await tmdb.search.tv({
        query: query.trim(),
        page,
        include_adult: includeAdult,
        language,
      });
    } else if (type === "person") {
      response = await tmdb.search.person({
        query: query.trim(),
        page,
        include_adult: includeAdult,
        language,
      });
    } else {
      // Default to multi-search across movies, tv, and people
      response = await tmdb.search.multi({
        query: query.trim(),
        page,
        include_adult: includeAdult,
        language,
      });
    }

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to connect to API";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
