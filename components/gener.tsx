import { geners } from "@/lib/tmd";
import { FC } from "react";

const Gener: FC = async () => {
    const genersList = await (await geners()).data;
    return (
        <ul className="grid grid-cols-2 md:grid-cols-4 gap-2 p-4 w-[400px] md:w-[500px]">
            {
                genersList?.genres.map((gener) => (
                    <li key={gener.id} className="px-3 py-2 text-sm text-white/60 hover:text-formovies-gold hover:bg-white/5 rounded-lg cursor-pointer transition-all duration-200 font-medium">
                        {gener.name}
                    </li>
                ))
            }
        </ul>
    )
}

export default Gener;
