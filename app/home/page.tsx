'use client'
import {useEffect, useState} from 'react'
import axios from "axios";
import { MovieResponse } from '../types/moviedbresponse';
import Image from 'next/image';

const Page = ()=>{
    const [movies, setMovies] = useState<MovieResponse>()
    useEffect(()=>{
        axios.get('/api/latestMovies').then((res)=>{
            setMovies(res.data)
        }).then(err=>{
            console.log(err)
        })
    },[])
    return(
        <div>
            <div className='w-full'>
                {
                    movies?.results.map((res)=>(
                        <div key={res.id} className='relative flex items-center w-full'>
                            <Image src={res.poster_path} width={200} height={200} alt={res.title}/>
                            <div>
                                <span className='text-2xl font-extrabold line-clamp-2 max-w-[300px]'>{res.original_title}</span>
                                <p className='text-sm max-w-[200px] text-center'>{res.overview}</p>
                                <span className='bg-white px-2'>{res.release_date}</span>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default Page;