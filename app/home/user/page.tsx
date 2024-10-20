import RecentlyViewed from "@/components/recentviewed";
import UserDashboard from "@/components/userdashborad";
import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db";
import {redirect}  from "next/navigation";

export default async function Page(){
    
    const userSession = await getAuthSession();
    if(!userSession || !userSession.user){
        redirect('/signup')
        return 
    }
    const recentlyViewed = await db.recentlyViewed.findMany({
        where:{
            user: {
                email: userSession.user.email
            } 
        }
    })
    return(
    <main className="w-full h-full">
        <UserDashboard userSession={userSession.user}>
            {recentlyViewed.length > 0 &&(
                <RecentlyViewed recentlyViewed={recentlyViewed}/>
            )}
        </UserDashboard>
    </main>
    )
}