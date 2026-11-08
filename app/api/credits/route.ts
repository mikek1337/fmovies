import { tmdb } from "@/lib/tmdb";
import {
  CastMember,
  CrewMember,
  AggregateCastMember,
  AggregateCrewMember,
} from "@/app/types/tmdb";
import { NextResponse } from "next/server";

export interface StandardCastMember {
  id: number;
  name: string;
  original_name?: string;
  character: string;
  profile_path: string | null;
  known_for_department?: string;
  order?: number;
  episode_count?: number;
}

export interface StandardCrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface CreditsResponseData {
  id: number;
  cast: StandardCastMember[];
  crew: StandardCrewMember[];
  directors: StandardCrewMember[];
  writers: StandardCrewMember[];
}

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
    let rawCast: (CastMember | AggregateCastMember)[] = [];
    let rawCrew: (CrewMember | AggregateCrewMember)[] = [];

    if (type === "tv") {
      try {
        const aggRes = await tmdb.tv.aggregateCredits(id, { language });
        rawCast = aggRes.data?.cast || [];
        rawCrew = aggRes.data?.crew || [];
      } catch {
        const tvRes = await tmdb.tv.credits(id, { language });
        rawCast = tvRes.data?.cast || [];
        rawCrew = tvRes.data?.crew || [];
      }
    } else {
      const movieRes = await tmdb.movies.credits(id, { language });
      rawCast = movieRes.data?.cast || [];
      rawCrew = movieRes.data?.crew || [];
    }

    // Standardize cast
    const cast: StandardCastMember[] = rawCast.slice(0, 30).map((c) => {
      const character =
        ("character" in c && c.character) ||
        ("roles" in c && Array.isArray(c.roles) && c.roles[0]?.character) ||
        "";
      const episode_count =
        ("total_episode_count" in c && c.total_episode_count) ||
        ("roles" in c && Array.isArray(c.roles) && c.roles[0]?.episode_count) ||
        undefined;
      return {
        id: c.id,
        name: c.name,
        original_name: c.original_name,
        character,
        profile_path: c.profile_path || null,
        known_for_department: c.known_for_department,
        order: c.order,
        episode_count,
      };
    });

    // Standardize crew
    const crew: StandardCrewMember[] = rawCrew.map((c) => {
      const job =
        ("job" in c && c.job) ||
        ("jobs" in c && Array.isArray(c.jobs) && c.jobs[0]?.job) ||
        c.department ||
        "Crew";
      return {
        id: c.id,
        name: c.name,
        job,
        department: c.department || "Crew",
        profile_path: c.profile_path || null,
      };
    });

    // Extract directors and writers
    const directors = crew.filter(
      (c) =>
        c.job.toLowerCase() === "director" ||
        c.job.toLowerCase() === "creator" ||
        c.job.toLowerCase() === "series director"
    );

    const writers = crew.filter(
      (c) =>
        c.job.toLowerCase() === "screenplay" ||
        c.job.toLowerCase() === "writer" ||
        c.job.toLowerCase() === "novel" ||
        c.job.toLowerCase() === "story" ||
        c.job.toLowerCase() === "teleplay"
    );

    const data: CreditsResponseData = {
      id,
      cast,
      crew: crew.slice(0, 30),
      directors,
      writers,
    };

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to fetch credits";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
