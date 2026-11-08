import { tmdb } from "@/lib/tmdb";
import { DiscoverMovieParams } from "@/app/types/tmdb";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;

    const query = searchParams.get("query");
    const pageParam = searchParams.get("page");
    const page = pageParam ? parseInt(pageParam, 10) : 1;
    const yearParam =
      searchParams.get("primary_release_year") ||
      searchParams.get("year");
    const year = yearParam ? parseInt(yearParam, 10) : undefined;
    const includeAdultParam = searchParams.get("include_adult");
    const includeAdult = includeAdultParam === "true";
    const withGenres =
      searchParams.get("with_genres") || searchParams.get("genre") || undefined;
    const language = searchParams.get("language") || undefined;
    const sortBy =
      searchParams.get("sort_by") || searchParams.get("sort") || "popularity.desc";

    let filterResult;

    if (query && query.trim() !== "") {
      // Use search/movie when text query is present
      filterResult = await tmdb.search.movie({
        query: query.trim(),
        page,
        primary_release_year: year,
        include_adult: includeAdult,
        language,
      });

      // Filter by genre if specified with search
      if (withGenres && filterResult.data?.results) {
        const genreId = parseInt(withGenres, 10);
        if (!isNaN(genreId)) {
          const filteredResults = filterResult.data.results.filter((m) =>
            m.genre_ids?.includes(genreId)
          );
          filterResult.data.results = filteredResults;
          filterResult.data.total_results = filteredResults.length;
        }
      }

      // In-memory sorting for search results
      if (filterResult.data?.results && sortBy !== "popularity.desc") {
        if (sortBy === "vote_average.desc") {
          filterResult.data.results.sort(
            (a, b) => (b.vote_average || 0) - (a.vote_average || 0)
          );
        } else if (
          sortBy === "release_date.desc" ||
          sortBy === "primary_release_date.desc"
        ) {
          filterResult.data.results.sort(
            (a, b) =>
              new Date(b.release_date || 0).getTime() -
              new Date(a.release_date || 0).getTime()
          );
        } else if (
          sortBy === "release_date.asc" ||
          sortBy === "primary_release_date.asc"
        ) {
          filterResult.data.results.sort(
            (a, b) =>
              new Date(a.release_date || 0).getTime() -
              new Date(b.release_date || 0).getTime()
          );
        } else if (sortBy === "vote_count.desc") {
          filterResult.data.results.sort(
            (a, b) => (b.vote_count || 0) - (a.vote_count || 0)
          );
        }
      }
    } else {
      // Build discover params based on requested sort
      const discoverParams: DiscoverMovieParams = {
        page,
        primary_release_year: year,
        with_genres: withGenres,
        include_adult: includeAdult,
        language,
      };

      const today = new Date().toISOString().split("T")[0];

      if (sortBy === "vote_average.desc") {
        discoverParams.sort_by = "vote_average.desc";
        // Ensure movies have a meaningful number of votes to prevent 1-vote 10/10 entries
        discoverParams["vote_count.gte"] = withGenres || year ? 50 : 150;
      } else if (
        sortBy === "release_date.desc" ||
        sortBy === "primary_release_date.desc"
      ) {
        discoverParams.sort_by = "primary_release_date.desc";
        // Restrict to released movies as of today
        discoverParams["primary_release_date.lte"] = today;
        discoverParams["vote_count.gte"] = 5;
      } else if (
        sortBy === "release_date.asc" ||
        sortBy === "primary_release_date.asc"
      ) {
        discoverParams.sort_by = "primary_release_date.asc";
        discoverParams["vote_count.gte"] = 10;
      } else if (sortBy === "vote_count.desc") {
        discoverParams.sort_by = "vote_count.desc";
      } else {
        discoverParams.sort_by = "popularity.desc";
      }

      filterResult = await tmdb.discover.movie(discoverParams);
    }

    return NextResponse.json(filterResult.data, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to connect to API";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
