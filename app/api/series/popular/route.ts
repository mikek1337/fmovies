import { popularSeries } from "@/lib/tmd";

export async function GET(req: Request){
    const url = new URL(req.url);
    const page = url.searchParams.get("page");
    const filterResult = await popularSeries(parseInt(page!));
    return new Response(JSON.stringify(filterResult.data),{status:200});
}