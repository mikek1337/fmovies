import axios from 'axios';
import { MovieResponse } from '../app/types/moviedbresponse';


export const latestMovies = async ()=>{
    return axios.get<MovieResponse>(`${process.env.API_BASE_URL!}trending/all/day?language=en-US`,{
        headers:{
            "Content-Type": "application/json",
            "Authorization":"Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5ZWQ1OTlhZDMzOWIwOWJmYTU0OWU3MmM4NTc1ZTYzOSIsIm5iZiI6MTcyNjEzNDc1OS44Mjc2NzcsInN1YiI6IjY2ZTJhOThkYzgxYjI0YjNmZTIzN2U2NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.r0E1J-cYFjvdSx9i6o-Jc6qFJDmR4I_YMhRY2eFKyQM"
        }
    })
}