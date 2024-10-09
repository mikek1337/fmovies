"use client"

import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { FC } from "react"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select"
import { Gener } from "@/app/types/gener"

const SelectGener = () =>{
    const {data, isPending, refetch} = useQuery({
        queryKey:["geners"],
        queryFn:async()=>{
            return await (await axios("/api/geners")).data;
        },
        retry:(failureCount, error)=>{
            if(error.cause === 404) return false;
            return failureCount < 3;
        }
    });
    return(
        <Select>
            <SelectTrigger className="w-1/5">
                <SelectValue placeholder="Select Gener"/>
            </SelectTrigger>
            <SelectContent >
            {
                data?.map((gener:Gener)=>(
                    <SelectItem key={gener.id} value={gener.id.toString()}>{gener.name}</SelectItem>
                ))
            }
            </SelectContent>
        </Select>
    )
}

export default SelectGener;