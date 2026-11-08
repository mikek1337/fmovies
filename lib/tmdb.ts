import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { Gener } from "@/app/types/gener";
import {
  AggregateCreditsResponse,
  CertificationsResponse,
  CollectionDetail,
  CompanyDetail,
  ConfigurationResponse,
  CountryConfiguration,
  CreditsResponse,
  DiscoverMovieParams,
  DiscoverTvParams,
  EpisodeSummary,
  FindResults,
  GenerResponse,
  ImagesResponse,
  JobDepartmentConfiguration,
  LanguageConfiguration,
  MovieDetail,
  MovieResponse,
  NetworkDetail,
  PaginatedResponse,
  PaginationParams,
  PersonCombinedCreditsResponse,
  PersonDetail,
  PersonSummary,
  ReviewsResponse,
  SearchMovieParams,
  SearchMultiParams,
  SearchPersonParams,
  SearchTvParams,
  TimezoneConfiguration,
  TvContentRatingsResponse,
  TvDetail,
  TvEpisodeDetail,
  TvSeasonDetail,
  VideosResponse,
  WatchProvidersResponse,
} from "@/app/types/tmdb";

// Force Node.js runtime to prioritize IPv4 DNS lookups.
// This prevents 'connect ENETUNREACH 2600:9000:... - Local (:::0)' errors
// on systems without active IPv6 routing.
if (typeof window === "undefined") {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const dns = require("dns");
    if (dns && typeof dns.setDefaultResultOrder === "function") {
      dns.setDefaultResultOrder("ipv4first");
    }
  } catch {
    // Ignore in non-Node environments
  }
}

export const FALLBACK_MOVIE_GENRES: Gener[] = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Science Fiction" },
  { id: 10770, name: "TV Movie" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37, name: "Western" },
];

