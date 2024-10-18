import RecentlyViewed from "@/components/recentviewed";
import UserDashboard from "@/components/userdashborad";
import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db";

export default async function Page(){
    const userSession = await getAuthSession();
    if(!userSession || !userSession.user){
        return <div>Redirecting...</div>
    }
    const recentlyViewed = await db.recentlyViewed.findMany({
        where:{
            userId: userSession.user?.id!
        }
    })
    return(
    <main className="w-full h-full">
        <UserDashboard userSession={userSession.user}>
            <RecentlyViewed recentlyViewed={recentlyViewed}/>
        </UserDashboard>
    </main>
    )
}