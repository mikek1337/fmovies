'use client'
import { FC } from "react";
import {QueryClientProvider, QueryClient} from '@tanstack/react-query'
interface ProvidersProps{
    children: React.ReactNode
}
const queryClient = new QueryClient();
const Providers:FC<ProvidersProps> = ({children})=>{
    return(
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}

export default Providers;
