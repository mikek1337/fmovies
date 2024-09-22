import axios from 'axios';
import { MovieDetail, MovieResponse } from '../app/types/moviedbresponse';
import { GenerResponse } from '@/app/types/gener';


export const latestMovies = async ()=>{
    return axios.get<MovieResponse>(`${process.env.NEXT_PUBLIC_API_BASE_URL!}trending/movie/day?language=en-US&api_key=${process.env.NEXT_PUBLIC_API_KEY!}`,{
        headers:{
            "Content-Type": "application/json",
            
        }
    })
}

export const geners = async ()=>{
    return axios.get<GenerResponse>(`${process.env.NEXT_PUBLIC_API_BASE_URL!}genre/movie/list?language=en&api_key=${process.env.NEXT_PUBLIC_API_KEY!}`, {
        headers:{
            "Content-Type":"application/json"
        }
    })
}

export const popularMovies = async () =>{
    return axios.get<MovieResponse>(`${process.env.NEXT_PUBLIC_API_BASE_URL!}movie/popular?language=en-US&api_key=${process.env.NEXT_PUBLIC_API_KEY}&page=1`,{
        headers:{
            "Content-Type":"application/json"
        }
    }
    )
}

export const newSeries = () =>{
    return axios.get<MovieResponse>(`${process.env.NEXT_PUBLIC_API_BASE_URL!}trending/tv/day?language=en-US&api_key=${process.env.NEXT_PUBLIC_API_KEY}`,{
        headers:{
            "Content-Type":"application/json"
        }
    })
}

export const movieDetail = (id:number)=>{
    return axios.get<MovieDetail>(`${process.env.NEXT_PUBLIC_API_BASE_URL!}movie/${id}?language=en-US&api_key=${process.env.NEXT_PUBLIC_API_KEY}`,{
        headers:{
            "Content-Type":"application/json"
        }
    })
}

export const getRecommendation = (id:number, mediaType?:string)=>{
    if(!mediaType){
        return axios.get<MovieResponse>(`${process.env.NEXT_PUBLIC_API_BASE_URL!}movie/${id}/recommendations?language=en-US&page=1&api_key=${process.env.NEXT_PUBLIC_API_KEY}`,{
            headers:{
                "Content-Type":"application/json"
            }
        })
    }
        return axios.get<MovieResponse>(`${process.env.NEXT_PUBLIC_API_BASE_URL!}${mediaType}/${id}/recommendations?language=en-US&page=1&api_key=${process.env.NEXT_PUBLIC_API_KEY}`,{
            headers:{
                "Content-Type":"application/json"
            }
        })
    
}

export const searchMulti = (query:string)=>{
    return axios.get<MovieResponse>(`${process.env.NEXT_PUBLIC_API_BASE_URL!}search/multi?language=en-US&page=1&api_key=${process.env.NEXT_PUBLIC_API_KEY}&query=${query}`,{
        headers:{
            "Content-Type":"application/json"
        }
    })
}

export const popularSeries = (page:number)=>{
    return axios.get<MovieResponse>(`${process.env.NEXT_PUBLIC_API_BASE_URL!}tv/popular?language=en-US&page=${page}&api_key=${process.env.NEXT_PUBLIC_API_KEY}`,{
        headers:{
            "Content-Type":"application/json"
        }
    })
}

export const searchSeries = (queries:string)=>{
    return axios.get<MovieResponse>(`${process.env.NEXT_PUBLIC_API_BASE_URL!}search/tv?${queries}api_key=${process.env.NEXT_PUBLIC_API_KEY}`,{
        headers:{
            "Content-Type":"application/json"
        }
    })
}

export const seriesDetail = (id:number)=>{
    return axios.get<MovieDetail>(`${process.env.NEXT_PUBLIC_API_BASE_URL}tv/${id}?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US`,{
        headers:{
            "Content-Type": "application/json"
        }
    })
}
