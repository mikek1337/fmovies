import { tmdb, TmdbClient } from "./tmdb";
import { SearchTvParams } from "@/app/types/tmdb";

export * from "./tmdb";

/**
 * Get trending movies of the week
 */
export const latestMovies = async () => {
  return tmdb.trending.movies("week");
};

/**
 * Get movie genres
 */
export const geners = async (language?: string) => {
  return tmdb.genres.movieList(language ? { language } : undefined);
};

/**
 * Get popular movies (first page)
 */
export const popularMovies = async () => {
  return tmdb.movies.popular({ page: 1 });
};

/**
 * Get popular movies for a specific page
 */
export const getPopularMovies = async (page: number) => {
  return tmdb.movies.popular({ page: page || 1 });
};

/**
 * Get trending TV series of the day
 */
export const newSeries = async () => {
  return tmdb.trending.tv("day");
};

/**
 * Get details for a movie
 */
export const movieDetail = async (
  id: number,
  params?: { append_to_response?: string; language?: string }
) => {
  return tmdb.movies.details(id, params);
};

/**
 * Get recommendations for a movie or TV show
 */
export const getRecommendation = async (
  id: number,
  mediaType?: string,
  page: number = 1
) => {
  if (mediaType === "tv") {
    return tmdb.tv.recommendations(id, { page });
  }
  return tmdb.movies.recommendations(id, { page });
};

/**
 * Search across multiple media types (movies, TV, people)
 */
export const searchMulti = async (
  query: string,
  page: number = 1,
  includeAdult: boolean = false
) => {
  return tmdb.search.multi({
    query,
    page,
    include_adult: includeAdult,
  });
};

/**
 * Get popular TV series for a specific page
 */
export const popularSeries = async (page: number = 1) => {
  return tmdb.tv.popular({ page: page || 1 });
};

/**
 * Search TV series. Supports both a query string or a structured SearchTvParams object.
 */
export const searchSeries = async (queries: string | SearchTvParams) => {
  if (typeof queries === "string") {
    const searchParams = new URLSearchParams(
      queries.startsWith("?") ? queries.slice(1) : queries
    );
    const query = searchParams.get("query") || "";
    const pageStr = searchParams.get("page");
    const page = pageStr ? parseInt(pageStr, 10) : 1;
    const yearStr =
      searchParams.get("first_air_date_year") ||
      searchParams.get("year") ||
      searchParams.get("primaryReleaseYear") ||
      searchParams.get("primary_released_date");
    const includeAdultStr = searchParams.get("include_adult");

    return tmdb.search.tv({
      query,
      page,
      ...(yearStr ? { first_air_date_year: parseInt(yearStr, 10) } : {}),
      ...(includeAdultStr !== null
        ? { include_adult: includeAdultStr === "true" }
        : {}),
    });
  }

  return tmdb.search.tv(queries);
};

/**
 * Get TV series details
 */
export const seriesDetail = async (
  id: number,
  params?: { append_to_response?: string; language?: string }
) => {
  return tmdb.tv.details(id, params);
};

/**
 * Get trending content (all types) of the week
 */
export const Trending = async (timeWindow: "day" | "week" = "week") => {
  return tmdb.trending.all(timeWindow);
};

export { tmdb, TmdbClient };
export default tmdb;
