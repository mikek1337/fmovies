import { geners } from "@/lib/tmd";

export async function GET(){
    try{
        const genersData = await(await geners()).data;
        return new Response(JSON.stringify(genersData.genres), {status: 200});
    } catch(err){
        return new Response(JSON.stringify({message: err.message}), {status: 500});
    }
}