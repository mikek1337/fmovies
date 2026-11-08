import { Gener, GenerResponse } from "./gener";

/**
 * Standard TMDB Language and Pagination parameters
 */
export interface PaginationParams {
  page?: number;
  language?: string;
}

export interface TimeWindowParams {
  time_window?: "day" | "week";
  language?: string;
}

export interface PaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
  dates?: {
    maximum: string;
    minimum: string;
  };
}

/**
 * Genres
 */
export type Genre = Gener;
export type GenresResponse = GenerResponse;
export type { Gener, GenerResponse } from "./gener";

export type Movie = MovieSummary & {
  name?: string;
  original_name?: string;
  first_air_date?: string;
  geners?: Gener[];
};

export type MovieResponse = PaginatedResponse<Movie>;

/**
 * Movie Types
 */
export interface MovieSummary {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  popularity: number;
  video: boolean;
  vote_average: number;
  vote_count: number;
  media_type?: "movie";
}

export interface ProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface BelongsToCollection {
  id: number;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
}

export interface MovieDetail {
  adult: boolean;
  backdrop_path: string | null;
  belongs_to_collection?: BelongsToCollection | null;
  budget: number;
  genres: Gener[];
  homepage: string;
  id: number;
  imdb_id: string | null;
  original_language: string;
  original_title: string;
  name?: string; // For compatibility with hybrid TV/Movie components
  overview: string;
  popularity: number;
  poster_path: string | null;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  release_date: string;
  revenue: number;
  runtime: number;
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
  // Included when append_to_response is used or when used in TV context
  seasons?: SeasonDetails[];
  type?: string;
  first_air_date?: string;
  last_episode_to_air?: {
    id?: number;
    name?: string;
    overview?: string;
    vote_average?: number;
    vote_count?: number;
    air_date?: string;
    episode_number?: number;
    episode_type?: string;
    runtime: number;
    season_number?: number;
  };
  credits?: CreditsResponse;
  videos?: VideosResponse;
  images?: ImagesResponse;
  recommendations?: PaginatedResponse<MovieSummary>;
  similar?: PaginatedResponse<MovieSummary>;
  reviews?: ReviewsResponse;
  keywords?: MovieKeywordsResponse;
  "watch/providers"?: WatchProvidersResponse;
}

/**
 * TV Types
 */
export interface TvSummary {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  origin_country: string[];
  popularity: number;
  vote_average: number;
  vote_count: number;
  media_type?: "tv";
}

export interface SeasonSummary {
  air_date: string | null;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
  vote_average: number;
}

export type SeasonDetails = SeasonSummary;

export interface EpisodeSummary {
  id: number;
  name: string;
  overview: string;
  vote_average: number;
  vote_count: number;
  air_date: string | null;
  episode_number: number;
  episode_type: string;
  production_code: string;
  runtime: number | null;
  season_number: number;
  show_id: number;
  still_path: string | null;
}

export interface TvNetwork {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
}

export interface TvDetail {
  adult: boolean;
  backdrop_path: string | null;
  created_by: Array<{
    id: number;
    credit_id: string;
    name: string;
    original_name: string;
    gender: number;
    profile_path: string | null;
  }>;
  episode_run_time: number[];
  first_air_date: string;
  genres: Gener[];
  homepage: string;
  id: number;
  in_production: boolean;
  languages: string[];
  last_air_date: string;
  last_episode_to_air: EpisodeSummary | null;
  name: string;
  next_episode_to_air: EpisodeSummary | null;
  networks: TvNetwork[];
  number_of_episodes: number;
  number_of_seasons: number;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  seasons: SeasonSummary[];
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string;
  type: string;
  vote_average: number;
  vote_count: number;
  credits?: CreditsResponse;
  aggregate_credits?: AggregateCreditsResponse;
  videos?: VideosResponse;
  images?: ImagesResponse;
  recommendations?: PaginatedResponse<TvSummary>;
  similar?: PaginatedResponse<TvSummary>;
  reviews?: ReviewsResponse;
  content_ratings?: TvContentRatingsResponse;
  "watch/providers"?: WatchProvidersResponse;
}

export interface TvSeasonDetail {
  _id: string;
  air_date: string | null;
  episodes: Array<EpisodeSummary & {
    crew: CrewMember[];
    guest_stars: CastMember[];
  }>;
  name: string;
  overview: string;
  id: number;
  poster_path: string | null;
  season_number: number;
  vote_average: number;
}

export interface TvEpisodeDetail extends EpisodeSummary {
  crew: CrewMember[];
  guest_stars: CastMember[];
}

/**
 * Credits
 */
export interface CastMember {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
  cast_id?: number;
  character: string;
  credit_id: string;
  order: number;
}

