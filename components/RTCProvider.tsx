"use client"

import { FC, useEffect, useState } from "react"
type RTCProviderProps = {
    children: React.ReactNode,
    mediaType
}
export const RTCProvider:FC<RTCProviderProps> = ({children}) =>{
    const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
 
    useEffect(()=>{
       
    },[]);

    return(
        <>
            {mediaStream && children}
        </>
    )

}