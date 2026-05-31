import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(){
    const session = await getAuthSession();
    if(session && session.user)
    {
        const fav = await db.favorite.findMany({
            where:{
                user: {
                    email: session.user.email!
                }
            }
        });
        return new Response(JSON.stringify(fav))
    }
    return new Response(JSON.stringify({}), {status: 401})
}