export interface CrewMember {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
  credit_id: string;
  department: string;
  job: string;
}

export interface CreditsResponse {
  id: number;
  cast: CastMember[];
  crew: CrewMember[];
}

export interface AggregateCastMember {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
  roles: Array<{
    credit_id: string;
    character: string;
    episode_count: number;
  }>;
  total_episode_count: number;
  order: number;
}

export interface AggregateCrewMember {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
  jobs: Array<{
    credit_id: string;
    job: string;
    episode_count: number;
  }>;
  department: string;
  total_episode_count: number;
}

export interface AggregateCreditsResponse {
  id: number;
  cast: AggregateCastMember[];
  crew: AggregateCrewMember[];
}

/**
 * Videos
 */
export interface VideoItem {
  iso_639_1: string;
  iso_3166_1: string;
  name: string;
  key: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
  published_at: string;
  id: string;
}

export interface VideosResponse {
  id: number;
  results: VideoItem[];
}

/**
 * Images
 */
export interface ImageItem {
  aspect_ratio: number;
  height: number;
  iso_639_1: string | null;
  file_path: string;
  vote_average: number;
  vote_count: number;
  width: number;
}

export interface ImagesResponse {
  id: number;
  backdrops: ImageItem[];
  logos: ImageItem[];
  posters: ImageItem[];
}

/**
 * Reviews
 */
export interface ReviewItem {
  author: string;
  author_details: {
    name: string;
    username: string;
    avatar_path: string | null;
    rating: number | null;
  };
  content: string;
  created_at: string;
  id: string;
  updated_at: string;
  url: string;
}

export interface ReviewsResponse {
  id: number;
  page: number;
  results: ReviewItem[];
  total_pages: number;
  total_results: number;
}

/**
 * Keywords
 */
export interface KeywordItem {
  id: number;
  name: string;
}

export interface MovieKeywordsResponse {
  id: number;
  keywords: KeywordItem[];
}

export interface TvKeywordsResponse {
  id: number;
  results: KeywordItem[];
}

/**
 * Content Ratings / Release Dates
 */
export interface ContentRatingItem {
  descriptors: string[];
  iso_3166_1: string;
  rating: string;
}

export interface TvContentRatingsResponse {
  id: number;
  results: ContentRatingItem[];
}

export interface ReleaseDateItem {
  certification: string;
  descriptors: string[];
  iso_639_1: string;
  note: string;
  release_date: string;
  type: number;
}

export interface ReleaseDatesResult {
  iso_3166_1: string;
  release_dates: ReleaseDateItem[];
}

export interface MovieReleaseDatesResponse {
  id: number;
  results: ReleaseDatesResult[];
}

/**
 * Watch Providers
 */
export interface WatchProviderItem {
  logo_path: string;
  provider_id: number;
  provider_name: string;
  display_priority: number;
}

export interface WatchProviderCountryDetail {
  link: string;
  flatrate?: WatchProviderItem[];
  rent?: WatchProviderItem[];
  buy?: WatchProviderItem[];
  free?: WatchProviderItem[];
  ads?: WatchProviderItem[];
}

export interface WatchProvidersResponse {
  id: number;
  results: Record<string, WatchProviderCountryDetail>;
}

export interface AvailableWatchProviderRegion {
  iso_3166_1: string;
  english_name: string;
  native_name: string;
}

/**
 * Search & Multi Search Types
 */
export interface MultiSearchResultItem {
  id: number;
  media_type: "movie" | "tv" | "person";
  adult?: boolean;
  overview?: string;
  popularity?: number;
  poster_path?: string | null;
  backdrop_path?: string | null;
  vote_average?: number;
  vote_count?: number;
  genre_ids?: number[];
  // Movie specific
  title?: string;
  original_title?: string;
  release_date?: string;
  video?: boolean;
  // TV specific
  name?: string;
  original_name?: string;
  first_air_date?: string;
  origin_country?: string[];
  // Person specific
  profile_path?: string | null;
  known_for_department?: string;
  known_for?: MultiSearchResultItem[];
}

export interface SearchMultiParams extends PaginationParams {
  query: string;
  include_adult?: boolean;
}

export interface SearchMovieParams extends PaginationParams {
  query: string;
  include_adult?: boolean;
  primary_release_year?: number | string;
  region?: string;
  year?: number | string;
}

export interface SearchTvParams extends PaginationParams {
  query: string;
  first_air_date_year?: number | string;
  include_adult?: boolean;
  year?: number | string;
}

export interface SearchPersonParams extends PaginationParams {
  query: string;
  include_adult?: boolean;
}

/**
 * Discover Parameters
 */
