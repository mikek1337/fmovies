import { seriesDetail } from "@/lib/tmd";

export async function GET(req:Request){
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if(id)
    {
        try{
            const response = await seriesDetail(parseInt(id));
            return new Response(JSON.stringify(response.data),{status:200});

        } catch(error){
            return new Response("Unable to connect to API", {status: 500});
        }
    }
    return new Response("id required", {status: 400});
}