import { GenerResponse } from "@/app/types/gener";
import { geners } from "@/lib/tmd";
import { FC } from "react";
interface GenerProps{
    genersList?: GenerResponse
}
const Gener:FC = async() =>{
    const genersList = await (await geners()).data;
    return(
        <ul className="grid grid-cols-12 gap-10 items-center justify-center p-3">
            {
                genersList?.genres.map((gener)=>(
                    <li key={gener.id} className="w-fit col-span-3 text-sm  text-center px-2 font-bold hover:text-indigo-500 cursor-pointer">{gener.name}</li>
                ))
            }
        </ul>
    )
}

export default Gener;