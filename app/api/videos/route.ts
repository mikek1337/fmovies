import { tmdb } from "@/lib/tmdb";
import { VideoItem } from "@/app/types/tmdb";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const idParam = url.searchParams.get("id");
  const type = url.searchParams.get("type") || "movie";
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
        ? await tmdb.tv.videos(id, { language })
        : await tmdb.movies.videos(id, { language });

    const videos: VideoItem[] = res.data?.results || [];

    // Prioritize official YouTube trailer
    const trailer =
      videos.find((v) => v.site === "YouTube" && v.type === "Trailer" && v.official) ||
      videos.find((v) => v.site === "YouTube" && v.type === "Trailer") ||
      videos.find((v) => v.site === "YouTube" && (v.type === "Teaser" || v.type === "Clip")) ||
      videos.find((v) => v.site === "YouTube") ||
      null;

    return NextResponse.json(
      {
        id,
        results: videos,
        trailer,
      },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to fetch videos";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
