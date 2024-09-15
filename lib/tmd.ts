import axios from 'axios';
import { MovieDetail, MovieResponse } from '../app/types/moviedbresponse';
import { GenerResponse } from '@/app/types/gener';


export const latestMovies = async ()=>{
    return axios.get<MovieResponse>(`${process.env.API_BASE_URL!}trending/all/day?language=en-US&api_key=${process.env.API_KEY!}`,{
        headers:{
            "Content-Type": "application/json",
            
        }
    })
}

export const geners = async ()=>{
    return axios.get<GenerResponse>(`${process.env.API_BASE_URL!}genre/movie/list?language=en&api_key=${process.env.API_KEY!}`, {
        headers:{
            "Content-Type":"application/json"
        }
    })
}

export const popularMovies = async () =>{
    return axios.get<MovieResponse>(`${process.env.API_BASE_URL!}movie/popular?language=en-US&api_key=${process.env.API_KEY}&page=1`,{
        headers:{
            "Content-Type":"application/json"
        }
    }
    )
}

export const newSeries = () =>{
    return axios.get<MovieResponse>(`${process.env.API_BASE_URL!}trending/tv/day?language=en-US&api_key=${process.env.API_KEY}`,{
        headers:{
            "Content-Type":"application/json"
        }
    })
}

export const movieDetail = (id:number)=>{
    return axios.get<MovieDetail>(`${process.env.API_BASE_URL!}movie/${id}?language=en-US&api_key=${process.env.API_KEY}`,{
        headers:{
            "Content-Type":"application/json"
        }
    })
}

export const getRecommendation = (id:number)=>{
    return axios.get<MovieResponse>(`${process.env.API_BASE_URL!}movie/${id}recommendations?language=en-US&page=1&api_key=${process.env.API_KEY}`,{
        headers:{
            "Content-Type":"application/json"
        }
    })
}

export const searchMulti = (query:string)=>{
    return axios.get<MovieResponse>(`https://api.themoviedb.org/3/search/multi?language=en-US&page=1&api_key=9ed599ad339b09bfa549e72c8575e639&query=${query}`,{
        headers:{
            "Content-Type":"application/json"
        }
    })
}

