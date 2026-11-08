import { Gener } from "./gener";
export * from "./tmdb";

export interface WatchedDates {
  maximum: string;
  minimum: string;
}

export interface Movie {
  id: number;
  original_title?: string;
  overview: string;
  geners?: Gener[];
  genre_ids?: number[];
  poster_path: string | null;
  name?: string;
  original_name?: string;
  first_air_date?: string;
  media_type?: string;
  backdrop_path?: string | null;
  release_date?: string;
  title?: string;
  vote_average: number;
  vote_count: number;
  adult?: boolean;
  popularity?: number;
  video?: boolean;
}

export interface MovieResponse {
  dates?: WatchedDates;
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}
