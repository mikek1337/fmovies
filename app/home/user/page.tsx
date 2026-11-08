import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { Trending } from "@/lib/tmd";
import { redirect } from "next/navigation";
import UserDashboardClient from "@/components/userdashboardclient";

export default async function Page() {
  const userSession = await getAuthSession();
  if (!userSession || !userSession.user) {
    redirect("/signin");
  }
  const user = userSession.user;

  const recentlyViewed = await db.recentlyViewed.findMany({
    where: {
      user: {
        email: user.email,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const watchLater = await db.favorite.findMany({
    where: {
      user: {
        email: user.email,
      },
    },
  });

  let trend = null;
  try {
    const trendRes = await Trending();
    trend = trendRes.data;
  } catch (err) {
    console.warn("Unable to fetch trending for user dashboard:", err);
  }

  const userForDashboard = {
    name: user.name,
    email: user.email,
    image: user.image,
  };

  return (
    <UserDashboardClient
      userSession={userForDashboard}
      initialRecentlyViewed={recentlyViewed}
      initialWatchLater={watchLater}
      trending={trend}
    />
  );
}
