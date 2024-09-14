import { GenerResponse } from "@/app/types/gener";
import { geners } from "@/lib/tmd";
import { FC } from "react";
interface GenerProps{
    genersList?: GenerResponse
}
const Gener:FC<GenerProps> = async() =>{
    const genersList = await (await geners()).data;
    return(
        <ul className="grid grid-cols-12 w-full text-indigo-300">
            {
                genersList?.genres.map((gener)=>(
                    <li key={gener.id} className="w-fit col-span-3">{gener.name}</li>
                ))
            }
        </ul>
    )
}

export default Gener;