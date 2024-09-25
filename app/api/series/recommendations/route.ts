import { getRecommendation } from '@/lib/tmd'
export async function GET(req: Request){
    const url = new URL(req.url);
    const searchParams = url.searchParams;
    const id = searchParams.get("id");
    if(id){
        try{
        const response = await getRecommendation(parseInt(id), 'tv');
        return new Response(JSON.stringify(response.data), {
            status: 200,
        })
    } catch(error){
        return new Response("Unable to connect to API", {
            status: 500
        })
    }}
    return new Response("Bad Request", {
        status: 400
    })
}