export interface DiscoverMovieParams extends PaginationParams {
  certification?: string;
  "certification.gte"?: string;
  "certification.lte"?: string;
  certification_country?: string;
  include_adult?: boolean;
  include_video?: boolean;
  primary_release_year?: number | string;
  "primary_release_date.gte"?: string;
  "primary_release_date.lte"?: string;
  region?: string;
  "release_date.gte"?: string;
  "release_date.lte"?: string;
  sort_by?: string;
  "vote_average.gte"?: number;
  "vote_average.lte"?: number;
  "vote_count.gte"?: number;
  "vote_count.lte"?: number;
  watch_region?: string;
  with_cast?: string;
  with_companies?: string;
  with_crew?: string;
  with_genres?: string;
  with_keywords?: string;
  with_origin_country?: string;
  with_original_language?: string;
  with_people?: string;
  with_release_type?: number;
  "with_runtime.gte"?: number;
  "with_runtime.lte"?: number;
  with_watch_monetization_types?: string;
  with_watch_providers?: string;
  without_companies?: string;
  without_genres?: string;
  without_keywords?: string;
  without_watch_providers?: string;
  year?: number | string;
}

export interface DiscoverTvParams extends PaginationParams {
  "air_date.gte"?: string;
  "air_date.lte"?: string;
  first_air_date_year?: number | string;
  "first_air_date.gte"?: string;
  "first_air_date.lte"?: string;
  include_adult?: boolean;
  include_null_first_air_dates?: boolean;
  screened_theatrically?: boolean;
  sort_by?: string;
  timezone?: string;
  "vote_average.gte"?: number;
  "vote_average.lte"?: number;
  "vote_count.gte"?: number;
  "vote_count.lte"?: number;
  watch_region?: string;
  with_companies?: string;
  with_genres?: string;
  with_keywords?: string;
  with_networks?: string;
  with_origin_country?: string;
  with_original_language?: string;
  "with_runtime.gte"?: number;
  "with_runtime.lte"?: number;
  with_status?: string;
  with_watch_monetization_types?: string;
  with_watch_providers?: string;
  without_companies?: string;
  without_genres?: string;
  without_keywords?: string;
  without_watch_providers?: string;
  with_type?: string;
}

/**
 * People Types
 */
export interface PersonSummary {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
  known_for: MultiSearchResultItem[];
}

export interface PersonDetail {
  adult: boolean;
  also_known_as: string[];
  biography: string;
  birthday: string | null;
  deathday: string | null;
  gender: number;
  homepage: string | null;
  id: number;
  imdb_id: string | null;
  known_for_department: string;
  name: string;
  place_of_birth: string | null;
  popularity: number;
  profile_path: string | null;
}

export interface PersonCombinedCreditsResponse {
  id: number;
  cast: Array<MultiSearchResultItem & {
    character: string;
    credit_id: string;
    order?: number;
    episode_count?: number;
  }>;
  crew: Array<MultiSearchResultItem & {
    credit_id: string;
    department: string;
    job: string;
    episode_count?: number;
  }>;
}

/**
 * Configuration Types
 */
export interface ConfigurationImages {
  base_url: string;
  secure_base_url: string;
  backdrop_sizes: string[];
  logo_sizes: string[];
  poster_sizes: string[];
  profile_sizes: string[];
  still_sizes: string[];
}

export interface ConfigurationResponse {
  images: ConfigurationImages;
  change_keys: string[];
}

export interface CountryConfiguration {
  iso_3166_1: string;
  english_name: string;
  native_name: string;
}

export interface LanguageConfiguration {
  iso_639_1: string;
  english_name: string;
  name: string;
}

export interface TimezoneConfiguration {
  iso_3166_1: string;
  zones: string[];
}

export interface JobDepartmentConfiguration {
  department: string;
  jobs: string[];
}

/**
 * Certifications
 */
export interface CertificationItem {
  certification: string;
  meaning: string;
  order: number;
}

export interface CertificationsResponse {
  certifications: Record<string, CertificationItem[]>;
}

/**
 * Collection Details
 */
export interface CollectionDetail {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  parts: MovieSummary[];
}

/**
 * Company Details
 */
export interface CompanyDetail {
  description: string;
  headquarters: string;
  homepage: string;
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
  parent_company: null | {
    id: number;
    name: string;
    logo_path: string | null;
  };
}

/**
 * Network Details
 */
export interface NetworkDetail {
  headquarters: string;
  homepage: string;
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

/**
 * Find by External ID
 */
export interface FindResults {
  movie_results: MovieSummary[];
  person_results: PersonSummary[];
  tv_results: TvSummary[];
  tv_episode_results: EpisodeSummary[];
  tv_season_results: SeasonSummary[];
}
