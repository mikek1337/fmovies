import { tmdb } from "@/lib/tmdb";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const pageParam = url.searchParams.get("page");
    const page = pageParam ? parseInt(pageParam, 10) : 1;
    const language = url.searchParams.get("language") || undefined;

    const filterResult = await tmdb.tv.popular({ page, language });
    return NextResponse.json(filterResult.data, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to connect to API";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
