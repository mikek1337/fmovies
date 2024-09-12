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
    release_date: string,
    title:string,
    vote_average: number,
    vote_count: number
}