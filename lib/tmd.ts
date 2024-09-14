import axios from 'axios';
import { MovieResponse } from '../app/types/moviedbresponse';
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