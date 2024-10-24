import { Gener } from "./gener";

export interface MovieResponse{
    dates:WatchedDates,
    page:number,
    results: Movie[],
    total_pages: number,
    total_results: number

}

export interface WatchedDates{
    maximum:string,
    minimum:string
}

export interface Movie{
    id: number,
    original_title: string,
    overview: string,
    poster_path: string,
    name:string,
    original_name:string,
    first_air_date:string,
    media_type:string,
    backdrop_path: string,
    release_date: string,
    title:string,
    vote_average: number,
    vote_count: number
}


export interface MovieDetail{
    adult: boolean,
    backdrop_path: string,
    budget: number,
    genres: Gener[],
    homepage: string,
    id: number,
    imdb_id: string,
    original_language: string,
    original_title: string,
    name:string,
    overview: string,
    popularity: number,
    poster_path: string,
    production_companies: ProductionCompany[],
    production_countries: ProductionCountry[],
    release_date: string,
    revenue: number,
    runtime: number,
    spoken_languages: SpokenLanguage[],
    status: string,
    tagline: string,
    title: string,
    video: boolean,
    vote_average: number,
    vote_count: number
    seasons:SeasonDetails[],
    type:string,
    first_air_date:string
}

export interface SeasonDetails{
    air_date: string,
    episode_count: number,
    id: number,
    name: string,
      overview: string,
      poster_path: string,
      season_number: number,
      vote_average: number
} 

export interface ProductionCompany{
    id: number,
    logo_path: string,
    name: string,
    origin_country: string
}

export interface ProductionCountry{
    iso_3166_1: string,
    name: string
}

export interface SpokenLanguage{
    english_name: string,
    iso_639_1: string,
    name: string
}

export interface MovieCast{
    id:number,
    cast:Cast[]
}

export interface Cast{
    adult: boolean,
    gender: number,
    id: number,
    known_for_department: string,
    name: string,
    original_name: string,
    popularity: number,
    profile_path: string,
    cast_id: number,
    character: string,
    credit_id: string,
    order: number
}