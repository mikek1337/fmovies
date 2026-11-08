import { tmdb } from "@/lib/tmdb";
import { PersonDetail } from "@/app/types/tmdb";
import { NextResponse } from "next/server";

export interface PersonFilmographyItem {
  id: number;
  title: string;
  media_type: "movie" | "tv";
  character?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  release_date?: string;
  first_air_date?: string;
  popularity: number;
}

export interface PersonApiResponse extends PersonDetail {
  known_for: PersonFilmographyItem[];
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const idParam = url.searchParams.get("id");
  const language = url.searchParams.get("language") || undefined;

  if (!idParam) {
    return NextResponse.json({ error: "id parameter is required" }, { status: 400 });
  }

  const id = parseInt(idParam, 10);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  try {
    const [personRes, creditsRes] = await Promise.all([
      tmdb.people.details(id, { language }),
      tmdb.people.combinedCredits(id, { language }),
    ]);

    const person = personRes.data;
    const rawCredits = creditsRes.data?.cast || [];

    // Deduplicate and rank by significance (vote_count * vote_average + popularity)
    const seenIds = new Set<number>();
    const known_for: PersonFilmographyItem[] = rawCredits
      .filter((item) => {
        if (!item.id || !item.poster_path || seenIds.has(item.id)) return false;
        seenIds.add(item.id);
        return true;
      })
      .sort((a, b) => {
        const scoreA =
          (a.vote_count || 0) * (a.vote_average || 0) + (a.popularity || 0);
        const scoreB =
          (b.vote_count || 0) * (b.vote_average || 0) + (b.popularity || 0);
        return scoreB - scoreA;
      })
      .slice(0, 16)
      .map((item) => ({
        id: item.id,
        title: item.title || item.name || "Untitled",
        media_type: (item.media_type === "tv" ? "tv" : "movie") as "movie" | "tv",
        character: item.character || undefined,
        poster_path: item.poster_path || null,
        backdrop_path: item.backdrop_path || null,
        vote_average: item.vote_average || 0,
        vote_count: item.vote_count || 0,
        release_date: item.release_date || undefined,
        first_air_date: item.first_air_date || undefined,
        popularity: item.popularity || 0,
      }));

    const responseData: PersonApiResponse = {
      ...person,
      known_for,
    };

    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to fetch person details";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
