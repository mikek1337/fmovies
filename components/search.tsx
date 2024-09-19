"use client";
import { SearchIcon } from "lucide-react";
import { FC, useState } from "react";
import SearchMovies from "./searchMovies";
const Search:FC = () =>{
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const onOpenChange = ()=>{
        setIsOpen(!isOpen);
    }
    return(
        <div>
            <SearchIcon className="w-6 h-6 cursor-pointer rounded-full p-1 hover:shadow-md" onClick={()=>setIsOpen(true)}/>
            <SearchMovies isOpen={isOpen} onOpenChange={onOpenChange}/>
        </div>
    )
}

export default Search;