export const FALLBACK_TV_GENRES: Gener[] = [
  { id: 10759, name: "Action & Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 10762, name: "Kids" },
  { id: 9648, name: "Mystery" },
  { id: 10763, name: "News" },
  { id: 10764, name: "Reality" },
  { id: 10765, name: "Sci-Fi & Fantasy" },
  { id: 10766, name: "Soap" },
  { id: 10767, name: "Talk" },
  { id: 10768, name: "War & Politics" },
  { id: 37, name: "Western" },
];

export interface TmdbClientConfig {
  baseUrl?: string;
  apiKey?: string;
  readAccessToken?: string;
  defaultLanguage?: string;
}

export class TmdbClient {
  private client: AxiosInstance;
  private apiKey?: string;
  private readAccessToken?: string;
  public defaultLanguage: string;

  constructor(config?: TmdbClientConfig) {
    const rawBaseUrl =
      config?.baseUrl ||
      process.env.TMDB_BASE_URL ||
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      "https://api.themoviedb.org/3";

    const normalizedBaseUrl = rawBaseUrl.endsWith("/")
      ? rawBaseUrl
      : `${rawBaseUrl}/`;

    this.apiKey =
      config?.apiKey ||
      process.env.TMDB_API_KEY ||
      process.env.NEXT_PUBLIC_API_KEY;

    this.readAccessToken =
      config?.readAccessToken ||
      process.env.TMDB_READ_ACCESS_TOKEN ||
      process.env.NEXT_PUBLIC_API_READ_ACCESS_TOKEN;

    this.defaultLanguage = config?.defaultLanguage || "en-US";

    this.client = axios.create({
      baseURL: normalizedBaseUrl,
      timeout: config?.baseUrl ? undefined : 10000,
      headers: {
        Accept: "application/json",
      },
    });

    this.client.interceptors.request.use((reqConfig: InternalAxiosRequestConfig) => {
      reqConfig.params = { ...(reqConfig.params || {}) };

      // Apply Bearer token if provided, else fallback to API key param
      if (this.readAccessToken) {
        reqConfig.headers = reqConfig.headers || {};
        reqConfig.headers.Authorization = `Bearer ${this.readAccessToken}`;
      } else if (this.apiKey) {
        reqConfig.params.api_key = this.apiKey;
      }

      // Default language if not explicitly provided
      if (
        !reqConfig.params.language &&
        !reqConfig.url?.includes("configuration")
      ) {
        reqConfig.params.language = this.defaultLanguage;
      }

      // Clean undefined or null params
      Object.keys(reqConfig.params).forEach((key) => {
        if (
          reqConfig.params[key] === undefined ||
          reqConfig.params[key] === null ||
          reqConfig.params[key] === ""
        ) {
          delete reqConfig.params[key];
        }
      });

      return reqConfig;
    });
  }

  public getRawClient(): AxiosInstance {
    return this.client;
  }

  private async get<T>(url: string, params?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.get<T>(url, { ...config, params: { ...(params as object), ...(config?.params || {}) } });
  }

  private async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.post<T>(url, data, config);
  }

  private async delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.delete<T>(url, config);
  }

  // ==========================================
  // TRENDING
  // ==========================================
  public trending = {
    all: (timeWindow: "day" | "week" = "week", params?: PaginationParams) =>
      this.get<MovieResponse>(`trending/all/${timeWindow}`, params),

    movies: (timeWindow: "day" | "week" = "week", params?: PaginationParams) =>
      this.get<MovieResponse>(`trending/movie/${timeWindow}`, params),

    tv: (timeWindow: "day" | "week" = "day", params?: PaginationParams) =>
      this.get<MovieResponse>(`trending/tv/${timeWindow}`, params),

    people: (timeWindow: "day" | "week" = "week", params?: PaginationParams) =>
      this.get<PaginatedResponse<PersonSummary>>(`trending/person/${timeWindow}`, params),
  };

  // ==========================================
  // MOVIES
  // ==========================================
  public movies = {
    popular: (params?: PaginationParams & { region?: string }) =>
      this.get<MovieResponse>("movie/popular", params),

    nowPlaying: (params?: PaginationParams & { region?: string }) =>
      this.get<MovieResponse>("movie/now_playing", params),

    topRated: (params?: PaginationParams & { region?: string }) =>
      this.get<MovieResponse>("movie/top_rated", params),

    upcoming: (params?: PaginationParams & { region?: string }) =>
      this.get<MovieResponse>("movie/upcoming", params),

    latest: () =>
      this.get<MovieDetail>("movie/latest"),

    details: (movieId: number, params?: { append_to_response?: string; language?: string }) =>
      this.get<MovieDetail>(`movie/${movieId}`, params),

    recommendations: (movieId: number, params?: PaginationParams) =>
      this.get<MovieResponse>(`movie/${movieId}/recommendations`, params),

    similar: (movieId: number, params?: PaginationParams) =>
      this.get<MovieResponse>(`movie/${movieId}/similar`, params),

    credits: (movieId: number, params?: { language?: string }) =>
      this.get<CreditsResponse>(`movie/${movieId}/credits`, params),

    videos: (movieId: number, params?: { language?: string }) =>
      this.get<VideosResponse>(`movie/${movieId}/videos`, params),

    images: (movieId: number, params?: { include_image_language?: string; language?: string }) =>
      this.get<ImagesResponse>(`movie/${movieId}/images`, params),

    keywords: (movieId: number) =>
      this.get<{ id: number; keywords: Array<{ id: number; name: string }> }>(`movie/${movieId}/keywords`),

    reviews: (movieId: number, params?: PaginationParams) =>
      this.get<ReviewsResponse>(`movie/${movieId}/reviews`, params),

    releaseDates: (movieId: number) =>
      this.get<{ id: number; results: Array<{ iso_3166_1: string; release_dates: Array<unknown> }> }>(`movie/${movieId}/release_dates`),

    alternativeTitles: (movieId: number, params?: { country?: string }) =>
      this.get<{ id: number; titles: Array<{ iso_3166_1: string; title: string; type: string }> }>(`movie/${movieId}/alternative_titles`, params),

    externalIds: (movieId: number) =>
      this.get<{ id: number; imdb_id?: string; wikidata_id?: string; facebook_id?: string; instagram_id?: string; twitter_id?: string }>(`movie/${movieId}/external_ids`),

    translations: (movieId: number) =>
      this.get<{ id: number; translations: Array<{ iso_3166_1: string; iso_639_1: string; name: string; english_name: string; data: unknown }> }>(`movie/${movieId}/translations`),

    watchProviders: (movieId: number) =>
      this.get<WatchProvidersResponse>(`movie/${movieId}/watch/providers`),

    changes: (params?: { end_date?: string; page?: number; start_date?: string }) =>
      this.get<PaginatedResponse<{ id: number; adult?: boolean }>>("movie/changes", params),

    movieChanges: (movieId: number, params?: { end_date?: string; page?: number; start_date?: string }) =>
      this.get<{ changes: unknown[] }>(`movie/${movieId}/changes`, params),

    lists: (movieId: number, params?: PaginationParams) =>
      this.get<PaginatedResponse<unknown>>(`movie/${movieId}/lists`, params),

    addRating: (movieId: number, value: number, params?: { guest_session_id?: string; session_id?: string }) =>
      this.post<{ status_code: number; status_message: string }>(`movie/${movieId}/rating`, { value }, { params }),

    deleteRating: (movieId: number, params?: { guest_session_id?: string; session_id?: string }) =>
      this.delete<{ status_code: number; status_message: string }>(`movie/${movieId}/rating`, { params }),
  };

  // ==========================================
  // TV SERIES
  // ==========================================
  public tv = {
    popular: (params?: PaginationParams) =>
      this.get<MovieResponse>("tv/popular", params),

    airingToday: (params?: PaginationParams) =>
      this.get<MovieResponse>("tv/airing_today", params),

    onTheAir: (params?: PaginationParams) =>
      this.get<MovieResponse>("tv/on_the_air", params),

    topRated: (params?: PaginationParams) =>
      this.get<MovieResponse>("tv/top_rated", params),

    latest: () =>
      this.get<TvDetail>("tv/latest"),

    details: (seriesId: number, params?: { append_to_response?: string; language?: string }) =>
      this.get<MovieDetail>(`tv/${seriesId}`, params),

    recommendations: (seriesId: number, params?: PaginationParams) =>
      this.get<MovieResponse>(`tv/${seriesId}/recommendations`, params),

    similar: (seriesId: number, params?: PaginationParams) =>
      this.get<MovieResponse>(`tv/${seriesId}/similar`, params),

    credits: (seriesId: number, params?: { language?: string }) =>
      this.get<CreditsResponse>(`tv/${seriesId}/credits`, params),

    aggregateCredits: (seriesId: number, params?: { language?: string }) =>
      this.get<AggregateCreditsResponse>(`tv/${seriesId}/aggregate_credits`, params),

    videos: (seriesId: number, params?: { language?: string }) =>
      this.get<VideosResponse>(`tv/${seriesId}/videos`, params),

    images: (seriesId: number, params?: { include_image_language?: string; language?: string }) =>
      this.get<ImagesResponse>(`tv/${seriesId}/images`, params),

    keywords: (seriesId: number) =>
      this.get<{ id: number; results: Array<{ id: number; name: string }> }>(`tv/${seriesId}/keywords`),

    reviews: (seriesId: number, params?: PaginationParams) =>
      this.get<ReviewsResponse>(`tv/${seriesId}/reviews`, params),

    contentRatings: (seriesId: number) =>
      this.get<TvContentRatingsResponse>(`tv/${seriesId}/content_ratings`),

    episodeGroups: (seriesId: number) =>
      this.get<{ id: number; results: unknown[] }>(`tv/${seriesId}/episode_groups`),

    externalIds: (seriesId: number) =>
      this.get<{ id: number; imdb_id?: string; freebase_mid?: string; freebase_id?: string; tvdb_id?: number; tvrage_id?: number; wikidata_id?: string; facebook_id?: string; instagram_id?: string; twitter_id?: string }>(`tv/${seriesId}/external_ids`),

    translations: (seriesId: number) =>
      this.get<{ id: number; translations: unknown[] }>(`tv/${seriesId}/translations`),

    watchProviders: (seriesId: number) =>
      this.get<WatchProvidersResponse>(`tv/${seriesId}/watch/providers`),

    screenedTheatrically: (seriesId: number) =>
      this.get<{ id: number; results: Array<{ id: number; episode_number: number; season_number: number }> }>(`tv/${seriesId}/screened_theatrically`),

    changes: (params?: { end_date?: string; page?: number; start_date?: string }) =>
      this.get<PaginatedResponse<{ id: number; adult?: boolean }>>("tv/changes", params),

    seriesChanges: (seriesId: number, params?: { end_date?: string; page?: number; start_date?: string }) =>
      this.get<{ changes: unknown[] }>(`tv/${seriesId}/changes`, params),

    addRating: (seriesId: number, value: number, params?: { guest_session_id?: string; session_id?: string }) =>
      this.post<{ status_code: number; status_message: string }>(`tv/${seriesId}/rating`, { value }, { params }),

    deleteRating: (seriesId: number, params?: { guest_session_id?: string; session_id?: string }) =>
      this.delete<{ status_code: number; status_message: string }>(`tv/${seriesId}/rating`, { params }),
  };

  // ==========================================
  // TV SEASONS
  // ==========================================
  public tvSeasons = {
    details: (seriesId: number, seasonNumber: number, params?: { append_to_response?: string; language?: string }) =>
      this.get<TvSeasonDetail>(`tv/${seriesId}/season/${seasonNumber}`, params),

    credits: (seriesId: number, seasonNumber: number, params?: { language?: string }) =>
      this.get<CreditsResponse>(`tv/${seriesId}/season/${seasonNumber}/credits`, params),

    aggregateCredits: (seriesId: number, seasonNumber: number, params?: { language?: string }) =>
      this.get<AggregateCreditsResponse>(`tv/${seriesId}/season/${seasonNumber}/aggregate_credits`, params),

    videos: (seriesId: number, seasonNumber: number, params?: { language?: string }) =>
      this.get<VideosResponse>(`tv/${seriesId}/season/${seasonNumber}/videos`, params),

    images: (seriesId: number, seasonNumber: number, params?: { include_image_language?: string; language?: string }) =>
      this.get<ImagesResponse>(`tv/${seriesId}/season/${seasonNumber}/images`, params),

    externalIds: (seriesId: number, seasonNumber: number) =>
      this.get<{ id: number; freebase_mid?: string; freebase_id?: string; tvdb_id?: number; tvrage_id?: number; wikidata_id?: string }>(`tv/${seriesId}/season/${seasonNumber}/external_ids`),

    translations: (seriesId: number, seasonNumber: number) =>
      this.get<{ id: number; translations: unknown[] }>(`tv/${seriesId}/season/${seasonNumber}/translations`),

    watchProviders: (seriesId: number, seasonNumber: number, params?: { language?: string; watch_region?: string }) =>
      this.get<WatchProvidersResponse>(`tv/${seriesId}/season/${seasonNumber}/watch/providers`, params),

    changes: (seasonId: number, params?: { end_date?: string; page?: number; start_date?: string }) =>
      this.get<{ changes: unknown[] }>(`tv/season/${seasonId}/changes`, params),
  };

  // ==========================================
  // TV EPISODES
  // ==========================================
  public tvEpisodes = {
    details: (seriesId: number, seasonNumber: number, episodeNumber: number, params?: { append_to_response?: string; language?: string }) =>
      this.get<TvEpisodeDetail>(`tv/${seriesId}/season/${seasonNumber}/episode/${episodeNumber}`, params),

    credits: (seriesId: number, seasonNumber: number, episodeNumber: number, params?: { language?: string }) =>
      this.get<CreditsResponse>(`tv/${seriesId}/season/${seasonNumber}/episode/${episodeNumber}/credits`, params),

    videos: (seriesId: number, seasonNumber: number, episodeNumber: number, params?: { language?: string }) =>
      this.get<VideosResponse>(`tv/${seriesId}/season/${seasonNumber}/episode/${episodeNumber}/videos`, params),

    images: (seriesId: number, seasonNumber: number, episodeNumber: number) =>
      this.get<{ id: number; stills: Array<unknown> }>(`tv/${seriesId}/season/${seasonNumber}/episode/${episodeNumber}/images`),

    externalIds: (seriesId: number, seasonNumber: number, episodeNumber: number) =>
      this.get<{ id: number; imdb_id?: string; freebase_mid?: string; freebase_id?: string; tvdb_id?: number; tvrage_id?: number; wikidata_id?: string }>(`tv/${seriesId}/season/${seasonNumber}/episode/${episodeNumber}/external_ids`),

    translations: (seriesId: number, seasonNumber: number, episodeNumber: number) =>
      this.get<{ id: number; translations: unknown[] }>(`tv/${seriesId}/season/${seasonNumber}/episode/${episodeNumber}/translations`),

    changes: (episodeId: number, params?: { end_date?: string; page?: number; start_date?: string }) =>
      this.get<{ changes: unknown[] }>(`tv/episode/${episodeId}/changes`, params),

    addRating: (seriesId: number, seasonNumber: number, episodeNumber: number, value: number, params?: { guest_session_id?: string; session_id?: string }) =>
      this.post<{ status_code: number; status_message: string }>(`tv/${seriesId}/season/${seasonNumber}/episode/${episodeNumber}/rating`, { value }, { params }),

    deleteRating: (seriesId: number, seasonNumber: number, episodeNumber: number, params?: { guest_session_id?: string; session_id?: string }) =>
      this.delete<{ status_code: number; status_message: string }>(`tv/${seriesId}/season/${seasonNumber}/episode/${episodeNumber}/rating`, { params }),
  };

  // ==========================================
  // SEARCH
  // ==========================================
  public search = {
    multi: (params: SearchMultiParams) =>
      this.get<MovieResponse>("search/multi", params),

    movie: (params: SearchMovieParams) =>
      this.get<MovieResponse>("search/movie", params),

    tv: (params: SearchTvParams) =>
      this.get<MovieResponse>("search/tv", params),

    person: (params: SearchPersonParams) =>
      this.get<PaginatedResponse<PersonSummary>>("search/person", params),

    collection: (params: PaginationParams & { query: string; include_adult?: boolean; region?: string }) =>
      this.get<PaginatedResponse<unknown>>("search/collection", params),

    keyword: (params: PaginationParams & { query: string }) =>
      this.get<PaginatedResponse<{ id: number; name: string }>>("search/keyword", params),

    company: (params: PaginationParams & { query: string }) =>
      this.get<PaginatedResponse<{ id: number; logo_path: string | null; name: string; origin_country: string }>>("search/company", params),
  };

  // ==========================================
  // DISCOVER
  // ==========================================
  public discover = {
    movie: (params?: DiscoverMovieParams) =>
      this.get<MovieResponse>("discover/movie", params),

    tv: (params?: DiscoverTvParams) =>
      this.get<MovieResponse>("discover/tv", params),
  };

  // ==========================================
  // GENRES
  // ==========================================
  public genres = {
    movieList: async (params?: { language?: string }) => {
      try {
        return await this.get<GenerResponse>("genre/movie/list", params);
      } catch (error) {
        console.warn(
          "TMDB movie genres request failed, returning fallback genres:",
          error instanceof Error ? error.message : error
        );
        return {
          data: { genres: FALLBACK_MOVIE_GENRES },
          status: 200,
          statusText: "OK",
          headers: {},
          config: {} as InternalAxiosRequestConfig,
        } as AxiosResponse<GenerResponse>;
      }
    },

    tvList: async (params?: { language?: string }) => {
      try {
        return await this.get<GenerResponse>("genre/tv/list", params);
      } catch (error) {
        console.warn(
          "TMDB tv genres request failed, returning fallback genres:",
          error instanceof Error ? error.message : error
        );
        return {
          data: { genres: FALLBACK_TV_GENRES },
          status: 200,
          statusText: "OK",
          headers: {},
          config: {} as InternalAxiosRequestConfig,
        } as AxiosResponse<GenerResponse>;
      }
    },
  };

  // ==========================================
  // PEOPLE
  // ==========================================
  public people = {
    popular: (params?: PaginationParams) =>
      this.get<PaginatedResponse<PersonSummary>>("person/popular", params),

    latest: () =>
      this.get<PersonDetail>("person/latest"),

    details: (personId: number, params?: { append_to_response?: string; language?: string }) =>
      this.get<PersonDetail>(`person/${personId}`, params),

    changes: (params?: { end_date?: string; page?: number; start_date?: string }) =>
      this.get<PaginatedResponse<{ id: number; adult?: boolean }>>("person/changes", params),

    personChanges: (personId: number, params?: { end_date?: string; page?: number; start_date?: string }) =>
      this.get<{ changes: unknown[] }>(`person/${personId}/changes`, params),

    combinedCredits: (personId: number, params?: { language?: string }) =>
      this.get<PersonCombinedCreditsResponse>(`person/${personId}/combined_credits`, params),

    movieCredits: (personId: number, params?: { language?: string }) =>
      this.get<unknown>(`person/${personId}/movie_credits`, params),

    tvCredits: (personId: number, params?: { language?: string }) =>
      this.get<unknown>(`person/${personId}/tv_credits`, params),

    images: (personId: number) =>
      this.get<{ id: number; profiles: unknown[] }>(`person/${personId}/images`),

    taggedImages: (personId: number, params?: PaginationParams) =>
      this.get<PaginatedResponse<unknown>>(`person/${personId}/tagged_images`, params),

    externalIds: (personId: number) =>
      this.get<{ id: number; imdb_id?: string; facebook_id?: string; instagram_id?: string; twitter_id?: string; wikidata_id?: string; tiktok_id?: string }>(`person/${personId}/external_ids`),

    translations: (personId: number) =>
      this.get<{ id: number; translations: unknown[] }>(`person/${personId}/translations`),
  };

  // ==========================================
  // CONFIGURATION
  // ==========================================
  public configuration = {
    details: () =>
      this.get<ConfigurationResponse>("configuration"),

    countries: (params?: { language?: string }) =>
      this.get<CountryConfiguration[]>("configuration/countries", params),

    jobs: () =>
      this.get<JobDepartmentConfiguration[]>("configuration/jobs"),

    languages: () =>
      this.get<LanguageConfiguration[]>("configuration/languages"),

    primaryTranslations: () =>
      this.get<string[]>("configuration/primary_translations"),

    timezones: () =>
      this.get<TimezoneConfiguration[]>("configuration/timezones"),
  };

  // ==========================================
  // WATCH PROVIDERS
  // ==========================================
  public watchProviders = {
    regions: (params?: { language?: string }) =>
      this.get<{ results: Array<{ iso_3166_1: string; english_name: string; native_name: string }> }>("watch/providers/regions", params),

    movie: (params?: { language?: string; watch_region?: string }) =>
      this.get<{ results: Array<{ display_priorities: Record<string, number>; display_priority: number; logo_path: string; provider_name: string; provider_id: number }> }>("watch/providers/movie", params),

    tv: (params?: { language?: string; watch_region?: string }) =>
      this.get<{ results: Array<{ display_priorities: Record<string, number>; display_priority: number; logo_path: string; provider_name: string; provider_id: number }> }>("watch/providers/tv", params),
  };

  // ==========================================
  // COLLECTIONS
  // ==========================================
  public collections = {
    details: (collectionId: number, params?: { language?: string }) =>
      this.get<CollectionDetail>(`collection/${collectionId}`, params),

    images: (collectionId: number, params?: { include_image_language?: string; language?: string }) =>
      this.get<ImagesResponse>(`collection/${collectionId}/images`, params),

    translations: (collectionId: number) =>
      this.get<{ id: number; translations: unknown[] }>(`collection/${collectionId}/translations`),
  };

  // ==========================================
  // COMPANIES
  // ==========================================
  public companies = {
    details: (companyId: number) =>
      this.get<CompanyDetail>(`company/${companyId}`),

    alternativeNames: (companyId: number) =>
      this.get<{ id: number; results: Array<{ name: string; type: string }> }>(`company/${companyId}/alternative_names`),

    images: (companyId: number) =>
      this.get<{ id: number; logos: Array<unknown> }>(`company/${companyId}/images`),
  };

  // ==========================================
  // NETWORKS
  // ==========================================
  public networks = {
    details: (networkId: number) =>
      this.get<NetworkDetail>(`network/${networkId}`),

    alternativeNames: (networkId: number) =>
      this.get<{ id: number; results: Array<{ name: string; type: string }> }>(`network/${networkId}/alternative_names`),

    images: (networkId: number) =>
      this.get<{ id: number; logos: Array<unknown> }>(`network/${networkId}/images`),
  };

  // ==========================================
  // CERTIFICATIONS
  // ==========================================
  public certifications = {
    movieList: () =>
      this.get<CertificationsResponse>("certification/movie/list"),

    tvList: () =>
      this.get<CertificationsResponse>("certification/tv/list"),
  };

  // ==========================================
  // FIND
  // ==========================================
  public find = {
    byId: (externalId: string, params: { external_source: "imdb_id" | "freebase_mid" | "freebase_id" | "tvdb_id" | "tvrage_id" | "wikidata_id" | "facebook_id" | "instagram_id" | "twitter_id" | "tiktok_id"; language?: string }) =>
      this.get<FindResults>(`find/${externalId}`, params),
  };

  // ==========================================
  // KEYWORDS
  // ==========================================
  public keywords = {
    details: (keywordId: number) =>
      this.get<{ id: number; name: string }>(`keyword/${keywordId}`),

    movies: (keywordId: number, params?: PaginationParams & { include_adult?: boolean }) =>
      this.get<MovieResponse>(`keyword/${keywordId}/movies`, params),
  };

  // ==========================================
  // REVIEWS
  // ==========================================
  public reviews = {
    details: (reviewId: string) =>
      this.get<unknown>(`review/${reviewId}`),
  };

  // ==========================================
  // ACCOUNT
  // ==========================================
  public account = {
    details: (accountId: number | string = "account_id", params?: { session_id?: string }) =>
      this.get<unknown>(`account/${accountId}`, params),

    favoriteMovies: (accountId: number | string = "account_id", params?: PaginationParams & { session_id?: string; sort_by?: string }) =>
      this.get<MovieResponse>(`account/${accountId}/favorite/movies`, params),

    favoriteTv: (accountId: number | string = "account_id", params?: PaginationParams & { session_id?: string; sort_by?: string }) =>
      this.get<MovieResponse>(`account/${accountId}/favorite/tv`, params),

    ratedMovies: (accountId: number | string = "account_id", params?: PaginationParams & { session_id?: string; sort_by?: string }) =>
      this.get<MovieResponse>(`account/${accountId}/rated/movies`, params),

    ratedTv: (accountId: number | string = "account_id", params?: PaginationParams & { session_id?: string; sort_by?: string }) =>
      this.get<MovieResponse>(`account/${accountId}/rated/tv`, params),

    ratedTvEpisodes: (accountId: number | string = "account_id", params?: PaginationParams & { session_id?: string; sort_by?: string }) =>
      this.get<PaginatedResponse<EpisodeSummary>>(`account/${accountId}/rated/tv/episodes`, params),

    watchlistMovies: (accountId: number | string = "account_id", params?: PaginationParams & { session_id?: string; sort_by?: string }) =>
      this.get<MovieResponse>(`account/${accountId}/watchlist/movies`, params),

    watchlistTv: (accountId: number | string = "account_id", params?: PaginationParams & { session_id?: string; sort_by?: string }) =>
      this.get<MovieResponse>(`account/${accountId}/watchlist/tv`, params),

    lists: (accountId: number | string = "account_id", params?: PaginationParams & { session_id?: string }) =>
      this.get<PaginatedResponse<unknown>>(`account/${accountId}/lists`, params),

    addFavorite: (accountId: number | string, body: { media_type: "movie" | "tv"; media_id: number; favorite: boolean }, params?: { session_id?: string }) =>
      this.post<{ status_code: number; status_message: string }>(`account/${accountId}/favorite`, body, { params }),

    addToWatchlist: (accountId: number | string, body: { media_type: "movie" | "tv"; media_id: number; watchlist: boolean }, params?: { session_id?: string }) =>
      this.post<{ status_code: number; status_message: string }>(`account/${accountId}/watchlist`, body, { params }),
  };

  // ==========================================
  // AUTHENTICATION
  // ==========================================
  public authentication = {
    validateKey: () =>
      this.get<{ success: boolean; status_code: number; status_message: string }>("authentication"),

    createRequestToken: () =>
      this.get<{ success: boolean; expires_at: string; request_token: string }>("authentication/token/new"),

    createGuestSession: () =>
      this.get<{ success: boolean; guest_session_id: string; expires_at: string }>("authentication/guest_session/new"),

    createSession: (requestToken: string) =>
      this.post<{ success: boolean; session_id: string }>("authentication/session/new", { request_token: requestToken }),

    createSessionFromLogin: (body: { username: string; password: string; request_token: string }) =>
      this.post<{ success: boolean; request_token: string }>("authentication/token/validate_with_login", body),

    createSessionFromV4Token: (accessToken: string) =>
      this.post<{ success: boolean; session_id: string }>("authentication/session/convert/4", { access_token: accessToken }),

    deleteSession: (sessionId: string) =>
      this.delete<{ success: boolean }>("authentication/session", { data: { session_id: sessionId } }),
  };

  // ==========================================
  // LISTS
  // ==========================================
  public lists = {
    details: (listId: number | string, params?: PaginationParams) =>
      this.get<unknown>(`list/${listId}`, params),

    itemStatus: (listId: number | string, movieId: number) =>
      this.get<{ id: string; item_present: boolean }>(`list/${listId}/item_status`, { movie_id: movieId }),

    create: (body: { name: string; description: string; language?: string }, params?: { session_id?: string }) =>
      this.post<{ status_message: string; success: boolean; status_code: number; list_id: number }>("list", body, { params }),

    delete: (listId: number | string, params?: { session_id?: string }) =>
      this.delete<{ status_code: number; status_message: string }>(`list/${listId}`, { params }),

    addItem: (listId: number | string, mediaId: number, params?: { session_id?: string }) =>
      this.post<{ status_code: number; status_message: string }>(`list/${listId}/add_item`, { media_id: mediaId }, { params }),

    removeItem: (listId: number | string, mediaId: number, params?: { session_id?: string }) =>
      this.post<{ status_code: number; status_message: string }>(`list/${listId}/remove_item`, { media_id: mediaId }, { params }),

    clear: (listId: number | string, confirm: boolean, params?: { session_id?: string }) =>
      this.post<{ status_code: number; status_message: string }>(`list/${listId}/clear`, null, { params: { ...params, confirm } }),
  };
}

export const tmdb = new TmdbClient();
export default tmdb;
