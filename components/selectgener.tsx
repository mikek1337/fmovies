"use client"

import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Gener } from "@/app/types/gener"
import { useState } from "react"
import { cn } from "@/lib/utils"

const SelectGener = () =>{
    const[open, setOpen] = useState(false);
    const[generNames, setGenerNames] = useState<string[]>([]);
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
    const onCheck = (e:React.ChangeEvent<HTMLInputElement>)=>{
        if(e.target.checked){
       
            setGenerNames(prev=>[...prev, e.target.id]);
        } else {
           
            setGenerNames(prev=>prev.filter((name)=>name !== e.target.id));
        }
    }
    return(
       <div className="relative">
        <div className="flex cursor-pointer w-fit justify-between items-center border rounded-lg p-2" onClick={()=>setOpen(!open)}>
          <span className="line-clamp-1 max-w-[100px]">{generNames.length==0?"Select Gener":generNames.join(",")}</span>
          {open?<ChevronUp className="w-5 h-5"/>:<ChevronDown className="w-5 h-5"/>}
        </div>
        <div className={cn("absolute z-10 flex items-center gap-5 bg-white  rounded-md shadow-md", {"hidden":!open})}>
          <div className="grid grid-cols-3 items-center gap-1 flex-wrap  w-[500px] p-2">
            {
                data?.map((gener:Gener)=>(
                    <div key={gener.id} className="flex items-center gap-2">
                        <input type="checkbox" className="rounded-md" value={gener.id} id={`${gener.name}`} onChange={onCheck}/>
                        <label htmlFor={`${gener.name}`} className="text-sm">{gener.name}</label>
                    </div>
                ))
            }
          </div>
          </div>

       </div> 
    )
}

export default SelectGener;
