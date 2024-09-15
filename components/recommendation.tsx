import { getRecommendation } from "@/lib/tmd";
import { FC } from "react";
import MovieList from "./movielist";
interface RecommendationProps{
    id: number
}
const Recommendation:FC<RecommendationProps> = async({id})=>{
    const recommendations = await (await getRecommendation(id)).data;
    return(
        <>
            <MovieList movies={recommendations}/>
        </>
    )
}

export default Recommendation;