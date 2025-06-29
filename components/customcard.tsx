import Image from "next/image";
import { FC } from "react";

type CustomCardProps = {
    title:string;
    overview:string;
    image:string;
    id:number;
    mediaType:string
}
const CustomCard:FC<CustomCardProps> = ({ title, overview, image, id, mediaType})=>{
    return(
        <div className="group bg-white rounded-xl shadow-md overflow-hidden card-hover-effect movie-card hover:scale-105 transition-transform duration-300" key={`copy${id}`}>
                <div className="relative">
                    <Image src={image} alt={title} className="w-full h-36  object-cover" width={500} height={100} />
                    <span className="absolute top-3 left-3 bg-indigo-600 text-white text-xs font-semibold px-2 py-1 rounded-md opacity-90 uppercase">{mediaType}</span>
                </div>
                <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 line-clamp-1">{title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{overview}</p>
                </div>
            </div>
    )
}

export default CustomCard;