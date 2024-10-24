import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
    const userSession = await getAuthSession();
    if (!userSession) {
        return new Response("Unauthorized", { status: 401 });
    }
 
    const favorite = await db.favorite.findMany({
        where: {
            user: {
                email: userSession.user?.email
            }
        }
    });
    return new Response(JSON.stringify(favorite), { status: 200 });
}