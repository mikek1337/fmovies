"use client";
import { SearchIcon } from "lucide-react";
import { FC, useState } from "react";
import SearchMovies from "./searchMovies";
import { useRouter } from 'next/navigation';
const Search:FC = () =>{
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const onOpenChange = ()=>{
        setIsOpen(!isOpen);
    }
  const router = useRouter();
    return(
        <div>
            <SearchIcon className="w-6 h-6 cursor-pointer rounded-full p-1 hover:shadow-md" onClick={()=>router.push('/search')}/>
            <SearchMovies isOpen={isOpen} onOpenChange={onOpenChange}/>
        </div>
    )
}

export default Search;
