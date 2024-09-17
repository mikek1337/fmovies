import { searchMulti } from "@/lib/tmd";

export async function GET(req:Request){
    const url = new URL(req.url);
    const query = url.searchParams.get('query');
    if(query){
        const response = await searchMulti(query);
        return new Response(JSON.stringify(response.data), {status:200})
    }
    return new Response('query is required', {status:400})
}