import { latestMovies } from "@/lib/tmd";
export async function GET(req:Request){
    const resData = await latestMovies();
    const movies = resData.data;
    /* movies.results = movies.results.map((res)=>{
        res.poster_path = process.env.API_BASE_URL!+res.poster_path.substring(1,res.poster_path.length)
        return res
    }) */
    return new Response(JSON.stringify(movies))
}