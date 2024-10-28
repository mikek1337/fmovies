'use client'
import { useEffect } from "react"

export default function Error({error, reset}:{
    error: Error & {digest?:string},
    reset: ()=>void
}){
    useEffect(()=>{
        console.log("Error Occured", error)
    },[error]);
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl font-bold">Error Occured</h1>
            <p className="text-lg">An error occured while processing your request</p>
            <button onClick={reset} className="bg-indigo-600 text-white p-2 rounded-md mt-4">Retry</button>
        </div>
    )
}