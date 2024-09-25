import { searchSeries } from "@/lib/tmd";
import { NextApiRequest } from "next";

export async function GET(req: Request){
    const url = new URL(req.url);
    const queries = url.searchParams;
    
    if(queries){
        const queryString = `${queries.get("query")?"query="+queries.get("query")+"&":""}${queries.get("page")?"page="+queries.get("page")+"&":""}${queries.get("primary_released_date")?queries.get("primary_released_date")+"&":""}`;
        try{
            const filterResult = await searchSeries(queryString);
            return new Response(JSON.stringify(filterResult.data),{status:200});
        } catch(error){
            return new Response("Unable to connect to API",{status:500});
        }
    }
    return new Response("Bad Request",{status:400});
}