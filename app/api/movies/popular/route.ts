import { getPopularMovies } from "@/lib/tmd";

export async function GET(req:Request){
  const url = new URL(req.url);
  const page = url.searchParams.get("page");
  if(!page)
  {
    return new Response("missing query", {status: 400});
  }
  try{
    const movies = (await getPopularMovies(parseInt(page))).data;
    return new Response(JSON.stringify(movies), {status: 200});
  }catch(err){
    return new Response("Unable to connect to API", {status: 400});
  }

}
