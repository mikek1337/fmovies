import { popularSeries } from "@/lib/tmd";

export async function GET(req: Request){
    const url = new URL(req.url);
    const page = url.searchParams.get("page");
    try{
        const filterResult = await popularSeries(parseInt(page!));
        return new Response(JSON.stringify(filterResult.data),{status:200});
    } catch(error){
        return new Response("Unable to connect to API",{status:500});
    }
}