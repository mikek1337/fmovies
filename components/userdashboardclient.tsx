"use client";

import { FC, useState } from "react";
import Link from "next/link";
import {
  Clock,
  Bookmark,
  Sparkles,
  Compass,
  ArrowRight,
  Film,
  Tv,
} from "lucide-react";
import UserDashboard from "@/components/userdashborad";
import RecentlyViewed, { RecentlyViewedItem } from "@/components/recentviewed";
import WatchLater, { WatchLaterItem } from "@/components/watchlater";
import UserTrending from "@/components/userrecommendation";
import { MovieResponse } from "@/app/types/moviedbresponse";

interface UserDashboardClientProps {
  userSession: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  initialRecentlyViewed: RecentlyViewedItem[];
  initialWatchLater: WatchLaterItem[];
  trending?: MovieResponse | null;
}

export const UserDashboardClient: FC<UserDashboardClientProps> = ({
  userSession,
  initialRecentlyViewed,
  initialWatchLater,
  trending,
}) => {
  const [activeTab, setActiveTab] = useState<"overview" | "watchlist" | "history">("overview");
  const [historyCount, setHistoryCount] = useState<number>(initialRecentlyViewed.length);
  const [watchlistCount, setWatchlistCount] = useState<number>(initialWatchLater.length);

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-[1600px] mx-auto space-y-8">
      {/* Profile & Navigation Banner */}
      <UserDashboard
        userSession={userSession}
        stats={{
          viewed: historyCount,
          watchlist: watchlistCount,
        }}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* TAB 1: OVERVIEW */}
      {activeTab === "overview" && (
        <div className="space-y-12 animate-fade-in-up">
          {/* Continue Watching Section */}
          {historyCount > 0 && (
            <section>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-formovies-gold/15 text-formovies-gold">
                    <Clock className="w-4 h-4" />
                  </div>
                  <h2 className="section-title !mb-0">Continue Watching</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab("history")}
                  className="flex items-center gap-1.5 text-xs font-semibold text-formovies-gold/80 hover:text-formovies-gold transition-colors"
                >
                  <span>View All History</span>
                  <ArrowRight className="size-3.5" />
                </button>
              </div>
              <RecentlyViewed
                recentlyViewed={initialRecentlyViewed}
                hasBtn={true}
                layout="carousel"
                onItemsChange={setHistoryCount}
                showClearAll={false}
              />
            </section>
          )}

          {/* Watchlist Quick Access */}
          {watchlistCount > 0 && (
            <section>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-formovies-gold/15 text-formovies-gold">
                    <Bookmark className="w-4 h-4" />
                  </div>
                  <h2 className="section-title !mb-0">From Your Watchlist</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab("watchlist")}
                  className="flex items-center gap-1.5 text-xs font-semibold text-formovies-gold/80 hover:text-formovies-gold transition-colors"
                >
                  <span>Manage Watchlist ({watchlistCount})</span>
                  <ArrowRight className="size-3.5" />
                </button>
              </div>
              <WatchLater
                media={initialWatchLater.slice(0, 6)}
                showFilters={false}
                onItemsChange={setWatchlistCount}
              />
            </section>
          )}

          {/* Trending & Recommendations */}
          {trending && (
            <section>
              <div className="flex items-center gap-2.5 mb-5">
                <div className="p-1.5 rounded-lg bg-formovies-gold/15 text-formovies-gold">
                  <Compass className="w-4 h-4" />
                </div>
                <h2 className="section-title !mb-0">Recommended For You</h2>
              </div>
              <UserTrending media={trending} />
            </section>
          )}

          {/* If both history and watchlist are empty */}
          {historyCount === 0 && watchlistCount === 0 && (
            <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 text-center max-w-xl mx-auto space-y-4">
              <Sparkles className="size-10 text-formovies-gold mx-auto" />
              <h3 className="font-display text-2xl text-white">Start Building Your Cinema Collection</h3>
              <p className="text-white/40 text-xs leading-relaxed">
                Add your favorite movies and shows to your Watchlist or start streaming to see your history right here.
              </p>
              <div className="flex justify-center gap-3 pt-2">
                <Link
                  href="/home/movies"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-formovies-gold text-formovies-dark font-semibold text-xs hover:bg-formovies-amber transition-all"
                >
                  <Film className="size-3.5" />
                  Browse Movies
                </Link>
                <Link
                  href="/home/series"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 text-white font-semibold text-xs hover:bg-white/15 transition-all"
                >
                  <Tv className="size-3.5" />
                  Browse Series
                </Link>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MY WATCHLIST */}
      {activeTab === "watchlist" && (
        <section className="space-y-6 animate-fade-in-up">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2.5">
                <Bookmark className="w-5 h-5 text-formovies-gold" />
                <h2 className="font-display text-2xl sm:text-3xl text-white">My Watchlist</h2>
              </div>
              <p className="text-xs text-white/40 mt-1">
                Movies and series saved to watch later. Filter or search by title.
              </p>
            </div>
          </div>

          <WatchLater
            media={initialWatchLater}
            onItemsChange={setWatchlistCount}
            showFilters={true}
          />
        </section>
      )}

      {/* TAB 3: WATCH HISTORY */}
      {activeTab === "history" && (
        <section className="space-y-6 animate-fade-in-up">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-5 h-5 text-formovies-gold" />
                <h2 className="font-display text-2xl sm:text-3xl text-white">Watch History</h2>
              </div>
              <p className="text-xs text-white/40 mt-1">
                All titles you have recently watched. Pick up right where you left off.
              </p>
            </div>
          </div>

          <RecentlyViewed
            recentlyViewed={initialRecentlyViewed}
            hasBtn={true}
            layout="grid"
            onItemsChange={setHistoryCount}
            showClearAll={true}
            showEmptyState={true}
          />
        </section>
      )}
    </div>
  );
};

export default UserDashboardClient;
