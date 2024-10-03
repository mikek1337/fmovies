import { geners } from "@/lib/tmd";
import { FC } from "react";

const Gener:FC = async() =>{
    const genersList = await (await geners()).data;
    return(
        <ul className="grid md:grid-cols-12 grid-rows-1 md:gap-10 gap-5 items-center justify-center p-3">
            {
                genersList?.genres.map((gener)=>(
                    <li key={gener.id} className="w-fit md:col-span-3 text-sm  text-center px-2 font-bold hover:text-indigo-500 cursor-pointer">{gener.name}</li>
                ))
            }
        </ul>
    )
}

export default Gener;