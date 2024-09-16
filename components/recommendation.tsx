import { getRecommendation } from "@/lib/tmd";
import { FC } from "react";
import MovieList from "./movielist";
import { FileWarningIcon } from "lucide-react";
interface RecommendationProps{
    id: number
}
const Recommendation:FC<RecommendationProps> = async({id})=>{
    const recommendationsRes = await (await getRecommendation(id));
    const recommendations = recommendationsRes.data;
    if(!recommendations)
    {
        return(
            <div className="flex items-center gap-2 font-bold">
                <FileWarningIcon className="w-5 h-5"/>
                Network error please try again
            </div>

        )
    }
    return(
        <>
            <MovieList movies={recommendations}/>
        </>
    )
}

export default Recommendation;