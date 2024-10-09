"use client"

import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { FC, useState } from "react"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select"
import { Gener } from "@/app/types/gener"
import { ChevronDown } from "lucide-react"

const SelectGener = () =>{
  const[open, setOpen] = useState(false);
    const {data} = useQuery({
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
       <div className="relative">
        <div className="flex w-1/5 justify-between items-center">
          <span>Select Gener</span>
          <ChevronDown className="w-5 h-5"/>
        </div>
        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex items-center gap-1">
            <input type="checkbox"/>
          Action
          </div>
          </div>

       </div> 
    )
}

export default SelectGener;
