import { tmdb } from "@/lib/tmdb";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const type = url.searchParams.get("type");
    const language = url.searchParams.get("language") || undefined;

    let genresData;
    if (type === "tv") {
      genresData = (await tmdb.genres.tvList({ language })).data;
    } else {
      genresData = (await tmdb.genres.movieList({ language })).data;
    }

    return NextResponse.json(genresData.genres, { status: 200 });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unable to fetch genres";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
