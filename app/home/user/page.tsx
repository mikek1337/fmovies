import RecentlyViewed from "@/components/recentviewed";
import UserTrending from "@/components/userrecommendation";
import WatchLater from "@/components/watchlater";
import UserDashboard from "@/components/userdashborad";
import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db";
import { Trending } from "@/lib/tmd";
import {redirect}  from "next/navigation";
import { Compass, Clock } from "lucide-react";

export default async function Page(){
    const userSession = await getAuthSession();
    if(!userSession || !userSession.user){
        redirect('/signup')
    }
    const user = userSession.user
    const recentlyViewed = await db.recentlyViewed.findMany({
        where:{
            user: {
                email: user.email
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    })
    const watchLater = await db.favorite.findMany({
        where:{
            user: {
                email: user.email
            }
        }
    });
    const Trend = (await Trending()).data;

    const userForDashboard = {
        name: user.name,
        email: user.email,
        image: user.image,
    }

    const stats = {
        viewed: recentlyViewed.length,
        watchlist: watchLater.length,
    }

    return (
        <div className="p-8 max-w-[1600px] mx-auto">
            <UserDashboard userSession={userForDashboard} stats={stats} />

            {recentlyViewed.length > 0 && (
                <section className="mb-14">
                    <div className="flex items-center gap-3 mb-6">
                        <Clock className="w-5 h-5 text-formovies-gold" />
                        <h2 className="section-title !mb-0">Continue Watching</h2>
                    </div>
                    <RecentlyViewed recentlyViewed={recentlyViewed} hasBtn={true} />
                </section>
            )}

            {watchLater.length > 0 && (
                <section className="mb-14">
                    <h2 className="section-title">My Watchlist</h2>
                    <WatchLater media={watchLater} />
                </section>
            )}

            {Trend && (
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <Compass className="w-5 h-5 text-formovies-gold" />
                        <h2 className="section-title !mb-0">Trending Now</h2>
                    </div>
                    <UserTrending media={Trend} />
                </section>
            )}
        </div>
    )
}
