import { db } from "@/lib/db";

export async function GET(req: Request){
    const url = new URL(req.url);
    const searchParams = url.searchParams;
    const id = searchParams.get('id');
    if(!id){
        return new Response('Missing id', {status:400});
    }
    const user = await db.user.findUnique({
        where:{
            id
        }
    });
    if(!user){
        return new Response('User not found', {status:404});
    }
    return new Response(JSON.stringify(user), {status:200});
}